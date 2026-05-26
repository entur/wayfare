import { createServerFn } from "@tanstack/react-start";
import { formatZoneName, OPERATOR_NAMES } from "../lib/zone-utils";
import type { PlaceReference } from "../types/common";

interface FareZone {
	id: string;
	name: string;
	operator: string;
	operatorName: string;
	tariffZoneId?: string;
}

type RawZone = {
	id: string;
	name: { value: string };
	keyList?: {
		keyValue?: { key: string; value: string }[];
	};
};

let cachedFareZones: FareZone[] | null = null;

async function getFareZones(): Promise<FareZone[]> {
	if (cachedFareZones) {
		return cachedFareZones;
	}

	const rawZoneModule = await import("../assets/fare-zones.json");
	const rawZones = rawZoneModule.default as RawZone[];
	cachedFareZones = rawZones.map((zone) => {
		const operator = zone.id.split(":")[0];
		const tzMapping = zone.keyList?.keyValue?.find(
			(kv) => kv.key === "tzMapping",
		);
		return {
			id: zone.id,
			name: zone.name.value,
			operator,
			operatorName: OPERATOR_NAMES[operator] ?? operator,
			tariffZoneId: tzMapping?.value,
		};
	});

	return cachedFareZones;
}

function searchFareZones(fareZones: FareZone[], query: string): FareZone[] {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) {
		return [];
	}

	return fareZones
		.filter((zone) => {
			const displayName = formatZoneName(zone.name, zone.operatorName);
			return (
				displayName.toLowerCase().includes(normalizedQuery) ||
				zone.id.toLowerCase().includes(normalizedQuery)
			);
		})
		.slice(0, 12);
}

export const getFareZoneSuggestions = createServerFn({ method: "GET" })
	.inputValidator((query: string) => query)
	.handler(async ({ data: query }) => {
		const fareZones = await getFareZones();
		const matches = searchFareZones(fareZones, query);
		return matches.map(
			(zone): PlaceReference => ({
				placeId: zone.id,
				name: formatZoneName(zone.name, zone.operatorName),
			}),
		);
	});
