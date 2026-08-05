import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OPERATORS } from "./operators";

const LOGO_DIR = join(process.cwd(), "public", "logos");

describe("operator logo assets", () => {
	it("has both colour-mode variants on disk for every declared logo", () => {
		// A missing file degrades to an invisible box rather than an error, so the
		// only thing that catches a bad rename is checking the filesystem.
		const missing: string[] = [];
		for (const operator of OPERATORS) {
			if (!operator.logo) continue;
			for (const variant of ["_simple.svg", "_simple_dark.svg"]) {
				const file = `${operator.logo}${variant}`;
				if (!existsSync(join(LOGO_DIR, file))) missing.push(file);
			}
		}
		expect(missing).toEqual([]);
	});

	it("declares a logo for every operator", () => {
		const withoutLogo = OPERATORS.filter((o) => !o.logo).map((o) => o.code);
		expect(withoutLogo).toEqual([]);
	});

	it("keeps the Farte chevrons on the brand colour", () => {
		// The upstream light variant is black and shifted out of its viewBox. Both
		// variants should be the corrected artwork; if a refresh drops the patch,
		// fail here rather than shipping a black, clipped mark.
		const light = readFileSync(join(LOGO_DIR, "Farte_simple.svg"), "utf8");
		expect(light).toContain("#6BC4AE");
		expect(light).not.toContain('fill="black"');
		expect(light).toBe(
			readFileSync(join(LOGO_DIR, "Farte_simple_dark.svg"), "utf8"),
		);
	});
});
