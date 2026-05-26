import {
	AtBIcon,
	BrakarIcon,
	FlybussenIcon,
	KolumbusIcon,
	LogoPositiveIcon,
	ReisNordlandIcon,
	RuterIcon,
	SJIcon,
	SkyssIcon,
	SvipperIcon,
	ValidTicketIcon,
	VyIcon,
} from "@entur/icons";
import { Link } from "@tanstack/react-router";
import type { FC, SVGProps } from "react";
import { usePackageItem, useTravelDocuments } from "../../hooks/use-documents";
import type {
	StoredPackage,
	TravelDocumentProperties,
} from "../../types/documents";

interface TicketCardProps {
	pkg: StoredPackage;
}

type IconComponent = FC<
	{ size?: string; className?: string } & SVGProps<SVGElement>
>;

interface OperatorConfig {
	icon: IconComponent;
	color: string;
	darkIcon?: boolean;
}

const OPERATORS: Record<string, OperatorConfig> = {
	RUT: { icon: RuterIcon, color: "#e60000" }, // Ruter red
	ATB: { icon: AtBIcon, color: "#3d474f" }, // AtB dark grey
	SKY: { icon: SkyssIcon, color: "#E34C2A" }, // Skyss orange-red
	VYG: { icon: VyIcon, color: "#1B4332" }, // Vy dark green
	SJT: { icon: SJIcon, color: "#2e3649" }, // SJ dark navy
	BRA: { icon: BrakarIcon, color: "#fbde3c", darkIcon: true }, // Brakar yellow
	KOL: { icon: KolumbusIcon, color: "#5BAD00" }, // Kolumbus green
	NOR: { icon: ReisNordlandIcon, color: "#0083a5" }, // Reis Nordland teal
	TFK: { icon: SvipperIcon, color: "#e95e1b" }, // Svipper/Troms orange
	FLY: { icon: FlybussenIcon, color: "#fd2e5e" }, // Flybussen pink-red
	ENT: { icon: LogoPositiveIcon, color: "#181C56" }, // Entur navy
};

function getOperatorConfig(productId?: string): OperatorConfig | null {
	if (!productId) return null;
	const code = productId.split(":")[0].toUpperCase();
	return OPERATORS[code] ?? null;
}

function formatFareZone(zone: string): string {
	const suffix = zone.split(":").at(-1);
	return suffix ? `Zone ${suffix}` : zone;
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

function badgeClass(status: string): string {
	switch (status) {
		case "CONFIRMED":
			return "bg-[rgba(0,160,80,0.1)] text-[#006630]";
		case "EXPIRED":
			return "bg-[rgba(0,0,0,0.06)] text-wayfare-text-secondary";
		case "CANCELLED":
		case "REFUNDED":
			return "bg-[rgba(200,0,0,0.08)] text-[#a00]";
		default:
			return "bg-wayfare-accent-soft text-wayfare-primary";
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

export default function TicketCard({ pkg }: TicketCardProps) {
	const { data: item, isLoading } = usePackageItem(pkg.packageId);
	const { data: docs } = useTravelDocuments(pkg.packageId);
	const props = item?.properties;

	if (isLoading) {
		return (
			<div className="animate-pulse rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 shrink-0 rounded-lg bg-wayfare-line" />
					<div className="flex-1 space-y-2">
						<div className="flex items-center justify-between gap-2">
							<div className="h-4 w-36 rounded bg-wayfare-line" />
							<div className="h-5 w-20 rounded-full bg-wayfare-line" />
						</div>
						<div className="h-3 w-28 rounded bg-wayfare-line" />
						<div className="flex items-center justify-between gap-2">
							<div className="h-3 w-32 rounded bg-wayfare-line" />
							<div className="h-3 w-16 rounded bg-wayfare-line" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	const firstOffer = item?.offers?.[0]?.properties;
	const firstProduct = firstOffer?.products?.[0];
	const productName = firstProduct?.productName;
	const productId = firstProduct?.productId?.productId;

	const operator = getOperatorConfig(productId);
	const OperatorIcon = operator?.icon ?? ValidTicketIcon;
	const iconBg = operator?.color ?? undefined;

	const fareZones =
		firstOffer?.summary?.geographicalValidity?.zonalValidity?.fareZones ?? [];
	const fallbackZones =
		firstOffer?.summary?.geographicalValidity?.zonalValidity?.zones ?? [];
	const activeZones = fareZones.length > 0 ? fareZones : fallbackZones;

	const from = props?.from?.name;
	const to = props?.to?.name;

	const validityLine =
		activeZones.length > 0
			? activeZones.map(formatFareZone).join(", ")
			: from && to
				? `${from} → ${to}`
				: null;

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

	const title = productName ?? (from && to ? `${from} → ${to}` : pkg.packageId);
	const isFallbackId = !productName && !from && !to;

	return (
		<Link
			to="/tickets/$packageId"
			params={{ packageId: pkg.packageId }}
			className="block rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4 no-underline transition-opacity hover:opacity-80"
		>
			<div className="flex items-center gap-3">
				<div
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
					style={{ background: iconBg ?? "var(--color-wayfare-bg)" }}
				>
					<OperatorIcon
						size="22"
						aria-hidden="true"
						className={
							operator
								? operator.darkIcon
									? "text-wayfare-text"
									: "text-white"
								: "text-wayfare-text"
						}
					/>
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<p
							className={`m-0 truncate text-sm font-semibold text-wayfare-text ${isFallbackId ? "font-mono" : ""}`}
						>
							{title}
						</p>
						<span
							className={`shrink-0 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass(displayStatus)}`}
						>
							{displayStatus}
						</span>
					</div>

					{validityLine && (
						<p className="m-0 mt-0.5 truncate text-xs text-wayfare-text-secondary">
							{validityLine}
						</p>
					)}

					<div className="mt-0.5 flex items-center justify-between gap-2">
						<p className="m-0 truncate text-xs text-wayfare-text-secondary">
							{dateLabel}
						</p>
						<p className="m-0 shrink-0 text-sm font-bold text-wayfare-primary">
							{pkg.price.currencyCode ?? "NOK"} {pkg.price.amount.toFixed(2)}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
}
