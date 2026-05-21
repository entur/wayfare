import { Link } from "@tanstack/react-router";
import type React from "react";
import { usePackageItem, useTravelDocuments } from "../../hooks/use-documents";
import type {
	StoredPackage,
	TravelDocumentProperties,
} from "../../types/documents";

interface TicketCardProps {
	pkg: StoredPackage;
}

function formatJourneyTime(start: Date, end: Date | null): string {
	const dateStr = start.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
	const startTime = start.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	if (!end) return `${dateStr} · ${startTime}`;

	const endTime = end.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});

	if (start.toDateString() === end.toDateString()) {
		return `${dateStr} · ${startTime}–${endTime}`;
	}

	const endDateStr = end.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
	});
	return `${dateStr} ${startTime} – ${endDateStr} ${endTime}`;
}

function badgeStyle(status: string): React.CSSProperties {
	switch (status) {
		case "CONFIRMED":
			return { background: "rgba(0,160,80,0.1)", color: "#006630" };
		case "EXPIRED":
			return {
				background: "rgba(0,0,0,0.06)",
				color: "var(--wayfare-text-secondary)",
			};
		case "CANCELLED":
		case "REFUNDED":
			return { background: "rgba(200,0,0,0.08)", color: "#a00" };
		default:
			return {
				background: "var(--wayfare-accent-soft)",
				color: "var(--wayfare-primary)",
			};
	}
}

function isDocExpired(
	props: TravelDocumentProperties | undefined,
	now: Date,
): boolean {
	if (!props) return false;
	if (props.type === "binary_ticket" && props.status === "EXPIRED") return true;
	return new Date(props.endvalidity) < now;
}

const cardStyle = {
	background: "var(--wayfare-surface-strong)",
	border: "1px solid var(--wayfare-line)",
};

export default function TicketCard({ pkg }: TicketCardProps) {
	const { data: item, isLoading } = usePackageItem(pkg.packageId);
	const { data: docs } = useTravelDocuments(pkg.packageId);
	const props = item?.properties;

	if (isLoading) {
		return (
			<div className="animate-pulse rounded-xl p-4" style={cardStyle}>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<div
							className="h-4 w-36 rounded"
							style={{ background: "var(--wayfare-line)" }}
						/>
						<div
							className="h-3 w-28 rounded"
							style={{ background: "var(--wayfare-line)" }}
						/>
					</div>
					<div className="flex flex-col items-end gap-2">
						<div
							className="h-4 w-16 rounded"
							style={{ background: "var(--wayfare-line)" }}
						/>
						<div
							className="h-5 w-20 rounded-full"
							style={{ background: "var(--wayfare-line)" }}
						/>
					</div>
				</div>
			</div>
		);
	}

	const from = props?.from?.name;
	const to = props?.to?.name;

	const firstDoc = docs?.travelDocuments?.[0]?.properties;
	const startTime = props?.startTime
		? new Date(props.startTime)
		: firstDoc?.startvalidity
			? new Date(firstDoc.startvalidity)
			: null;
	const endTime = props?.endTime
		? new Date(props.endTime)
		: firstDoc?.endvalidity
			? new Date(firstDoc.endvalidity)
			: null;

	const now = new Date();
	const travelDocs = docs?.travelDocuments ?? [];
	const allDocsExpired =
		travelDocs.length > 0 &&
		travelDocs.every((doc) => isDocExpired(doc.properties, now));
	const isExpired = (endTime !== null && endTime < now) || allDocsExpired;
	const baseStatus = item?.status ?? props?.status ?? pkg.status;
	const displayStatus =
		isExpired && baseStatus === "CONFIRMED" ? "EXPIRED" : baseStatus;

	const dateLabel = startTime
		? formatJourneyTime(startTime, endTime)
		: `Purchased ${new Date(pkg.savedAt).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
			})}`;

	return (
		<Link
			to="/tickets/$packageId"
			params={{ packageId: pkg.packageId }}
			className="block rounded-xl p-4 no-underline transition-opacity hover:opacity-80"
			style={cardStyle}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1">
					{from && to ? (
						<p
							className="truncate text-sm font-semibold"
							style={{ color: "var(--wayfare-text)", margin: 0 }}
						>
							{from} → {to}
						</p>
					) : (
						<p
							className="font-mono text-sm font-semibold"
							style={{ color: "var(--wayfare-text)", margin: 0 }}
						>
							{pkg.packageId}
						</p>
					)}
					<p
						className="mt-1 text-xs"
						style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
					>
						{dateLabel}
					</p>
				</div>
				<div className="shrink-0 text-right">
					<p
						className="text-sm font-bold"
						style={{ color: "var(--wayfare-primary)", margin: 0 }}
					>
						{pkg.price.currencyCode ?? "NOK"} {pkg.price.amount.toFixed(2)}
					</p>
					<span
						className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
						style={badgeStyle(displayStatus)}
					>
						{displayStatus}
					</span>
				</div>
			</div>
		</Link>
	);
}
