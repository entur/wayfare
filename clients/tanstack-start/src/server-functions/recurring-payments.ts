import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createSalesClient } from "../server/omsa-client";
import type {
	CreateRecurringPaymentRequest,
	RecurringPayment,
	RecurringPaymentTerminalRequest,
	RecurringPaymentTerminalResponse,
	UpdateRecurringPaymentRequest,
} from "../types/payment-methods";

export const listRecurringPayments = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator((data: { customerNumber: string; includeExpired?: boolean }) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		const params: Record<string, string> = {
			customerNumber: data.customerNumber,
		};
		if (data.includeExpired) {
			params.includeExpired = "true";
		}
		return sales.get<RecurringPayment[]>("/recurring-payments", params);
	});

export const createRecurringPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: CreateRecurringPaymentRequest) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.post<RecurringPayment>("/recurring-payments", data);
	});

export interface UpdateRecurringPaymentInput {
	recurringPaymentId: number;
	patch: UpdateRecurringPaymentRequest;
}

export const updateRecurringPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: UpdateRecurringPaymentInput) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.patch<RecurringPayment>(
			`/recurring-payments/${data.recurringPaymentId}`,
			data.patch,
		);
	});

export const deleteRecurringPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: { recurringPaymentId: number }) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.delete<RecurringPayment>(
			`/recurring-payments/${data.recurringPaymentId}`,
		);
	});

export interface CreateRecurringPaymentTerminalInput {
	recurringPaymentId: number;
	redirectUrl: string;
	terminalLanguage?: string;
}

export const createRecurringPaymentTerminal = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: CreateRecurringPaymentTerminalInput) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		const body: RecurringPaymentTerminalRequest = {
			redirectUrl: data.redirectUrl,
			terminalLanguage: data.terminalLanguage,
		};
		return sales.post<RecurringPaymentTerminalResponse>(
			`/recurring-payments/${data.recurringPaymentId}/terminal`,
			body,
		);
	});

export const authorizeRecurringPayment = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: { recurringPaymentId: number }) => data)
	.handler(async ({ data, context }) => {
		const sales = createSalesClient(context.devConfig);
		return sales.put<RecurringPayment>(
			`/recurring-payments/${data.recurringPaymentId}/authorize`,
		);
	});
