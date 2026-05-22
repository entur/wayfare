import { inspect } from "node:util";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { getAccessToken } from "./auth";
import { getRuntimeConfig, type RuntimeConfig } from "./runtime-config";

type RequestLogLevel = "meta" | "headers" | "body";

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
) {
	if (!shouldEnableRequestLogging()) {
		return;
	}

	console.log(`[http][outgoing] ${method.toUpperCase()} ${url}`);
	const level = getRequestLogLevel();
	if (level === "headers" || level === "body") {
		if (headers) {
			console.log(
				"[http][outgoing] headers",
				formatForLog(redactHeaders(headers)),
			);
		}
	}
	if (level === "body" && typeof body !== "undefined") {
		console.log("[http][outgoing] body", formatForLog(body));
	}
}

async function logResponse(response: Response, startedAt: number) {
	if (!shouldEnableRequestLogging()) {
		return;
	}

	const durationMs = Date.now() - startedAt;
	console.log(
		`[http][incoming] ${response.status} ${response.statusText} (${durationMs}ms)`,
	);
	const level = getRequestLogLevel();
	if (level === "headers" || level === "body") {
		console.log(
			"[http][incoming] headers",
			formatForLog(
				redactHeaders(Object.fromEntries(response.headers.entries())),
			),
		);
	}
	if (level === "body") {
		const body = await readResponseBody(response);
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
	console.error(
		`[http][error] ${method.toUpperCase()} ${url} (${durationMs}ms)`,
		error,
	);
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
		"Entur-Client-Name":
			devConfig?.clientName ?? config.enturClientName ?? "Wayfare-Web",
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

export function createOmsaClient(devConfig?: DevConfigOverrides) {
	const config = getRuntimeConfig(devConfig);

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
			logRequest("GET", requestUrl, undefined, headers);
			try {
				const response = await fetch(requestUrl, { headers });
				await logResponse(response, startedAt);
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
			logRequest("POST", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse(response, startedAt);
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
			logRequest("PUT", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "PUT",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse(response, startedAt);
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
			logRequest("PATCH", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "PATCH",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse(response, startedAt);
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
				await logResponse(response, startedAt);
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
				await logResponse(response, startedAt);
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
				await logResponse(response, startedAt);
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
				await logResponse(response, startedAt);
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
				await logResponse(response, startedAt);
				return handleResponse<T>(response, `DELETE ${path}`);
			} catch (error) {
				logRequestError("DELETE", requestUrl, startedAt, error);
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
				...enturHeaders(config, devConfig),
			};
			logRequest("POST", requestUrl, body, headers);
			try {
				const response = await fetch(requestUrl, {
					method: "POST",
					headers,
					body: JSON.stringify(body),
				});
				await logResponse(response, startedAt);
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
