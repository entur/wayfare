import { createRemoteJWKSet, jwtVerify } from "jose";
import {
	authorizationCodeGrant,
	buildAuthorizationUrl,
	buildEndSessionUrl,
	type Configuration,
	calculatePKCECodeChallenge,
	discovery,
	randomNonce,
	randomPKCECodeVerifier,
	randomState,
} from "openid-client";
import { requirePublishedDeploymentConfig } from "./deployment-config.ts";

const SESSION_COOKIE_NAME = "wayfare_session";
const PENDING_COOKIE_NAME = "wayfare_login_pending";
const PENDING_MAX_AGE_SECONDS = 5 * 60;

interface PendingLogin {
	state: string;
	nonce: string;
	codeVerifier: string;
	returnTo: string;
}

let oidcConfiguration:
	| { key: string; promise: Promise<Configuration> }
	| undefined;
let jwks:
	| { domain: string; value: ReturnType<typeof createRemoteJWKSet> }
	| undefined;

function getOidcConfiguration(): Promise<Configuration> {
	const config = requirePublishedDeploymentConfig();
	const key = `${config.loginDomain}:${config.loginClientId}:${config.loginClientSecret}`;
	if (oidcConfiguration?.key !== key) {
		oidcConfiguration = {
			key,
			promise: discovery(
				new URL(`https://${config.loginDomain}`),
				config.loginClientId,
				config.loginClientSecret,
			),
		};
	}
	return oidcConfiguration.promise;
}

export async function initializeEnturLogin(): Promise<void> {
	await getOidcConfiguration();
}

function buildPublicUrl(pathname: string): URL {
	const { publicOrigin } = requirePublishedDeploymentConfig();
	return new URL(pathname, publicOrigin);
}

function buildCookie(
	name: string,
	value: string,
	maxAgeSeconds: number,
): string {
	return [
		`${name}=${value}`,
		"Path=/",
		`Max-Age=${maxAgeSeconds}`,
		"HttpOnly",
		"SameSite=Lax",
		"Secure",
	].join("; ");
}

function readCookie(request: Request, name: string): string | undefined {
	const header = request.headers.get("cookie") ?? "";
	const match = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(header);
	return match?.[1];
}

export function sanitizeReturnTo(value: string | null): string {
	if (!value) return "/";
	if (
		!value.startsWith("/") ||
		value.startsWith("//") ||
		value.includes("://") ||
		value.includes("\\")
	) {
		return "/";
	}
	return value;
}

function isPendingLogin(value: unknown): value is PendingLogin {
	if (!value || typeof value !== "object") return false;
	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.state === "string" &&
		typeof candidate.nonce === "string" &&
		typeof candidate.codeVerifier === "string" &&
		typeof candidate.returnTo === "string"
	);
}

function noStoreHeaders(initial?: HeadersInit): Headers {
	const headers = new Headers(initial);
	headers.set("cache-control", "no-store");
	headers.set("pragma", "no-cache");
	headers.set("x-content-type-options", "nosniff");
	return headers;
}

export function buildLoginRedirect(originalUrl: URL): Response {
	const loginUrl = buildPublicUrl("/auth/login");
	loginUrl.searchParams.set(
		"returnTo",
		sanitizeReturnTo(originalUrl.pathname + originalUrl.search),
	);
	return new Response(null, {
		status: 302,
		headers: noStoreHeaders({ location: loginUrl.toString() }),
	});
}

export async function startLogin(request: Request): Promise<Response> {
	const returnTo = sanitizeReturnTo(
		new URL(request.url).searchParams.get("returnTo"),
	);
	const state = randomState();
	const nonce = randomNonce();
	const codeVerifier = randomPKCECodeVerifier();
	const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
	const pending: PendingLogin = { state, nonce, codeVerifier, returnTo };
	const redirectUri = buildPublicUrl("/auth/callback").toString();
	const authorizationUrl = buildAuthorizationUrl(await getOidcConfiguration(), {
		redirect_uri: redirectUri,
		response_type: "code",
		scope: "openid profile email",
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		state,
		nonce,
	});

	const headers = noStoreHeaders({ location: authorizationUrl.toString() });
	headers.append(
		"set-cookie",
		buildCookie(
			PENDING_COOKIE_NAME,
			encodeURIComponent(JSON.stringify(pending)),
			PENDING_MAX_AGE_SECONDS,
		),
	);
	return new Response(null, { status: 302, headers });
}

function loginErrorResponse(): Response {
	return new Response("Login could not be completed. Please try again.", {
		status: 400,
		headers: noStoreHeaders({ "content-type": "text/plain; charset=utf-8" }),
	});
}

function logLoginFailure(reason: string, error?: unknown): void {
	console.warn(`[auth] ${reason}`, {
		errorType: error instanceof Error ? error.name : typeof error,
	});
}

export async function handleCallback(request: Request): Promise<Response> {
	const requestUrl = new URL(request.url);
	const code = requestUrl.searchParams.get("code");
	const state = requestUrl.searchParams.get("state");
	const pendingRaw = readCookie(request, PENDING_COOKIE_NAME);

	if (!code || !state || !pendingRaw) {
		logLoginFailure("callback parameters or pending login cookie missing");
		return loginErrorResponse();
	}

	let pending: PendingLogin;
	try {
		const parsed: unknown = JSON.parse(decodeURIComponent(pendingRaw));
		if (!isPendingLogin(parsed)) {
			throw new Error("pending login cookie has an unexpected shape");
		}
		pending = parsed;
	} catch (error) {
		logLoginFailure("pending login cookie is invalid", error);
		return loginErrorResponse();
	}

	try {
		const callbackUrl = buildPublicUrl("/auth/callback");
		callbackUrl.search = requestUrl.search;
		const tokens = await authorizationCodeGrant(
			await getOidcConfiguration(),
			callbackUrl,
			{
				expectedState: pending.state,
				expectedNonce: pending.nonce,
				pkceCodeVerifier: pending.codeVerifier,
				idTokenExpected: true,
			},
		);
		if (!tokens.id_token) {
			throw new Error("token endpoint response did not contain an ID token");
		}

		const claims = tokens.claims();
		const expiresAt = claims?.exp ?? Math.floor(Date.now() / 1000) + 3600;
		const maxAge = Math.max(60, expiresAt - Math.floor(Date.now() / 1000));
		const headers = noStoreHeaders({
			location: buildPublicUrl(sanitizeReturnTo(pending.returnTo)).toString(),
		});
		headers.append(
			"set-cookie",
			buildCookie(SESSION_COOKIE_NAME, tokens.id_token, maxAge),
		);
		headers.append("set-cookie", buildCookie(PENDING_COOKIE_NAME, "", 0));
		return new Response(null, { status: 302, headers });
	} catch (error) {
		logLoginFailure("authorization response validation failed", error);
		return loginErrorResponse();
	}
}

export async function handleLogout(request: Request): Promise<Response> {
	const idToken = readCookie(request, SESSION_COOKIE_NAME);
	const parameters: Record<string, string> = {
		post_logout_redirect_uri: buildPublicUrl("/").toString(),
	};
	if (idToken) parameters.id_token_hint = idToken;
	const logoutUrl = buildEndSessionUrl(
		await getOidcConfiguration(),
		parameters,
	);
	const headers = noStoreHeaders({ location: logoutUrl.toString() });
	headers.append("set-cookie", buildCookie(SESSION_COOKIE_NAME, "", 0));
	return new Response(null, { status: 302, headers });
}

async function verifyIdToken(idToken: string): Promise<void> {
	const { loginDomain, loginClientId } = requirePublishedDeploymentConfig();
	if (jwks?.domain !== loginDomain) {
		jwks = {
			domain: loginDomain,
			value: createRemoteJWKSet(
				new URL(`https://${loginDomain}/.well-known/jwks.json`),
			),
		};
	}
	await jwtVerify(idToken, jwks.value, {
		issuer: `https://${loginDomain}/`,
		audience: loginClientId,
	});
}

export async function getSessionIdToken(
	request: Request,
): Promise<string | undefined> {
	const token = readCookie(request, SESSION_COOKIE_NAME);
	if (!token) return undefined;
	try {
		await verifyIdToken(token);
		return token;
	} catch {
		return undefined;
	}
}
