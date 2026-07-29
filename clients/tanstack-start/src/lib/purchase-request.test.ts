import { describe, expect, it } from "vitest";
import { buildPurchaseOffersRequest } from "./purchase-request";

describe("buildPurchaseOffersRequest", () => {
	it("builds an anonymous purchase request", () => {
		expect(buildPurchaseOffersRequest(["offer-1", "offer-2"])).toEqual({
			inputs: {
				type: "purchase_offers",
				offerIds: ["offer-1", "offer-2"],
			},
		});
	});

	it("includes the active customer", () => {
		const customer = {
			id: "customer-1",
			firstName: "Ada",
			email: "ada@example.com",
		};

		expect(buildPurchaseOffersRequest(["offer-1"], customer)).toEqual({
			inputs: {
				type: "purchase_offers",
				offerIds: ["offer-1"],
				customer,
			},
		});
	});
});
