import { TravelTag } from "@entur/travel";
import {
	ClientOnly,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { Layers, MapPin, Navigation, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "@entur/travel/dist/styles.css";
import {
	MapControls,
	MapFillLayer,
	MapMarker,
	type MapRef,
	MapView,
	MarkerContent,
	MarkerLabel,
	MarkerPopup,
	useMap,
} from "../components/map";
import PlaceSearch from "../components/search/PlaceSearch";
import Button from "../components/ui/Button";
import { useSearchForm } from "../context/search-form";
import {
	getStopsInBounds,
	type MapStopPlace,
} from "../server-functions/stop-places";
import type { PlaceReference } from "../types/common";

export const Route = createFileRoute("/map")({ component: MapPage });

type PickTarget = "from" | "to";

type FareZoneProperties = {
	id: string;
	name: string;
	operator: string;
	tariffZoneId: string | null;
};

const FARE_ZONES_URL = "/fare-zones-geo.json";
const NORWAY_CENTER: [number, number] = [10.75, 59.9];
const MIN_ZOOM_FOR_STOPS = 10;

// Priority order for selecting the "primary" transport mode icon when a stop has several
const MODE_PRIORITY = ["rail", "metro", "tram", "ferry", "air", "coach", "bus"];

function primaryMode(modes: string[]): string {
	for (const m of MODE_PRIORITY) {
		if (modes.includes(m)) return m;
	}
	return modes[0] ?? "bus";
}

// Fetch stop places in the current map viewport and update on move
function useStopsInViewport() {
	const { map, isLoaded } = useMap();
	const [stops, setStops] = useState<MapStopPlace[]>([]);
	const fetchIdRef = useRef(0);

	useEffect(() => {
		if (!map || !isLoaded) return;

		async function fetchStops() {
			if (!map) return;
			if (map.getZoom() < MIN_ZOOM_FOR_STOPS) {
				setStops([]);
				return;
			}
			const bounds = map.getBounds();
			const id = ++fetchIdRef.current;
			try {
				const result = await getStopsInBounds({
					data: {
						minLat: bounds.getSouth(),
						maxLat: bounds.getNorth(),
						minLon: bounds.getWest(),
						maxLon: bounds.getEast(),
					},
				});
				if (id === fetchIdRef.current) setStops(result);
			} catch {
				// ignore transient errors
			}
		}

		let debounceTimer: ReturnType<typeof setTimeout> | null = null;
		const handleMoveEnd = () => {
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(fetchStops, 300);
		};

		map.on("moveend", handleMoveEnd);
		fetchStops();

		return () => {
			map.off("moveend", handleMoveEnd);
			if (debounceTimer) clearTimeout(debounceTimer);
			fetchIdRef.current++;
		};
	}, [map, isLoaded]);

	return stops;
}

function StopMarkers({ onSelect }: { onSelect: (stop: MapStopPlace) => void }) {
	const stops = useStopsInViewport();

	return (
		<>
			{stops.map((stop) => {
				const mode = primaryMode(stop.transportMode);
				const hasMultipleModes = stop.transportMode.length > 1;
				return (
					<MapMarker
						key={stop.id}
						longitude={stop.longitude}
						latitude={stop.latitude}
						anchor="bottom"
						onClick={() => onSelect(stop)}
					>
						<MarkerContent>
							<TravelTag
								transport={mode as never}
								className="cursor-pointer shadow-md transition-transform hover:scale-110"
								style={{ fontSize: "0.65rem", padding: "2px 4px" }}
							/>
							<MarkerLabel position="bottom">{stop.name}</MarkerLabel>
						</MarkerContent>
						{hasMultipleModes && (
							<MarkerPopup closeButton>
								<div className="flex items-center gap-1.5">
									{stop.transportMode.map((m) => (
										<TravelTag
											key={m}
											transport={m as never}
											style={{ fontSize: "0.65rem", padding: "2px 4px" }}
										/>
									))}
								</div>
							</MarkerPopup>
						)}
					</MapMarker>
				);
			})}
		</>
	);
}

function ZoneToggleButton({
	showZones,
	onToggle,
}: {
	showZones: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onToggle}
			title={showZones ? "Hide fare zones" : "Show fare zones"}
			className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors ${
				showZones
					? "border-wayfare-primary bg-wayfare-primary text-white"
					: "border-wayfare-line bg-wayfare-surface text-wayfare-text-secondary hover:bg-wayfare-bg"
			}`}
		>
			<Layers className="size-3.5" />
			Zones
		</button>
	);
}

function MapSearchOverlay({
	pickTarget,
	onPickTargetChange,
	hoveredZone,
	showZones,
	onZoneToggle,
	mapRef,
}: {
	pickTarget: PickTarget;
	onPickTargetChange: (t: PickTarget) => void;
	hoveredZone: FareZoneProperties | null;
	showZones: boolean;
	onZoneToggle: () => void;
	mapRef: React.RefObject<MapRef | null>;
}) {
	const { state, dispatch } = useSearchForm();
	const navigate = useNavigate();

	const handleFromChange = useCallback(
		(place: PlaceReference | null) => {
			dispatch({ type: "SET_FROM", payload: place });
			if (place?.coordinates) {
				mapRef.current?.flyTo({
					center: place.coordinates,
					zoom: 13,
					duration: 1000,
				});
			}
		},
		[dispatch, mapRef],
	);

	const handleToChange = useCallback(
		(place: PlaceReference | null) => {
			dispatch({ type: "SET_TO", payload: place });
			if (place?.coordinates) {
				mapRef.current?.flyTo({
					center: place.coordinates,
					zoom: 13,
					duration: 1000,
				});
			}
		},
		[dispatch, mapRef],
	);

	const canSearch = state.from !== null && state.to !== null;

	return (
		<div className="pointer-events-none absolute inset-0 z-10">
			{/* Search panel */}
			<div className="pointer-events-auto absolute top-3 left-3 w-72 rounded-xl border border-wayfare-line bg-wayfare-surface/95 p-3 shadow-lg backdrop-blur-sm">
				{/* Pick target + zone toggle row */}
				<div className="mb-2 flex items-center gap-1.5">
					<button
						type="button"
						onClick={() => onPickTargetChange("from")}
						className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
							pickTarget === "from"
								? "bg-wayfare-primary text-white"
								: "bg-wayfare-bg text-wayfare-text-secondary hover:bg-wayfare-line"
						}`}
					>
						<Navigation className="size-3" />
						From
					</button>
					<button
						type="button"
						onClick={() => onPickTargetChange("to")}
						className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
							pickTarget === "to"
								? "bg-wayfare-primary text-white"
								: "bg-wayfare-bg text-wayfare-text-secondary hover:bg-wayfare-line"
						}`}
					>
						<MapPin className="size-3" />
						To
					</button>
					<div className="ml-auto">
						<ZoneToggleButton showZones={showZones} onToggle={onZoneToggle} />
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<PlaceSearch
						label="From"
						value={state.from}
						onChange={handleFromChange}
						placeholder="Departure stop or zone"
					/>
					<PlaceSearch
						label="To"
						value={state.to}
						onChange={handleToChange}
						placeholder="Arrival stop or zone"
					/>
				</div>

				<Button
					className="mt-3 w-full"
					disabled={!canSearch}
					onClick={() => navigate({ to: "/" })}
				>
					<Search className="size-4" />
					Search tickets
				</Button>
			</div>

			{/* Hovered zone tooltip */}
			{hoveredZone && (
				<div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 rounded-md bg-wayfare-text px-3 py-1.5 text-sm font-medium text-wayfare-bg shadow-md">
					{hoveredZone.name}
					<span className="text-wayfare-bg/60 ml-1.5 text-xs font-normal">
						{hoveredZone.operator}
					</span>
				</div>
			)}
		</div>
	);
}

function ZoomHint() {
	const { map, isLoaded } = useMap();
	const [zoom, setZoom] = useState<number | null>(null);

	useEffect(() => {
		if (!map || !isLoaded) return;
		setZoom(map.getZoom());
		const update = () => setZoom(map.getZoom());
		map.on("zoom", update);
		return () => {
			map.off("zoom", update);
		};
	}, [map, isLoaded]);

	if (zoom === null || zoom >= MIN_ZOOM_FOR_STOPS) return null;

	return (
		<div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-wayfare-text/80 px-3 py-1.5 text-xs text-wayfare-bg shadow-md">
			Zoom in to see stop places
		</div>
	);
}

function MapContent() {
	const { state, dispatch } = useSearchForm();
	const mapRef = useRef<MapRef | null>(null);
	const [pickTarget, setPickTarget] = useState<PickTarget>("from");
	const [showZones, setShowZones] = useState(false);
	const [hoveredZone, setHoveredZone] = useState<FareZoneProperties | null>(
		null,
	);

	const handleZoneClick = useCallback(
		(
			feature: GeoJSON.Feature<
				GeoJSON.Polygon | GeoJSON.MultiPolygon,
				FareZoneProperties
			>,
		) => {
			const place: PlaceReference = {
				placeId: feature.properties.id,
				name: feature.properties.name,
				type: "zone",
			};
			if (pickTarget === "from") {
				dispatch({ type: "SET_FROM", payload: place });
				setPickTarget("to");
			} else {
				dispatch({ type: "SET_TO", payload: place });
				setPickTarget("from");
			}
		},
		[pickTarget, dispatch],
	);

	const handleZoneHover = useCallback(
		(
			feature: GeoJSON.Feature<
				GeoJSON.Polygon | GeoJSON.MultiPolygon,
				FareZoneProperties
			> | null,
		) => {
			setHoveredZone(feature ? feature.properties : null);
		},
		[],
	);

	const handleStopSelect = useCallback(
		(stop: MapStopPlace) => {
			const place: PlaceReference = {
				placeId: stop.id,
				name: stop.name,
				type: "stop",
				coordinates: [stop.longitude, stop.latitude],
			};
			if (pickTarget === "from") {
				dispatch({ type: "SET_FROM", payload: place });
				setPickTarget("to");
			} else {
				dispatch({ type: "SET_TO", payload: place });
				setPickTarget("from");
			}
		},
		[pickTarget, dispatch],
	);

	const fromCoords =
		state.from?.type === "stop" ? state.from.coordinates : null;
	const toCoords = state.to?.type === "stop" ? state.to.coordinates : null;

	return (
		<div className="relative h-full w-full">
			<MapView
				ref={mapRef}
				center={NORWAY_CENTER}
				zoom={5}
				minZoom={4}
				maxZoom={18}
			>
				{showZones && (
					<MapFillLayer<FareZoneProperties>
						data={FARE_ZONES_URL}
						paint={{
							"fill-color": [
								"match",
								["get", "operator"],
								"RUT",
								"#ef4444",
								"ATB",
								"#f97316",
								"SKY",
								"#eab308",
								"BRA",
								"#22c55e",
								"INN",
								"#14b8a6",
								"KOL",
								"#3b82f6",
								"MOR",
								"#8b5cf6",
								"AKT",
								"#ec4899",
								"NOR",
								"#06b6d4",
								"OST",
								"#84cc16",
								"FIN",
								"#f59e0b",
								"TEL",
								"#10b981",
								"TRO",
								"#6366f1",
								"VKT",
								"#d946ef",
								"#4285F4",
							],
							"fill-opacity": 0.18,
						}}
						hoverPaint={{ "fill-opacity": 0.42 }}
						outlinePaint={{
							"line-color": "#ffffff",
							"line-width": 0.5,
							"line-opacity": 0.4,
						}}
						onClick={handleZoneClick}
						onHover={handleZoneHover}
					/>
				)}

				<StopMarkers onSelect={handleStopSelect} />

				{fromCoords && (
					<MapMarker longitude={fromCoords[0]} latitude={fromCoords[1]}>
						<MarkerContent>
							<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-wayfare-primary shadow-md">
								<Navigation className="size-3 text-white" />
							</div>
						</MarkerContent>
					</MapMarker>
				)}
				{toCoords && (
					<MapMarker longitude={toCoords[0]} latitude={toCoords[1]}>
						<MarkerContent>
							<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md">
								<MapPin className="size-3 text-white" />
							</div>
						</MarkerContent>
					</MapMarker>
				)}

				<ZoomHint />
				<MapControls position="bottom-right" showZoom showCompass showLocate />
			</MapView>

			<MapSearchOverlay
				pickTarget={pickTarget}
				onPickTargetChange={setPickTarget}
				hoveredZone={hoveredZone}
				showZones={showZones}
				onZoneToggle={() => setShowZones((v) => !v)}
				mapRef={mapRef}
			/>
		</div>
	);
}

function MapPage() {
	return (
		<div className="h-[calc(100vh-var(--header-height,57px)-var(--footer-height,57px))] min-h-96">
			<ClientOnly fallback={<MapLoadingPlaceholder />}>
				<MapContent />
			</ClientOnly>
		</div>
	);
}

function MapLoadingPlaceholder() {
	return (
		<div className="bg-muted flex h-full w-full items-center justify-center">
			<div className="flex gap-1">
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
			</div>
		</div>
	);
}
