import type { ConfirmedPackage, Subscriber } from "./purchase";

export type AssetAvailability =
	| "AVAILABLE"
	| "OCCUPIED"
	| "CLOSED"
	| "LAST_STOP";

export interface AssetLink {
	rel: string;
	href: string;
	type?: string;
	description?: string;
}

export interface CarriageFeatureProperties {
	type: "carriage";
	id: string;
	carriage: string;
	deck?: string;
}

export interface SeatFeatureProperties {
	type: "seat";
	id: string;
	availability: AssetAvailability;
	carriage: string;
	seatNumber?: string;
	/** True when this seat is already assigned to the current package. */
	chosen?: boolean;
}

export interface FacilityFeatureProperties {
	type: "facility";
	id: string;
	facilityType: string;
	name?: string;
	carriage: string;
}

export type AssetFeatureProperties =
	| CarriageFeatureProperties
	| SeatFeatureProperties
	| FacilityFeatureProperties;

export type AssetGeometry =
	| { type?: "Polygon"; coordinates: number[][][] }
	| { type: "Point"; coordinates: number[] };

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
	numberMatched?: number;
	numberReturned?: number;
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
