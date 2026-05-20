import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getCustomer,
	getCustomers,
	updateCustomer,
} from "../server-functions/customers";
import type { CustomerSearchParams, OmsaCustomer } from "../types/customer";

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

export function useUpdateCustomer(customerId: string) {
	const queryClient = useQueryClient();
	return useMutation<OmsaCustomer, Error, Partial<OmsaCustomer>>({
		mutationFn: (customer) =>
			updateCustomer({ data: { customerId, customer } }),
		onSuccess: (updated) => {
			queryClient.setQueryData(["customer", customerId], updated);
		},
	});
}
