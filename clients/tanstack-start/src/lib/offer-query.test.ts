import { describe, expect, it } from "vitest";
import type { TravelerGroup } from "../context/search-form";
import type { TripPattern } from "../types/trip-planner";
import { buildOfferSearchRequest } from "./offer-query";

const pattern = {
	legs: [
		{
			expectedStartTime: "2026-08-03T08:15:00+02:00",
			fromPlace: {
				name: "Oslo S",
				quay: { stopPlace: { id: "NSR:StopPlace:337" } },
			},
			toPlace: {
				name: "Drammen stasjon",
				quay: { stopPlace: { id: "NSR:StopPlace:584" } },
			},
			serviceJourney: { id: "NSB:ServiceJourney:RE11" },
		},
		{
			expectedStartTime: "2026-08-03T09:00:00+02:00",
			fromPlace: { name: "Drammen stasjon" },
			toPlace: { name: "Destination" },
			serviceJourney: null,
		},
	],
} as TripPattern;

const travelers: TravelerGroup[] = [
	{ id: "adult", ageGroup: "ADULT", count: 1, minAge: 18 },
];

describe("buildOfferSearchRequest", () => {
	it("maps bookable legs and traveller profiles to an OMSA request", () => {
		expect(buildOfferSearchRequest(pattern, travelers)).toEqual({
			inputs: {
				type: "search_offer",
				profiles: [
					{
						id: "adult",
						type: "user_profile",
						count: 1,
						ageGroup: "ADULT",
						minimumAge: 18,
					},
				],
				pattern: [
					{
						serviceJourney: "NSB:ServiceJourney:RE11",
						date: "2026-08-03",
						from: { placeId: "NSR:StopPlace:337", name: "Oslo S" },
						to: {
							placeId: "NSR:StopPlace:584",
							name: "Drammen stasjon",
						},
					},
				],
			},
		});
	});

	it("includes prefetch and recommendation controls when requested", () => {
		const request = buildOfferSearchRequest(
			pattern,
			travelers,
			{
				enabled: true,
				types: ["CHEAPEST", "FLEXIBLE"],
				stripDuplicates: false,
			},
			true,
		);

		expect(request._prefetch).toBe(true);
		expect(request.inputs.entur).toEqual({
			recommendationControl: {
				enabled: true,
				types: ["CHEAPEST", "FLEXIBLE"],
				stripDuplicates: false,
			},
		});
	});
});
