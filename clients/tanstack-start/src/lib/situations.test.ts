import { describe, expect, it } from "vitest";
import type { PtSituationElement } from "../types/situations";
import { dedupeSituations, pickText, severityRank } from "./situations";

function situation(
	overrides: Partial<PtSituationElement> = {},
): PtSituationElement {
	return {
		id: "SIT:SituationElement:1",
		summary: [{ value: "Test disruption", language: "no" }],
		description: [],
		advice: [],
		...overrides,
	};
}

describe("pickText", () => {
	it("returns English text by default", () => {
		const strings = [
			{ value: "Test disruption", language: "en" },
			{ value: "Testforstyrrelse", language: "no" },
		];
		expect(pickText(strings)).toBe("Test disruption");
	});

	it("accepts 'nb' as equivalent to 'no' when lang is 'no'", () => {
		const strings = [
			{ value: "Testforstyrrelse", language: "nb" },
			{ value: "Test disruption", language: "en" },
		];
		expect(pickText(strings, "no")).toBe("Testforstyrrelse");
	});

	it("falls back to English when Norwegian is absent", () => {
		const strings = [{ value: "Test disruption", language: "en" }];
		expect(pickText(strings)).toBe("Test disruption");
	});

	it("falls back to first non-empty value when no language matches", () => {
		const strings = [{ value: "Ukjent", language: "xx" }];
		expect(pickText(strings)).toBe("Ukjent");
	});

	it("returns undefined for empty array", () => {
		expect(pickText([])).toBeUndefined();
	});

	it("skips empty values", () => {
		const strings = [
			{ value: "", language: "no" },
			{ value: "Fallback", language: "en" },
		];
		expect(pickText(strings)).toBe("Fallback");
	});
});

describe("severityRank", () => {
	it("ranks verySevere higher than severe", () => {
		expect(severityRank("verySevere")).toBeGreaterThan(severityRank("severe"));
	});

	it("ranks severe higher than normal", () => {
		expect(severityRank("severe")).toBeGreaterThan(severityRank("normal"));
	});

	it("ranks noImpact as 0", () => {
		expect(severityRank("noImpact")).toBe(0);
	});

	it("returns 0 for null/undefined", () => {
		expect(severityRank(null)).toBe(0);
		expect(severityRank(undefined)).toBe(0);
	});
});

describe("dedupeSituations", () => {
	it("removes duplicate ids across lists", () => {
		const s1 = situation({ id: "S1", severity: "normal" });
		const s2 = situation({ id: "S2", severity: "severe" });
		const s1dup = situation({ id: "S1", severity: "normal" });

		const result = dedupeSituations([s1], [s2, s1dup]);
		expect(result).toHaveLength(2);
		expect(result.map((s) => s.id)).toEqual(["S2", "S1"]);
	});

	it("sorts by severity descending", () => {
		const low = situation({ id: "S1", severity: "slight" });
		const high = situation({ id: "S2", severity: "verySevere" });
		const mid = situation({ id: "S3", severity: "normal" });

		const result = dedupeSituations([low, high, mid]);
		expect(result.map((s) => s.id)).toEqual(["S2", "S3", "S1"]);
	});

	it("handles null/undefined list args", () => {
		const s1 = situation({ id: "S1" });
		const result = dedupeSituations(null, undefined, [s1]);
		expect(result).toHaveLength(1);
	});

	it("returns empty array when all lists are empty/null", () => {
		expect(dedupeSituations([], null, undefined)).toEqual([]);
	});
});
