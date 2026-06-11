import { TravelTag } from "@entur/travel";
import { useMemo } from "react";

import { getTransportColor } from "../../lib/transport-colors";
import type {
	OtpTransportMode,
	TripLeg,
	TripPattern,
} from "../../types/trip-planner";
import { MapMarker, MarkerContent, MarkerPopup } from "./MapMarker";
import { useResolvedTheme } from "./theme";

type Transport =
	| "metro"
	| "bus"
	| "tram"
	| "train"
	| "ferry"
	| "water"
	| "air"
	| "bicycle"
	| "walk"
	| "taxi";

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

type StopKind = "origin" | "transfer" | "destination";

type Stop = {
	key: string;
	quayId: string;
	name: string;
	longitude: number;
	latitude: number;
	kind: StopKind;
	inbound: TripLeg | null;
	outbound: TripLeg | null;
	arrivalTime: string | null;
	departureTime: string | null;
};

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString("no-NO", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function buildStops(pattern: TripPattern): Stop[] {
	const transitLegs = pattern.legs.filter((l) => l.serviceJourney != null);
	if (transitLegs.length === 0) return [];

	type Raw = {
		quayId: string;
		name: string;
		longitude: number;
		latitude: number;
		inbound: TripLeg | null;
		outbound: TripLeg | null;
		arrivalTime: string | null;
		departureTime: string | null;
	};

	const raw: Raw[] = [];
	for (const leg of transitLegs) {
		const from = leg.fromPlace;
		if (
			from.quay?.id &&
			from.quay.latitude != null &&
			from.quay.longitude != null
		) {
			raw.push({
				quayId: from.quay.id,
				name: from.name,
				longitude: from.quay.longitude,
				latitude: from.quay.latitude,
				inbound: null,
				outbound: leg,
				arrivalTime: null,
				departureTime: leg.expectedStartTime,
			});
		}
		const to = leg.toPlace;
		if (to.quay?.id && to.quay.latitude != null && to.quay.longitude != null) {
			raw.push({
				quayId: to.quay.id,
				name: to.name,
				longitude: to.quay.longitude,
				latitude: to.quay.latitude,
				inbound: leg,
				outbound: null,
				arrivalTime: leg.expectedEndTime,
				departureTime: null,
			});
		}
	}

	const merged: Raw[] = [];
	for (const p of raw) {
		const last = merged[merged.length - 1];
		if (last && last.quayId === p.quayId) {
			merged[merged.length - 1] = {
				...last,
				inbound: last.inbound ?? p.inbound,
				outbound: p.outbound ?? last.outbound,
				arrivalTime: last.arrivalTime ?? p.arrivalTime,
				departureTime: p.departureTime ?? last.departureTime,
			};
		} else {
			merged.push(p);
		}
	}

	return merged.map((r, index) => {
		const kind: StopKind =
			index === 0
				? "origin"
				: index === merged.length - 1
					? "destination"
					: "transfer";
		return { ...r, kind, key: `${index}-${r.quayId}` };
	});
}

function stopMode(stop: Stop): OtpTransportMode | null {
	return stop.outbound?.mode ?? stop.inbound?.mode ?? null;
}

function StopDot({ color, kind }: { color: string; kind: StopKind }) {
	const size = kind === "transfer" ? "h-3 w-3" : "h-4 w-4";
	return (
		<div
			className={`${size} rounded-full border-2 border-white shadow-md ring-1 ring-black/10`}
			style={{ backgroundColor: color }}
		/>
	);
}

function LegRow({ leg, timeLabel }: { leg: TripLeg; timeLabel: string }) {
	const transport = MODE_TO_TRANSPORT[leg.mode];
	const publicCode = leg.line?.publicCode ?? leg.line?.name ?? "";
	return (
		<div className="flex items-center gap-1.5">
			{transport && (
				<TravelTag transport={transport}>{publicCode || "—"}</TravelTag>
			)}
			<span className="tabular-nums text-xs text-wayfare-text-secondary">
				{timeLabel}
			</span>
		</div>
	);
}

function StopPopup({ stop }: { stop: Stop }) {
	return (
		<div className="flex min-w-44 flex-col gap-2">
			<div>
				<p className="m-0 text-[10px] uppercase tracking-wide text-wayfare-text-secondary">
					{stop.kind === "origin"
						? "Departure"
						: stop.kind === "destination"
							? "Arrival"
							: "Transfer"}
				</p>
				<p className="m-0 text-sm font-semibold text-wayfare-text">
					{stop.name}
				</p>
			</div>
			{stop.inbound && stop.arrivalTime && (
				<LegRow
					leg={stop.inbound}
					timeLabel={`Arrives ${formatTime(stop.arrivalTime)}`}
				/>
			)}
			{stop.outbound && stop.departureTime && (
				<LegRow
					leg={stop.outbound}
					timeLabel={`Departs ${formatTime(stop.departureTime)}`}
				/>
			)}
		</div>
	);
}

function JourneyStopMarkers({ pattern }: { pattern: TripPattern }) {
	const theme = useResolvedTheme();
	const stops = useMemo(() => buildStops(pattern), [pattern]);

	return (
		<>
			{stops.map((stop) => {
				const mode = stopMode(stop);
				const color = mode ? getTransportColor(mode, theme) : "#4285F4";
				return (
					<MapMarker
						key={stop.key}
						longitude={stop.longitude}
						latitude={stop.latitude}
					>
						<MarkerContent>
							<StopDot color={color} kind={stop.kind} />
						</MarkerContent>
						<MarkerPopup openOnHover offset={12}>
							<StopPopup stop={stop} />
						</MarkerPopup>
					</MapMarker>
				);
			})}
		</>
	);
}

export { JourneyStopMarkers };
