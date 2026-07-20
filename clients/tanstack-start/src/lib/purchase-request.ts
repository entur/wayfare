import type { OmsaCustomer } from "../types/customer";
import type { PurchaseOffersRequest } from "../types/purchase";

export function buildPurchaseOffersRequest(
	offerIds: string[],
	customer?: OmsaCustomer,
): PurchaseOffersRequest {
	return {
		inputs: {
			type: "purchase_offers",
			offerIds,
			...(customer ? { customer } : {}),
		},
	};
}
