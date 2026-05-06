import type { SearchType } from "../context/search-form";
import type { PlaceReference } from "../types/common";
import type { OfferCollection, UserProfile } from "../types/search";

const OFFER_COLLECTION_KEY = "offerCollection";
const SEARCH_CONTEXT_KEY = "searchContext";

export interface SearchContext {
	from: PlaceReference;
	to: PlaceReference;
	travelDate: string;
	searchType: SearchType;
	profiles?: UserProfile[];
}

interface SearchSession {
	collection: OfferCollection | null;
	context: SearchContext | null;
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
	if (!isBrowser()) {
		return null;
	}
	try {
		const rawValue = window.sessionStorage.getItem(key);
		if (!rawValue) {
			return null;
		}
		return JSON.parse(rawValue) as T;
	} catch {
		return null;
	}
}

export function readSearchSession(): SearchSession {
	return {
		collection: readJson<OfferCollection>(OFFER_COLLECTION_KEY),
		context: readJson<SearchContext>(SEARCH_CONTEXT_KEY),
	};
}

export function writeSearchSession(
	collection: OfferCollection,
	context: SearchContext,
): void {
	if (!isBrowser()) {
		return;
	}
	window.sessionStorage.setItem(
		OFFER_COLLECTION_KEY,
		JSON.stringify(collection),
	);
	window.sessionStorage.setItem(SEARCH_CONTEXT_KEY, JSON.stringify(context));
}
