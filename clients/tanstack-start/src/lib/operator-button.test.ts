import { describe, expect, it } from "vitest";
import {
	BUTTON_DARK_INK,
	BUTTON_LIGHT_INK,
	brandButtonColors,
	OPERATOR_ACCENTS,
} from "./operator-accent";
import { OPERATORS } from "./operators";

function relativeLuminance(hex: string): number {
	const raw = hex.replace("#", "");
	const linear = [0, 2, 4]
		.map((i) => Number.parseInt(raw.slice(i, i + 2), 16) / 255)
		.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a: string, b: string): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const [hi, lo] = la > lb ? [la, lb] : [lb, la];
	return (hi + 0.05) / (lo + 0.05);
}

describe("brandButtonColors", () => {
	it("clears AA against its own ink for every operator", () => {
		const failures = OPERATORS.map((operator) => {
			const { background, ink } = brandButtonColors(
				OPERATOR_ACCENTS[operator.code],
			);
			return {
				code: operator.code,
				background,
				ink,
				contrast: Number(contrast(background, ink).toFixed(2)),
			};
		}).filter((r) => r.contrast < 4.5);

		expect(failures).toEqual([]);
	});

	it("keeps hover readable too", () => {
		const failures = OPERATORS.map((operator) => {
			const { hover, ink } = brandButtonColors(OPERATOR_ACCENTS[operator.code]);
			return {
				code: operator.code,
				contrast: Number(contrast(hover, ink).toFixed(2)),
			};
		}).filter((r) => r.contrast < 4.5);

		expect(failures).toEqual([]);
	});

	it("keeps a light brand yellow untouched and puts dark ink on it", () => {
		// Darkening #FCDE3D far enough to hold white text lands on olive, because
		// yellow carries its chroma at high lightness. Dark ink keeps it yellow.
		const { background, ink } = brandButtonColors("#FCDE3D");
		expect(background).toBe("#FCDE3D");
		expect(ink).toBe(BUTTON_DARK_INK);
	});

	it("keeps a dark brand green untouched with white ink", () => {
		const { background, ink } = brandButtonColors("#00453E");
		expect(background).toBe("#00453E");
		expect(ink).toBe(BUTTON_LIGHT_INK);
	});

	it("leaves the fill alone whenever either ink works", () => {
		// The brand colour surviving intact is the point; shifting is the fallback.
		const untouched = Object.entries(OPERATOR_ACCENTS).filter(
			([, accent]) => brandButtonColors(accent).background === accent,
		);
		expect(untouched.length).toBeGreaterThan(
			Object.keys(OPERATOR_ACCENTS).length / 2,
		);
	});

	it("only shifts a mid-tone that fails both inks", () => {
		// AKT's green manages 3.4:1 with white and 4.4:1 with dark.
		const { background } = brandButtonColors("#009F6F");
		expect(background).not.toBe("#009F6F");
	});

	it("keeps saturation high while darkening", () => {
		// Deepen rather than grey out. A darkened green should stay clearly green:
		// its dominant channel keeps a wide lead over the others.
		const { background } = brandButtonColors("#009F6F");
		const raw = background.replace("#", "");
		const [r, g, b] = [0, 2, 4].map((i) =>
			Number.parseInt(raw.slice(i, i + 2), 16),
		);
		expect(g).toBeGreaterThan(r + 30);
		expect(g).toBeGreaterThan(b + 20);
	});

	it("gives every operator a hover shade distinct from its background", () => {
		for (const operator of OPERATORS) {
			const { background, hover } = brandButtonColors(
				OPERATOR_ACCENTS[operator.code],
			);
			expect(hover, operator.code).not.toBe(background);
		}
	});

	it("produces valid hex for both shades", () => {
		for (const accent of Object.values(OPERATOR_ACCENTS)) {
			const { background, hover } = brandButtonColors(accent);
			expect(background).toMatch(/^#[0-9A-F]{6}$/);
			expect(hover).toMatch(/^#[0-9A-F]{6}$/);
		}
	});
});
