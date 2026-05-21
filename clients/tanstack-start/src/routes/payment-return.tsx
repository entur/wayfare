import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import PageShell from "../components/layout/PageShell";
import Illustration from "../components/shared/Illustration";
import { useCaptureTransaction } from "../hooks/use-payments";
import { useConfirmPackage } from "../hooks/use-purchase";
import { popPendingGuestContact, savePackage } from "../lib/ticket-storage";
import { getTransaction } from "../server-functions/payments";

export const Route = createFileRoute("/payment-return")({
	validateSearch: (search: Record<string, unknown>) => ({
		packageId: search.packageId as string | undefined,
		enturPaymentId: search.enturPaymentId as string | undefined,
		enturTransactionId: search.enturTransactionId as string | undefined,
		paymentType: search.paymentType as string | undefined,
	}),
	component: PaymentReturnPage,
});

function PaymentReturnPage() {
	const { packageId, enturPaymentId, enturTransactionId, paymentType } =
		Route.useSearch();
	const navigate = useNavigate();
	const captureMutation = useCaptureTransaction();
	const confirmMutation = useConfirmPackage();

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
								throw new Error("Vipps payment failed");
							await new Promise((r) => setTimeout(r, 2000));
							if (attempt === 29) throw new Error("Vipps payment timed out");
						}
					} else {
						await captureMutation.mutateAsync({
							paymentId: enturPaymentId,
							transactionId: enturTransactionId,
						});
					}
				}
				const confirmed = await confirmMutation.mutateAsync({
					inputs: { type: "package_input", packageId: resolvedPackageId },
				});
				const guestContact = popPendingGuestContact(resolvedPackageId);
				savePackage({
					packageId: resolvedPackageId,
					savedAt: new Date().toISOString(),
					status: confirmed.status ?? "CONFIRMED",
					price: {
						amount: confirmed.price?.amount ?? 0,
						currencyCode: confirmed.price?.currencyCode,
					},
					...(guestContact ? { guestContact } : {}),
				});
				navigate({
					to: "/tickets/$packageId",
					params: { packageId: resolvedPackageId },
				});
			} catch {
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
	]);

	return (
		<PageShell title="Completing your purchase">
			<div className="flex flex-col items-center py-12 text-center">
				<Illustration
					name="octopus-payment-processing"
					size="lg"
					decorative
					className="mb-6"
				/>
				<div
					className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
					style={{
						borderColor: "var(--wayfare-line)",
						borderTopColor: "var(--wayfare-primary)",
					}}
				/>
				<p
					className="text-sm"
					style={{ color: "var(--wayfare-text-secondary)" }}
				>
					Completing your purchase…
				</p>
			</div>
		</PageShell>
	);
}
