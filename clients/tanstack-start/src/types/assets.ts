import type { ConfirmedPackage } from "./purchase";
import type { Subscriber } from "./purchase";

export type AssetAvailability = "AVAILABLE" | "OCCUPIED" | "CLOSED" | "LAST_STOP";

export interface SeatFeatureProperties {
	type: "seat";
	id: string;
	availability: AssetAvailability;
	carriage: string;
	seatNumber?: string;
}

export interface FacilityFeatureProperties {
	type: "facility";
	id: string;
	facilityType: string;
	carriage: string;
}

export type AssetFeatureProperties = SeatFeatureProperties | FacilityFeatureProperties;

export interface AssetFeature {
	type: "Feature";
	id: string;
	geometry: {
		type: "Polygon";
		coordinates: number[][][];
	};
	properties: AssetFeatureProperties;
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
