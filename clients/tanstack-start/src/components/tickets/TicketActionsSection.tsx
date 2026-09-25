import { DownArrowIcon } from "@entur/icons";
import { formatPrice } from "../../lib/format-price";
import type { RefundOptionSummary } from "../../lib/refund-options";

function formatDeadline(date: Date): string {
	return date.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

interface TicketActionsSectionProps {
	refundOptions: RefundOptionSummary[];
	onClaimRefund: (option: RefundOptionSummary) => void;
	claimingRefund: boolean;
	onCancel: () => void;
	cancelling: boolean;
}

export default function TicketActionsSection({
	refundOptions,
	onClaimRefund,
	claimingRefund,
	onCancel,
	cancelling,
}: TicketActionsSectionProps) {
	return (
		<details className="group rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
			<summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold text-wayfare-text [&::-webkit-details-marker]:hidden">
				Manage ticket
				<span className="flex items-center gap-2 text-xs font-normal text-wayfare-text-secondary">
					{refundOptions.length > 0 &&
						`${refundOptions.length} refund ${refundOptions.length === 1 ? "option" : "options"}`}
					<span className="transition-transform group-open:rotate-180">
						<DownArrowIcon aria-hidden="true" />
					</span>
				</span>
			</summary>

			<div className="flex flex-col gap-4 border-t border-wayfare-line p-4">
				{refundOptions.length > 0 && (
					<div className="flex flex-col gap-2">
						{refundOptions.map((option) => (
							<button
								key={option.id}
								type="button"
								disabled={claimingRefund}
								onClick={() => onClaimRefund(option)}
								className="flex w-full items-start justify-between gap-4 rounded-lg border border-wayfare-line p-3 text-left transition-colors hover:bg-wayfare-bg disabled:pointer-events-none disabled:opacity-50"
							>
								<div className="min-w-0">
									<p className="m-0 text-sm font-medium text-wayfare-text">
										{option.title}
									</p>
									{option.productName && (
										<p className="m-0 mt-0.5 text-xs text-wayfare-text-secondary">
											{option.productName}
										</p>
									)}
									{option.deadline && (
										<p className="m-0 mt-1 text-xs text-wayfare-text-secondary">
											Refundable until {formatDeadline(option.deadline)}
										</p>
									)}
								</div>
								<div className="shrink-0 text-right">
									<p className="m-0 text-sm font-semibold text-wayfare-primary">
										{formatPrice(option.refund, option.currency)} back
									</p>
									{option.fee > 0 && (
										<p className="m-0 mt-0.5 text-xs text-wayfare-text-secondary">
											after {formatPrice(option.fee, option.currency)} fee
										</p>
									)}
								</div>
							</button>
						))}
					</div>
				)}

				<button
					type="button"
					disabled={cancelling}
					onClick={onCancel}
					className="self-start rounded-lg px-1 py-1 text-sm font-medium text-wayfare-primary transition-colors hover:bg-wayfare-accent-soft disabled:pointer-events-none disabled:opacity-50"
				>
					Cancel ticket
				</button>
			</div>
		</details>
	);
}
