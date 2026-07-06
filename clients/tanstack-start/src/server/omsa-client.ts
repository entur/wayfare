import { inspect } from "node:util";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { getAccessToken } from "./auth";
import { getRuntimeConfig, type RuntimeConfig } from "./runtime-config";

type RequestLogLevel = "meta" | "headers" | "body";
type RequestLogFormat = "pretty" | "json";

function getRequestLogFormat(): RequestLogFormat {
	const envValue =
		process.env.REQUEST_RESPONSE_LOG_FORMAT?.trim().toLowerCase();
	return envValue === "json" ? "json" : "pretty";
}

function shouldEnableRequestLogging(): boolean {
	const envValue = process.env.ENABLE_REQUEST_RESPONSE_LOGGING;
	if (envValue === "true") {
		return true;
	}
	if (envValue === "false") {
		return false;
	}
	return process.env.NODE_ENV !== "production";
}

function getRequestLogDepth(): number | null {
	const envValue = process.env.REQUEST_RESPONSE_LOG_DEPTH?.trim().toLowerCase();
	if (!envValue || envValue === "full" || envValue === "null") {
		return null;
	}

	const parsedDepth = Number.parseInt(envValue, 10);
	if (Number.isNaN(parsedDepth) || parsedDepth < 0) {
		return null;
	}

	return parsedDepth;
}

function getRequestLogLevel(): RequestLogLevel {
	const envValue = process.env.REQUEST_RESPONSE_LOG_LEVEL?.trim().toLowerCase();
	if (envValue === "meta" || envValue === "headers" || envValue === "body") {
		return envValue;
	}

	return "body";
}

function shouldRedactSensitiveHeaders(): boolean {
	const envValue =
		process.env.REQUEST_RESPONSE_LOG_REDACT_SENSITIVE_HEADERS?.trim().toLowerCase();
	if (envValue === "false") {
		return false;
	}
	if (envValue === "true") {
		return true;
	}
	return true;
}

function redactAuthorizationValue(value: string): string {
	const trimmedValue = value.trim();
	if (!trimmedValue) {
		return "[REDACTED]";
	}

	const [scheme, ...rest] = trimmedValue.split(/\s+/);
	if (rest.length === 0) {
		return "[REDACTED]";
	}

	return `${scheme} [REDACTED]`;
}

function redactHeaders(
	headers: Record<string, string>,
): Record<string, string> {
	if (!shouldRedactSensitiveHeaders()) {
		return headers;
	}

	const redactedHeaders: Record<string, string> = {};
	for (const [key, value] of Object.entries(headers)) {
		const normalizedKey = key.toLowerCase();
		if (
			normalizedKey === "authorization" ||
			normalizedKey === "proxy-authorization"
		) {
			redactedHeaders[key] = redactAuthorizationValue(value);
			continue;
		}
		redactedHeaders[key] = value;
	}

	return redactedHeaders;
}

function formatForLog(value: unknown): string {
	return inspect(value, {
		depth: getRequestLogDepth(),
		colors: false,
		maxArrayLength: 100,
		compact: 2,
		breakLength: 120,
	});
}

export function stringifyJsonLog(value: unknown): string {
	const ancestors: object[] = [];

	return JSON.stringify(value, function (this: object, _key, currentValue) {
		if (typeof currentValue === "bigint") {
			return currentValue.toString();
		}
		if (currentValue === null || typeof currentValue !== "object") {
			return currentValue;
		}

		while (ancestors.length > 0 && ancestors.at(-1) !== this) {
			ancestors.pop();
		}
		if (ancestors.includes(currentValue)) {
			return "[Circular]";
		}

		ancestors.push(currentValue);
		return currentValue;
	});
}

// Mirrors formatForLog's depth truncation but keeps the result valid JSON, so
// REQUEST_RESPONSE_LOG_FORMAT=json output stays parseable line-by-line (e.g. with jq).
function truncateAtDepth(
	value: unknown,
	depth: number | null,
	currentDepth = 0,
): unknown {
	if (depth === null || value === null || typeof value !== "object") {
		return value;
	}
	if (currentDepth >= depth) {
		return Array.isArray(value) ? "[Array]" : "[Object]";
	}
	if (Array.isArray(value)) {
		return value.map((item) => truncateAtDepth(item, depth, currentDepth + 1));
	}
	return Object.fromEntries(
		Object.entries(value).map(([key, val]) => [
			key,
			truncateAtDepth(val, depth, currentDepth + 1),
		]),
	);
}

async function readResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("json")) {
		return response.clone().json();
	}
	if (contentType.startsWith("text/")) {
		return response.clone().text();
	}
	return "[non-text response]";
}

function logRequest(
	method: string,
	url: string,
	body?: unknown,
	headers?: Record<string, string>,
	quiet = false,
) {
	if (!shouldEnableRequestLogging() || quiet) {
		return;
	}

	const level = getRequestLogLevel();
	const includeHeaders = (level === "headers" || level === "body") && !!headers;
	const includeBody = level === "body" && typeof body !== "undefined";
	const redactedHeaders = includeHeaders
		? redactHeaders(headers as Record<string, string>)
		: undefined;

	if (getRequestLogFormat() === "json") {
		console.log(
			stringifyJsonLog({
				ts: new Date().toISOString(),
				type: "request",
				method: method.toUpperCase(),
				url,
				...(redactedHeaders ? { headers: redactedHeaders } : {}),
				...(includeBody
					? { body: truncateAtDepth(body, getRequestLogDepth()) }
					: {}),
			}),
		);
		return;
	}

	console.log(`[http][outgoing] ${method.toUpperCase()} ${url}`);
	if (redactedHeaders) {
		console.log("[http][outgoing] headers", formatForLog(redactedHeaders));
	}
	if (includeBody) {
		console.log("[http][outgoing] body", formatForLog(body));
	}
}

async function logResponse(
	method: string,
	url: string,
	response: Response,
	startedAt: number,
	quiet = false,
) {
	if (!shouldEnableRequestLogging()) {
		return;
	}

	const durationMs = Date.now() - startedAt;
	const format = getRequestLogFormat();

	if (quiet) {
		if (format === "json") {
			console.log(
				stringifyJsonLog({
					ts: new Date().toISOString(),
					type: "response",
					prefetch: true,
					method: method.toUpperCase(),
					url,
					status: response.status,
					durationMs,
				}),
			);
			return;
		}
		console.log(
			`[http][prefetch] ${method.toUpperCase()} ${url} ${response.status} (${durationMs}ms)`,
		);
		return;
	}

	// GET 404s are expected for stale/invisible tickets — skip headers/body to avoid log spam.
	// For other methods a 404 is unexpected and the body contains the actual error.
	const skipDetails = response.status === 404 && method.toUpperCase() === "GET";
	const level = getRequestLogLevel();
	const includeHeaders =
		!skipDetails && (level === "headers" || level === "body");
	const includeBody = !skipDetails && level === "body";
	const redactedHeaders = includeHeaders
		? redactHeaders(Object.fromEntries(response.headers.entries()))
		: undefined;
	const body = includeBody ? await readResponseBody(response) : undefined;

	if (format === "json") {
		console.log(
			stringifyJsonLog({
				ts: new Date().toISOString(),
				type: "response",
				method: method.toUpperCase(),
				url,
				status: response.status,
				statusText: response.statusText,
				durationMs,
				...(redactedHeaders ? { headers: redactedHeaders } : {}),
				...(includeBody
					? { body: truncateAtDepth(body, getRequestLogDepth()) }
					: {}),
			}),
		);
		return;
	}

	console.log(
		`[http][incoming] ${response.status} ${response.statusText} (${durationMs}ms)`,
	);
	if (skipDetails) {
		return;
	}
	if (redactedHeaders) {
		console.log("[http][incoming] headers", formatForLog(redactedHeaders));
	}
	if (includeBody) {
		console.log("[http][incoming] body", formatForLog(body));
	}
}

function logRequestError(
	method: string,
	url: string,
	startedAt: number,
	error: unknown,
) {
	if (!shouldEnableRequestLogging()) {
		return;
	}

	const durationMs = Date.now() - startedAt;

	if (getRequestLogFormat() === "json") {
		console.error(
			stringifyJsonLog({
				ts: new Date().toISOString(),
				type: "error",
				method: method.toUpperCase(),
				url,
				durationMs,
				error: error instanceof Error ? error.message : String(error),
			}),
		);
		return;
	}

	console.error(
		`[http][error] ${method.toUpperCase()} ${url} (${durationMs}ms)`,
		error,
	);
}

function resolveClientName(
	config: RuntimeConfig,
	devConfig?: DevConfigOverrides,
): string {
	return devConfig?.clientName ?? config.enturClientName ?? "Wayfare-Web";
}

function enturHeaders(
	config: RuntimeConfig,
	devConfig?: DevConfigOverrides,
): Record<string, string> {
	return {
		"Entur-Distribution-Channel":
			devConfig?.distributionChannel ??
			config.enturDistributionChannel ??
			"WAY:DistributionChannel:App",
		"ET-Client-Name": resolveClientName(config, devConfig),
		"Entur-POS": devConfig?.pos ?? config.enturPos ?? "Wayfare",
	};
}

async function authorizedHeaders(
	config: RuntimeConfig,
	devConfig?: DevConfigOverrides,
): Promise<Record<string, string>> {
	const authorization = await getAccessToken(devConfig);
	return {
		Authorization: authorization,
		Accept: "application/json",
		"Accept-Language": "en-GB",
		...enturHeaders(config, devConfig),
	};
}

async function handleResponse<T>(
	response: Response,
	action: string,
): Promise<T> {
	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OMSA ${action} failed (${response.status}): ${text}`);
	}
	return response.json() as Promise<T>;
}

export function createOmsaClient(
	devConfig?: DevConfigOverrides,
	options?: { quiet?: boolean; signal?: AbortSignal },
) {
	const config = getRuntimeConfig(devConfig);
	const quiet = options?.quiet ?? false;
	const signal = options?.signal;

	return {
		async get<T>(path: string, params?: Record<string, string>): Promise<T> {
			const url = new URL(`${config.omsaBaseUrl}${path}`);
			if (params) {
				for (const [key, value] of Object.entries(params)) {
					url.searchParams.set(key, value);
				}
			}
			const requestUrl = url.toString();
			const startedAt = Date.now();
			const headers = await authorizedHeaders(config, devConfig);
			logRequest("GET", requestUrl, undefined, headers, quiet);
			try {
				const response = await fetch(requestUrl, { headers, signal });
				await logResponse("GET", requestUrl, response, startedAt, quiet);
				return handleResponse<T>(response, `GET ${path}`);
			} catch (error) {
				logRequestError("GET", requestUrl, startedAt, error);
				throw error;
			}
		},

		async post<T>(path: string, body: unknown): Promise<T> {
			const requestUrl = `${config.omsaBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				...(await authorizedHeaders(config, devConfig)),
				"Content-Type": "application/json",
			};
			logRequest("POST", requestUrl, body, headers, quiet);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("POST", requestUrl, response, startedAt, quiet);
				return handleResponse<T>(response, `POST ${path}`);
			} catch (error) {
				logRequestError("POST", requestUrl, startedAt, error);
				throw error;
			}
		},

		async put<T>(path: string, body: unknown): Promise<T> {
			const requestUrl = `${config.omsaBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				...(await authorizedHeaders(config, devConfig)),
				"Content-Type": "application/json",
			};
			logRequest("PUT", requestUrl, body, headers, quiet);
			try {
				const response = await fetch(requestUrl, {
					method: "PUT",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("PUT", requestUrl, response, startedAt, quiet);
				return handleResponse<T>(response, `PUT ${path}`);
			} catch (error) {
				logRequestError("PUT", requestUrl, startedAt, error);
				throw error;
			}
		},

		async patch<T>(path: string, body: unknown): Promise<T> {
			const requestUrl = `${config.omsaBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				...(await authorizedHeaders(config, devConfig)),
				"Content-Type": "application/json",
			};
			logRequest("PATCH", requestUrl, body, headers, quiet);
			try {
				const response = await fetch(requestUrl, {
					method: "PATCH",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("PATCH", requestUrl, response, startedAt, quiet);
				return handleResponse<T>(response, `PATCH ${path}`);
			} catch (error) {
				logRequestError("PATCH", requestUrl, startedAt, error);
				throw error;
			}
		},
	};
}

export function createSalesClient(devConfig?: DevConfigOverrides) {
	const config = getRuntimeConfig(devConfig);

	return {
		async post<T>(path: string, body: unknown): Promise<T> {
			const authorization = await getAccessToken(devConfig);
			const requestUrl = `${config.salesBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				Authorization: authorization,
				Accept: "application/hal+json",
				"Accept-Language": "en-GB",
				"Content-Type": "application/json",
				...enturHeaders(config, devConfig),
			};
			logRequest("POST", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("POST", requestUrl, response, startedAt);
				return handleResponse<T>(response, `POST ${path}`);
			} catch (error) {
				logRequestError("POST", requestUrl, startedAt, error);
				throw error;
			}
		},

		async put<T>(path: string): Promise<T> {
			const authorization = await getAccessToken(devConfig);
			const requestUrl = `${config.salesBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				Authorization: authorization,
				Accept: "application/hal+json",
				"Accept-Language": "en-GB",
				...enturHeaders(config, devConfig),
			};
			logRequest("PUT", requestUrl, undefined, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "PUT",
					headers,
				});
				await logResponse("PUT", requestUrl, response, startedAt);
				return handleResponse<T>(response, `PUT ${path}`);
			} catch (error) {
				logRequestError("PUT", requestUrl, startedAt, error);
				throw error;
			}
		},

		async get<T>(path: string, params?: Record<string, string>): Promise<T> {
			const authorization = await getAccessToken(devConfig);
			const url = new URL(`${config.salesBaseUrl}${path}`);
			if (params) {
				for (const [key, value] of Object.entries(params)) {
					url.searchParams.set(key, value);
				}
			}
			const requestUrl = url.toString();
			const startedAt = Date.now();
			const headers = {
				Authorization: authorization,
				Accept: "application/hal+json",
				"Accept-Language": "en-GB",
				...enturHeaders(config, devConfig),
			};
			logRequest("GET", requestUrl, undefined, headers);
			try {
				const response = await fetch(requestUrl, { headers });
				await logResponse("GET", requestUrl, response, startedAt);
				return handleResponse<T>(response, `GET ${path}`);
			} catch (error) {
				logRequestError("GET", requestUrl, startedAt, error);
				throw error;
			}
		},

		async patch<T>(path: string, body: unknown): Promise<T> {
			const authorization = await getAccessToken(devConfig);
			const requestUrl = `${config.salesBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				Authorization: authorization,
				Accept: "application/hal+json",
				"Accept-Language": "en-GB",
				"Content-Type": "application/json",
				...enturHeaders(config, devConfig),
			};
			logRequest("PATCH", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "PATCH",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("PATCH", requestUrl, response, startedAt);
				return handleResponse<T>(response, `PATCH ${path}`);
			} catch (error) {
				logRequestError("PATCH", requestUrl, startedAt, error);
				throw error;
			}
		},

		async delete<T>(path: string): Promise<T> {
			const authorization = await getAccessToken(devConfig);
			const requestUrl = `${config.salesBaseUrl}${path}`;
			const startedAt = Date.now();
			const headers = {
				Authorization: authorization,
				Accept: "application/hal+json",
				"Accept-Language": "en-GB",
				...enturHeaders(config, devConfig),
			};
			logRequest("DELETE", requestUrl, undefined, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "DELETE",
					headers,
				});
				await logResponse("DELETE", requestUrl, response, startedAt);
				return handleResponse<T>(response, `DELETE ${path}`);
			} catch (error) {
				logRequestError("DELETE", requestUrl, startedAt, error);
				throw error;
			}
		},
	};
}

export function createVehiclePositionsClient(devConfig?: DevConfigOverrides) {
	const config = getRuntimeConfig(devConfig);

	return {
		async query<T>(query: string, variables: unknown): Promise<T> {
			const requestUrl = config.vehiclePositionsUrl;
			const body = { query, variables };
			const startedAt = Date.now();
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				"ET-Client-Name": resolveClientName(config, devConfig),
			};
			logRequest("POST", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("POST", requestUrl, response, startedAt);
				const json = (await response.json()) as {
					data?: T;
					errors?: { message: string }[];
				};
				if (json.errors?.length) {
					throw new Error(json.errors[0]?.message ?? "Vehicle positions error");
				}
				if (!json.data) {
					throw new Error("Vehicle positions API returned no data");
				}
				return json.data;
			} catch (error) {
				logRequestError("POST", requestUrl, startedAt, error);
				throw error;
			}
		},
	};
}

export function createJourneyPlannerClient(devConfig?: DevConfigOverrides) {
	const config = getRuntimeConfig(devConfig);

	return {
		async query<T>(query: string, variables: unknown): Promise<T> {
			const requestUrl = config.journeyPlannerUrl;
			const body = { query, variables };
			const startedAt = Date.now();
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
				"ET-Client-Name": resolveClientName(config, devConfig),
			};
			logRequest("POST", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse("POST", requestUrl, response, startedAt);
				const json = (await response.json()) as {
					data?: T;
					errors?: { message: string }[];
				};
				if (json.errors?.length) {
					throw new Error(json.errors[0]?.message ?? "Journey planner error");
				}
				if (!json.data) {
					throw new Error("Journey planner returned no data");
				}
				return json.data;
			} catch (error) {
				logRequestError("POST", requestUrl, startedAt, error);
				throw error;
			}
		},
	};
}
