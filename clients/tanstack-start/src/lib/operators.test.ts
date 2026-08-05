import { describe, expect, it } from "vitest";
import {
	authorityRefFor,
	findOperator,
	OPERATORS,
	operatorsWithProducts,
} from "./operators";
import { OPERATOR_NAMES } from "./zone-utils";

describe("operator registry", () => {
	it("has unique codespaces", () => {
		const codes = OPERATORS.map((operator) => operator.code);
		expect(new Set(codes).size).toBe(codes.length);
	});

	it("keeps operators without fare zones out of OPERATOR_NAMES", () => {
		// map.tsx and ZonesPanel.tsx use Object.keys(OPERATOR_NAMES) as the
		// canonical zone-operator list, so rail operators must not leak into it.
		const zoneless = OPERATORS.filter((operator) => !operator.hasFareZones);

		// Guard against the loop below passing vacuously.
		expect(zoneless.length).toBeGreaterThan(0);

		for (const operator of zoneless) {
			expect(OPERATOR_NAMES[operator.code]).toBeUndefined();
			expect(findOperator(operator.code)?.name).toBe(operator.name);
		}
	});

	it("exposes every fare zone operator by name", () => {
		for (const operator of OPERATORS) {
			if (operator.hasFareZones) {
				expect(OPERATOR_NAMES[operator.code]).toBe(operator.name);
			}
		}
	});

	it("resolves authority refs for known codes only", () => {
		expect(authorityRefFor("KOL")).toBe("KOL:Authority:8");
		expect(authorityRefFor("SKY")).toBe("SKY:Authority:SKY");
		expect(authorityRefFor("nope")).toBeUndefined();
		expect(authorityRefFor(null)).toBeUndefined();

		for (const operator of operatorsWithProducts()) {
			expect(operator.authorityRef).toBeDefined();
		}
	});

	it("has an authority ref for every operator", () => {
		// Every ref is confirmed against the organisation register, so
		// operatorsWithProducts() currently covers the whole registry.
		expect(operatorsWithProducts()).toHaveLength(OPERATORS.length);
	});

	it("scopes each authority ref to a real codespace", () => {
		for (const operator of OPERATORS) {
			// Refs may sit under another org's codespace (Skyss also answers to
			// SOF:*), but the one we pick must belong to a codespace we know.
			const codespace = operator.authorityRef?.split(":")[0];
			expect(OPERATORS.some((other) => other.code === codespace)).toBe(true);
		}
	});
});
