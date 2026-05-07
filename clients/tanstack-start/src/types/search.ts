import type { AmountOfMoney, Link, PlaceReference } from "./common";

export interface TripPatternLeg {
	serviceJourney: string;
	date: string; // "YYYY-MM-DD"
	from?: PlaceReference;
	to?: PlaceReference;
}

interface TravelPartyEntitlements {
	entitlementsGiven?: { entitlementType: string }[];
}

export interface IndividualTraveller {
	id: string;
	type: "individual_traveller";
	age?: number;
	fullName?: string;
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

export interface SearchOfferInputs {
	type: "search_offer";
	travellers?: IndividualTraveller[];
	profiles?: UserProfile[];
	specification?: SearchSpecification;
	pattern?: TripPatternLeg[];
	timestamp?: string;
}

export interface SearchOfferRequest {
	inputs: SearchOfferInputs;
}

export interface OfferProductId {
	productId: string;
	name: string;
}

export interface OfferProduct {
	type?: "product";
	productId?: OfferProductId | string;
	productName?: string;
}

export interface TravellerMapping {
	travellerIds: string[];
	minNumberOfTravellers?: number;
	maxNumberOfTravellers?: number;
	userType?: string;
}

export interface ZonalValidity {
	zones?: string[];
	fareZones?: string[];
	groupOfTariffZones?: string[];
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
	sequenceNumber?: number;
	traveller?: string;
	state?: string;
	products?: string[];
}

export interface OfferProperties {
	legs?: OfferLeg[];
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
