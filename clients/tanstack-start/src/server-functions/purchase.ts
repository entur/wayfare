import { createServerFn } from "@tanstack/react-start";
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
	PurchaseOffersRequest,
	PurchasePackageRequest,
	SelectOffersRequest,
} from "../types/purchase";

export const selectOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: SelectOffersRequest) => data)
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
			subscriber: { successUri: "https://example.com" },
		};
		return omsa.post<ConfirmedPackage>(
			"/processes/purchase-offers/execute",
			body,
		);
	});

export const purchasePackage = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: PurchasePackageRequest) => data)
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
	.inputValidator((data: ListAncillariesRequest) => data)
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
	.inputValidator((data: AssignAncillaryRequest) => data)
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
