// The single HTTP-layer gate a published deployment sits behind. Deliberately
// enforced in server.mjs, in front of everything — SSR page loads and server
// function calls alike — rather than only inside a createServerFn
// middleware, so there's no way to reach the app by any request shape
// without going through this first.
// server.mjs imports this module (and everything it imports) directly via
// plain `node`, relying on Node 24's built-in TS type-stripping rather than
// going through Vite — so, unlike the rest of this codebase, relative
// imports here need explicit .ts extensions; Node's own ESM resolver
// doesn't infer them the way the bundler does.

import { isEnturLoginRequired } from "./deployment-config.ts";
import {
	buildLoginRedirect,
	getSessionIdToken,
	handleCallback,
	handleLogout,
	initializeEnturLogin,
	startLogin,
} from "./entur-login.ts";
import {
	hasStagingAccess,
	initializePermissionStore,
} from "./permission-store.ts";

export { isEnturLoginRequired } from "./deployment-config.ts";

let ready = false;

export async function initializeAccessGate(): Promise<void> {
	if (isEnturLoginRequired()) {
		await Promise.all([initializeEnturLogin(), initializePermissionStore()]);
	}
	ready = true;
}

export function isAccessGateReady(): boolean {
	return ready;
}

const AUTH_ROUTE_HANDLERS: Record<
	string,
	(request: Request) => Response | Promise<Response>
> = {
	"/auth/login": startLogin,
	"/auth/callback": handleCallback,
	"/auth/logout": handleLogout,
};

/** Handles /auth/login, /auth/callback, /auth/logout. Null if not one of those paths. */
export async function handleAuthRoutes(
	request: Request,
): Promise<Response | null> {
	const handler = AUTH_ROUTE_HANDLERS[new URL(request.url).pathname];
	return handler ? handler(request) : null;
}

/**
 * Gates every other request. Returns a Response to short-circuit with
 * (a redirect to /auth/login, or a 403), or null to let the request proceed.
 */
export async function authorizeRequest(
	request: Request,
): Promise<Response | null> {
	if (!ready) {
		return new Response("Service Unavailable", {
			status: 503,
			headers: {
				"cache-control": "no-store",
				"content-type": "text/plain; charset=utf-8",
			},
		});
	}
	const idToken = await getSessionIdToken(request);
	if (!idToken) {
		return buildLoginRedirect(new URL(request.url));
	}
	if (!(await hasStagingAccess(idToken))) {
		return new Response(
			"You're signed in, but your Entur account hasn't been granted " +
				"wayfare.web. Ask a Wayfare admin to assign it in Permission Store.",
			{
				status: 403,
				headers: {
					"cache-control": "no-store",
					"content-type": "text/plain; charset=utf-8",
				},
			},
		);
	}
	return null;
}
