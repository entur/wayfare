import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type {
	CancelPackageRequest,
	ClaimRefundRequest,
	ConfirmedPackage,
	ConfirmPackageRequest,
	PurchaseOffersRequest,
} from "../types/purchase";

export const purchaseOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: PurchaseOffersRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		const body: PurchaseOffersRequest = {
			...data,
			subscriber: { successUri: "https://example.com" },
		};
		return omsa.post<ConfirmedPackage>(
			"/processes/purchase-offers/execute",
			body,
		);
	});

export const confirmPackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: ConfirmPackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/confirm-package/execute",
			data,
		);
	});

export const cancelPackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: CancelPackageRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>(
			"/processes/cancel-package/execute",
			data,
		);
	});

export const claimRefund = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: ClaimRefundRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<{ status?: string }>(
			"/processes/claim-refund-option/execute",
			data,
		);
	});
