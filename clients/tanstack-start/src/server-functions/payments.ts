import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createSalesClient } from "../server/omsa-client";
import type {
	PaymentRequest,
	PaymentSessionResult,
	TerminalSessionResult,
	TransactionStatus,
} from "../types/purchase";

export const createPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: PaymentRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<PaymentSessionResult>("/payments", data);
	});

export interface TerminalSessionRequest {
	paymentId: string;
	transactionId: string;
	redirectUrl: string;
	terminalLanguage: string;
}

export const startTerminalSession = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: TerminalSessionRequest) => data)
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
	.inputValidator((data: AppClaimRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<{ status?: string; id?: string }>(
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
	.inputValidator((data: CaptureRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.put<{ status?: string }>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}/capture`,
		);
	});

export const getTransaction = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: CaptureRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.get<TransactionStatus>(
			`/payments/${data.paymentId}/transactions/${data.transactionId}`,
		);
	});
