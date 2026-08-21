#!/usr/bin/env node
// Production entry point for the built TanStack Start server.
//
// `vite build` emits a server-side fetch handler (dist/server/server.js) and
// a static client bundle (dist/client/), but neither is wired to an HTTP
// listener on its own — `vite preview` only works locally because the
// TanStack Start Vite plugin wires that up internally for smoke-testing.
// This file does the equivalent wiring for a real deployment: a lightweight
// health check, static file serving for dist/client, and the built server
// handler, listening on PORT (default 3000, srvx's default).
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "srvx";
import { serveStatic } from "srvx/static";
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

// Vite content-hashes everything under /assets/, so an ungated deployment can
// cache those responses for a long time. The access-gated staging deployment
// overrides this below because every response behind the gate must be no-store.
async function withAssetCaching(request, next) {
	const response = await serveClientAssets(request, next);
	if (new URL(request.url).pathname.startsWith("/assets/")) {
		response.headers.set("cache-control", "public, max-age=31536000, immutable");
	}
	return response;
}

serve({
	port: process.env.PORT,
	// Bind to all interfaces by default. Set HOST=127.0.0.1 if this pod ever
	// sits behind a sidecar meant to be its only public entry point.
	hostname: process.env.HOST,
	async fetch(request) {
		try {
			const { pathname } = new URL(request.url);
			// Infra-only endpoint: intentionally does not call any upstream, so
			// it stays meaningful as a k8s liveness probe even when OMSA is down.
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

			// Entur employee login gate — see src/server/access-gate.ts. Only
			// active when REQUIRE_ENTUR_LOGIN=true (a published/locked
			// deployment); local dev and the eventual public mock deployment
			// never hit this at all.
			if (isEnturLoginRequired()) {
				const authRouteResponse = await handleAuthRoutes(request);
				if (authRouteResponse) return authRouteResponse;

				const denied = await authorizeRequest(request);
				if (denied) return denied;
			}

			const response = await withAssetCaching(request, () =>
				serverEntry.fetch(request),
			);
			if (isEnturLoginRequired()) {
				response.headers.set("cache-control", "no-store");
			}
			return response;
		} catch (error) {
			// srvx's Node adapter does not catch synchronous/async throws from
			// this handler — an uncaught one takes the whole process down,
			// which would fail every other request (including /health) along
			// with it. A single request's error must stay a single request's
			// error.
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
