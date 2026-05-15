export interface OmsaCustomer {
	id?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
}

export interface CustomerCollection {
	type?: string;
	customers?: OmsaCustomer[];
	numberMatched?: number;
	numberReturned?: number;
}

export interface CustomerSearchParams {
	customerId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
}
