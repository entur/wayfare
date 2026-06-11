import { TravelTag } from "@entur/travel";
import { useMemo } from "react";

import { decodePolyline } from "../../lib/polyline";
import type { OtpTransportMode, TripPattern } from "../../types/trip-planner";
import { MapMarker, MarkerContent } from "./MapMarker";

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

type LegLabel = {
	key: string;
	longitude: number;
	latitude: number;
	transport: Transport;
	publicCode: string;
};

function midpointAlongLine(
	coords: [number, number][],
): [number, number] | null {
	if (coords.length < 2) return null;
	let total = 0;
	const segLengths: number[] = [];
	for (let i = 1; i < coords.length; i++) {
		const dx = coords[i][0] - coords[i - 1][0];
		const dy = coords[i][1] - coords[i - 1][1];
		const len = Math.hypot(dx, dy);
		segLengths.push(len);
		total += len;
	}
	if (total === 0) return coords[0];
	const half = total / 2;
	let acc = 0;
	for (let i = 0; i < segLengths.length; i++) {
		if (acc + segLengths[i] >= half) {
			const remain = half - acc;
			const t = segLengths[i] === 0 ? 0 : remain / segLengths[i];
			const a = coords[i];
			const b = coords[i + 1];
			return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
		}
		acc += segLengths[i];
	}
	return coords[coords.length - 1];
}

function JourneyLegLabels({ pattern }: { pattern: TripPattern }) {
	const labels = useMemo<LegLabel[]>(() => {
		const out: LegLabel[] = [];
		pattern.legs.forEach((leg, index) => {
			if (leg.serviceJourney == null) return;
			const transport = MODE_TO_TRANSPORT[leg.mode];
			if (!transport) return;

			let coords: [number, number][] = [];
			if (leg.pointsOnLink?.points) {
				coords = decodePolyline(leg.pointsOnLink.points);
			} else {
				const from = leg.fromPlace.quay;
				const to = leg.toPlace.quay;
				if (
					from?.longitude != null &&
					from?.latitude != null &&
					to?.longitude != null &&
					to?.latitude != null
				) {
					coords = [
						[from.longitude, from.latitude],
						[to.longitude, to.latitude],
					];
				}
			}

			const mid = midpointAlongLine(coords);
			if (!mid) return;

			const publicCode = leg.line?.publicCode ?? leg.line?.name ?? "";
			out.push({
				key: `${index}-${leg.serviceJourney.id}`,
				longitude: mid[0],
				latitude: mid[1],
				transport,
				publicCode: publicCode || "—",
			});
		});
		return out;
	}, [pattern]);

	return (
		<>
			{labels.map((label) => (
				<MapMarker
					key={label.key}
					longitude={label.longitude}
					latitude={label.latitude}
				>
					<MarkerContent className="cursor-default">
						<div className="pointer-events-none drop-shadow-md">
							<TravelTag transport={label.transport}>
								{label.publicCode}
							</TravelTag>
						</div>
					</MarkerContent>
				</MapMarker>
			))}
		</>
	);
}

export { JourneyLegLabels };
