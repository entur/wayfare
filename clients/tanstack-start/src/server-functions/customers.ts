import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { omsa } from "../server/omsa-client";
import type {
	CustomerCollection,
	CustomerSearchParams,
	OmsaCustomer,
} from "../types/customer";

export const getCustomers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: CustomerSearchParams) => data)
	.handler(async ({ data }) => {
		const params: Record<string, string> = {};
		if (data.customerId) params.customerId = data.customerId;
		if (data.firstName) params.firstName = data.firstName;
		if (data.lastName) params.lastName = data.lastName;
		if (data.email) params.email = data.email;
		if (data.phoneNumber) params.phoneNumber = data.phoneNumber;
		return omsa.get<CustomerCollection>("/collections/customers/items", params);
	});

export const getCustomer = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: { customerId: string }) => data)
	.handler(async ({ data }) => {
		return omsa.get<OmsaCustomer>(
			`/collections/customers/items/${data.customerId}`,
		);
	});
