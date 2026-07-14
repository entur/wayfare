import type {
	AssetAvailability,
	AssetFeature,
	SeatFeatureProperties,
} from "../types/assets";

function rawProperties(feature: AssetFeature): Record<string, unknown> {
	return feature.properties as unknown as Record<string, unknown>;
}

export function isSeatFeature(
	feature: AssetFeature,
): feature is AssetFeature & { properties: SeatFeatureProperties } {
	const properties = rawProperties(feature);
	const type = String(properties.type ?? "").toLowerCase();
	return (
		type === "seat" ||
		type === "passenger_spot" ||
		type === "passengerspot" ||
		("availability" in properties &&
			("seatNumber" in properties || "visualId" in properties))
	);
}

export function assetAvailability(
	feature: AssetFeature,
): AssetAvailability | null {
	if (!isSeatFeature(feature)) return null;
	const value = String(rawProperties(feature).availability ?? "").toUpperCase();
	return ["AVAILABLE", "OCCUPIED", "CLOSED", "LAST_STOP"].includes(value)
		? (value as AssetAvailability)
		: null;
}

export function assetSeatNumber(feature: AssetFeature): string | undefined {
	if (!isSeatFeature(feature)) return undefined;
	const properties = rawProperties(feature);
	const value = properties.seatNumber ?? properties.visualId;
	return value == null ? undefined : String(value);
}
