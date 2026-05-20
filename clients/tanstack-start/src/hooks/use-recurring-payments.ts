import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	authorizeRecurringPayment,
	createRecurringPayment,
	createRecurringPaymentTerminal,
	deleteRecurringPayment,
	listRecurringPayments,
	updateRecurringPayment,
} from "../server-functions/recurring-payments";
import type { RecurringPayment } from "../types/payment-methods";

export function recurringPaymentsKey(customerNumber: string) {
	return ["recurring-payments", customerNumber] as const;
}

export function useRecurringPayments(customerNumber: string | undefined) {
	return useQuery<RecurringPayment[]>({
		queryKey: recurringPaymentsKey(customerNumber ?? ""),
		queryFn: () =>
			listRecurringPayments({ data: { customerNumber: customerNumber ?? "" } }),
		enabled: !!customerNumber,
		staleTime: 60_000,
	});
}

export function useSetPrimaryPayment(customerNumber: string) {
	const queryClient = useQueryClient();
	return useMutation<RecurringPayment, Error, number>({
		mutationFn: (recurringPaymentId) =>
			updateRecurringPayment({
				data: { recurringPaymentId, patch: { isPrimary: true } },
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: recurringPaymentsKey(customerNumber),
			});
		},
	});
}

export function useDeletePayment(customerNumber: string) {
	const queryClient = useQueryClient();
	return useMutation<RecurringPayment, Error, number>({
		mutationFn: (recurringPaymentId) =>
			deleteRecurringPayment({ data: { recurringPaymentId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: recurringPaymentsKey(customerNumber),
			});
		},
	});
}

export interface AddCardResult {
	recurringPaymentId: number;
	terminalUri: string;
}

export interface AddCardInput {
	nickname?: string;
	terminalLanguage?: string;
	makeRedirectUrl: (recurringPaymentId: number) => string;
}

export function useAddCard(customerNumber: string) {
	const queryClient = useQueryClient();
	return useMutation<AddCardResult, Error, AddCardInput>({
		mutationFn: async ({ makeRedirectUrl, terminalLanguage, nickname }) => {
			const created = await createRecurringPayment({
				data: { customerNumber, nickname },
			});
			const redirectUrl = makeRedirectUrl(created.recurringPaymentId);
			const terminal = await createRecurringPaymentTerminal({
				data: {
					recurringPaymentId: created.recurringPaymentId,
					redirectUrl,
					terminalLanguage,
				},
			});
			if (!terminal.terminalUri) {
				throw new Error("No terminal URI returned for card registration");
			}
			return {
				recurringPaymentId: created.recurringPaymentId,
				terminalUri: terminal.terminalUri,
			};
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: recurringPaymentsKey(customerNumber),
			});
		},
	});
}

export function useAuthorizeCard(customerNumber: string) {
	const queryClient = useQueryClient();
	return useMutation<RecurringPayment, Error, number>({
		mutationFn: (recurringPaymentId) =>
			authorizeRecurringPayment({ data: { recurringPaymentId } }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: recurringPaymentsKey(customerNumber),
			});
		},
	});
}
