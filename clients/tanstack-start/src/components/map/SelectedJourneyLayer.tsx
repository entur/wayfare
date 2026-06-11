import MapLibreGL from "maplibre-gl";
import { useEffect, useMemo } from "react";

import { decodePolyline } from "../../lib/polyline";
import { getTransportColor } from "../../lib/transport-colors";
import type { TripPattern } from "../../types/trip-planner";
import { useMap } from "./context";
import { MapRoute } from "./MapRoute";
import { useResolvedTheme } from "./theme";

type SelectedJourneyLayerProps = {
	pattern: TripPattern;
	onLegClick?: (legIndex: number) => void;
	/** Auto-fit the map to the journey bounds on mount (default: true). */
	fitBounds?: boolean;
	/** Padding (px) when fitting bounds. */
	fitPadding?: number;
};

function SelectedJourneyLayer({
	pattern,
	onLegClick,
	fitBounds = true,
	fitPadding = 48,
}: SelectedJourneyLayerProps) {
	const { map, isLoaded } = useMap();
	const theme = useResolvedTheme();
	const legs = useMemo(() => {
		return pattern.legs.map((leg, index) => {
			let coordinates: [number, number][] = [];
			if (leg.pointsOnLink?.points) {
				coordinates = decodePolyline(leg.pointsOnLink.points);
			} else {
				const from = leg.fromPlace.quay;
				const to = leg.toPlace.quay;
				if (
					from?.latitude != null &&
					from?.longitude != null &&
					to?.latitude != null &&
					to?.longitude != null
				) {
					coordinates = [
						[from.longitude, from.latitude],
						[to.longitude, to.latitude],
					];
				}
			}
			return { index, leg, coordinates };
		});
	}, [pattern]);

	useEffect(() => {
		if (!fitBounds || !isLoaded || !map) return;
		const allCoords = legs.flatMap((l) => l.coordinates);
		if (allCoords.length < 2) return;
		const bounds = new MapLibreGL.LngLatBounds(allCoords[0], allCoords[0]);
		for (const coord of allCoords) bounds.extend(coord);
		map.fitBounds(bounds, { padding: fitPadding, duration: 600 });
	}, [fitBounds, fitPadding, isLoaded, map, legs]);

	return (
		<>
			{legs.map(({ index, leg, coordinates }) => {
				if (coordinates.length < 2) return null;
				const isFoot = leg.mode === "foot";
				return (
					<MapRoute
						key={`${index}-${leg.serviceJourney?.id ?? leg.mode}`}
						id={`selected-journey-leg-${index}`}
						coordinates={coordinates}
						color={getTransportColor(leg.mode, theme)}
						width={isFoot ? 3 : 5}
						opacity={0.9}
						dashArray={isFoot ? [2, 2] : undefined}
						onClick={onLegClick ? () => onLegClick(index) : undefined}
					/>
				);
			})}
		</>
	);
}

export { SelectedJourneyLayer };
