import { useMutation, useQuery } from "@tanstack/react-query";
import type {
	AppClaimRequest,
	CaptureRequest,
	TerminalSessionRequest,
} from "../server-functions/payments";
import {
	captureTransaction,
	createPayment,
	getTransaction,
	startAppClaim,
	startTerminalSession,
} from "../server-functions/payments";
import type {
	PaymentRequest,
	PaymentSessionResult,
	TerminalSessionResult,
	TransactionStatus,
} from "../types/purchase";

export function useCreatePayment() {
	return useMutation<PaymentSessionResult, Error, PaymentRequest>({
		mutationFn: (req) => createPayment({ data: req }),
	});
}

export function useStartTerminalSession() {
	return useMutation<TerminalSessionResult, Error, TerminalSessionRequest>({
		mutationFn: (req) => startTerminalSession({ data: req }),
	});
}

export function useStartAppClaim() {
	return useMutation<
		{ appClaimUrl?: string; status?: string },
		Error,
		AppClaimRequest
	>({
		mutationFn: (req) => startAppClaim({ data: req }),
	});
}

export function useCaptureTransaction() {
	return useMutation<unknown, Error, CaptureRequest>({
		mutationFn: (req) => captureTransaction({ data: req }),
	});
}

export function useGetTransaction(
	paymentId: string | null,
	transactionId: string | null,
) {
	return useQuery<TransactionStatus>({
		queryKey: ["transaction", paymentId, transactionId],
		queryFn: () =>
			getTransaction({
				data: {
					paymentId: paymentId ?? "",
					transactionId: transactionId ?? "",
				},
			}),
		enabled: !!paymentId && !!transactionId,
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			if (
				!status ||
				status === "CAPTURED" ||
				status === "CANCELLED" ||
				status === "REJECTED"
			)
				return false;
			return 2000;
		},
	});
}
