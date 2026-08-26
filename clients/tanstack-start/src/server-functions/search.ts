import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import { mapSearchOfferRequest } from "../server/omsa-search-request";
import type { OfferCollection, SearchOfferRequest } from "../types/search";

export const searchOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: SearchOfferRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig, {
			quiet: !!data._prefetch,
		});
		return omsa.post<OfferCollection>(
			"/processes/search-offers/execute",
			mapSearchOfferRequest(data),
		);
	});
