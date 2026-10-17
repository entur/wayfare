import type { AmountOfMoney } from "../types/common";
import type {
	Offer,
	OfferAncillary,
	OfferReservationRequirement,
} from "../types/search";

export type ReservationFlowKind = "none" | "included" | "ancillary";

export interface ReservationAncillaryOption {
	ancillaryId: string;
	name: string;
	price?: AmountOfMoney;
	offerIds: string[];
	legIds: string[];
	serviceJourneys: string[];
}

export interface OfferReservationFlow {
	kind: ReservationFlowKind;
	canOpenSeatmap: boolean;
	ancillaryOptions: ReservationAncillaryOption[];
}

function isPassengerSeatRequirement(
	requirement: OfferReservationRequirement | undefined,
): boolean {
	if (!requirement) return false;
	if (requirement.spotType && requirement.spotType !== "PASSENGER_SPOT") {
		return false;
	}
	if (requirement.reservationPolicy === "NOT_POSSIBLE") return false;
	if (requirement.assetSelection === "NOT_AVAILABLE") return false;
	return (
		requirement.assetSelection === "MANUAL_AVAILABLE" ||
		requirement.assetSelection === "AUTO_ASSIGNED" ||
		requirement.reservationPolicy === "COMPULSORY" ||
		requirement.reservationPolicy === "OPTIONAL"
	);
}

function hasManualSeatSelection(
	requirement: OfferReservationRequirement | undefined,
): boolean {
	return (
		isPassengerSeatRequirement(requirement) &&
		requirement?.assetSelection === "MANUAL_AVAILABLE"
	);
}

function isFulfilledByAncillary(
	requirement: OfferReservationRequirement | undefined,
): boolean {
	return (requirement?.fulfilledByAncillaries?.length ?? 0) > 0;
}

function serviceJourneysForAncillary(ancillary: OfferAncillary): string[] {
	return [
		...new Set([
			...(ancillary.service ?? []).flatMap((service) =>
				service.serviceJourney ? [service.serviceJourney] : [],
			),
			...(ancillary.reservationRequirements ?? []).flatMap((requirement) =>
				requirement.serviceJourney ? [requirement.serviceJourney] : [],
			),
		]),
	];
}

function mergeAncillaryOption(
	options: Map<string, ReservationAncillaryOption>,
	offer: Offer,
	ancillary: OfferAncillary,
	legId: string,
): void {
	const existing = options.get(ancillary.ancillaryId);
	const offerIds = offer.id ? [offer.id] : [];
	const serviceJourneys = serviceJourneysForAncillary(ancillary);
	if (!existing) {
		options.set(ancillary.ancillaryId, {
			ancillaryId: ancillary.ancillaryId,
			name: ancillary.name ?? ancillary.description ?? "Seat reservation",
			price: ancillary.price,
			offerIds,
			legIds: [legId],
			serviceJourneys,
		});
		return;
	}

	options.set(ancillary.ancillaryId, {
		...existing,
		offerIds: [...new Set([...existing.offerIds, ...offerIds])],
		legIds: [...new Set([...existing.legIds, legId])],
		serviceJourneys: [
			...new Set([...existing.serviceJourneys, ...serviceJourneys]),
		],
	});
}

export function getOfferReservationFlow(
	offers: Offer[],
	selectedAncillaryIds: Set<string> = new Set(),
): OfferReservationFlow {
	const ancillaryOptions = new Map<string, ReservationAncillaryOption>();
	let hasIncludedSeatSelection = false;

	for (const offer of offers) {
		for (const leg of offer.properties?.legs ?? []) {
			const requirement = leg.reservationRequirement;
			if (!isPassengerSeatRequirement(requirement)) continue;
			if (!hasManualSeatSelection(requirement)) continue;

			if (isFulfilledByAncillary(requirement)) {
				for (const fulfilledBy of requirement?.fulfilledByAncillaries ?? []) {
					const ancillary = offer.properties?.ancillaries?.find(
						(candidate) =>
							candidate.ancillaryId === fulfilledBy.ancillaryId &&
							(candidate.reservationRequirements ?? []).some(
								isPassengerSeatRequirement,
							),
					);
					if (ancillary)
						mergeAncillaryOption(ancillaryOptions, offer, ancillary, leg.id);
				}
			} else {
				hasIncludedSeatSelection = true;
			}
		}

		for (const product of offer.properties?.products ?? []) {
			if (product.reservationRequirements?.some(hasManualSeatSelection)) {
				hasIncludedSeatSelection = true;
			}
		}
	}

	const options = [...ancillaryOptions.values()];
	const selectedAncillaryAllowsSeatmap = options.some((option) =>
		selectedAncillaryIds.has(option.ancillaryId),
	);

	if (hasIncludedSeatSelection) {
		return {
			kind: "included",
			canOpenSeatmap: true,
			ancillaryOptions: options,
		};
	}

	if (options.length > 0) {
		return {
			kind: "ancillary",
			canOpenSeatmap: selectedAncillaryAllowsSeatmap,
			ancillaryOptions: options,
		};
	}

	return {
		kind: "none",
		canOpenSeatmap: false,
		ancillaryOptions: [],
	};
}

export function getSeatSelectableServiceJourneyIds(
	offers: Offer[],
	selectedAncillaryIds: Set<string> = new Set(),
): Set<string> {
	const serviceJourneyIds = new Set<string>();

	for (const offer of offers) {
		for (const leg of offer.properties?.legs ?? []) {
			const requirement = leg.reservationRequirement;
			if (!hasManualSeatSelection(requirement)) continue;

			const fulfilledByAncillaryIds =
				requirement?.fulfilledByAncillaries?.map((a) => a.ancillaryId) ?? [];
			const isIncluded = fulfilledByAncillaryIds.length === 0;
			const selectedAncillaryFulfillsRequirement =
				fulfilledByAncillaryIds.length > 0 &&
				fulfilledByAncillaryIds.some((id) => selectedAncillaryIds.has(id));

			if (
				(isIncluded || selectedAncillaryFulfillsRequirement) &&
				requirement?.serviceJourney
			) {
				serviceJourneyIds.add(requirement.serviceJourney);
			}
		}

		for (const product of offer.properties?.products ?? []) {
			for (const requirement of product.reservationRequirements ?? []) {
				if (hasManualSeatSelection(requirement) && requirement.serviceJourney) {
					serviceJourneyIds.add(requirement.serviceJourney);
				}
			}
		}

		for (const ancillary of offer.properties?.ancillaries ?? []) {
			if (!selectedAncillaryIds.has(ancillary.ancillaryId)) continue;
			for (const requirement of ancillary.reservationRequirements ?? []) {
				if (hasManualSeatSelection(requirement) && requirement.serviceJourney) {
					serviceJourneyIds.add(requirement.serviceJourney);
				}
			}
		}
	}

	return serviceJourneyIds;
}
