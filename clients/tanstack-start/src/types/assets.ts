import type { ConfirmedPackage, Subscriber } from "./purchase";

export type AssetAvailability =
	| "AVAILABLE"
	| "UNAVAILABLE"
	| "OCCUPIED"
	| "CLOSED"
	| "LAST_STOP";

export type SeatPosition =
	| "WINDOW"
	| "AISLE"
	| "MIDDLE"
	| "UPPER_BERTH"
	| "MIDDLE_BERTH"
	| "LOWER_BERTH"
	| "OTHER";

export type SeatTravelDirection =
	| "FORWARDS"
	| "BACKWARDS"
	| "REVERSIBLE"
	| "UNKNOWN";

export type SeatAttachment =
	| "REVERSIBLE"
	| "FIXED"
	| "FOLDING"
	| "REMOVABLE"
	| "OTHER";

export type SeatAssetType = "BICYCLE_SPACE";

export interface AssetLink {
	rel: string;
	href: string;
	type?: string;
	description?: string;
}

export interface CarriageFeatureProperties {
	type: "carriage";
	carriage: string;
	/** Width of this carriage's local coordinate space in pixels. */
	width?: number;
	/** Height of this carriage's local coordinate space in pixels. */
	height?: number;
	deck?: string;
}

export interface SeatFeatureProperties {
	type: "seat";
	availability: AssetAvailability;
	/**
	 * True when this seat is already assigned to the package the seatmap was
	 * requested for. Independent of `availability`, which reflects train-wide
	 * occupancy — a seat already assigned to this package reads OCCUPIED there
	 * but `selected: true` here.
	 */
	selected?: boolean;
	carriage: string;
	seatNumber?: string;
	deck?: string;
	space?: string;
	/** Carriage-local pixel coordinates, top-left origin, y downward. */
	x?: number;
	y?: number;
	/** Present for reservable non-passenger spaces represented by this seat feature. */
	assetType?: SeatAssetType;
	/** Seating Manager fare class, preserved without translating STANDARD_CLASS to ECONOMY_CLASS. */
	fareClass?: string;
	seatPosition?: SeatPosition;
	/** Direction relative to the journey, not the direction used to draw the seatmap icon. */
	travelDirection?: SeatTravelDirection;
	seatAttachment?: SeatAttachment;
	/** Seating Manager accommodation facility value. */
	accommodation?: string;
	/** Passenger communication, sanitary, mobility, and baggage facilities. */
	facilities?: string[];
	/** Nuisance and group-booking restrictions. */
	restrictions?: string[];
	/** Whether this feature represents inventory that can be reserved. */
	reservable?: boolean;
	closed?: boolean;
	compartmentLabel?: string;
	compartmentName?: string;
	series?: string;
	seriesVersion?: number;
	/** Leg space in centimetres. Omitted when no measurement is available. */
	legSpace?: number;
	/** Ancillaries that must be assigned before this seat can be selected. */
	requiredAncillaries?: { ancillaryId: string }[];
}

export interface FacilityFeatureProperties {
	type: "facility";
	facilityType: string;
	name?: string;
	carriage: string;
}

export type AssetFeatureProperties =
	| CarriageFeatureProperties
	| SeatFeatureProperties
	| FacilityFeatureProperties;

export type AssetGeometry =
	| { type: "Point"; coordinates: number[] }
	| { type: "LineString"; coordinates: number[][] }
	| { type: "Polygon"; coordinates: number[][][] }
	| { type: "MultiPolygon"; coordinates: number[][][][] };

export interface AssetFeature {
	type: "Feature";
	id: string;
	geometry: AssetGeometry | null;
	properties: AssetFeatureProperties;
	links?: AssetLink[];
}

export interface AssetFeatureCollection {
	type: "FeatureCollection";
	crs?: { type: string; properties: { name: string } };
	numberMatched: number;
	numberReturned: number;
	features: AssetFeature[];
}

export interface AssignAssetInput {
	type: "asset";
	packageId: string;
	legId: string;
	assetId: string;
	replaceAssetId?: string;
}

export interface AssignAssetRequest {
	inputs: AssignAssetInput;
	subscriber?: Subscriber;
}

export type AssignAssetResponse = ConfirmedPackage;

export interface SelectedAssetInfo {
	assetId: string;
	carriage: string;
	seatNumber?: string;
}
