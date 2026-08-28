import { PUBLIC_PATHNAMES } from "../lib/public-pathnames.ts";
import { isEnturLoginRequired } from "./deployment-config.ts";
import {
	buildLoginRedirect,
	getSessionSubject,
	handleCallback,
	handleLogout,
	initializeEnturLogin,
	noStoreHeaders,
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

export async function handleAuthRoutes(
	request: Request,
): Promise<Response | null> {
	const handler = AUTH_ROUTE_HANDLERS[new URL(request.url).pathname];
	return handler ? handler(request) : null;
}

export async function authorizeRequest(
	request: Request,
	responseHeaders: Headers,
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
	// Reachable regardless of session state, so the auth failures below can
	// redirect here without looping back through this same gate. Shared with
	// __root.tsx's standalone-shell check so the two lists can't drift apart.
	if (PUBLIC_PATHNAMES.has(new URL(request.url).pathname)) {
		return null;
	}
	const subject = await getSessionSubject(request, responseHeaders);
	if (!subject) {
		return buildLoginRedirect(new URL(request.url));
	}
	if (!(await hasStagingAccess(subject))) {
		return new Response(null, {
			status: 302,
			headers: noStoreHeaders({ location: "/access-denied?reason=no-access" }),
		});
	}
	return null;
}
