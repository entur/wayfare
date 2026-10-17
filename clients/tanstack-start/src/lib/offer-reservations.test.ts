import { describe, expect, it } from "vitest";
import type { Offer } from "../types/search";
import {
	getOfferReservationFlow,
	getSeatSelectableServiceJourneyIds,
} from "./offer-reservations";

function offer(overrides: Offer["properties"]): Offer {
	return {
		id: "offer-1",
		type: "offer",
		properties: overrides,
	};
}

describe("getOfferReservationFlow", () => {
	it("returns none when no passenger seat reservation is possible", () => {
		const flow = getOfferReservationFlow([
			offer({
				legs: [
					{
						id: "leg-1",
						reservationRequirement: {
							spotType: "PASSENGER_SPOT",
							reservationPolicy: "NOT_POSSIBLE",
							assetSelection: "NOT_AVAILABLE",
						},
					},
				],
			}),
		]);

		expect(flow).toEqual({
			kind: "none",
			canOpenSeatmap: false,
			ancillaryOptions: [],
		});
	});

	it("opens the seatmap when manual passenger seat selection is included", () => {
		const flow = getOfferReservationFlow([
			offer({
				legs: [
					{
						id: "leg-1",
						reservationRequirement: {
							spotType: "PASSENGER_SPOT",
							reservationPolicy: "OPTIONAL",
							assetSelection: "MANUAL_AVAILABLE",
						},
					},
				],
			}),
		]);

		expect(flow.kind).toBe("included");
		expect(flow.canOpenSeatmap).toBe(true);
	});

	it("requires selecting an ancillary before opening the seatmap", () => {
		const selected = new Set<string>();
		const flow = getOfferReservationFlow(
			[
				offer({
					legs: [
						{
							id: "leg-1",
							reservationRequirement: {
								spotType: "PASSENGER_SPOT",
								reservationPolicy: "OPTIONAL",
								assetSelection: "MANUAL_AVAILABLE",
								serviceJourney: "VYG:ServiceJourney:1",
								fulfilledByAncillaries: [
									{ ancillaryId: "seat-1", name: "Seat reservation" },
								],
							},
						},
					],
					ancillaries: [
						{
							ancillaryId: "seat-1",
							name: "Seat reservation",
							price: { amount: 69, currencyCode: "NOK" },
							reservationRequirements: [
								{
									spotType: "PASSENGER_SPOT",
									reservationPolicy: "COMPULSORY",
									assetSelection: "MANUAL_AVAILABLE",
									serviceJourney: "VYG:ServiceJourney:1",
								},
							],
						},
					],
				}),
			],
			selected,
		);

		expect(flow.kind).toBe("ancillary");
		expect(flow.canOpenSeatmap).toBe(false);
		expect(flow.ancillaryOptions).toEqual([
			{
				ancillaryId: "seat-1",
				name: "Seat reservation",
				price: { amount: 69, currencyCode: "NOK" },
				offerIds: ["offer-1"],
				legIds: ["leg-1"],
				serviceJourneys: ["VYG:ServiceJourney:1"],
			},
		]);

		selected.add("seat-1");
		expect(
			getOfferReservationFlow(
				[
					offer({
						legs: [
							{
								id: "leg-1",
								reservationRequirement: {
									spotType: "PASSENGER_SPOT",
									reservationPolicy: "OPTIONAL",
									assetSelection: "MANUAL_AVAILABLE",
									fulfilledByAncillaries: [{ ancillaryId: "seat-1" }],
								},
							},
						],
						ancillaries: [
							{
								ancillaryId: "seat-1",
								reservationRequirements: [
									{
										spotType: "PASSENGER_SPOT",
										reservationPolicy: "COMPULSORY",
										assetSelection: "MANUAL_AVAILABLE",
									},
								],
							},
						],
					}),
				],
				selected,
			).canOpenSeatmap,
		).toBe(true);
	});

	it("returns only service journeys backed by selected seat access", () => {
		const offers = [
			offer({
				legs: [
					{
						id: "leg-1",
						reservationRequirement: {
							spotType: "PASSENGER_SPOT",
							reservationPolicy: "OPTIONAL",
							assetSelection: "MANUAL_AVAILABLE",
							serviceJourney: "included",
						},
					},
					{
						id: "leg-2",
						reservationRequirement: {
							spotType: "PASSENGER_SPOT",
							reservationPolicy: "OPTIONAL",
							assetSelection: "MANUAL_AVAILABLE",
							serviceJourney: "paid",
							fulfilledByAncillaries: [{ ancillaryId: "seat-1" }],
						},
					},
				],
				ancillaries: [
					{
						ancillaryId: "seat-1",
						reservationRequirements: [
							{
								spotType: "PASSENGER_SPOT",
								reservationPolicy: "COMPULSORY",
								assetSelection: "MANUAL_AVAILABLE",
								serviceJourney: "paid",
							},
						],
					},
				],
			}),
		];

		expect([...getSeatSelectableServiceJourneyIds(offers)]).toEqual([
			"included",
		]);
		expect([
			...getSeatSelectableServiceJourneyIds(offers, new Set(["seat-1"])),
		]).toEqual(["included", "paid"]);
	});
});
