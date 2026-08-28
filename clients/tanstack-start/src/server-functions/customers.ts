import { createServerFn } from "@tanstack/react-start";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import {
	type CustomerCollection,
	type CustomerSearchParams,
	normalizeCustomer,
	normalizeCustomerCollection,
	type OmsaCustomer,
} from "../types/customer";

// Resolves an Entur customer number to the full OMSA customer record, for
// server-internal use (not exposed as a server fn -- callers already run
// server-side, e.g. purchase.ts applying a dev-config default customer).
// Returns undefined rather than throwing on a miss or lookup failure, since a
// stale/typo'd dev-config override shouldn't break an otherwise-valid purchase.
export async function findCustomerByNumber(
	customerNumber: string,
	devConfig?: DevConfigOverrides,
): Promise<OmsaCustomer | undefined> {
	try {
		const omsa = createOmsaClient(devConfig);
		const raw = await omsa.get<CustomerCollection>(
			"/collections/customers/items",
			{ customerId: customerNumber },
		);
		return normalizeCustomerCollection(raw).customers?.[0];
	} catch (error) {
		console.warn(
			`[dev-config] failed to resolve customer number "${customerNumber}"`,
			error,
		);
		return undefined;
	}
}

export const getCustomers = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((data: CustomerSearchParams) => data)
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
	.validator((data: { customerId: string }) => data)
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
	.validator((data: UpdateCustomerRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.put<OmsaCustomer>(
			`/collections/customers/items/${encodeURIComponent(data.customerId)}`,
			data.customer,
		);
	});
