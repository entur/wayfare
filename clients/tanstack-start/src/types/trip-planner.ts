import type { PtSituationElement } from "./situations";

export type OtpTransportMode =
	| "foot"
	| "bus"
	| "coach"
	| "rail"
	| "tram"
	| "metro"
	| "water"
	| "air"
	| "bicycle"
	| "car"
	| "ferry";

export interface TripPlace {
	name: string;
	quay?: {
		id: string;
		stopPlace?: {
			id: string;
		} | null;
		latitude?: number | null;
		longitude?: number | null;
	} | null;
}

export interface TripLeg {
	mode: OtpTransportMode;
	expectedStartTime: string;
	expectedEndTime: string;
	realtime?: boolean | null;
	pointsOnLink?: {
		points: string;
		length: number;
	} | null;
	fromPlace: TripPlace;
	toPlace: TripPlace;
	serviceJourney?: {
		id: string;
		situations?: PtSituationElement[] | null;
	} | null;
	line?: {
		publicCode?: string | null;
		name?: string | null;
		transportMode?: OtpTransportMode | null;
		situations?: PtSituationElement[] | null;
	} | null;
	authority?: { name: string } | null;
}

export interface TripPattern {
	expectedStartTime: string;
	expectedEndTime: string;
	duration: number; // seconds
	legs: TripLeg[];
}

export interface TripQueryResult {
	tripPatterns: TripPattern[];
	nextPageCursor: string | null;
	previousPageCursor: string | null;
}
