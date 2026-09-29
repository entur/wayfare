import { describe, expect, it } from "vitest";
import { fetchAllPages } from "./assets";
import type { AssetFeature, AssetFeatureCollection } from "../types/assets";

function seat(id: string): AssetFeature {
	return {
		type: "Feature",
		id,
		geometry: null,
		properties: { type: "seat", availability: "AVAILABLE", carriage: "1" },
	};
}

function page(
	offset: number,
	count: number,
	numberMatched: number,
): AssetFeatureCollection {
	return {
		type: "FeatureCollection",
		numberMatched,
		numberReturned: count,
		features: Array.from({ length: count }, (_, i) => seat(`seat-${offset + i}`)),
	};
}

describe("fetchAllPages", () => {
	it("stops after the first page when it already covers numberMatched", async () => {
		const fetchPage = async (offset: number) => page(offset, 5, 5);
		const result = await fetchAllPages(fetchPage);
		expect(result.features).toHaveLength(5);
		expect(result.numberReturned).toBe(5);
	});

	it("pages until numberMatched is reached, requesting the right offsets", async () => {
		const requestedOffsets: number[] = [];
		const fetchPage = async (offset: number) => {
			requestedOffsets.push(offset);
			// three pages of 1000 covering numberMatched: 2500
			const remaining = 2500 - offset;
			return page(offset, Math.min(1000, remaining), 2500);
		};

		const result = await fetchAllPages(fetchPage);
		expect(requestedOffsets).toEqual([0, 1000, 2000]);
		expect(result.features).toHaveLength(2500);
		expect(result.numberReturned).toBe(2500);
	});

	it("stops if a page unexpectedly returns zero features", async () => {
		let calls = 0;
		const fetchPage = async (offset: number) => {
			calls++;
			if (offset === 0) return page(0, 1000, 3000);
			return page(offset, 0, 3000);
		};

		const result = await fetchAllPages(fetchPage);
		expect(calls).toBe(2);
		expect(result.features).toHaveLength(1000);
	});

	it("never loops forever when numberMatched never converges", async () => {
		let calls = 0;
		const fetchPage = async (offset: number) => {
			calls++;
			return page(offset, 1000, Number.MAX_SAFE_INTEGER);
		};

		const result = await fetchAllPages(fetchPage);
		expect(calls).toBeLessThanOrEqual(50);
		expect(result.features.length).toBeGreaterThan(0);
	});
});
