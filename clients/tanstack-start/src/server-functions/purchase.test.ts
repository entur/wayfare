import { afterEach, describe, expect, it, vi } from "vitest";

const { findCustomerByNumberMock } = vi.hoisted(() => ({
	findCustomerByNumberMock: vi.fn(),
}));

vi.mock("./customers", () => ({
	findCustomerByNumber: findCustomerByNumberMock,
}));

import type { OmsaCustomer } from "../types/customer";
import type { PurchaseOffersInputs } from "../types/purchase";
import { resolvePurchaseCustomerAndContact } from "./purchase";

afterEach(() => {
	vi.clearAllMocks();
});

function inputs(
	overrides: Partial<PurchaseOffersInputs> = {},
): PurchaseOffersInputs {
	return { type: "purchase_offers", offerIds: ["offer-1"], ...overrides };
}

const CUSTOMER: OmsaCustomer = { id: "customer-1", customerNumber: "111" };
const CONTACT: OmsaCustomer = { id: "contact-1", customerNumber: "222" };

describe("resolvePurchaseCustomerAndContact", () => {
	it("returns nothing when neither checkout nor dev-config supply a customer", async () => {
		const result = await resolvePurchaseCustomerAndContact(inputs(), {});
		expect(result).toEqual({});
		expect(findCustomerByNumberMock).not.toHaveBeenCalled();
	});

	it("prefers checkout's own customer over a configured dev-config default", async () => {
		const checkoutCustomer: OmsaCustomer = { id: "signed-in-customer" };
		const result = await resolvePurchaseCustomerAndContact(
			inputs({ customer: checkoutCustomer }),
			{ customerNumber: "111" },
		);
		expect(result.customer).toBe(checkoutCustomer);
		expect(findCustomerByNumberMock).not.toHaveBeenCalled();
	});

	it("falls back to the dev-config default customer for an anonymous purchase", async () => {
		findCustomerByNumberMock.mockResolvedValue(CUSTOMER);
		const devConfig = { customerNumber: "111" };

		const result = await resolvePurchaseCustomerAndContact(inputs(), devConfig);

		expect(result.customer).toEqual(CUSTOMER);
		expect(result.contact).toBeUndefined();
		expect(findCustomerByNumberMock).toHaveBeenCalledWith("111", devConfig);
	});

	it("attaches the dev-config default contact once a customer is present", async () => {
		findCustomerByNumberMock.mockImplementation(async (number: string) =>
			number === "111" ? CUSTOMER : CONTACT,
		);
		const devConfig = { customerNumber: "111", contactCustomerNumber: "222" };

		const result = await resolvePurchaseCustomerAndContact(inputs(), devConfig);

		expect(result.customer).toEqual(CUSTOMER);
		expect(result.contact).toEqual(CONTACT);
	});

	it("never sends a contact without a customer (OMSA requires customer.id with contact.id)", async () => {
		findCustomerByNumberMock.mockResolvedValue(CONTACT);
		const devConfig = { contactCustomerNumber: "222" };

		const result = await resolvePurchaseCustomerAndContact(inputs(), devConfig);

		expect(result.customer).toBeUndefined();
		expect(result.contact).toBeUndefined();
		expect(findCustomerByNumberMock).not.toHaveBeenCalled();
	});

	it("leaves the purchase anonymous when the configured customer number can't be resolved", async () => {
		findCustomerByNumberMock.mockResolvedValue(undefined);
		const devConfig = {
			customerNumber: "does-not-exist",
			contactCustomerNumber: "222",
		};

		const result = await resolvePurchaseCustomerAndContact(inputs(), devConfig);

		expect(result).toEqual({});
	});

	it("prefers an explicit checkout contact over the dev-config default", async () => {
		const explicitContact: OmsaCustomer = { id: "explicit-contact" };
		const result = await resolvePurchaseCustomerAndContact(
			inputs({ customer: CUSTOMER, contact: explicitContact }),
			{ contactCustomerNumber: "222" },
		);

		expect(result.contact).toBe(explicitContact);
		expect(findCustomerByNumberMock).not.toHaveBeenCalled();
	});
});
