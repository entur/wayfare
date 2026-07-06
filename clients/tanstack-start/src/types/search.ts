import type { AmountOfMoney, Link, PlaceReference } from "./common";

export interface TripPatternLeg {
	serviceJourney: string;
	date: string; // "YYYY-MM-DD"
	from?: PlaceReference;
	to?: PlaceReference;
}

interface TravelPartyEntitlements {
	entitlementsGiven?: { type: "entitlement"; entitlementType: string }[];
}

export interface IndividualTraveller {
	id: string;
	type: "individual_traveller";
	age?: number;
	fullName?: string;
	customerReference?: string;
	entitlements?: TravelPartyEntitlements;
}

export interface UserProfile {
	id: string;
	type: "user_profile";
	count?: number;
	ageGroup?: "ANYONE" | "INFANT" | "CHILD" | "YOUTH" | "ADULT" | "SENIOR";
	minimumAge?: number;
	maximumAge?: number;
	entitlements?: TravelPartyEntitlements;
}

export interface SearchSpecification {
	from?: PlaceReference;
	to?: PlaceReference;
	startTime?: string;
	endTime?: string;
}

export type EnturRecommendationType =
	| "FLEXIBLE"
	| "SEMI_FLEXIBLE"
	| "NON_FLEXIBLE"
	| "CHEAPEST";

export interface EnturRecommendationControl {
	enabled: boolean;
	types?: EnturRecommendationType[];
	stripDuplicates?: boolean;
}

export interface EnturSearchOfferInput {
	recommendationControl?: EnturRecommendationControl;
}

export interface OrganisationalParameter {
	type: "organisational";
	/** NeTEx authority ref, e.g. "KOL:Authority:8" */
	id: string;
	name?: string;
	legalName?: string;
}

/**
 * Search-level requirements. Supplying `organisational` without a
 * specification or pattern switches OMSA to an authority catalogue search,
 * returning every product belonging to that organisation.
 */
export interface SearchOffersRequirements {
	/** OMSA accepts at most one entry. */
	organisational?: OrganisationalParameter[];
}

export interface SearchOfferInputs {
	type: "search_offer";
	travellers?: IndividualTraveller[];
	profiles?: UserProfile[];
	specification?: SearchSpecification;
	pattern?: TripPatternLeg[];
	requirements?: SearchOffersRequirements;
	entur?: EnturSearchOfferInput;
}

export interface SearchOfferRequest {
	inputs: SearchOfferInputs;
	_prefetch?: boolean;
}

export interface OfferProductId {
	productId: string;
	name: string;
}

export interface OfferProduct {
	type?: "product";
	productId?: OfferProductId | string;
	productName?: string;
	service?: OfferService[];
	reservationRequirements?: OfferReservationRequirement[];
}

export type ReservationSpotType =
	| "VEHICLE_SPOT"
	| "PASSENGER_SPOT"
	| "LUGGAGE_SPOT";

export type ReservationPolicy =
	| "COMPULSORY"
	| "OPTIONAL"
	| "NOT_POSSIBLE"
	| "UNKNOWN";

export type AssetSelection =
	| "AUTO_ASSIGNED"
	| "MANUAL_AVAILABLE"
	| "NOT_AVAILABLE"
	| "UNKNOWN";

export interface FulfilledByAncillary {
	ancillaryId: string;
	name?: string;
}

export interface OfferReservationRequirement {
	type?: "reservation_requirement";
	spotType?: ReservationSpotType;
	reservationPolicy?: ReservationPolicy;
	sourceReservationPolicy?: string;
	assetSelection?: AssetSelection;
	serviceJourney?: string;
	fulfilledByAncillaries?: FulfilledByAncillary[];
}

export interface OfferAccommodation {
	type?: "accommodation";
	name?: string;
	berthType?: string;
}

export interface OfferService {
	type?: "service";
	serviceJourney?: string;
	class?: string;
	accommodations?: OfferAccommodation[];
}

export interface OfferAncillary {
	ancillaryId: string;
	name?: string;
	type?: "ancillary";
	price?: AmountOfMoney;
	description?: string;
	available?: number;
	service?: OfferService[];
	reservationRequirements?: OfferReservationRequirement[];
	links?: Link[];
}

export interface TravellerMapping {
	travellerIds: string[];
	minNumberOfTravellers?: number;
	maxNumberOfTravellers?: number;
	userType?: string;
}

export interface ZoneLabel {
	id: string;
	label: string;
}

export interface ZonalValidity {
	fareZones?: ZoneLabel[];
	groups?: ZoneLabel[];
}

export interface GeographicalValidity {
	zonalValidity?: ZonalValidity;
}

export interface OfferSummary {
	name?: string;
	description?: string;
	isRefundable?: boolean;
	isExchangeable?: boolean;
	geographicalValidity?: GeographicalValidity;
	travellerMapping?: TravellerMapping[];
	recommendationType?: string;
	recommendationGroup?: number;
	recommendationRank?: number;
}

export interface OfferLeg {
	id: string;
	type?: "leg";
	from?: PlaceReference;
	to?: PlaceReference;
	sequenceNumber?: number;
	traveller?: string;
	state?: string;
	price?: AmountOfMoney;
	products?: string[];
	ancillaries?: string[];
	reservationRequirement?: OfferReservationRequirement;
	operator?: { organisationId?: string; name?: string };
	assets?: string[];
}

export interface OfferProperties {
	legs?: OfferLeg[];
	ancillaries?: OfferAncillary[];
	products?: OfferProduct[];
	price?: AmountOfMoney;
	expiryTime?: string;
	summary?: OfferSummary;
}

export interface Offer {
	id?: string;
	type?: "offer";
	properties?: OfferProperties;
	links?: Link[];
}

export interface OfferCollection {
	type: string;
	offers?: Offer[];
	numberMatched?: number;
	numberReturned?: number;
	links?: Link[];
}
