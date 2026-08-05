import { describe, expect, it } from "vitest";
import { searchFareZones } from "./fare-zones";

interface TestZone {
	id: string;
	name: string;
	operator: string;
	operatorName: string;
}

function zone(operator: string, n: number): TestZone {
	return {
		id: `${operator}:FareZone:${n}`,
		name: `Sone ${n}`,
		operator,
		operatorName: operator,
	};
}

// 12 Skyss zones ahead of a single Kolumbus one, so the Kolumbus zone falls
// outside the result cap unless the sort runs before the slice.
const ZONES: TestZone[] = [
	...Array.from({ length: 12 }, (_, i) => zone("SKY", i + 1)),
	zone("KOL", 99),
];

describe("searchFareZones", () => {
	it("returns matches in source order with no preference", () => {
		const result = searchFareZones(ZONES, "Sone");
		expect(result).toHaveLength(12);
		expect(result.every((z) => z.operator === "SKY")).toBe(true);
	});

	it("promotes the preferred operator ahead of the result cap", () => {
		const result = searchFareZones(ZONES, "Sone", "KOL");
		expect(result[0]?.id).toBe("KOL:FareZone:99");
		expect(result).toHaveLength(12);
	});

	it("orders but never filters", () => {
		const result = searchFareZones(ZONES, "Sone", "KOL");
		expect(result.filter((z) => z.operator === "SKY")).toHaveLength(11);
	});

	it("leaves ordering alone for an operator with no matches", () => {
		const result = searchFareZones(ZONES, "Sone", "RUT");
		expect(result[0]?.id).toBe("SKY:FareZone:1");
	});

	it("returns nothing for a blank query", () => {
		expect(searchFareZones(ZONES, "   ", "KOL")).toEqual([]);
	});
});
