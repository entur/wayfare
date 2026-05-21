import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import {
	type CustomerCollection,
	type CustomerSearchParams,
	normalizeCustomer,
	normalizeCustomerCollection,
	type OmsaCustomer,
} from "../types/customer";

export const getCustomers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: CustomerSearchParams) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		const params: Record<string, string> = {};
		if (data.customerId) params.customerId = data.customerId;
		if (data.firstName) params.firstName = data.firstName;
		if (data.lastName) params.lastName = data.lastName;
		if (data.email) params.email = data.email;
		if (data.phoneNumber) params.phoneNumber = data.phoneNumber;
		const raw = await omsa.get<CustomerCollection>(
			"/collections/customers/items",
			params,
		);
		return normalizeCustomerCollection(raw);
	});

export const getCustomer = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: { customerId: string }) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		const raw = await omsa.get<OmsaCustomer>(
			`/collections/customers/items/${encodeURIComponent(data.customerId)}`,
		);
		return normalizeCustomer(raw);
	});

export interface UpdateCustomerRequest {
	customerId: string;
	customer: Partial<OmsaCustomer>;
}

export const updateCustomer = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: UpdateCustomerRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.put<OmsaCustomer>(
			`/collections/customers/items/${encodeURIComponent(data.customerId)}`,
			data.customer,
		);
	});
