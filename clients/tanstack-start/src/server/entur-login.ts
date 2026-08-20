// Entur employee login for a published (locked) deployment — see
// areDevConfigOverridesAllowed for the sibling "is this deployment locked"
// concept. This is a hand-rolled Authorization Code + PKCE flow against
// Entur's partner Auth0 tenant, the same tenant and library-free approach
// real Entur GKE apps (kafka-admin-frontend, abt-backoffice) use for
// employee-facing login — those do it client-side with @auth0/auth0-spa-js
// because they're plain SPAs with a separate backend. This app has a real
// server (server.mjs) in front of everything, so the flow runs there
// instead: an HttpOnly session cookie, never a token sitting in localStorage
// reachable by XSS.
import { createHash, randomBytes } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "wayfare_session";
const PENDING_COOKIE_NAME = "wayfare_login_pending";
const PENDING_MAX_AGE_SECONDS = 5 * 60;

interface PendingLogin {
	state: string;
	codeVerifier: string;
	returnTo: string;
}

export interface EnturLoginConfig {
	domain: string;
	clientId: string;
}

function partnerDomainForMode(mode: string | undefined): string {
	return mode === "staging" || mode === "local-staging"
		? "partner.staging.entur.org"
		: "partner.dev.entur.org";
}

/**
 * Login is deliberately NOT wired into the per-request devConfig override
 * mechanism (see runtime-config.ts) — the domain/client id a published
 * deployment logs in against must not be something a client-supplied cookie
 * can influence, so this reads OMSA_ENV_MODE directly rather than going
 * through getRuntimeConfig().
 */
export function getEnturLoginConfig(): EnturLoginConfig {
	const domain =
		process.env.ENTUR_LOGIN_DOMAIN ??
		partnerDomainForMode(process.env.OMSA_ENV_MODE);
	const clientId = process.env.ENTUR_LOGIN_CLIENT_ID;
	if (!clientId) {
		throw new Error(
			"REQUIRE_ENTUR_LOGIN is enabled but ENTUR_LOGIN_CLIENT_ID is not set. " +
				"This is the interactive SPA client id registered against " +
				`${domain} — it isn't self-service via .entur/ (that only provisions ` +
				"M2M clients), so it has to be requested and set explicitly.",
		);
	}
	return { domain, clientId };
}

function cookiesAreSecure(): boolean {
	return process.env.COOKIE_SECURE?.trim().toLowerCase() !== "false";
}

function buildCookie(
	name: string,
	value: string,
	maxAgeSeconds: number,
): string {
	const parts = [
		`${name}=${value}`,
		"Path=/",
		`Max-Age=${maxAgeSeconds}`,
		"HttpOnly",
		"SameSite=Lax",
	];
	if (cookiesAreSecure()) parts.push("Secure");
	return parts.join("; ");
}

function readCookie(request: Request, name: string): string | undefined {
	const header = request.headers.get("cookie") ?? "";
	const match = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(header);
	return match?.[1];
}

function base64url(input: Buffer): string {
	return input
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/** Same-origin relative paths only — never let a login redirect target an arbitrary host. */
function sanitizeReturnTo(value: string | null): string {
	if (!value) return "/";
	if (
		!value.startsWith("/") ||
		value.startsWith("//") ||
		value.includes("://")
	) {
		return "/";
	}
	return value;
}

export function buildLoginRedirect(originalUrl: URL): Response {
	const loginUrl = new URL("/auth/login", originalUrl.origin);
	loginUrl.searchParams.set(
		"returnTo",
		sanitizeReturnTo(originalUrl.pathname + originalUrl.search),
	);
	return new Response(null, {
		status: 302,
		headers: { location: loginUrl.toString() },
	});
}

export function startLogin(request: Request): Response {
	const { domain, clientId } = getEnturLoginConfig();
	const url = new URL(request.url);
	const returnTo = sanitizeReturnTo(url.searchParams.get("returnTo"));

	const state = base64url(randomBytes(16));
	const codeVerifier = base64url(randomBytes(32));
	const codeChallenge = base64url(
		createHash("sha256").update(codeVerifier).digest(),
	);

	const pending: PendingLogin = { state, codeVerifier, returnTo };
	const redirectUri = new URL("/auth/callback", url.origin).toString();

	const authorizeUrl = new URL(`https://${domain}/authorize`);
	authorizeUrl.searchParams.set("response_type", "code");
	authorizeUrl.searchParams.set("client_id", clientId);
	authorizeUrl.searchParams.set("redirect_uri", redirectUri);
	authorizeUrl.searchParams.set("scope", "openid profile email");
	authorizeUrl.searchParams.set("code_challenge", codeChallenge);
	authorizeUrl.searchParams.set("code_challenge_method", "S256");
	authorizeUrl.searchParams.set("state", state);

	const headers = new Headers({ location: authorizeUrl.toString() });
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

function errorResponse(message: string): Response {
	return new Response(`${message}\n\nTry logging in again: /auth/login`, {
		status: 400,
		headers: { "content-type": "text/plain" },
	});
}

export async function handleCallback(request: Request): Promise<Response> {
	const { domain, clientId } = getEnturLoginConfig();
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const pendingRaw = readCookie(request, PENDING_COOKIE_NAME);

	if (!code || !state || !pendingRaw) {
		return errorResponse("Missing login callback parameters.");
	}

	let pending: PendingLogin;
	try {
		pending = JSON.parse(decodeURIComponent(pendingRaw));
	} catch {
		return errorResponse("Corrupt or expired login attempt.");
	}
	if (pending.state !== state) {
		return errorResponse(
			"Login state mismatch — possible stale or replayed callback.",
		);
	}

	const redirectUri = new URL("/auth/callback", url.origin).toString();
	const tokenResponse = await fetch(`https://${domain}/oauth/token`, {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			client_id: clientId,
			code,
			code_verifier: pending.codeVerifier,
			redirect_uri: redirectUri,
		}),
	});
	if (!tokenResponse.ok) {
		return errorResponse(
			`Token exchange failed (${tokenResponse.status}): ${await tokenResponse.text()}`,
		);
	}

	const body = (await tokenResponse.json()) as {
		id_token?: string;
		expires_in?: number;
	};
	if (!body.id_token) {
		return errorResponse("Token response did not include an ID token.");
	}

	let expSeconds: number;
	try {
		const claims = await verifyIdToken(body.id_token);
		expSeconds = claims.exp ?? Math.floor(Date.now() / 1000) + 3600;
	} catch (error) {
		return errorResponse(
			`ID token failed verification: ${error instanceof Error ? error.message : String(error)}`,
		);
	}

	const maxAge = Math.max(60, expSeconds - Math.floor(Date.now() / 1000));
	const headers = new Headers({
		location: new URL(pending.returnTo, url.origin).toString(),
	});
	headers.append(
		"set-cookie",
		buildCookie(SESSION_COOKIE_NAME, body.id_token, maxAge),
	);
	headers.append("set-cookie", buildCookie(PENDING_COOKIE_NAME, "", 0));
	return new Response(null, { status: 302, headers });
}

export function handleLogout(request: Request): Response {
	const { domain, clientId } = getEnturLoginConfig();
	const url = new URL(request.url);
	const logoutUrl = new URL(`https://${domain}/v2/logout`);
	logoutUrl.searchParams.set("client_id", clientId);
	logoutUrl.searchParams.set("returnTo", url.origin);

	const headers = new Headers({ location: logoutUrl.toString() });
	headers.append("set-cookie", buildCookie(SESSION_COOKIE_NAME, "", 0));
	return new Response(null, { status: 302, headers });
}

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

async function verifyIdToken(idToken: string) {
	const { domain, clientId } = getEnturLoginConfig();
	jwks ??= createRemoteJWKSet(
		new URL(`https://${domain}/.well-known/jwks.json`),
	);
	const { payload } = await jwtVerify(idToken, jwks, {
		issuer: `https://${domain}/`,
		audience: clientId,
	});
	return payload;
}

/** The verified session token for the current request, or undefined if absent/invalid. */
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
