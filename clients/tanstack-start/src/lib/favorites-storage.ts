import type { PlaceReference } from "../types/common";
import { getDevConfigOverrides } from "./dev-config-storage";

const isClient = typeof window !== "undefined";

function storageKey(): string {
	const { envMode } = getDevConfigOverrides();
	return envMode ? `wayfare_favorites_${envMode}` : "wayfare_favorites";
}

export interface FavoriteRoute {
	id: string;
	from: PlaceReference;
	to: PlaceReference;
	savedAt: string;
}

export function getFavorites(): FavoriteRoute[] {
	if (!isClient) return [];
	try {
		const raw = localStorage.getItem(storageKey());
		if (!raw) return [];
		return JSON.parse(raw) as FavoriteRoute[];
	} catch {
		return [];
	}
}

export function isFavorite(
	from: PlaceReference,
	to: PlaceReference,
): FavoriteRoute | undefined {
	return getFavorites().find(
		(f) => f.from.placeId === from.placeId && f.to.placeId === to.placeId,
	);
}

export function addFavorite(
	from: PlaceReference,
	to: PlaceReference,
): FavoriteRoute {
	const existing = isFavorite(from, to);
	if (existing) return existing;
	const entry: FavoriteRoute = {
		id: crypto.randomUUID(),
		from,
		to,
		savedAt: new Date().toISOString(),
	};
	const updated = [entry, ...getFavorites()];
	try {
		localStorage.setItem(storageKey(), JSON.stringify(updated));
	} catch {
		// storage full or unavailable
	}
	return entry;
}

export function removeFavorite(id: string): void {
	if (!isClient) return;
	const updated = getFavorites().filter((f) => f.id !== id);
	try {
		localStorage.setItem(storageKey(), JSON.stringify(updated));
	} catch {
		// ignore
	}
}
