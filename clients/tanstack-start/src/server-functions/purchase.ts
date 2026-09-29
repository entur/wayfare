import { createServerFn } from "@tanstack/react-start";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type {
	AncillaryCollection,
	AssignAncillaryRequest,
	CancelPackageRequest,
	ClaimRefundRequest,
	ConfirmedPackage,
	ConfirmPackageRequest,
	ListAncillariesRequest,
	PurchaseOffersInputs,
	PurchaseOffersRequest,
	PurchasePackageRequest,
	ReleasePackageRequest,
	SelectOffersRequest,
	UpdatedValidity,
	UpdateValidityRequest,
} from "../types/purchase";
import { findCustomerByNumber } from "./customers";

// Checkout's own customer/contact (set when a signed-in profile checks out)
// always wins; a dev-config default only fills in for an otherwise-anonymous
// purchase, so leaving the defaults unset behaves exactly like today's guest
// checkout. OMSA requires contact.id to accompany customer.id, so a contact
// (from either source) is only resolved once a customer is present.
export async function resolvePurchaseCustomerAndContact(
	inputs: PurchaseOffersInputs,
	devConfig: DevConfigOverrides | undefined,
): Promise<Pick<PurchaseOffersInputs, "customer" | "contact">> {
	const customer =
		inputs.customer ??
		(devConfig?.customerNumber
			? await findCustomerByNumber(devConfig.customerNumber, devConfig)
			: undefined);

	const contact = customer
		? (inputs.contact ??
			(devConfig?.contactCustomerNumber
				? await findCustomerByNumber(devConfig.contactCustomerNumber, devConfig)
				: undefined))
		: undefined;

	return { customer, contact };
}

export const selectOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: SelectOffersRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		const body: SelectOffersRequest = {
			...data,
			subscriber: { successUri: "https://example.com" },
		};
		return omsa.post<ConfirmedPackage>(
			"/processes/select-offers/execute",
			body,
		);
	});

export const purchaseOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: PurchaseOffersRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		const body: PurchaseOffersRequest = {
			...data,
			inputs: {
				...data.inputs,
				...(await resolvePurchaseCustomerAndContact(
					data.inputs,
					context.devConfig,
				)),
			},
			subscriber: { successUri: "https://example.com" },
		};
		return omsa.post<ConfirmedPackage>(
			"/processes/purchase-offers/execute",
			body,
		);
	});

export const purchasePackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: PurchasePackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/purchase-package/execute",
			data,
		);
	});

export const confirmPackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: ConfirmPackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/confirm-package/execute",
			data,
		);
	});

export const listAncillaries = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((data: ListAncillariesRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<AncillaryCollection>("/collections/ancillaries/items", {
			packageId: data.packageId,
			...(data.legId ? { legId: data.legId } : {}),
			...(data.limit !== undefined ? { limit: String(data.limit) } : {}),
			...(data.offset !== undefined ? { offset: String(data.offset) } : {}),
		});
	});

export const assignAncillary = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: AssignAncillaryRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/assign-ancillary/execute",
			data,
		);
	});

export const cancelPackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: CancelPackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/cancel-package/execute",
			data,
		);
	});

// Releases the holds of a package that was never paid for. OMSA also drops the
// package at its expiryTime, so this only needs calling when we know the user
// abandoned the purchase.
export const releasePackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: ReleasePackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/release-package/execute",
			data,
		);
	});

export const claimRefund = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: ClaimRefundRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<{ status?: string }>(
			"/processes/claim-refund-option/execute",
			data,
		);
	});

// Optional today (claiming already refunds), but OMSA asks clients to confirm
// so it can start validating at confirm time without breaking them.
export const confirmRefund = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: ClaimRefundRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/confirm-refund-option/execute",
			data,
		);
	});

export const updateTravelDocumentValidity = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: UpdateValidityRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<UpdatedValidity>(
			"/processes/update-travel-document-validity/execute",
			data,
		);
	});
