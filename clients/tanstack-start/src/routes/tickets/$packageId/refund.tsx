import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import ErrorBanner from "../../../components/shared/ErrorBanner";
import TicketFlowShell, {
	ticketContext,
} from "../../../components/tickets/TicketFlowShell";
import Button from "../../../components/ui/Button";
import { usePackageItem, useRefundOptions } from "../../../hooks/use-documents";
import { useRefundOption } from "../../../hooks/use-purchase";
import { formatPrice } from "../../../lib/format-price";
import { summarizeRefundOptions } from "../../../lib/refund-options";

export const Route = createFileRoute("/tickets/$packageId/refund")({
	component: RefundPage,
	validateSearch: (search: Record<string, unknown>): { option?: string } =>
		typeof search.option === "string" ? { option: search.option } : {},
});

function formatDateTime(date: Date): string {
	return date.toLocaleString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function RefundPage() {
	const { packageId } = Route.useParams();
	const { option: optionId } = Route.useSearch();
	const [done, setDone] = useState<string | null>(null);

	const { data: packageItem } = usePackageItem(packageId);
	const { data: refundCollection, isLoading } = useRefundOptions(packageId);
	const refundOption = useRefundOption();

	const options = summarizeRefundOptions(
		refundCollection?.options ?? [],
		packageItem?.offers ?? [],
	);
	// A single refundable traveller needs no picking.
	const selected =
		options.find((option) => option.id === optionId) ??
		(options.length === 1 ? options[0] : undefined);

	const shell = (children: ReactNode) => (
		<TicketFlowShell
			packageId={packageId}
			title="Get a refund"
			context={ticketContext(packageItem)}
		>
			{children}
		</TicketFlowShell>
	);

	const backToTicket = (
		<Link
			to="/tickets/$packageId"
			params={{ packageId }}
			className="mt-4 inline-block text-sm font-medium text-wayfare-primary"
		>
			Back to ticket
		</Link>
	);

	if (done) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-semibold text-wayfare-text">
					{done} refunded
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					That ticket is no longer valid for travel.
				</p>
				{backToTicket}
			</div>,
		);
	}

	if (isLoading) {
		return shell(
			<p className="m-0 text-sm text-wayfare-text-secondary">Loading…</p>,
		);
	}

	// A refund claimed elsewhere, or a deadline that has passed, drops the option
	// out of the list while its id is still in the URL.
	if (optionId && !selected) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					This refund is no longer available
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					It may already have been refunded, or the deadline has passed.
				</p>
				{backToTicket}
			</div>,
		);
	}

	if (options.length === 0) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					Nothing to refund
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					This ticket has no refundable parts left.
				</p>
			</div>,
		);
	}

	if (!selected) {
		return shell(
			<>
				<p className="m-0 text-sm text-wayfare-text-secondary">
					Each traveller is refunded separately. Pick who to refund.
				</p>
				{options.map((option) => (
					<Link
						key={option.id}
						to="/tickets/$packageId/refund"
						params={{ packageId }}
						search={{ option: option.id }}
						className="flex items-start justify-between gap-4 rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4 no-underline transition-colors hover:bg-wayfare-bg"
					>
						<span className="min-w-0">
							<span className="block text-sm font-medium text-wayfare-text">
								{option.title}
							</span>
							{option.productName && (
								<span className="mt-0.5 block text-xs text-wayfare-text-secondary">
									{option.productName}
								</span>
							)}
							{option.deadline && (
								<span className="mt-1 block text-xs text-wayfare-text-secondary">
									Refundable until {formatDateTime(option.deadline)}
								</span>
							)}
						</span>
						<span className="shrink-0 text-sm font-semibold text-wayfare-primary">
							{formatPrice(option.refund, option.currency)}
						</span>
					</Link>
				))}
			</>,
		);
	}

	const amount = formatPrice(selected.refund, selected.currency);

	return shell(
		<>
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-3xl font-bold text-wayfare-text">{amount}</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					back for {selected.title}
					{selected.productName ? `, ${selected.productName}` : ""}
				</p>

				<div className="mt-4 grid gap-y-2 border-t border-wayfare-line pt-4 text-sm">
					{selected.fee > 0 && (
						<div className="flex justify-between gap-4">
							<span className="text-wayfare-text-secondary">Fee deducted</span>
							<span className="text-wayfare-text">
								{formatPrice(selected.fee, selected.currency)}
							</span>
						</div>
					)}
					{selected.deadline && (
						<div className="flex justify-between gap-4">
							<span className="text-wayfare-text-secondary">
								Refundable until
							</span>
							<span className="text-wayfare-text">
								{formatDateTime(selected.deadline)}
							</span>
						</div>
					)}
				</div>
			</div>

			<p className="m-0 text-sm text-wayfare-text-secondary">
				This can't be undone. {selected.title}'s ticket stops being valid for
				travel.
			</p>

			{refundOption.error && (
				<ErrorBanner message={refundOption.error.message} />
			)}

			<Button
				fluid
				loading={refundOption.isPending}
				onClick={async () => {
					await refundOption.mutateAsync(selected.id);
					setDone(amount);
				}}
			>
				Refund {amount}
			</Button>
			{options.length > 1 ? (
				<Link
					to="/tickets/$packageId/refund"
					params={{ packageId }}
					search={{}}
					className="self-center text-sm font-medium text-wayfare-text-secondary no-underline"
				>
					Pick another traveller
				</Link>
			) : (
				<Link
					to="/tickets/$packageId"
					params={{ packageId }}
					className="self-center text-sm font-medium text-wayfare-text-secondary no-underline"
				>
					Back to ticket
				</Link>
			)}
		</>,
	);
}
