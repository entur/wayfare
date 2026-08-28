import { createServerFn } from "@tanstack/react-start";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type {
	CancelPackageRequest,
	ClaimRefundRequest,
	ConfirmedPackage,
	ConfirmPackageRequest,
	PurchaseOffersInputs,
	PurchaseOffersRequest,
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

	return {
		...(customer ? { customer } : {}),
		...(contact ? { contact } : {}),
	};
}

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
