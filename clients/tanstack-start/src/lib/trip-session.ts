import type { TimeMode, TravelerGroup } from "../context/search-form";
import type { PlaceReference } from "../types/common";

const TRIP_PARAMS_KEY = "tripSearchParams";

export interface TripSearchParams {
	from: PlaceReference;
	to: PlaceReference;
	dateTime: string;
	timeMode: TimeMode;
	travelers: TravelerGroup[];
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function writeTripSearchParams(params: TripSearchParams): void {
	if (!isBrowser()) return;
	window.sessionStorage.setItem(TRIP_PARAMS_KEY, JSON.stringify(params));
}

export function readTripSearchParams(): TripSearchParams | null {
	if (!isBrowser()) return null;
	try {
		const raw = window.sessionStorage.getItem(TRIP_PARAMS_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as TripSearchParams;
	} catch {
		return null;
	}
}
