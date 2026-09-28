import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import ErrorBanner from "../../../components/shared/ErrorBanner";
import TicketFlowShell, {
	ticketContext,
} from "../../../components/tickets/TicketFlowShell";
import Button from "../../../components/ui/Button";
import {
	useChangeOptions,
	usePackageItem,
	useRefundOptions,
	useTravelDocuments,
} from "../../../hooks/use-documents";
import { useCancelPackage } from "../../../hooks/use-purchase";
import { getTicketActions } from "../../../lib/ticket-actions";
import { removePackage } from "../../../lib/ticket-storage";

export const Route = createFileRoute("/tickets/$packageId/cancel")({
	component: CancelPage,
});

function CancelPage() {
	const { packageId } = Route.useParams();
	const navigate = useNavigate();

	const { data: packageItem } = usePackageItem(packageId);
	const { data: docCollection } = useTravelDocuments(packageId);
	const { data: changeCollection, isLoading } = useChangeOptions(packageId);
	const { data: refundCollection } = useRefundOptions(packageId);
	const cancelPackage = useCancelPackage();

	const { canCancel } = getTicketActions(
		changeCollection?.options ?? [],
		docCollection?.travelDocuments ?? [],
		new Date(),
	);
	const hasRefundOptions = (refundCollection?.options ?? []).length > 0;

	const shell = (children: ReactNode) => (
		<TicketFlowShell
			packageId={packageId}
			title="Cancel without refund"
			context={ticketContext(packageItem)}
		>
			{children}
		</TicketFlowShell>
	);

	if (isLoading) {
		return shell(
			<p className="m-0 text-sm text-wayfare-text-secondary">Loading…</p>,
		);
	}

	if (!canCancel) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					This ticket can't be cancelled
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					Cancelling is no longer available for this order.
				</p>
			</div>,
		);
	}

	return shell(
		<>
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					The whole ticket is cancelled
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					Every traveller in this order stops being able to travel on it, and no
					money is paid back.
				</p>
			</div>

			{hasRefundOptions && (
				<div className="rounded-xl border border-wayfare-line p-4">
					<p className="m-0 text-sm text-wayfare-text">
						Parts of this ticket can still be refunded.
					</p>
					<Link
						to="/tickets/$packageId/refund"
						params={{ packageId }}
						className="mt-1 inline-block text-sm font-medium text-wayfare-primary"
					>
						Get a refund instead
					</Link>
				</div>
			)}

			{cancelPackage.error && (
				<ErrorBanner message={cancelPackage.error.message} />
			)}

			<Button
				fluid
				variant="negative"
				loading={cancelPackage.isPending}
				onClick={async () => {
					await cancelPackage.mutateAsync({
						inputs: { type: "package_input", packageId },
					});
					removePackage(packageId);
					navigate({ to: "/tickets" });
				}}
			>
				Cancel ticket
			</Button>
			<Link
				to="/tickets/$packageId"
				params={{ packageId }}
				className="self-center text-sm font-medium text-wayfare-text-secondary no-underline"
			>
				Keep ticket
			</Link>
		</>,
	);
}
