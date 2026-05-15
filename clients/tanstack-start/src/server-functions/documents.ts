import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type {
	ChangeOptionCollection,
	PackageItem,
	RefundOptionCollection,
	TravelDocumentCollection,
} from "../types/documents";

export const getPackageItem = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<PackageItem>(
			`/collections/packages/items/${encodeURIComponent(packageId)}`,
		);
	});

export const getTravelDocuments = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<TravelDocumentCollection>(
			"/collections/travel-documents/items",
			{ packageId },
		);
	});

export const getRefundOptions = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<RefundOptionCollection>(
			"/collections/refund-options/items",
			{ packageId },
		);
	});

export const getChangeOptions = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((packageId: string) => packageId)
	.handler(async ({ data: packageId, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<ChangeOptionCollection>(
			"/collections/change-options/items",
			{ packageId },
		);
	});
