import { DownArrowIcon, ForwardIcon } from "@entur/icons";
import { Link } from "@tanstack/react-router";
import { formatPrice } from "../../lib/format-price";
import type { RefundOptionSummary } from "../../lib/refund-options";
import type { MovableDocument } from "../../lib/ticket-actions";

function formatDateTime(date: Date): string {
	return date.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

interface TicketActionsSectionProps {
	packageId: string;
	movableDocuments: MovableDocument[];
	refundOptions: RefundOptionSummary[];
	canCancel: boolean;
}

interface ActionRowProps {
	packageId: string;
	to:
		| "/tickets/$packageId/start-time"
		| "/tickets/$packageId/refund"
		| "/tickets/$packageId/cancel";
	title: string;
	subtitle: string;
	negative?: boolean;
}

function ActionRow({
	packageId,
	to,
	title,
	subtitle,
	negative = false,
}: ActionRowProps) {
	return (
		<Link
			to={to}
			params={{ packageId }}
			className="flex items-center justify-between gap-4 rounded-lg border border-wayfare-line p-3 no-underline transition-colors hover:bg-wayfare-bg"
		>
			<span className="min-w-0">
				<span
					className={`block text-sm font-medium ${negative ? "text-wayfare-primary" : "text-wayfare-text"}`}
				>
					{title}
				</span>
				<span className="mt-0.5 block text-xs text-wayfare-text-secondary">
					{subtitle}
				</span>
			</span>
			<ForwardIcon
				aria-hidden="true"
				className="shrink-0 text-wayfare-text-secondary"
			/>
		</Link>
	);
}

export default function TicketActionsSection({
	packageId,
	movableDocuments,
	refundOptions,
	canCancel,
}: TicketActionsSectionProps) {
	const refundTotal = refundOptions.reduce(
		(total, option) => total + option.refund,
		0,
	);
	const refundCurrency = refundOptions[0]?.currency ?? "NOK";
	const earliestStart = movableDocuments
		.map((doc) => doc.start)
		.sort((a, b) => a.getTime() - b.getTime())[0];
	const actionCount =
		(movableDocuments.length > 0 ? 1 : 0) +
		(refundOptions.length > 0 ? 1 : 0) +
		(canCancel ? 1 : 0);

	return (
		<details className="group rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-wayfare-text [&::-webkit-details-marker]:hidden">
				Manage ticket
				<span className="flex items-center gap-2 text-xs font-normal text-wayfare-text-secondary">
					{actionCount > 0 &&
						`${actionCount} ${actionCount === 1 ? "option" : "options"}`}
					<span className="transition-transform group-open:rotate-180">
						<DownArrowIcon aria-hidden="true" />
					</span>
				</span>
			</summary>

			<div className="flex flex-col gap-2 border-t border-wayfare-line p-4">
				{actionCount === 0 && (
					<p className="m-0 text-sm text-wayfare-text-secondary">
						No changes available for this ticket.
					</p>
				)}

				{movableDocuments.length > 0 && earliestStart && (
					<ActionRow
						packageId={packageId}
						to="/tickets/$packageId/start-time"
						title="Change start time"
						subtitle={
							movableDocuments.length === 1
								? `Starts ${formatDateTime(earliestStart)}`
								: `${movableDocuments.length} tickets start ${formatDateTime(earliestStart)}`
						}
					/>
				)}

				{refundOptions.length > 0 && (
					<ActionRow
						packageId={packageId}
						to="/tickets/$packageId/refund"
						title="Get a refund"
						subtitle={
							refundOptions.length === 1
								? `${formatPrice(refundTotal, refundCurrency)} back`
								: `Up to ${formatPrice(refundTotal, refundCurrency)} back, one traveller at a time`
						}
					/>
				)}

				{canCancel && (
					<ActionRow
						packageId={packageId}
						to="/tickets/$packageId/cancel"
						title="Cancel without refund"
						subtitle="No money back"
						negative
					/>
				)}
			</div>
		</details>
	);
}
