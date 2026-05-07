import { createServerFn } from "@tanstack/react-start";
import { getRuntimeConfig } from "../server/runtime-config";
import type { GeocoderResponse } from "../types/geocoder";

interface AutocompleteInput {
	text: string;
	size?: number;
	lang?: string;
	layers?: string;
}

export const autocompletePlaces = createServerFn({ method: "GET" })
	.inputValidator((data: AutocompleteInput) => data)
	.handler(async ({ data }) => {
		const params = new URLSearchParams({
			text: data.text,
			size: String(data.size ?? 10),
			lang: data.lang ?? "no",
			layers: data.layers ?? "venue",
		});
		const url = `${getRuntimeConfig().geocoderUrl}/autocomplete?${params}`;
		const res = await fetch(url, {
			headers: {
				"ET-Client-Name": process.env.ET_CLIENT_NAME ?? "wayfare-web",
			},
		});
		if (!res.ok) {
			throw new Error(`Geocoder request failed (${res.status})`);
		}
		return (await res.json()) as GeocoderResponse;
	});
