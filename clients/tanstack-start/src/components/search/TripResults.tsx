import { ClockIcon, DestinationIcon, ValidTicketIcon } from "@entur/icons";
import { TravelTag } from "@entur/travel";
import React, { useEffect, useRef, useState } from "react";
import type { TravelerGroup } from "../../context/search-form";
import { formatPrice } from "../../lib/format-price";
import type { OfferPreview } from "../../lib/offer-query";
import type {
	OtpTransportMode,
	TripLeg,
	TripPattern,
} from "../../types/trip-planner";
import Spinner from "../ui/Spinner";

type Transport =
	| "metro"
	| "bus"
	| "plane"
	| "helicopter"
	| "tram"
	| "funicular"
	| "cableway"
	| "taxi"
	| "bicycle"
	| "walk"
	| "train"
	| "ferry"
	| "carferry"
	| "mobility"
	| "airportLinkBus"
	| "airportLinkRail"
	| "snowcoach"
	| "rail"
	| "water"
	| "air"
	| "none";

const MODE_TO_TRANSPORT: Partial<Record<OtpTransportMode, Transport>> = {
	bus: "bus",
	coach: "bus",
	rail: "train",
	tram: "tram",
	metro: "metro",
	water: "water",
	ferry: "ferry",
	air: "air",
	bicycle: "bicycle",
	car: "taxi",
	foot: "walk",
};

// Minimum horizontal space consumed by one connector (mx-1 margins + min-w-[1rem] line)
const CONNECTOR_MIN_W = 24;
// Width of the destination box (w-8)
const DEST_W = 32;
// Approximate width of the "+N" overflow badge (px-2 padding + text)
const OVERFLOW_BADGE_W = 40;

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString("no-NO", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function formatDuration(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function hasTransitLegs(pattern: TripPattern): boolean {
	return pattern.legs.some((l) => l.serviceJourney != null);
}

function getLegKey(leg: TripLeg): string {
	return `${leg.serviceJourney?.id ?? leg.mode}-${leg.expectedStartTime}-${leg.expectedEndTime}`;
}

function getPatternKey(pattern: TripPattern): string {
	return [
		pattern.expectedStartTime,
		pattern.expectedEndTime,
		...pattern.legs.map((leg) => getLegKey(leg)),
	].join("|");
}

function totalTravelers(travelers: TravelerGroup[]): number {
	return travelers.reduce((sum, t) => sum + t.count, 0);
}

function TransitLegPill({ leg }: { leg: TripLeg }) {
	const transport = MODE_TO_TRANSPORT[leg.mode];
	if (!transport) return null;
	const publicCode = leg.line?.publicCode;
	const destination = leg.toPlace.name;
	const shortLabel = publicCode ?? destination;
	const fullLabel = publicCode ? `${publicCode} ${destination}` : destination;
	return (
		<>
			<span className="lg:hidden">
				<TravelTag transport={transport}>{shortLabel}</TravelTag>
			</span>
			<span className="hidden lg:block">
				<TravelTag transport={transport}>{fullLabel}</TravelTag>
			</span>
		</>
	);
}

function LegTimeline({ legs, endTime }: { legs: TripLeg[]; endTime: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const shadowRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(legs.length);

	useEffect(() => {
		const container = containerRef.current;
		const shadow = shadowRef.current;
		if (!container || !shadow) return;

		function recalculate() {
			if (!container || !shadow) return;
			const available = container.clientWidth;
			const pillEls = shadow.querySelectorAll<HTMLElement>("[data-pill]");
			const pillWidths = Array.from(pillEls).map((el) => el.offsetWidth);

			for (let n = legs.length; n >= 1; n--) {
				const showOverflow = n < legs.length;
				const total =
					pillWidths
						.slice(0, n)
						.reduce((sum, w) => sum + w + CONNECTOR_MIN_W, 0) +
					(showOverflow ? OVERFLOW_BADGE_W + CONNECTOR_MIN_W : 0) +
					DEST_W;
				if (total <= available) {
					setVisibleCount(n);
					return;
				}
			}
			setVisibleCount(1);
		}

		recalculate();
		const ro = new ResizeObserver(recalculate);
		ro.observe(container);
		return () => ro.disconnect();
	}, [legs]);

	const visibleLegs = legs.slice(0, visibleCount);
	const overflowCount = legs.length - visibleCount;

	return (
		<div className="relative mb-3">
			{/* Hidden shadow row — renders all pills to measure their widths */}
			<div
				ref={shadowRef}
				className="pointer-events-none invisible absolute flex"
				aria-hidden="true"
			>
				{legs.map((leg) => (
					<div key={getLegKey(leg)} data-pill className="shrink-0">
						<TransitLegPill leg={leg} />
					</div>
				))}
			</div>

			{/* Visible timeline */}
			<div ref={containerRef} className="flex items-start">
				{visibleLegs.map((leg) => (
					<React.Fragment key={getLegKey(leg)}>
						<div className="flex shrink-0 flex-col items-start">
							<TransitLegPill leg={leg} />
							<span className="mt-1 whitespace-nowrap text-xs tabular-nums text-wayfare-text-secondary">
								{formatTime(leg.expectedStartTime)}
							</span>
						</div>
						<div className="mx-1 mt-4 h-px min-w-4 flex-1 bg-wayfare-line" />
					</React.Fragment>
				))}

				{overflowCount > 0 && (
					<>
						<div className="flex shrink-0 flex-col items-start">
							<div className="flex h-8 items-center justify-center rounded-md border border-wayfare-line bg-wayfare-bg px-2 text-xs font-semibold text-wayfare-text-secondary">
								+{overflowCount}
							</div>
						</div>
						<div className="mx-1 mt-4 h-px min-w-4 flex-1 bg-wayfare-line" />
					</>
				)}

				<div className="flex shrink-0 flex-col items-start">
					<div className="flex h-8 w-8 items-center justify-center rounded-md border border-wayfare-line bg-wayfare-bg">
						<DestinationIcon aria-hidden="true" className="text-wayfare-text" />
					</div>
					<span className="mt-1 whitespace-nowrap text-xs tabular-nums text-wayfare-text-secondary">
						{formatTime(endTime)}
					</span>
				</div>
			</div>
		</div>
	);
}

function PriceLine({
	preview,
	travelerCount,
}: {
	preview: OfferPreview | "loading" | "empty" | "error" | undefined;
	travelerCount: number;
}) {
	return (
		<div className="flex items-center justify-between border-t border-wayfare-line pt-3">
			<div className="flex items-center gap-1.5 text-sm text-wayfare-text-secondary">
				<ValidTicketIcon
					aria-hidden="true"
					className="shrink-0 text-wayfare-text-secondary"
				/>
				{preview === "loading" ? (
					<span className="flex items-center gap-1.5">
						<Spinner size="sm" />
						Checking prices…
					</span>
				) : preview === "error" ? (
					<span>Price unavailable</span>
				) : preview === "empty" ? (
					<span>Tickets not sold</span>
				) : preview == null ? (
					<span>Select to see prices</span>
				) : preview.partial ? (
					<span>Tickets are sold for parts of the journey</span>
				) : (
					<span>
						{travelerCount} traveller{travelerCount !== 1 ? "s" : ""} from{" "}
						<strong className="text-wayfare-text">
							{formatPrice(preview.minPrice, preview.currency)}
						</strong>
					</span>
				)}
			</div>
			<span className="shrink-0 text-sm font-medium text-wayfare-primary">
				See details →
			</span>
		</div>
	);
}

interface TripResultsProps {
	patterns: TripPattern[];
	onSelect: (pattern: TripPattern) => void;
	getPreview: (
		pattern: TripPattern,
	) => OfferPreview | "loading" | "empty" | "error" | undefined;
	isSelecting: (pattern: TripPattern) => boolean;
	anySelecting: boolean;
	travelers: TravelerGroup[];
}

export default function TripResults({
	patterns,
	onSelect,
	getPreview,
	isSelecting,
	anySelecting,
	travelers,
}: TripResultsProps) {
	const transitPatterns = patterns.filter(hasTransitLegs);
	const travelerCount = totalTravelers(travelers);

	if (transitPatterns.length === 0) {
		return (
			<p className="text-center text-sm text-wayfare-text-secondary">
				No trip options found. Try a different time or route.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{transitPatterns.map((pattern) => {
				const transitLegs = pattern.legs.filter(
					(l) => l.serviceJourney != null,
				);
				const firstLeg = transitLegs[0];
				const originName = firstLeg?.fromPlace.name ?? "";
				const preview = getPreview(pattern);
				const selecting = isSelecting(pattern);
				const disabled = anySelecting;

				return (
					<button
						key={getPatternKey(pattern)}
						type="button"
						disabled={disabled}
						onClick={() => onSelect(pattern)}
						className={`w-full rounded-xl border p-4 text-left transition-all bg-wayfare-surface-strong ${
							selecting
								? "border-wayfare-primary"
								: "border-wayfare-line hover:border-wayfare-primary"
						} ${disabled && !selecting ? "opacity-50" : ""} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
					>
						{/* Row 1: origin + duration */}
						<div className="mb-3 flex items-center justify-between gap-2">
							<span className="text-sm font-bold text-wayfare-text">
								From {originName}
							</span>
							<span className="flex shrink-0 items-center gap-1 text-sm text-wayfare-text-secondary">
								<ClockIcon
									aria-hidden="true"
									className="text-wayfare-text-secondary"
								/>
								{formatDuration(pattern.duration)}
							</span>
						</div>

						{/* Row 2: responsive leg timeline */}
						<LegTimeline legs={transitLegs} endTime={pattern.expectedEndTime} />

						{/* Row 3: price + CTA */}
						{selecting ? (
							<div className="flex items-center gap-1.5 border-t border-wayfare-line pt-3 text-sm text-wayfare-text-secondary">
								<Spinner className="h-3.5 w-3.5" />
								Loading offers…
							</div>
						) : (
							<PriceLine preview={preview} travelerCount={travelerCount} />
						)}
					</button>
				);
			})}
		</div>
	);
}
