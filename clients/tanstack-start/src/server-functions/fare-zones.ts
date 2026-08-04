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

export interface FareZoneQuery {
	query: string;
	/** Operator codespace whose zones sort first. Ordering only — no filtering. */
	preferredOperator?: string;
}

export function searchFareZones(
	fareZones: FareZone[],
	query: string,
	preferredOperator?: string,
): FareZone[] {
	const normalizedQuery = query.trim().toLowerCase();
	if (!normalizedQuery) {
		return [];
	}

	const matches = fareZones.filter((zone) => {
		const displayName = formatZoneName(zone.name, zone.operatorName);
		return (
			displayName.toLowerCase().includes(normalizedQuery) ||
			zone.id.toLowerCase().includes(normalizedQuery)
		);
	});

	// Sort before slicing, otherwise a preferred-operator zone ranked 13th or
	// lower would be cut before it ever gets promoted. Sort is stable, so
	// relative order within each group survives.
	if (preferredOperator) {
		matches.sort(
			(a, b) =>
				Number(b.operator === preferredOperator) -
				Number(a.operator === preferredOperator),
		);
	}

	return matches.slice(0, 12);
}

export const getFareZoneSuggestions = createServerFn({ method: "GET" })
	.inputValidator((input: FareZoneQuery) => input)
	.handler(async ({ data }) => {
		const fareZones = await getFareZones();
		const matches = searchFareZones(
			fareZones,
			data.query,
			data.preferredOperator,
		);
		return matches.map(
			(zone): PlaceReference => ({
				placeId: zone.id,
				name: formatZoneName(zone.name, zone.operatorName),
			}),
		);
	});
