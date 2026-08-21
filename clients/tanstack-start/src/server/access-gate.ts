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

export async function handleAuthRoutes(
	request: Request,
): Promise<Response | null> {
	const handler = AUTH_ROUTE_HANDLERS[new URL(request.url).pathname];
	return handler ? handler(request) : null;
}

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
			"Your Entur account does not have wayfare.web access.",
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
