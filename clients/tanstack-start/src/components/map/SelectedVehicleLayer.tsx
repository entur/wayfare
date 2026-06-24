import MapLibreGL from "maplibre-gl";
import { useEffect, useId, useMemo, useState } from "react";

function projectPointOnSegment(
	p: [number, number],
	a: [number, number],
	b: [number, number],
): [number, number] {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const len2 = dx * dx + dy * dy;
	if (len2 === 0) return a;
	const t = Math.max(
		0,
		Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2),
	);
	return [a[0] + t * dx, a[1] + t * dy];
}

function snapToPolyline(
	point: [number, number],
	polyline: [number, number][],
): [number, number] {
	let best: [number, number] = point;
	let minDist = Infinity;
	for (let i = 0; i < polyline.length - 1; i++) {
		const proj = projectPointOnSegment(point, polyline[i], polyline[i + 1]);
		const d = (proj[0] - point[0]) ** 2 + (proj[1] - point[1]) ** 2;
		if (d < minDist) {
			minDist = d;
			best = proj;
		}
	}
	return best;
}

import { useServiceJourneyRoute } from "../../hooks/use-service-journey-route";
import { useVehiclePosition } from "../../hooks/use-vehicle-position";
import { decodePolyline } from "../../lib/polyline";
import { getTransportColor } from "../../lib/transport-colors";
import type { OtpTransportMode } from "../../types/trip-planner";
import { useMap } from "./context";
import { MapMarker, MarkerContent, MarkerTooltip } from "./MapMarker";
import { MapRoute } from "./MapRoute";
import { useResolvedTheme } from "./theme";

interface Props {
	serviceJourneyId: string;
	mode: OtpTransportMode;
	lineName?: string;
}

function formatDelay(seconds: number | null | undefined): string {
	if (seconds == null || seconds === 0) return "On time";
	const mins = Math.round(Math.abs(seconds) / 60);
	return seconds > 0 ? `${mins} min late` : `${mins} min early`;
}

function formatUpdatedAgo(iso: string): string {
	const diffMs = Date.now() - new Date(iso).getTime();
	const secs = Math.round(diffMs / 1000);
	if (secs < 60) return `${secs}s ago`;
	return `${Math.round(secs / 60)}m ago`;
}

function VehicleIcon({ color }: { color: string }) {
	return (
		<svg
			aria-hidden="true"
			width="28"
			height="28"
			viewBox="0 0 28 28"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="14"
				cy="14"
				r="13"
				fill={color}
				stroke="white"
				strokeWidth="2.5"
			/>
			{/* Arrow pointing north (up). MapMarker rotation prop handles bearing. */}
			<path d="M14 7L19.5 20L14 17L8.5 20L14 7Z" fill="white" />
		</svg>
	);
}

export function SelectedVehicleLayer({
	serviceJourneyId,
	mode,
	lineName,
}: Props) {
	const { map, isLoaded } = useMap();
	const theme = useResolvedTheme();
	const uid = useId();
	const stopSourceId = `vehicle-stops-src-${uid}`;
	const stopLayerId = `vehicle-stops-${uid}`;

	const route = useServiceJourneyRoute(serviceJourneyId);
	const position = useVehiclePosition(serviceJourneyId);

	const [hasFit, setHasFit] = useState(false);

	const color = getTransportColor(mode, theme);

	const coordinates = useMemo(() => {
		if (!route.data?.points) return null;
		return decodePolyline(route.data.points);
	}, [route.data?.points]);

	// Fit bounds once when route first loads
	useEffect(() => {
		if (!isLoaded || !map || !coordinates || hasFit || coordinates.length < 2)
			return;
		const bounds = new MapLibreGL.LngLatBounds(coordinates[0], coordinates[0]);
		for (const coord of coordinates) bounds.extend(coord);
		map.fitBounds(bounds, { padding: 64, duration: 600 });
		setHasFit(true);
	}, [isLoaded, map, coordinates, hasFit]);

	// Add stop circle layer on mount; clean up on unmount
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;

		map.addSource(stopSourceId, {
			type: "geojson",
			data: { type: "FeatureCollection", features: [] },
		});

		map.addLayer({
			id: stopLayerId,
			type: "circle",
			source: stopSourceId,
			paint: {
				"circle-radius": 5,
				"circle-color": "#ffffff",
				"circle-stroke-width": 2,
				"circle-stroke-color": color,
			},
		});

		return () => {
			try {
				if (map.getLayer(stopLayerId)) map.removeLayer(stopLayerId);
				if (map.getSource(stopSourceId)) map.removeSource(stopSourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map]);

	// Update stop source data when route loads; snap stop coords to the polyline
	useEffect(() => {
		if (!isLoaded || !map) return;
		const source = map.getSource(stopSourceId) as
			| MapLibreGL.GeoJSONSource
			| undefined;
		if (!source) return;
		const stops = route.data?.stops ?? [];
		const features: GeoJSON.Feature<GeoJSON.Point>[] = stops.map((stop, i) => {
			const raw: [number, number] = [stop.longitude, stop.latitude];
			const snapped =
				coordinates && coordinates.length >= 2
					? snapToPolyline(raw, coordinates)
					: raw;
			return {
				type: "Feature",
				id: i,
				geometry: { type: "Point", coordinates: snapped },
				properties: { name: stop.name },
			};
		});
		source.setData({ type: "FeatureCollection", features });
	}, [isLoaded, map, route.data?.stops, stopSourceId, coordinates]);

	// Keep stop stroke color in sync with theme
	useEffect(() => {
		if (!isLoaded || !map) return;
		if (!map.getLayer(stopLayerId)) return;
		map.setPaintProperty(stopLayerId, "circle-stroke-color", color);
	}, [isLoaded, map, stopLayerId, color]);

	const vehicle = position.data;

	return (
		<>
			{coordinates && coordinates.length >= 2 && (
				<MapRoute
					id={`vehicle-route-${uid}`}
					coordinates={coordinates}
					color={color}
					width={5}
					opacity={0.9}
					interactive={false}
					beforeId={stopLayerId}
				/>
			)}
			{vehicle && (
				<MapMarker
					longitude={vehicle.longitude}
					latitude={vehicle.latitude}
					rotation={vehicle.bearing ?? 0}
					rotationAlignment="map"
					anchor="center"
				>
					<MarkerContent>
						<VehicleIcon color={color} />
					</MarkerContent>
					<MarkerTooltip>
						<div className="flex flex-col gap-0.5">
							{lineName && <span className="font-semibold">{lineName}</span>}
							<span>{formatDelay(vehicle.delay)}</span>
							<span className="text-[10px] opacity-75">
								Updated {formatUpdatedAgo(vehicle.lastUpdated)}
							</span>
						</div>
					</MarkerTooltip>
				</MapMarker>
			)}
		</>
	);
}
