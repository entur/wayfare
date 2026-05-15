import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
	DEV_CONFIG_COOKIE_NAME,
	type DevConfigOverrides,
} from "../lib/dev-config-storage";
import { getAccessToken } from "./auth";

function parseDevConfigCookie(): DevConfigOverrides {
	try {
		const req = getRequest();
		if (!req) return {};
		const cookieHeader = req.headers.get("cookie") ?? "";
		const pattern = new RegExp(`(?:^|;\\s*)${DEV_CONFIG_COOKIE_NAME}=([^;]+)`);
		const match = pattern.exec(cookieHeader);
		if (!match?.[1]) return {};
		return JSON.parse(decodeURIComponent(match[1])) as DevConfigOverrides;
	} catch {
		return {};
	}
}

export const devConfigMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const devConfig = parseDevConfigCookie();
		return next({ context: { devConfig } });
	},
);

export const authMiddleware = createMiddleware({ type: "function" })
	.middleware([devConfigMiddleware])
	.server(async ({ next, context }) => {
		await getAccessToken(context.devConfig);
		return next();
	});
