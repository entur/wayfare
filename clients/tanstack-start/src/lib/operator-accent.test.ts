import { describe, expect, it } from "vitest";
import { accentFor, accentTint, OPERATOR_ACCENTS } from "./operator-accent";
import { OPERATORS } from "./operators";

describe("operator accents", () => {
	it("has an accent for every registered operator", () => {
		const missing = OPERATORS.filter((o) => !accentFor(o.code)).map(
			(o) => o.code,
		);
		expect(missing).toEqual([]);
	});

	it("only holds full six-digit hex values", () => {
		// accentTint slices fixed offsets, so a shorthand or named colour would
		// silently produce NaN channels.
		for (const [code, hex] of Object.entries(OPERATOR_ACCENTS)) {
			expect(hex, code).toMatch(/^#[0-9A-Fa-f]{6}$/);
		}
	});

	it("converts to rgba with the requested alpha", () => {
		expect(accentTint("#E60000", 0.1)).toBe("rgba(230, 0, 0, 0.1)");
		expect(accentTint("#003F24", 0.08)).toBe("rgba(0, 63, 36, 0.08)");
	});

	it("produces no NaN channels for any registered accent", () => {
		for (const operator of OPERATORS) {
			const accent = accentFor(operator.code) as string;
			expect(accentTint(accent, 0.1), operator.code).not.toContain("NaN");
		}
	});

	it("avoids the pale Svipper background as an accent", () => {
		// Svipper trades on #FDEEE7, which is invisible as a border or tint. The
		// orange mark is the usable accent.
		expect(accentFor("TRO")).toBe("#E95E1B");
	});

	it("returns nothing for unknown or missing codes", () => {
		expect(accentFor("nope")).toBeUndefined();
		expect(accentFor(null)).toBeUndefined();
	});
});
