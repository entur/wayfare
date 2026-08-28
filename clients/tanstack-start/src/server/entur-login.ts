import {
	type CookieHandler,
	type CookieSerializeOptions,
	CookieTransactionStore,
	ServerClient,
	StatelessStateStore,
} from "@auth0/auth0-server-js";
import { requirePublishedDeploymentConfig } from "./deployment-config.ts";

const SESSION_COOKIE_NAME = "wayfare_session";
const PENDING_COOKIE_NAME = "wayfare_login_pending";

interface StoreOptions {
	request: Request;
	responseHeaders: Headers;
}

interface AppState {
	returnTo: string;
}

function parseCookies(request: Request): Record<string, string> {
	const header = request.headers.get("cookie");
	if (!header) return {};
	const cookies: Record<string, string> = {};
	for (const part of header.split(";")) {
		const separatorIndex = part.indexOf("=");
		if (separatorIndex === -1) continue;
		const name = part.slice(0, separatorIndex).trim();
		if (!name) continue;
		cookies[name] = part.slice(separatorIndex + 1).trim();
	}
	return cookies;
}

function serializeCookie(
	name: string,
	value: string,
	options: CookieSerializeOptions = {},
): string {
	const segments = [`${name}=${value}`, `Path=${options.path ?? "/"}`];
	if (typeof options.maxAge === "number") {
		segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
	}
	if (options.expires)
		segments.push(`Expires=${options.expires.toUTCString()}`);
	if (options.domain) segments.push(`Domain=${options.domain}`);
	if (options.httpOnly !== false) segments.push("HttpOnly");
	const sameSite = options.sameSite ?? "lax";
	segments.push(`SameSite=${sameSite[0].toUpperCase()}${sameSite.slice(1)}`);
	// Deployment config already requires COOKIE_SECURE=true; Secure is never optional here.
	segments.push("Secure");
	return segments.join("; ");
}

// Bridges @auth0/auth0-server-js to the plain Request/Response world of
// server.mjs: this gate runs before the TanStack Start SSR handler, so there
// is no ambient request context to read cookies from, unlike the framework
// helpers TanStack Start server functions get. Callers pass the incoming
// Request and a Headers object to collect outgoing Set-Cookie values onto.
class WayfareCookieHandler implements CookieHandler<StoreOptions> {
	getCookie(name: string, storeOptions?: StoreOptions): string | undefined {
		return storeOptions && parseCookies(storeOptions.request)[name];
	}

	getCookies(storeOptions?: StoreOptions): Record<string, string> {
		return storeOptions ? parseCookies(storeOptions.request) : {};
	}

	setCookie(
		name: string,
		value: string,
		options?: CookieSerializeOptions,
		storeOptions?: StoreOptions,
	): void {
		storeOptions?.responseHeaders.append(
			"set-cookie",
			serializeCookie(name, value, options),
		);
	}

	deleteCookie(
		name: string,
		storeOptions?: StoreOptions,
		options?: CookieSerializeOptions,
	): void {
		storeOptions?.responseHeaders.append(
			"set-cookie",
			serializeCookie(name, "", { ...options, maxAge: 0 }),
		);
	}
}

const cookieHandler = new WayfareCookieHandler();

let serverClient:
	| { key: string; client: ServerClient<StoreOptions> }
	| undefined;

function buildPublicUrl(pathname: string): URL {
	const { publicOrigin } = requirePublishedDeploymentConfig();
	return new URL(pathname, publicOrigin);
}

function getServerClient(): ServerClient<StoreOptions> {
	const config = requirePublishedDeploymentConfig();
	const key = [
		config.loginDomain,
		config.loginClientId,
		config.loginClientSecret,
		config.loginSessionSecret,
		config.loginCsrfSecret,
	].join(":");
	if (serverClient?.key !== key) {
		serverClient = {
			key,
			client: new ServerClient<StoreOptions>({
				domain: config.loginDomain,
				clientId: config.loginClientId,
				clientSecret: config.loginClientSecret,
				authorizationParams: {
					redirect_uri: buildPublicUrl("/auth/callback").toString(),
					scope: "openid profile email offline_access",
				},
				stateIdentifier: SESSION_COOKIE_NAME,
				transactionIdentifier: PENDING_COOKIE_NAME,
				transactionStore: new CookieTransactionStore(
					{ secret: config.loginCsrfSecret },
					cookieHandler,
				),
				stateStore: new StatelessStateStore(
					{ secret: config.loginSessionSecret },
					cookieHandler,
				),
			}),
		};
	}
	return serverClient.client;
}

// Constructs the client eagerly so a misconfigured deployment fails startup
// instead of the first login attempt. OIDC discovery itself is lazy and
// cached inside the SDK, so this does not reach the IdP.
export async function initializeEnturLogin(): Promise<void> {
	getServerClient();
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
	const responseHeaders = noStoreHeaders();
	const authorizationUrl = await getServerClient().startInteractiveLogin(
		{ appState: { returnTo } satisfies AppState },
		{ request, responseHeaders },
	);
	responseHeaders.set("location", authorizationUrl.href);
	return new Response(null, { status: 302, headers: responseHeaders });
}

function loginErrorResponse(): Response {
	return new Response("Login could not be completed. Please try again.", {
		status: 400,
		headers: noStoreHeaders({ "content-type": "text/plain; charset=utf-8" }),
	});
}

function logLoginFailure(reason: string, error?: unknown): void {
	const details: Record<string, unknown> = {
		errorType: error instanceof Error ? error.name : typeof error,
	};
	if (error instanceof Error) {
		details.message = error.message;
		const code = (error as { code?: unknown }).code;
		if (typeof code === "string") details.code = code;
		// SDK API errors (TokenByCodeError, etc.) attach the raw OAuth2 error here.
		const cause = (error as { cause?: unknown }).cause;
		if (cause && typeof cause === "object") {
			const { error: oauthError, error_description: oauthErrorDescription } =
				cause as { error?: unknown; error_description?: unknown };
			if (typeof oauthError === "string") details.oauthError = oauthError;
			if (typeof oauthErrorDescription === "string") {
				details.oauthErrorDescription = oauthErrorDescription;
			}
		}
	}
	console.warn(`[auth] ${reason}`, details);
}

export async function handleCallback(request: Request): Promise<Response> {
	const responseHeaders = noStoreHeaders();
	try {
		// request.url carries the scheme srvx sees on the raw socket, which is
		// plain http behind the TLS-terminating ingress. The SDK derives the
		// redirect_uri for the token exchange from this URL's origin, and it
		// must match the https redirect_uri sent to /authorize (via
		// buildPublicUrl below), so rebuild it against PUBLIC_ORIGIN instead of
		// trusting the request's own origin.
		const incomingUrl = new URL(request.url);
		const callbackUrl = buildPublicUrl(
			incomingUrl.pathname + incomingUrl.search,
		);
		const { appState } =
			await getServerClient().completeInteractiveLogin<AppState>(
				callbackUrl,
				{ request, responseHeaders },
			);
		const returnTo = sanitizeReturnTo(appState?.returnTo ?? null);
		responseHeaders.set("location", buildPublicUrl(returnTo).toString());
		return new Response(null, { status: 302, headers: responseHeaders });
	} catch (error) {
		logLoginFailure("authorization response validation failed", error);
		return loginErrorResponse();
	}
}

export async function handleLogout(request: Request): Promise<Response> {
	const responseHeaders = noStoreHeaders();
	const logoutUrl = await getServerClient().logout(
		{ returnTo: buildPublicUrl("/").toString() },
		{ request, responseHeaders },
	);
	responseHeaders.set("location", logoutUrl.href);
	return new Response(null, { status: 302, headers: responseHeaders });
}

// Returns the signed-in user's subject, or undefined when there is no valid
// session. Any Set-Cookie the SDK needs to write (e.g. a rotated session
// cookie after a refresh) is appended to `responseHeaders`; the caller is
// responsible for copying those onto the final response.
export async function getSessionSubject(
	request: Request,
	responseHeaders: Headers,
): Promise<string | undefined> {
	const storeOptions: StoreOptions = { request, responseHeaders };
	const client = getServerClient();
	const session = await client.getSession(storeOptions);
	if (!session?.user) return undefined;
	try {
		// Touching the access token lets the SDK refresh it (and persist a
		// rotated session cookie) when the current one is close to expiry, so a
		// session can outlive a single ID token via the refresh token. The
		// token itself is unused here -- Wayfare calls Entur APIs with a
		// separate machine credential (see src/server/auth.ts).
		await client.getAccessToken({}, storeOptions);
	} catch {
		return undefined;
	}
	return session.user.sub;
}
