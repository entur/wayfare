import type { CardPaymentType } from "./purchase";

export type RecurringPaymentStatus = "CREATED" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface RecurringPayment {
	recurringPaymentId: number;
	customerNumber?: string;
	nickname?: string;
	primary: boolean;
	recurringStatus: RecurringPaymentStatus;
	paymentType?: CardPaymentType;
	maskedPan?: string;
	cardExpiresAt?: string;
	expiresAt?: string;
}

export interface CreateRecurringPaymentRequest {
	customerNumber: string;
	nickname?: string;
}

export interface UpdateRecurringPaymentRequest {
	nickname?: string;
	isPrimary?: boolean;
}

export interface RecurringPaymentTerminalRequest {
	redirectUrl: string;
	terminalLanguage?: string;
}

export interface RecurringPaymentTerminalResponse {
	terminalUri?: string;
}

export type AgreementStatus = "PENDING" | "ACTIVE" | "CANCELLED";
export type AgreementType = "FIXED" | "FLEXIBLE" | "VARIABLE";
export type AgreementIntervalUnit = "MONTH" | "YEAR";

export interface AgreementInterval {
	unit: AgreementIntervalUnit;
	count: number;
}

export interface AgreementPricing {
	amount: number;
	currency: string;
	interval: AgreementInterval;
	agreementType: AgreementType;
}

export interface PaymentAgreement {
	agreementId: number;
	status: AgreementStatus;
	productName?: string;
	pricing: AgreementPricing;
	providerData?: {
		confirmationUrl?: string;
	};
}

export interface CreatePaymentAgreementRequest {
	customerNumber: string;
	phoneNumber: string;
	productName: string;
	pricing: AgreementPricing;
	agreementProvider: "VIPPS";
}

export type PaymentMethodType = "PAYMENTCARD" | "MOBILE" | "CASH";

export interface PaymentMethod {
	paymentMethodId: number;
	paymentType: string;
	paymentTypeGroup: PaymentMethodType;
	active: boolean;
	distributionChannelId?: string;
}

export interface GuestPaymentPrefs {
	preferredCardType?: CardPaymentType;
	vippsPhone?: string;
}

export type PaymentSelection =
	| { kind: "recurring"; recurringPaymentId: number; paymentType?: CardPaymentType }
	| { kind: "card"; paymentType: CardPaymentType }
	| { kind: "vipps"; phone: string };
