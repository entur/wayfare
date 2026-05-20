import type { Link } from "./common";

export interface BinaryTicketDocument {
	type: "binary_ticket";
	contentType: string;
	base64: string;
	startvalidity: string;
	endvalidity: string;
	travelDocumentType?: string;
	status?: string;
	version?: string;
}

export interface ExternalTicketDocument {
	type: "externalTicket";
	startvalidity: string;
	endvalidity: string;
	travelDocumentType?: string;
}

export type TravelDocumentProperties =
	| BinaryTicketDocument
	| ExternalTicketDocument;

export interface TravelDocumentItem {
	id?: string;
	properties?: TravelDocumentProperties;
	links?: Link[];
}

export interface TravelDocumentCollection {
	type: string;
	travelDocuments?: TravelDocumentItem[];
	numberMatched?: number;
	numberReturned?: number;
	links?: Link[];
}

export interface AmountBreakdown {
	amount?: number;
	currencyCode?: string;
}

export interface FinancialDetail {
	amount?: AmountBreakdown;
	currencyCode?: string;
	description?: string;
	category?: string;
}

export interface RefundOption {
	type?: "refund_option";
	id?: string;
	packageState?: string;
	refundType?: "PACKAGE_REFUND" | "REMOVE_TRAVELLER" | "REMOVE_ANCILLARY";
	consequences?: FinancialDetail[];
}

export interface RefundOptionItem {
	id?: string;
	properties?: RefundOption;
	links?: Link[];
}

export interface RefundOptionCollection {
	type: string;
	options?: RefundOptionItem[];
	numberMatched?: number;
	numberReturned?: number;
}

export interface ChangeOption {
	type?: string;
	id?: string;
	description?: string;
}

export interface ChangeOptionItem {
	id?: string;
	properties?: ChangeOption;
	links?: Link[];
}

export interface ChangeOptionCollection {
	type: string;
	options?: ChangeOptionItem[];
	numberMatched?: number;
	numberReturned?: number;
}

export interface StoredPackageContact {
	firstName?: string;
	lastName?: string;
	email?: string;
}

export interface StoredPackage {
	packageId: string;
	savedAt: string;
	status: string;
	price: { amount: number; currencyCode?: string };
	offerIds?: string[];
	guestContact?: StoredPackageContact;
}

export interface PackageItemProperties {
	type?: string;
	status?: string;
	from?: { placeId?: string; name?: string };
	to?: { placeId?: string; name?: string };
	startTime?: string;
	endTime?: string;
	purchaseDate?: string;
	price?: { amount: number; currencyCode?: string };
}

export interface PackageItem {
	id?: string;
	properties?: PackageItemProperties;
	links?: { href: string; rel: string; type?: string; method?: string }[];
}
