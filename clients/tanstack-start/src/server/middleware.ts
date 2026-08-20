import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
	DEV_CONFIG_COOKIE_NAME,
	type DevConfigOverrides,
	sanitizeDevConfigOverrides,
} from "../lib/dev-config-storage";
import { getAccessToken } from "./auth";
import { areDevConfigOverridesAllowed } from "./runtime-config";

function parseDevConfigCookie(): DevConfigOverrides {
	if (!areDevConfigOverridesAllowed()) return {};
	try {
		const req = getRequest();
		if (!req) return {};
		const cookieHeader = req.headers.get("cookie") ?? "";
		const pattern = new RegExp(`(?:^|;\\s*)${DEV_CONFIG_COOKIE_NAME}=([^;]+)`);
		const match = pattern.exec(cookieHeader);
		if (!match?.[1]) return {};
		// The cookie is client-writable and unsigned, so its contents are
		// untrusted input: validate/narrow it the same way the client does
		// before it can influence which env mode or Entur headers a request uses.
		return sanitizeDevConfigOverrides(JSON.parse(decodeURIComponent(match[1])));
	} catch {
		return {};
	}
}

export const devConfigMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const devConfig = parseDevConfigCookie();
	return next({ context: { devConfig } });
});

export const authMiddleware = createMiddleware({ type: "function" })
	.middleware([devConfigMiddleware])
	.server(async ({ next, context }) => {
		await getAccessToken(context.devConfig);
		return next();
	});
