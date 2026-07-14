import { describe, expect, it } from "vitest";
import type { AssetFeature } from "../types/assets";
import {
	assetAvailability,
	assetSeatNumber,
	isSeatFeature,
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
});
