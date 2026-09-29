import { describe, expect, it } from "vitest";
import type { AssetFeature } from "../types/assets";
import {
	assetAvailability,
	assetSeatNumber,
	isAssignableSeat,
	isReservableAsset,
	isSeatClosed,
	isSeatFeature,
	isSelectedSeat,
} from "./asset-features";

function feature(properties: Record<string, unknown>): AssetFeature {
	return {
		type: "Feature",
		id: "5-23",
		geometry: { type: "Point", coordinates: [1, 2] },
		properties,
	} as unknown as AssetFeature;
}

describe("asset feature normalization", () => {
	it("accepts case-insensitive OMSA seat properties", () => {
		const seat = feature({
			type: "SEAT",
			availability: "available",
			seatNumber: "23",
		});

		expect(isSeatFeature(seat)).toBe(true);
		expect(assetAvailability(seat)).toBe("AVAILABLE");
		expect(assetSeatNumber(seat)).toBe("23");
	});

	it("accepts passenger spot features using visualId", () => {
		const seat = feature({
			type: "PASSENGER_SPOT",
			availability: "AVAILABLE",
			visualId: "5-23",
		});

		expect(isSeatFeature(seat)).toBe(true);
		expect(assetSeatNumber(seat)).toBe("5-23");
	});

	it("recognizes UNAVAILABLE — a physical seat missing from Seating Manager", () => {
		const seat = feature({
			type: "seat",
			availability: "UNAVAILABLE",
			seatNumber: "12",
		});

		expect(assetAvailability(seat)).toBe("UNAVAILABLE");
		expect(isAssignableSeat(seat)).toBe(false);
	});

	it("treats a seat as selected only when the platform marks it so", () => {
		const own = feature({
			type: "seat",
			availability: "OCCUPIED",
			seatNumber: "23",
			selected: true,
		});
		const someoneElses = feature({
			type: "seat",
			availability: "OCCUPIED",
			seatNumber: "24",
		});

		expect(isSelectedSeat(own)).toBe(true);
		expect(isSelectedSeat(someoneElses)).toBe(false);
	});

	it("is assignable when AVAILABLE, or when already selected regardless of availability", () => {
		const available = feature({
			type: "seat",
			availability: "AVAILABLE",
			seatNumber: "1",
		});
		const selectedButOccupied = feature({
			type: "seat",
			availability: "OCCUPIED",
			seatNumber: "2",
			selected: true,
		});
		const occupiedByOthers = feature({
			type: "seat",
			availability: "OCCUPIED",
			seatNumber: "3",
		});

		expect(isAssignableSeat(available)).toBe(true);
		expect(isAssignableSeat(selectedButOccupied)).toBe(true);
		expect(isAssignableSeat(occupiedByOthers)).toBe(false);
	});

	it("treats reservable as the default when the field is absent", () => {
		const noField = feature({
			type: "seat",
			availability: "AVAILABLE",
			seatNumber: "4",
		});
		const explicitlyNonReservable = feature({
			type: "seat",
			availability: "AVAILABLE",
			seatNumber: "5",
			reservable: false,
		});

		expect(isReservableAsset(noField)).toBe(true);
		expect(isReservableAsset(explicitlyNonReservable)).toBe(false);
	});

	it("recognizes a closed seat", () => {
		const closed = feature({
			type: "seat",
			availability: "AVAILABLE",
			seatNumber: "6",
			closed: true,
		});

		expect(isSeatClosed(closed)).toBe(true);
	});

	it("still recognizes a reservable bicycle space as a seat feature", () => {
		const bicycleSpace = feature({
			type: "seat",
			availability: "AVAILABLE",
			seatNumber: "B1",
			assetType: "BICYCLE_SPACE",
		});

		expect(isSeatFeature(bicycleSpace)).toBe(true);
		expect(isAssignableSeat(bicycleSpace)).toBe(true);
	});

	it("does not crash on a seat with null geometry", () => {
		const noGeometry = {
			type: "Feature",
			id: "3-1",
			geometry: null,
			properties: {
				type: "seat",
				availability: "AVAILABLE",
				seatNumber: "1",
				reservable: true,
			},
		} as unknown as AssetFeature;

		expect(isSeatFeature(noGeometry)).toBe(true);
		expect(isAssignableSeat(noGeometry)).toBe(true);
	});
});
