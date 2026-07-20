import { describe, expect, it } from "vitest";
import type { SearchOfferRequest } from "../types/search";
import { mapSearchOfferRequest } from "./omsa-search-request";

describe("mapSearchOfferRequest", () => {
	it("maps a zone specification without application-only place fields", () => {
		const request: SearchOfferRequest = {
			_prefetch: true,
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
				specification: {
					from: {
						placeId: "KOL:FareZone:1",
						name: "Haugalandet (Kolumbus)",
						type: "zone",
						coordinates: [5.3, 59.4],
					},
					to: {
						placeId: "KOL:FareZone:4",
						name: "Nord-Jæren (Kolumbus)",
						type: "zone",
					},
					startTime: "2026-07-17T14:46:00.000Z",
				},
			},
		};

		expect(mapSearchOfferRequest(request)).toEqual({
			inputs: {
				type: "search_offer",
				profiles: request.inputs.profiles,
				specification: {
					from: {
						placeId: "KOL:FareZone:1",
						name: "Haugalandet (Kolumbus)",
					},
					to: {
						placeId: "KOL:FareZone:4",
						name: "Nord-Jæren (Kolumbus)",
					},
					startTime: "2026-07-17T14:46:00.000Z",
				},
			},
		});
	});

	it("maps pattern places and Entur recommendation control", () => {
		const request: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				pattern: [
					{
						serviceJourney: "NSB:ServiceJourney:1",
						date: "2026-07-17",
						from: {
							placeId: "NSR:StopPlace:1",
							name: "From",
							type: "stop",
							coordinates: [10.7, 59.9],
						},
						to: {
							placeId: "NSR:StopPlace:2",
							type: "stop",
						},
					},
				],
				entur: {
					recommendationControl: {
						enabled: true,
						types: ["CHEAPEST", "FLEXIBLE"],
						stripDuplicates: false,
					},
				},
			},
		};

		expect(mapSearchOfferRequest(request)).toEqual({
			inputs: {
				type: "search_offer",
				pattern: [
					{
						serviceJourney: "NSB:ServiceJourney:1",
						date: "2026-07-17",
						from: { placeId: "NSR:StopPlace:1", name: "From" },
						to: { placeId: "NSR:StopPlace:2" },
					},
				],
				entur: {
					recommendationControl: {
						enabled: true,
						types: ["CHEAPEST", "FLEXIBLE"],
						stripDuplicates: false,
					},
				},
			},
		});
	});

	it("omits empty traveller and profile arrays", () => {
		const request: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				travellers: [],
				profiles: [],
			},
		};

		expect(mapSearchOfferRequest(request)).toEqual({
			inputs: { type: "search_offer" },
		});
	});

	it("omits unsupported and absent optional fields", () => {
		const request = {
			_prefetch: true,
			inputs: {
				type: "search_offer",
				timestamp: "2026-07-17T12:00:00.000Z",
				enturRecommendationControl: {
					enabled: true,
					enturRecommendationType: ["CHEAPEST"],
				},
				entur: {
					recommendationControl: { enabled: false },
				},
			},
		} as unknown as SearchOfferRequest;

		expect(mapSearchOfferRequest(request)).toEqual({
			inputs: {
				type: "search_offer",
				entur: { recommendationControl: { enabled: false } },
			},
		});
	});
});
