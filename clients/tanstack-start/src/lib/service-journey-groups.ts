import type { Offer, OfferLeg } from "../types/search";

export interface ServiceJourneyGroup {
	serviceJourney: string;
	legs: OfferLeg[];
}

export function groupPackageLegsByServiceJourney(
	offers: Offer[],
): ServiceJourneyGroup[] {
	const groups = new Map<string, OfferLeg[]>();
	const seenLegs = new Set<string>();
	for (const offer of offers) {
		for (const leg of offer.properties?.legs ?? []) {
			if (!leg.serviceJourney || seenLegs.has(leg.id)) continue;
			const legs = groups.get(leg.serviceJourney) ?? [];
			legs.push(leg);
			groups.set(leg.serviceJourney, legs);
			seenLegs.add(leg.id);
		}
	}
	return [...groups].map(([serviceJourney, legs]) => ({
		serviceJourney,
		legs,
	}));
}

export function manualSelectionServiceJourneyGroups(
	packageOffers: Offer[],
	reservationOffers: Offer[],
): ServiceJourneyGroup[] {
	const eligibleServiceJourneys = new Set<string>();
	for (const offer of reservationOffers) {
		for (const leg of offer.properties?.legs ?? []) {
			if (
				leg.serviceJourney &&
				leg.reservationRequirement?.assetSelection === "MANUAL_AVAILABLE"
			) {
				eligibleServiceJourneys.add(leg.serviceJourney);
			}
		}
	}

	return groupPackageLegsByServiceJourney(packageOffers).filter((group) =>
		eligibleServiceJourneys.has(group.serviceJourney),
	);
}
