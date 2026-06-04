import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type { OfferCollection, SearchOfferRequest } from "../types/search";

export const searchOffers = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: SearchOfferRequest) => data)
	.handler(async ({ data, context }) => {
		const { _prefetch, ...omsaRequest } = data;
		const omsa = createOmsaClient(context.devConfig, { quiet: !!_prefetch });
		return omsa.post<OfferCollection>(
			"/processes/search-offers/execute",
			omsaRequest,
		);
	});
