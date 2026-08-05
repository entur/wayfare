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

	it("maps an authority catalogue search without route or time", () => {
		const request: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				profiles: [
					{ id: "adult", type: "user_profile", count: 1, ageGroup: "ADULT" },
				],
				requirements: {
					organisational: [
						{
							type: "organisational",
							id: "KOL:Authority:8",
							name: "Kolumbus",
						},
					],
				},
			},
		};

		expect(mapSearchOfferRequest(request)).toEqual({
			inputs: {
				type: "search_offer",
				profiles: request.inputs.profiles,
				requirements: {
					organisational: [
						{
							type: "organisational",
							id: "KOL:Authority:8",
							name: "Kolumbus",
						},
					],
				},
			},
		});
	});

	it("keeps only the first organisational parameter and drops empty arrays", () => {
		const withExtras: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				travellers: [{ id: "t1", type: "individual_traveller" }],
				requirements: {
					organisational: [
						{ type: "organisational", id: "VYG:Authority:VY" },
						{ type: "organisational", id: "RUT:Authority:RUT" },
					],
				},
			},
		};

		expect(mapSearchOfferRequest(withExtras).inputs.requirements).toEqual({
			organisational: [{ type: "organisational", id: "VYG:Authority:VY" }],
		});

		const empty: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				travellers: [{ id: "t1", type: "individual_traveller" }],
				requirements: { organisational: [] },
			},
		};

		expect(mapSearchOfferRequest(empty).inputs.requirements).toBeUndefined();
	});

	it("drops recommendation control on a standalone authority search", () => {
		const request: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				travellers: [{ id: "t1", type: "individual_traveller" }],
				requirements: {
					organisational: [{ type: "organisational", id: "RUT:Authority:RUT" }],
				},
				entur: {
					recommendationControl: { enabled: true, stripDuplicates: true },
				},
			},
		};

		const mapped = mapSearchOfferRequest(request);
		expect(mapped.inputs.entur).toBeUndefined();
		expect(mapped.inputs.requirements).toEqual({
			organisational: [{ type: "organisational", id: "RUT:Authority:RUT" }],
		});
	});

	it("keeps recommendation control when an authority search has a pattern", () => {
		const request: SearchOfferRequest = {
			inputs: {
				type: "search_offer",
				travellers: [{ id: "t1", type: "individual_traveller" }],
				pattern: [
					{ serviceJourney: "KOL:ServiceJourney:1", date: "2026-08-03" },
				],
				requirements: {
					organisational: [{ type: "organisational", id: "RUT:Authority:RUT" }],
				},
				entur: { recommendationControl: { enabled: true } },
			},
		};

		expect(mapSearchOfferRequest(request).inputs.entur).toEqual({
			recommendationControl: { enabled: true },
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
