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

process.env.NODE_ENV ??= "production";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "dist/client");

const { default: serverEntry } = await import(
	join(__dirname, "dist/server/server.js")
);

const serveClientAssets = serveStatic({ dir: clientDir });

// Vite content-hashes everything under /assets/, so it's safe to cache
// those responses for a long time. Everything else (index.html,
// manifest.json, stops-geo.json, ...) keeps whatever serveStatic sends by
// default.
async function withAssetCaching(request, next) {
	const response = await serveClientAssets(request, next);
	if (new URL(request.url).pathname.startsWith("/assets/")) {
		response.headers.set("cache-control", "public, max-age=31536000, immutable");
	}
	return response;
}

serve({
	port: process.env.PORT,
	// Bind to all interfaces by default. Set HOST=127.0.0.1 for a deployment
	// where a sidecar (e.g. an oauth2-proxy gating employee access) is meant
	// to be the only thing this pod exposes publicly.
	hostname: process.env.HOST,
	fetch(request) {
		const { pathname } = new URL(request.url);
		// Infra-only endpoint: intentionally does not call any upstream, so it
		// stays meaningful as a k8s liveness probe even when OMSA is down.
		if (pathname === "/health" || pathname === "/healthz") {
			return new Response(JSON.stringify({ status: "ok" }), {
				status: 200,
				headers: { "content-type": "application/json" },
			});
		}
		return withAssetCaching(request, () => serverEntry.fetch(request));
	},
});
