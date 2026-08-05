import { describe, expect, it } from "vitest";
import { bannerColors, OPERATOR_ACCENTS } from "./operator-accent";
import { OPERATORS } from "./operators";

const LIGHT_SURFACE = "#F5F6F7";
const DARK_SURFACE = "#12151A";

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

describe("bannerColors", () => {
	it("stays visible on both surfaces for every operator", () => {
		const failures: { code: string; theme: string; contrast: number }[] = [];

		for (const operator of OPERATORS) {
			const { light, dark } = bannerColors(OPERATOR_ACCENTS[operator.code]);
			const onLight = contrast(light, LIGHT_SURFACE);
			const onDark = contrast(dark, DARK_SURFACE);
			if (onLight < 2) {
				failures.push({
					code: operator.code,
					theme: "light",
					contrast: Number(onLight.toFixed(2)),
				});
			}
			if (onDark < 2) {
				failures.push({
					code: operator.code,
					theme: "dark",
					contrast: Number(onDark.toFixed(2)),
				});
			}
		}

		expect(failures).toEqual([]);
	});

	it("lightens a very dark brand colour for the dark theme", () => {
		// Vy's #00453E manages only ~1.8:1 against #12151A untouched.
		const { dark } = bannerColors("#00453E");
		expect(dark).not.toBe("#00453E");
		expect(relativeLuminance(dark)).toBeGreaterThan(
			relativeLuminance("#00453E"),
		);
	});

	it("darkens a light brand yellow for the light theme", () => {
		// #FCDE3D against #F5F6F7 is about 1.2:1 — present but not deliberate.
		const { light } = bannerColors("#FCDE3D");
		expect(light).not.toBe("#FCDE3D");
		expect(relativeLuminance(light)).toBeLessThan(relativeLuminance("#FCDE3D"));
	});

	it("leaves a mid-tone alone on the surface it already suits", () => {
		// Ruter red clears both thresholds untouched.
		const { light, dark } = bannerColors("#E60000");
		expect(light).toBe("#E60000");
		expect(dark).toBe("#E60000");
	});

	it("returns valid hex for both themes", () => {
		for (const accent of Object.values(OPERATOR_ACCENTS)) {
			const { light, dark } = bannerColors(accent);
			expect(light).toMatch(/^#[0-9A-F]{6}$/);
			expect(dark).toMatch(/^#[0-9A-F]{6}$/);
		}
	});
});
