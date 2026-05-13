import { useQuery } from "@tanstack/react-query";
import { getCustomer, getCustomers } from "../server-functions/customers";
import type { CustomerSearchParams } from "../types/customer";

export function useCustomerSearch(
	params: CustomerSearchParams,
	enabled: boolean,
) {
	return useQuery({
		queryKey: ["customers", params],
		queryFn: () => getCustomers({ data: params }),
		enabled,
	});
}

export function useCustomer(customerId: string | undefined) {
	return useQuery({
		queryKey: ["customer", customerId],
		queryFn: () => {
			if (!customerId) throw new Error("customerId is required");
			return getCustomer({ data: { customerId } });
		},
		enabled: !!customerId,
	});
}
