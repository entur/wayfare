import type { GeographicalValidity, ZoneLabel } from "../types/search";

export const OPERATOR_NAMES: Record<string, string> = {
	AKT: "Agder",
	ATB: "AtB (Trondheim)",
	BRA: "Brakar",
	FIN: "Finnmark",
	INN: "Innlandstrafikk",
	KOL: "Kolumbus",
	MOR: "More og Romsdal",
	NOR: "Nordland",
	OST: "Ostfold",
	RUT: "Ruter",
	SKY: "Skyss",
	TEL: "Telemark",
	TRO: "Troms",
	VKT: "Vestfold Telemark",
};

export function formatZoneName(name: string, operatorName: string): string {
	const isCode = name.length <= 4 && /^[A-Za-z0-9]+$/.test(name);
	return isCode
		? `Zone ${name} (${operatorName})`
		: `${name} (${operatorName})`;
}

// Returns the zones to display for an offer's geographical validity.
// Prefers `groups` when present (they represent a named override, e.g. "Alle Soner"),
// otherwise falls back to the individual `fareZones`.
export function getEffectiveZones(
	validity: GeographicalValidity | undefined,
): ZoneLabel[] {
	const zonal = validity?.zonalValidity;
	if (!zonal) return [];
	if (zonal.groups && zonal.groups.length > 0) return zonal.groups;
	return zonal.fareZones ?? [];
}

const FARE_ZONE_NUMERIC = /^\d+$/;

function fareZoneSortKey(id: string): [string, number, string] {
	const operator = id.split(":")[0] ?? "";
	const suffix = id.split(":").at(-1) ?? id;
	const numeric = FARE_ZONE_NUMERIC.test(suffix)
		? Number.parseInt(suffix, 10)
		: Number.POSITIVE_INFINITY;
	return [operator, numeric, suffix];
}

export function sortFareZones(zones: ZoneLabel[]): ZoneLabel[] {
	return [...zones].sort((a, b) => {
		const [opA, nA, sA] = fareZoneSortKey(a.id);
		const [opB, nB, sB] = fareZoneSortKey(b.id);
		if (opA !== opB) return opA.localeCompare(opB);
		if (nA !== nB) return nA - nB;
		return sA.localeCompare(sB);
	});
}

export function formatZoneList(zones: ZoneLabel[]): string {
	return zones.map((z) => z.label).join(", ");
}
