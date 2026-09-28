import { describe, expect, it } from "vitest";
import { buildBundles } from "../components/checkout/BundleCard";
import type { Offer } from "../types/search";
import {
	durationHours,
	durationLabel,
	groupBundlesByDuration,
	isOtherProduct,
} from "./offer-durations";

const zones = {
	zonalValidity: {
		fareZones: [{ id: "KOL:FareZone:1", label: "Haugalandet" }],
	},
};

function offer(
	id: string,
	validityPeriodType: string,
	standardDuration: string,
	transit = true,
): Offer {
	return {
		id,
		properties: {
			usageValidityPeriods: [{ validityPeriodType, standardDuration }],
			products: [
				{
					productName: id,
					...(transit ? { service: [{ class: "ECONOMY_CLASS" }] } : {}),
				},
			],
			summary: transit ? { geographicalValidity: zones } : {},
		},
	};
}

describe("durationHours", () => {
	it("parses ISO 8601 durations", () => {
		expect(durationHours("PT2H")).toBe(2);
		expect(durationHours("PT720H")).toBe(720);
		expect(durationHours("P7D")).toBe(168);
		expect(durationHours("P1DT12H")).toBe(36);
		expect(durationHours(undefined)).toBeNull();
		expect(durationHours("P")).toBeNull();
	});
});

describe("durationLabel", () => {
	it("labels durations in hours up to a day and in days after", () => {
		expect(durationLabel("SINGLE_TRIP", 2)).toBe("Single ticket");
		expect(durationLabel("DAY_PASS", 24)).toBe("24 hours");
		expect(durationLabel("WEEKLY_PASS", 168)).toBe("7 days");
		expect(durationLabel("SEASON_TICKET", 8760)).toBe("365 days");
		expect(durationLabel(undefined, null)).toBe("Tickets");
	});
});

describe("isOtherProduct", () => {
	it("flags products with neither fare zones nor a travel class", () => {
		expect(isOtherProduct(offer("bike", "MONTHLY_PASS", "PT720H", false))).toBe(
			true,
		);
		expect(isOtherProduct(offer("pass", "MONTHLY_PASS", "PT720H"))).toBe(false);
	});
});

describe("groupBundlesByDuration", () => {
	it("groups by validity, shortest first, with other products last", () => {
		const bundles = buildBundles([
			offer("year", "SEASON_TICKET", "PT8760H"),
			offer("bike", "MONTHLY_PASS", "PT720H", false),
			offer("month", "MONTHLY_PASS", "PT720H"),
			offer("u23", "MONTHLY_PASS", "PT720H"),
			offer("single", "SINGLE_TRIP", "PT2H"),
		]);

		expect(
			groupBundlesByDuration(bundles).map((g) => [
				g.label,
				g.bundles.map((b) => b.offers[0].id),
			]),
		).toEqual([
			["Single ticket", ["single"]],
			["30 days", ["month", "u23"]],
			["365 days", ["year"]],
			["Other products", ["bike"]],
		]);
	});
});
