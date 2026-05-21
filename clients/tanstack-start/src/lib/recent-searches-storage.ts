import type { TimeMode, TravelerGroup } from "../context/search-form";
import type { PlaceReference } from "../types/common";
import { getDevConfigOverrides } from "./dev-config-storage";

const MAX_RECENT = 5;
const isClient = typeof window !== "undefined";

function storageKey(): string {
	const { envMode } = getDevConfigOverrides();
	return envMode
		? `wayfare_recent_searches_${envMode}`
		: "wayfare_recent_searches";
}

export interface RecentSearch {
	id: string;
	from: PlaceReference;
	to: PlaceReference;
	timeMode: TimeMode;
	travelDate: string;
	travelers: TravelerGroup[];
	searchedAt: string;
}

export function getRecentSearches(): RecentSearch[] {
	if (!isClient) return [];
	try {
		const raw = localStorage.getItem(storageKey());
		if (!raw) return [];
		return JSON.parse(raw) as RecentSearch[];
	} catch {
		return [];
	}
}

export function addRecentSearch(
	search: Omit<RecentSearch, "id" | "searchedAt">,
): void {
	if (!isClient) return;
	const existing = getRecentSearches().filter(
		(s) =>
			!(
				s.from.placeId === search.from.placeId &&
				s.to.placeId === search.to.placeId
			),
	);
	const next: RecentSearch[] = [
		{
			...search,
			id: crypto.randomUUID(),
			searchedAt: new Date().toISOString(),
		},
		...existing,
	].slice(0, MAX_RECENT);
	try {
		localStorage.setItem(storageKey(), JSON.stringify(next));
	} catch {
		// storage full or unavailable
	}
}

export function removeRecentSearch(id: string): void {
	if (!isClient) return;
	const updated = getRecentSearches().filter((s) => s.id !== id);
	try {
		localStorage.setItem(storageKey(), JSON.stringify(updated));
	} catch {
		// ignore
	}
}

export function clearRecentSearches(): void {
	if (!isClient) return;
	try {
		localStorage.removeItem(storageKey());
	} catch {
		// ignore
	}
}
