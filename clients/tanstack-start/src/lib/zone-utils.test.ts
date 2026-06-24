import { describe, expect, it } from "vitest";
import type { GeographicalValidity, ZoneLabel } from "../types/search";
import { formatZoneList, getEffectiveZones, sortFareZones } from "./zone-utils";

function geo(
	fareZones?: ZoneLabel[],
	groups?: ZoneLabel[],
): GeographicalValidity {
	return { zonalValidity: { fareZones, groups } };
}

function zone(id: string, label = id): ZoneLabel {
	return { id, label };
}

describe("getEffectiveZones", () => {
	it("returns empty array when validity is undefined", () => {
		expect(getEffectiveZones(undefined)).toEqual([]);
	});

	it("returns empty array when zonalValidity is absent", () => {
		expect(getEffectiveZones({})).toEqual([]);
	});

	it("returns fareZones when groups is absent", () => {
		const z = [zone("RUT:FareZone:1")];
		expect(getEffectiveZones(geo(z))).toEqual(z);
	});

	it("returns fareZones when groups is empty", () => {
		const z = [zone("RUT:FareZone:1")];
		expect(getEffectiveZones(geo(z, []))).toEqual(z);
	});

	it("prefers groups over fareZones when groups is non-empty", () => {
		const fareZones = [zone("RUT:FareZone:1"), zone("RUT:FareZone:2")];
		const groups = [zone("RUT:GroupOfTariffZones:All", "Alle Soner")];
		expect(getEffectiveZones(geo(fareZones, groups))).toEqual(groups);
	});
});

describe("sortFareZones", () => {
	it("sorts numeric suffixes numerically within the same operator", () => {
		const input = [
			zone("RUT:FareZone:10"),
			zone("RUT:FareZone:2"),
			zone("RUT:FareZone:1"),
		];
		const result = sortFareZones(input).map((z) => z.id);
		expect(result).toEqual([
			"RUT:FareZone:1",
			"RUT:FareZone:2",
			"RUT:FareZone:10",
		]);
	});

	it("sorts non-numeric suffixes lexicographically after numeric ones", () => {
		const input = [
			zone("RUT:FareZone:A"),
			zone("RUT:FareZone:2"),
			zone("RUT:FareZone:1"),
		];
		const result = sortFareZones(input).map((z) => z.id);
		expect(result).toEqual([
			"RUT:FareZone:1",
			"RUT:FareZone:2",
			"RUT:FareZone:A",
		]);
	});

	it("groups by operator before sorting by zone number", () => {
		const input = [
			zone("SKY:FareZone:1"),
			zone("RUT:FareZone:2"),
			zone("RUT:FareZone:1"),
		];
		const result = sortFareZones(input).map((z) => z.id);
		expect(result).toEqual([
			"RUT:FareZone:1",
			"RUT:FareZone:2",
			"SKY:FareZone:1",
		]);
	});

	it("does not mutate the input array", () => {
		const input = [zone("RUT:FareZone:2"), zone("RUT:FareZone:1")];
		const copy = [...input];
		sortFareZones(input);
		expect(input).toEqual(copy);
	});
});

describe("formatZoneList", () => {
	it("returns empty string for empty array", () => {
		expect(formatZoneList([])).toBe("");
	});

	it("returns the label for a single zone", () => {
		expect(formatZoneList([zone("id", "Zone 1")])).toBe("Zone 1");
	});

	it("joins multiple labels with a comma and space", () => {
		const zones = [
			zone("a", "Zone 1"),
			zone("b", "Zone 2"),
			zone("c", "Alle Soner"),
		];
		expect(formatZoneList(zones)).toBe("Zone 1, Zone 2, Alle Soner");
	});
});
