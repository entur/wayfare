import type { AmountOfMoney, Link } from "./common";
import type { OmsaCustomer } from "./customer";
import type { Offer, OfferAncillary } from "./search";

export interface Subscriber {
	successUri?: string;
	inProgressUri?: string;
	failedUri?: string;
}

export interface PurchaseOffersInputs {
	type: "purchase_offers";
	offerIds: string[];
	customer?: OmsaCustomer;
	// OMSA requires contact.id to accompany customer.id -- never send one without the other.
	contact?: OmsaCustomer;
	timestamp?: string;
}

export interface PurchaseOffersRequest {
	inputs: PurchaseOffersInputs;
	subscriber?: Subscriber;
}

export interface SelectOffersInputs {
	type: "select_offers";
	offerIds: string[];
	customer?: OmsaCustomer;
	timestamp?: string;
}

export interface SelectOffersRequest {
	inputs: SelectOffersInputs;
	subscriber?: Subscriber;
}

export interface PackageInput {
	type: "package_input" | "package";
	packageId: string;
	timestamp?: string;
}

export interface ListAncillariesRequest {
	packageId: string;
	legId?: string;
	limit?: number;
	offset?: number;
}

export interface AncillaryCollectionItem {
	id?: string;
	properties?: OfferAncillary;
	links?: Link[];
}

export interface AncillaryCollection {
	type: "AncillaryCollection";
	ancillaries?: AncillaryCollectionItem[];
	numberMatched?: number;
	numberReturned?: number;
	links?: Link[];
}

export interface AncillaryReference {
	ancillaryId: string;
	name?: string;
}

export interface AssignAncillaryInput {
	type: "ancillary";
	packageId: string;
	legId: string;
	offerId?: string;
	location?: { placeId: string; name?: string };
	ancillaryId: AncillaryReference;
	replaceAncillaryId?: AncillaryReference;
}

export interface AssignAncillaryRequest {
	inputs: AssignAncillaryInput;
	subscriber?: Subscriber;
}

export interface ConfirmPackageRequest {
	inputs: PackageInput;
}

export interface PurchasePackageRequest {
	inputs: PackageInput;
}

export interface ReleasePackageRequest {
	inputs: { type: "package"; packageId: string };
}

export interface CancelPackageRequest {
	inputs: PackageInput;
	subscriber?: Subscriber;
}

export interface RefundOptionInput {
	type: "claim_refund_option" | "confirm_refund_option";
	optionId?: string;
}

export interface ClaimRefundRequest {
	inputs: RefundOptionInput;
	subscriber?: Subscriber;
}

export interface UpdateValidityInput {
	type: "update_travel_document_validity";
	packageId: string;
	travelDocumentId: string;
	// RFC3339, or the literal "NOW" for a server-side immediate start.
	newStartTime: string;
}

export interface UpdateValidityRequest {
	inputs: UpdateValidityInput;
	subscriber?: Subscriber;
}

// The document is replaced rather than mutated, so its id changes.
export interface UpdatedValidity {
	previousTravelDocumentId: string;
	newTravelDocumentId: string;
}

export type PackageStatus =
	| "OFFER"
	| "PENDING"
	| "CONFIRMED"
	| "CANCEL_PENDING"
	| "CANCELLED"
	| "EXCHANGED"
	| "EXPIRED"
	| "UNKNOWN";

export interface PackageLeg {
	id?: string;
	type?: string;
	from?: { placeId: string; name?: string };
	to?: { placeId: string; name?: string };
	startTime?: string;
	endTime?: string;
}

export interface ConfirmedPackage {
	type?: string;
	id?: string;
	status: PackageStatus;
	price: AmountOfMoney;
	offers?: Offer[];
	orderVersion?: number;
	expiryTime?: string;
	links?: Link[];
}

export type CardPaymentType = "VISA" | "MASTERCARD" | "AMEX" | "BANKAXEPT";
export type OtherPaymentType = "VIPPS" | "GIFTCARD" | "INTERNAL";
export type PaymentType = CardPaymentType | OtherPaymentType;
export type PaymentTypeGroup =
	| "AGENT"
	| "CASH"
	| "ECARD"
	| "GIFTCARD"
	| "INVOICE"
	| "MOBILE"
	| "PAYMENTCARD"
	| "PAYPAL"
	| "REMITTED"
	| "REQUISITION"
	| "TRAVELACCOUNT";

export interface CardPaymentTransaction {
	amount: string;
	currency: string;
	paymentType: PaymentType;
	isImport?: boolean;
	paymentTypeGroup?: PaymentTypeGroup;
}

export interface RecurringPaymentTransaction {
	amount: string;
	currency: string;
	recurringPaymentId: number;
}

export type PaymentTransaction =
	| CardPaymentTransaction
	| RecurringPaymentTransaction;

export interface PaymentRequest {
	orderId: string;
	orderVersion: number;
	totalAmount: string;
	transaction: PaymentTransaction;
}

export interface TransactionHistoryItem {
	transactionId?: number;
	amount?: string;
	currency?: string;
	status?: string;
	paymentType?: string;
}

export interface PaymentSessionResult {
	paymentId?: number;
	totalAmount?: string;
	currency?: string;
	status?: string;
	transactionHistory?: TransactionHistoryItem[];
}

export interface AddTransactionResult {
	transactionId?: number;
	status?: TransactionStatusValue;
}

export interface TerminalSessionResult {
	paymentId?: number;
	transactionId?: number;
	terminalUri?: string;
}

export type TransactionStatusValue =
	| "CANCELLED"
	| "CAPTURED"
	| "CREATED"
	| "CREDITED"
	| "INITIATED"
	| "REJECTED";

export interface TransactionStatus {
	id?: string;
	status?: TransactionStatusValue;
	amount?: string;
	currency?: string;
	paymentType?: string;
	redirectUrl?: string;
}
