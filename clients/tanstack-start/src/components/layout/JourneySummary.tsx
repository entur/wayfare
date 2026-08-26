import {
	ClockIcon,
	DateIcon,
	DestinationIcon,
	MapPinIcon,
	RouteIcon,
	UsersIcon,
	ValidTicketIcon,
} from "@entur/icons";
import { formatDuration } from "../../lib/format-duration";
import { formatPrice } from "../../lib/format-price";

interface TicketRow {
	name: string;
	quantity: number;
	category?: string;
	segment?: string;
	price: { amount: number; currencyCode?: string | null };
}

interface AddOnRow {
	name: string;
	quantity: number;
	price: { amount: number; currencyCode?: string | null };
}

interface JourneySummaryProps {
	from: string;
	to: string;
	startTime: string;
	endTime?: string;
	durationSeconds?: number;
	partyLabel?: string;
	ticketRows?: TicketRow[];
	addOnRows?: AddOnRow[];
	total?: { amount: number; currencyCode?: string | null };
	onChangeJourney?: () => void;
	detailsSlot?: React.ReactNode;
	formattedDate?: string;
	variant?: "rail" | "bar";
}

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString("no-NO", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

export function JourneySummary({
	from,
	to,
	startTime,
	endTime,
	durationSeconds,
	partyLabel,
	ticketRows,
	addOnRows,
	total,
	onChangeJourney,
	detailsSlot,
	formattedDate,
	variant = "rail",
}: JourneySummaryProps) {
	const dateStr = formattedDate ?? formatDate(startTime);

	if (variant === "bar") {
		return (
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-4 py-3">
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
					<span className="flex items-center gap-1.5 font-semibold text-wayfare-text">
						<MapPinIcon aria-hidden="true" />
						{from}
						<span className="mx-0.5 font-normal text-wayfare-text-secondary">
							→
						</span>
						<DestinationIcon aria-hidden="true" />
						{to}
					</span>
					<span className="flex items-center gap-1 text-wayfare-text-secondary">
						<DateIcon aria-hidden="true" />
						{dateStr}
					</span>
					{partyLabel && (
						<span className="flex items-center gap-1 text-wayfare-text-secondary">
							<UsersIcon aria-hidden="true" />
							{partyLabel}
						</span>
					)}
					{durationSeconds != null && (
						<span className="flex items-center gap-1 text-wayfare-text-secondary">
							<ClockIcon aria-hidden="true" />
							{formatDuration(durationSeconds)}
						</span>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
			<div className="mb-3 flex items-center justify-between gap-2">
				<span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					<RouteIcon aria-hidden="true" />
					Journey
				</span>
				{onChangeJourney && (
					<button
						type="button"
						onClick={onChangeJourney}
						className="text-xs text-wayfare-primary hover:underline"
					>
						Change journey
					</button>
				)}
			</div>

			<div className="flex items-center gap-2">
				<MapPinIcon
					className="shrink-0 text-wayfare-text-secondary"
					aria-hidden="true"
				/>
				<span className="min-w-[2.75rem] font-mono text-sm font-bold tabular-nums text-wayfare-text">
					{formatTime(startTime)}
				</span>
				<span className="truncate text-sm text-wayfare-text">{from}</span>
			</div>

			{endTime && (
				<div className="mt-1 flex items-center gap-2">
					<DestinationIcon
						className="shrink-0 text-wayfare-text-secondary"
						aria-hidden="true"
					/>
					<span className="min-w-[2.75rem] font-mono text-sm font-bold tabular-nums text-wayfare-text">
						{formatTime(endTime)}
					</span>
					<span className="truncate text-sm text-wayfare-text">{to}</span>
				</div>
			)}

			<div className="mt-3 flex flex-col gap-1">
				<span className="flex items-center gap-1.5 text-xs text-wayfare-text-secondary">
					<DateIcon aria-hidden="true" />
					{dateStr}
				</span>
				{partyLabel && (
					<span className="flex items-center gap-1.5 text-xs text-wayfare-text-secondary">
						<UsersIcon aria-hidden="true" />
						{partyLabel}
					</span>
				)}
				{durationSeconds != null && (
					<span className="flex items-center gap-1.5 text-xs text-wayfare-text-secondary">
						<ClockIcon aria-hidden="true" />
						{formatDuration(durationSeconds)}
					</span>
				)}
			</div>

			{detailsSlot && <div className="mt-3">{detailsSlot}</div>}

			{addOnRows && addOnRows.length > 0 && (
				<div className="mt-3 flex flex-col gap-1 border-t border-wayfare-line pt-3">
					<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
						Add-ons
					</p>
					{addOnRows.map((row, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: add-on rows are stable
							key={i}
							className="flex items-center justify-between gap-2 text-xs text-wayfare-text-secondary"
						>
							<span>
								{row.name}
								{row.quantity > 1 && (
									<span className="ml-1">× {row.quantity}</span>
								)}
							</span>
							<span className="shrink-0">
								{formatPrice(row.price.amount, row.price.currencyCode ?? "NOK")}
							</span>
						</div>
					))}
				</div>
			)}

			{ticketRows && ticketRows.length > 0 && (
				<>
					<div className="my-3 h-px bg-wayfare-line" />
					<p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
						<ValidTicketIcon aria-hidden="true" />
						Ticket
					</p>
					<div className="flex flex-col gap-2">
						{ticketRows.map((row, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: ticket rows are stable
							<div key={i} className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="m-0 truncate text-sm text-wayfare-text">
										{row.name}
									</p>
									{row.quantity > 0 && (
										<p className="m-0 text-xs text-wayfare-text-secondary">
											{row.quantity}{" "}
											{row.category ??
												(row.quantity === 1 ? "traveller" : "travellers")}
											{row.segment ? ` · ${row.segment}` : ""}
										</p>
									)}
								</div>
								<span className="shrink-0 text-sm text-wayfare-text">
									{formatPrice(
										row.price.amount,
										row.price.currencyCode ?? "NOK",
									)}
								</span>
							</div>
						))}
					</div>
					{total && (
						<div className="mt-3 flex items-center justify-between border-t border-wayfare-line pt-3">
							<span className="text-sm font-semibold text-wayfare-text">
								Price total
							</span>
							<span className="text-base font-bold text-wayfare-primary">
								{formatPrice(total.amount, total.currencyCode ?? "NOK")}
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
}
