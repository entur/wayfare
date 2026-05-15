import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";

export const checkHealth = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<Record<string, string>>("/health");
	});
