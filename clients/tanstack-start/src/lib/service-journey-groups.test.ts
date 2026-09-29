import { describe, expect, it } from "vitest";
import type { Offer } from "../types/search";
import {
	groupPackageLegsByServiceJourney,
	manualSelectionServiceJourneyGroups,
} from "./service-journey-groups";

function offerWithLegs(legs: NonNullable<Offer["properties"]>["legs"]): Offer {
	return { type: "offer", properties: { legs } };
}

describe("groupPackageLegsByServiceJourney", () => {
	it("groups traveller legs sharing a departure", () => {
		const groups = groupPackageLegsByServiceJourney([
			offerWithLegs([
				{ id: "leg-adult", traveller: "adult", serviceJourney: "departure-1" },
				{ id: "leg-child", traveller: "child", serviceJourney: "departure-1" },
			]),
		]);

		expect(groups).toHaveLength(1);
		expect(groups[0].legs.map((leg) => leg.id)).toEqual([
			"leg-adult",
			"leg-child",
		]);
	});

	it("keeps separate departures in separate groups", () => {
		const groups = groupPackageLegsByServiceJourney([
			offerWithLegs([
				{ id: "leg-1", serviceJourney: "departure-1" },
				{ id: "leg-2", serviceJourney: "departure-2" },
			]),
		]);

		expect(groups.map((group) => group.serviceJourney)).toEqual([
			"departure-1",
			"departure-2",
		]);
	});

	it("omits legs without a service journey and duplicate leg ids", () => {
		const groups = groupPackageLegsByServiceJourney([
			offerWithLegs([
				{ id: "missing" },
				{ id: "duplicate", serviceJourney: "departure-1" },
			]),
			offerWithLegs([{ id: "duplicate", serviceJourney: "departure-1" }]),
		]);

		expect(groups).toHaveLength(1);
		expect(groups[0].legs).toHaveLength(1);
	});
});

describe("manualSelectionServiceJourneyGroups", () => {
	it("only includes journeys with at least one manually selectable leg", () => {
		const packageOffers = [
			offerWithLegs([
				{ id: "bus-adult", serviceJourney: "bus" },
				{ id: "train-adult", serviceJourney: "train" },
				{ id: "train-child", serviceJourney: "train" },
			]),
		];
		const reservationOffers = [
			offerWithLegs([
				{
					id: "bus-adult",
					serviceJourney: "bus",
					reservationRequirement: { assetSelection: "NOT_AVAILABLE" },
				},
				{
					id: "train-adult",
					serviceJourney: "train",
					reservationRequirement: { assetSelection: "NOT_AVAILABLE" },
				},
				{
					id: "train-child",
					serviceJourney: "train",
					reservationRequirement: { assetSelection: "MANUAL_AVAILABLE" },
				},
			]),
		];

		const groups = manualSelectionServiceJourneyGroups(
			packageOffers,
			reservationOffers,
		);

		expect(groups).toHaveLength(1);
		expect(groups[0].serviceJourney).toBe("train");
		expect(groups[0].legs.map((leg) => leg.id)).toEqual([
			"train-adult",
			"train-child",
		]);
	});
});
