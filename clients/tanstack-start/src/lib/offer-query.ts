import { buildBundles } from "../components/checkout/BundleCard";
import type { TravelerGroup } from "../context/search-form";
import { searchOffers } from "../server-functions/search";
import type { OfferCollection, TripPatternLeg } from "../types/search";
import type { TripPattern } from "../types/trip-planner";
import { buildRequest } from "./build-request";

export interface OfferPreview {
	minPrice: number;
	currency: string;
	/** True when offers only cover some legs of the journey */
	partial: boolean;
}

function patternKey(pattern: TripPattern): string {
	return pattern.legs
		.filter((l) => l.serviceJourney != null)
		.map((l) => `${l.serviceJourney?.id}:${l.expectedStartTime.slice(0, 10)}`)
		.join("|");
}

function travelerKey(travelers: TravelerGroup[]): string {
	return travelers
		.filter((t) => t.count > 0)
		.map((t) => `${t.ageGroup}:${t.count}`)
		.join(",");
}

export function offerQueryKey(
	pattern: TripPattern,
	travelers: TravelerGroup[],
): string[] {
	return ["offers", patternKey(pattern), travelerKey(travelers)];
}

function buildOmsaLegs(pattern: TripPattern): TripPatternLeg[] {
	return pattern.legs.flatMap((leg) => {
		if (!leg.serviceJourney) return [];
		const entry: TripPatternLeg = {
			serviceJourney: leg.serviceJourney.id,
			date: leg.expectedStartTime.slice(0, 10),
		};
		const fromStopId = leg.fromPlace.quay?.stopPlace?.id;
		const toStopId = leg.toPlace.quay?.stopPlace?.id;
		if (fromStopId)
			entry.from = { placeId: fromStopId, name: leg.fromPlace.name };
		if (toStopId) entry.to = { placeId: toStopId, name: leg.toPlace.name };
		return [entry];
	});
}

export function buildOfferQuery(
	pattern: TripPattern,
	travelers: TravelerGroup[],
) {
	const { profiles, travellers } = buildRequest(travelers);
	const omsaLegs = buildOmsaLegs(pattern);
	const legCount = omsaLegs.length;

	return {
		queryKey: offerQueryKey(pattern, travelers),
		queryFn: (): Promise<OfferCollection> =>
			searchOffers({
				data: {
					inputs: {
						type: "search_offer",
						...(profiles.length > 0 ? { profiles } : {}),
						...(travellers.length > 0 ? { travellers } : {}),
						pattern: omsaLegs,
					},
				},
			}) as Promise<OfferCollection>,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: false,
		_legCount: legCount,
	} as const;
}

export function extractOfferPreview(
	collection: OfferCollection,
	legCount: number,
): OfferPreview | null {
	const offers = collection.offers ?? [];
	if (offers.length === 0) return null;

	const bundles = buildBundles(offers);
	if (bundles.length === 0) return null;

	const minBundle = bundles.reduce((best, b) =>
		b.totalPrice < best.totalPrice ? b : best,
	);

	const coveredSequences = new Set(minBundle.sequences);
	const partial = legCount > 0 && coveredSequences.size < legCount;

	return {
		minPrice: minBundle.totalPrice,
		currency: minBundle.currency,
		partial,
	};
}
