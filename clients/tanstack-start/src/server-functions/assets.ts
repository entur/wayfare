import { createServerFn } from "@tanstack/react-start";
import { getAccessToken } from "../server/auth";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import { getRuntimeConfig } from "../server/runtime-config";
import type {
	AssetFeatureCollection,
	AssignAssetRequest,
} from "../types/assets";
import type { ConfirmedPackage } from "../types/purchase";

const ALLOWED_IMAGE_HOST_SUFFIXES = [".entur.io", ".entur.org"];

function isAllowedImageHost(hostname: string, omsaHost: string): boolean {
	if (hostname === omsaHost) return true;
	if (hostname === "localhost" || hostname === "127.0.0.1") return true;
	return ALLOWED_IMAGE_HOST_SUFFIXES.some((suffix) =>
		hostname.endsWith(suffix),
	);
}

function svgDimensions(
	buffer: Buffer,
): { width: number; height: number } | null {
	const source = buffer
		.subarray(0, Math.min(buffer.length, 4096))
		.toString("utf8");
	const svg = source.match(/<svg\b[^>]*>/i)?.[0];
	if (!svg) return null;

	const viewBox = svg.match(
		/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i,
	);
	if (viewBox) {
		const width = Number(viewBox[1]);
		const height = Number(viewBox[2]);
		if (width > 0 && height > 0) return { width, height };
	}

	const width = Number(svg.match(/\bwidth=["']([\d.]+)/i)?.[1]);
	const height = Number(svg.match(/\bheight=["']([\d.]+)/i)?.[1]);
	return width > 0 && height > 0 ? { width, height } : null;
}

export const listAssets = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: { packageId: string; serviceJourney: string }) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<AssetFeatureCollection>("/collections/assets/items", {
			packageId: data.packageId,
			serviceJourney: data.serviceJourney,
			limit: "10000",
		});
	});

export const getSeatmapImage = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: { href: string }) => data)
	.handler(async ({ data, context }) => {
		const config = getRuntimeConfig(context.devConfig);
		const url = new URL(data.href, config.omsaBaseUrl);
		const omsaHost = new URL(config.omsaBaseUrl).hostname;

		if (
			url.protocol !== "https:" &&
			!(url.protocol === "http:" && isAllowedImageHost(url.hostname, omsaHost))
		) {
			throw new Error("Refusing to fetch seatmap image over insecure protocol");
		}
		if (!isAllowedImageHost(url.hostname, omsaHost)) {
			throw new Error(
				`Refusing to fetch seatmap image from untrusted host: ${url.hostname}`,
			);
		}

		const headers: Record<string, string> = {
			Accept: "image/svg+xml,image/png;q=0.8",
		};
		if (url.hostname === omsaHost) {
			headers.Authorization = await getAccessToken(context.devConfig);
		}

		const response = await fetch(url, { headers });
		if (!response.ok) {
			throw new Error(`Failed to fetch seatmap image (${response.status})`);
		}
		const contentType = response.headers.get("content-type") ?? "image/svg+xml";
		const buffer = Buffer.from(await response.arrayBuffer());
		const isPng =
			contentType.includes("image/png") &&
			buffer.length >= 24 &&
			buffer.subarray(1, 4).toString("ascii") === "PNG";
		const dimensions = contentType.includes("image/svg+xml")
			? svgDimensions(buffer)
			: isPng
				? { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
				: null;
		return {
			dataUrl: `data:${contentType};base64,${buffer.toString("base64")}`,
			...(dimensions ?? {}),
		};
	});

export const assignAsset = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: AssignAssetRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>("/processes/assign-asset/execute", data);
	});
