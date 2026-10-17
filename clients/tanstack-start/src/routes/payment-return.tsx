import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import Illustration from "../components/shared/Illustration";
import Button from "../components/ui/Button";
import { useCaptureTransaction } from "../hooks/use-payments";
import { useConfirmPackage } from "../hooks/use-purchase";
import {
	abandonPackage,
	clearPendingCheckout,
	getPendingCheckout,
	setPendingCheckout,
} from "../lib/pending-checkout";
import { readSearchSession } from "../lib/search-session";
import { popPendingGuestContact, savePackage } from "../lib/ticket-storage";
import { getTransaction } from "../server-functions/payments";
import type { TransactionStatus } from "../types/purchase";

export const Route = createFileRoute("/payment-return")({
	validateSearch: (search: Record<string, unknown>) => ({
		packageId: search.packageId as string | undefined,
		offerId: search.offerId as string | undefined,
		enturPaymentId: search.enturPaymentId as string | undefined,
		enturTransactionId: search.enturTransactionId as string | undefined,
		paymentType: search.paymentType as string | undefined,
	}),
	component: PaymentReturnPage,
});

// Thrown only when we know no money was taken, so the package is safe to release
class PaymentFailedError extends Error {
	readonly transaction: TransactionStatus;

	constructor(message: string, transaction: TransactionStatus) {
		super(message);
		this.transaction = transaction;
	}
}

function PaymentReturnPage() {
	const {
		packageId,
		offerId,
		enturPaymentId,
		enturTransactionId,
		paymentType,
	} = Route.useSearch();
	const navigate = useNavigate();
	const captureMutation = useCaptureTransaction();
	const confirmMutation = useConfirmPackage();
	const [paymentFailed, setPaymentFailed] = useState(false);

	useEffect(() => {
		if (!packageId) {
			navigate({ to: "/" });
			return;
		}
		const resolvedPackageId = packageId;

		async function complete() {
			try {
				if (enturPaymentId && enturTransactionId) {
					if (paymentType === "VIPPS") {
						// Vipps captures asynchronously; poll until the transaction is settled before confirming
						for (let attempt = 0; attempt < 30; attempt++) {
							const tx = await getTransaction({
								data: {
									paymentId: enturPaymentId,
									transactionId: enturTransactionId,
								},
							});
							if (tx.status === "CAPTURED") break;
							if (tx.status === "CANCELLED" || tx.status === "REJECTED")
								throw new PaymentFailedError("Vipps payment failed", tx);
							await new Promise((r) => setTimeout(r, 2000));
							if (attempt === 29) throw new Error("Vipps payment timed out");
						}
					} else {
						try {
							await captureMutation.mutateAsync({
								paymentId: enturPaymentId,
								transactionId: enturTransactionId,
							});
						} catch (captureError) {
							// Cancelled or declined in the terminal. Only treat it as a failed
							// payment once the transaction confirms nothing was captured.
							const tx = await getTransaction({
								data: {
									paymentId: enturPaymentId,
									transactionId: enturTransactionId,
								},
							});
							if (!tx.status) throw captureError;
							if (tx.status !== "CAPTURED")
								throw new PaymentFailedError("Card payment failed", tx);
						}
					}
				}
				// Paid: from here the package must be confirmed, never released
				clearPendingCheckout();
				// confirm-package also confirms any held seat reservations server-side
				const confirmed = await confirmMutation.mutateAsync({
					inputs: { type: "package_input", packageId: resolvedPackageId },
				});

				const guestContact = popPendingGuestContact(resolvedPackageId);
				const searchContext = readSearchSession().context;
				savePackage({
					packageId: resolvedPackageId,
					savedAt: new Date().toISOString(),
					status: confirmed.status ?? "CONFIRMED",
					price: {
						amount: confirmed.price?.amount ?? 0,
						currencyCode: confirmed.price?.currencyCode,
					},
					...(guestContact ? { guestContact } : {}),
					...(searchContext?.from && searchContext.to
						? {
								route: {
									from: {
										placeId: searchContext.from.placeId,
										name: searchContext.from.name,
									},
									to: {
										placeId: searchContext.to.placeId,
										name: searchContext.to.name,
									},
								},
							}
						: {}),
					...(searchContext?.pattern ? { pattern: searchContext.pattern } : {}),
				});
				navigate({
					to: "/tickets/$packageId",
					params: { packageId: resolvedPackageId },
				});
			} catch (err) {
				if (err instanceof PaymentFailedError) {
					// Keep the package and payment while the user decides whether to
					// retry. Rebuilt from the URL and transaction when a Vipps return
					// lands in a tab that never started checkout.
					const existing = getPendingCheckout();
					const base =
						existing?.packageId === resolvedPackageId ? existing : undefined;
					const amount = base?.amount ?? err.transaction.amount;
					if (offerId && amount) {
						setPendingCheckout({
							...base,
							packageId: resolvedPackageId,
							offerId,
							amount,
							currency: base?.currency ?? err.transaction.currency ?? "NOK",
							orderVersion: base?.orderVersion ?? 1,
							paymentId: enturPaymentId,
							transactionId: enturTransactionId,
						});
					}
					setPaymentFailed(true);
					return;
				}
				// Payment state unknown (e.g. Vipps still pending) or already
				// captured: leave the package alone and let it confirm or expire.
				clearPendingCheckout();
				navigate({ to: "/" });
			}
		}

		complete();
	}, [
		packageId,
		captureMutation.mutateAsync,
		confirmMutation.mutateAsync,
		navigate,
		enturPaymentId,
		enturTransactionId,
		paymentType,
		offerId,
	]);

	// The attempt that just failed, so it can be abandoned even when this tab
	// holds no pending checkout
	function failedAttempt() {
		const pending = getPendingCheckout();
		if (pending?.packageId === packageId) return pending;
		return packageId
			? {
					packageId,
					paymentId: enturPaymentId,
					transactionId: enturTransactionId,
				}
			: null;
	}

	function handleCancelPurchase() {
		const attempt = failedAttempt();
		clearPendingCheckout();
		if (attempt) void abandonPackage(attempt);
		navigate({ to: "/" });
	}

	function handleTryAgain() {
		if (!offerId) return;
		// Checkout retries on the stored package and payment. Without them it
		// starts over, so free this attempt instead of leaving it to expire.
		if (getPendingCheckout()?.packageId !== packageId) {
			const attempt = failedAttempt();
			if (attempt) void abandonPackage(attempt);
		}
		navigate({
			to: "/checkout/$offerId",
			params: { offerId },
			search: { pendingCardId: undefined },
		});
	}

	if (paymentFailed) {
		return (
			<PageShell title="Payment failed">
				<div className="flex flex-col items-center py-12 text-center">
					<Illustration
						name="crab-ticket-expired"
						size="lg"
						decorative
						className="mb-6"
					/>
					<p className="mb-6 text-sm text-wayfare-text-secondary">
						Your payment was not completed and you have not been charged.
					</p>
					<div className="flex w-full max-w-sm gap-3">
						<Button
							variant="secondary"
							className="flex-1"
							onClick={handleCancelPurchase}
						>
							Cancel purchase
						</Button>
						{offerId && (
							<Button
								variant="primary"
								className="flex-1"
								onClick={handleTryAgain}
							>
								Try again
							</Button>
						)}
					</div>
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell title="Completing your purchase">
			<div className="flex flex-col items-center py-12 text-center">
				<Illustration
					name="octopus-payment-processing"
					size="lg"
					decorative
					className="mb-6"
				/>
				<div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
				<p className="text-sm text-wayfare-text-secondary">
					Completing your purchase…
				</p>
			</div>
		</PageShell>
	);
}
