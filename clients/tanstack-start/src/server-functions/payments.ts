import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createSalesClient } from "../server/omsa-client";
import type {
	AddTransactionResult,
	PaymentRequest,
	PaymentSessionResult,
	PaymentTransaction,
	TerminalSessionResult,
	TransactionStatus,
} from "../types/purchase";

export const createPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: PaymentRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<PaymentSessionResult>("/payments", data);
	});

export interface AddTransactionRequest {
	paymentId: string;
	transaction: PaymentTransaction;
}

// A payment can hold several transactions, so a failed attempt is retried by
// adding a new transaction to the same payment rather than creating a new one.
export const addTransaction = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: AddTransactionRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<AddTransactionResult>(
			`/payments/${data.paymentId}/transactions`,
			data.transaction,
		);
	});

export interface TerminalSessionRequest {
	paymentId: string;
	transactionId: string;
	redirectUrl: string;
	terminalLanguage: string;
}

export const startTerminalSession = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: TerminalSessionRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<TerminalSessionResult>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}/terminal`,
			{
				redirectUrl: data.redirectUrl,
				terminalLanguage: data.terminalLanguage,
			},
		);
	});

export interface AppClaimRequest {
	paymentId: string;
	transactionId: string;
	description: string;
	phoneNumber: string;
	redirectUrl: string;
}

export const startAppClaim = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: AppClaimRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<{ appClaimUrl?: string; status?: string }>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}/app-claim`,
			{
				description: data.description,
				phoneNumber: data.phoneNumber,
				redirectUrl: data.redirectUrl,
			},
		);
	});

export interface CaptureRequest {
	paymentId: string;
	transactionId: string;
}

export const captureTransaction = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: CaptureRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.put<{ status?: string }>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}/capture`,
		);
	});

// Cancels a transaction that has not been captured, cleaning up with the PSP
export const cancelTransaction = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator((data: CaptureRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<TransactionStatus>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}/cancel`,
			{},
		);
	});

export const getTransaction = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.validator((data: CaptureRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.get<TransactionStatus>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}`,
		);
	});
