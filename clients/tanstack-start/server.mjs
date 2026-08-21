#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "srvx";
import { serveStatic } from "srvx/static";
// Runs .ts sources directly via Node's built-in type stripping (default
// since Node 23.6; this image pins Node 24) -- only erasable syntax here,
// no enums/decorators, so no build step is needed for these files.
import {
	authorizeRequest,
	handleAuthRoutes,
	initializeAccessGate,
	isAccessGateReady,
	isEnturLoginRequired,
} from "./src/server/access-gate.ts";

process.env.NODE_ENV ??= "production";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "dist/client");

const { default: serverEntry } = await import(
	join(__dirname, "dist/server/server.js")
);

const serveClientAssets = serveStatic({ dir: clientDir });

await initializeAccessGate();

async function withAssetCaching(request, next) {
	const response = await serveClientAssets(request, next);
	if (new URL(request.url).pathname.startsWith("/assets/")) {
		response.headers.set("cache-control", "public, max-age=31536000, immutable");
	}
	return response;
}

serve({
	port: process.env.PORT,
	hostname: process.env.HOST,
	async fetch(request) {
		try {
			const { pathname } = new URL(request.url);
			if (
				pathname === "/health" ||
				pathname === "/healthz" ||
				pathname === "/health/liveness"
			) {
				return new Response(JSON.stringify({ status: "ok" }), {
					status: 200,
					headers: { "content-type": "application/json" },
				});
			}
			if (pathname === "/health/readiness") {
				const ready = isAccessGateReady();
				return new Response(
					JSON.stringify({ status: ready ? "ok" : "not_ready" }),
					{
						status: ready ? 200 : 503,
						headers: { "content-type": "application/json" },
					},
				);
			}

			if (isEnturLoginRequired()) {
				const authRouteResponse = await handleAuthRoutes(request);
				if (authRouteResponse) return authRouteResponse;

				const denied = await authorizeRequest(request);
				if (denied) return denied;
			}

			const response = await withAssetCaching(request, () =>
				serverEntry.fetch(request),
			);
			if (isEnturLoginRequired() && !pathname.startsWith("/assets/")) {
				response.headers.set("cache-control", "no-store");
			}
			return response;
		} catch (error) {
			console.error("[server] unhandled request error:", error);
			return new Response("Internal Server Error", {
				status: 500,
				headers: isEnturLoginRequired()
					? { "cache-control": "no-store" }
					: undefined,
			});
		}
	},
});
