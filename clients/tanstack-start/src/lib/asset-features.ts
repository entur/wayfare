import type {
	AssetAvailability,
	AssetFeature,
	AssetGeometry,
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
	return ["AVAILABLE", "UNAVAILABLE", "OCCUPIED", "CLOSED", "LAST_STOP"].includes(
		value,
	)
		? (value as AssetAvailability)
		: null;
}

export function assetSeatNumber(feature: AssetFeature): string | undefined {
	if (!isSeatFeature(feature)) return undefined;
	const properties = rawProperties(feature);
	const value = properties.seatNumber ?? properties.visualId;
	return value == null ? undefined : String(value);
}

/** True when the platform has already assigned this seat to the current package. */
export function isSelectedSeat(feature: AssetFeature): boolean {
	if (!isSeatFeature(feature)) return false;
	return rawProperties(feature).selected === true;
}

/**
 * Whether this seat can be assigned: it's train-wide AVAILABLE, or it's
 * already selected for this package (an OCCUPIED seat this package holds is
 * still pickable — that's how you keep or swap your own seat).
 */
export function isAssignableSeat(feature: AssetFeature): boolean {
	if (!isSeatFeature(feature)) return false;
	return assetAvailability(feature) === "AVAILABLE" || isSelectedSeat(feature);
}

/** False only when the platform explicitly marks the asset non-reservable. */
export function isReservableAsset(feature: AssetFeature): boolean {
	return rawProperties(feature).reservable !== false;
}

export function isSeatClosed(feature: AssetFeature): boolean {
	return rawProperties(feature).closed === true;
}

export function assetSeatPosition(feature: AssetFeature): string | undefined {
	const value = rawProperties(feature).seatPosition;
	return typeof value === "string" ? value : undefined;
}

export function assetFareClass(feature: AssetFeature): string | undefined {
	const value = rawProperties(feature).fareClass;
	return typeof value === "string" ? value : undefined;
}

export function assetCompartmentLabel(feature: AssetFeature): string | undefined {
	const properties = rawProperties(feature);
	const value = properties.compartmentLabel ?? properties.compartmentName;
	return typeof value === "string" ? value : undefined;
}

export function assetTypeOf(feature: AssetFeature): string | undefined {
	const value = rawProperties(feature).assetType;
	return typeof value === "string" ? value : undefined;
}

export function assetRequiredAncillaryIds(feature: AssetFeature): string[] {
	const value = rawProperties(feature).requiredAncillaries;
	if (!Array.isArray(value)) return [];
	return value
		.map((entry) =>
			entry && typeof entry === "object" && "ancillaryId" in entry
				? String((entry as { ancillaryId: unknown }).ancillaryId)
				: undefined,
		)
		.filter((id): id is string => !!id);
}

export type GeometryKind = "Point" | "LineString" | "Polygon" | "MultiPolygon";

export function geometryKind(
	geometry: AssetGeometry | null | undefined,
): GeometryKind | null {
	if (!geometry) return null;
	return geometry.type ?? null;
}
