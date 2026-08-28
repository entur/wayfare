#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "srvx";
import { staticMiddleware } from "srvx/static";
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

const serveClientAssets = staticMiddleware({ dir: clientDir });

await initializeAccessGate();

// Static files (JS/CSS bundles, favicons, illustrations) are public and must
// not depend on the current session having wayfare.web access -- the
// access-denied page needs its own assets to render for a session that just
// failed that check. Returns null when the path isn't a static file.
async function serveStaticAsset(request) {
	const response = await serveClientAssets(request, () => null);
	if (response && new URL(request.url).pathname.startsWith("/assets/")) {
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

			const staticResponse = await serveStaticAsset(request);
			if (staticResponse) return staticResponse;

			let authResponseHeaders;
			if (isEnturLoginRequired()) {
				const authRouteResponse = await handleAuthRoutes(request);
				if (authRouteResponse) return authRouteResponse;

				authResponseHeaders = new Headers();
				const denied = await authorizeRequest(request, authResponseHeaders);
				if (denied) return denied;
			}

			const response = await serverEntry.fetch(request);
			// The gate may have refreshed the session (e.g. rotated an expiring
			// token) while authorizing this request -- carry those Set-Cookie
			// headers onto the response the SSR handler produced.
			if (authResponseHeaders) {
				for (const cookie of authResponseHeaders.getSetCookie()) {
					response.headers.append("set-cookie", cookie);
				}
			}
			// Static assets already returned above, so anything reaching here is
			// an SSR document response.
			if (isEnturLoginRequired()) {
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
