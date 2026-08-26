import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type {
	ChangeOptionCollection,
	PackageCollection,
	PackageItem,
	RefundOptionCollection,
	TravelDocumentCollection,
} from "../types/documents";

export const getPackageItem = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<PackageItem>(
			`/collections/packages/items/${encodeURIComponent(packageId)}`,
		);
	});

// Lists packages owned by a specific customer (Orders createdBy). customerId is
// required so we never fetch the whole client-wide package set by accident.
export const listCustomerPackages = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((customerId: string) => customerId)
	.handler(async ({ data: customerId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<PackageCollection>("/collections/packages/items", {
			customerId,
			limit: "1000",
		});
	});

export const getTravelDocuments = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<TravelDocumentCollection>(
			"/collections/travel-documents/items",
			{ packageId },
		);
	});

export const getRefundOptions = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<RefundOptionCollection>(
			"/collections/refund-options/items",
			{ packageId },
		);
	});

export const getChangeOptions = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<ChangeOptionCollection>(
			"/collections/change-options/items",
			{ packageId },
		);
	});
