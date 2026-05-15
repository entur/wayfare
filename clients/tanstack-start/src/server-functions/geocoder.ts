import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import { getRuntimeConfig } from "../server/runtime-config";
import type { GeocoderResponse } from "../types/geocoder";

interface AutocompleteInput {
	text: string;
	size?: number;
	lang?: string;
	layers?: string;
}

export const autocompletePlaces = createServerFn({ method: "GET" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: AutocompleteInput) => data)
	.handler(async ({ data, context }) => {
		const config = getRuntimeConfig(context.devConfig);
		const params = new URLSearchParams({
			text: data.text,
			size: String(data.size ?? 10),
			lang: data.lang ?? "no",
			layers: data.layers ?? "venue",
		});
		const url = `${config.geocoderUrl}/autocomplete?${params}`;
		const res = await fetch(url, {
			headers: {
				"Entur-Client-Name":
					context.devConfig.clientName ??
					process.env.ENTUR_CLIENT_NAME ??
					"Wayfare-Web",
			},
		});
		if (!res.ok) {
			throw new Error(`Geocoder request failed (${res.status})`);
		}
		return (await res.json()) as GeocoderResponse;
	});
