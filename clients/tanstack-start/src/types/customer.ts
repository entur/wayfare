export interface OmsaCustomer {
	id?: string;
	customerNumber?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
	vippsPhoneNumber?: string;
}

interface RawOmsaCustomer extends OmsaCustomer {
	customProperties?: { enturCustomerNumber?: string };
}

export function normalizeCustomer(raw: RawOmsaCustomer): OmsaCustomer {
	const { customProperties, ...rest } = raw;
	return {
		...rest,
		customerNumber:
			rest.customerNumber ?? customProperties?.enturCustomerNumber,
	};
}

export interface CustomerCollection {
	type?: string;
	customers?: OmsaCustomer[];
	numberMatched?: number;
	numberReturned?: number;
}

interface RawCustomerCollection extends Omit<CustomerCollection, "customers"> {
	customers?: RawOmsaCustomer[];
}

export function normalizeCustomerCollection(
	raw: RawCustomerCollection,
): CustomerCollection {
	return {
		...raw,
		customers: raw.customers?.map(normalizeCustomer),
	};
}

export interface CustomerSearchParams {
	customerId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
}
