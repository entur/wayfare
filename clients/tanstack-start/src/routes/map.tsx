import {
	ClientOnly,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { Layers, MapPin, Navigation, Search } from "lucide-react";
import type MapLibreGL from "maplibre-gl";
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	MapControls,
	MapFillLayer,
	MapMarker,
	type MapRef,
	MapView,
	MarkerContent,
	useMap,
} from "../components/map";
import { useResolvedTheme } from "../components/map/theme";
import { useStopIcons } from "../components/map/useStopIcons";
import PlaceSearch from "../components/search/PlaceSearch";
import Button from "../components/ui/Button";
import { useSearchForm } from "../context/search-form";

interface MapStopPlace {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	transportMode: string[];
}

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
const MIN_ZOOM_FOR_STOPS = 4;

// Priority order for selecting the "primary" transport mode icon when a stop has several
const MODE_PRIORITY = ["rail", "metro", "tram", "ferry", "air", "coach", "bus"];

function primaryMode(modes: string[]): string {
	for (const m of MODE_PRIORITY) {
		if (modes.includes(m)) return m;
	}
	return modes[0] ?? "bus";
}

const STOPS_URL = "/stops-geo.json";

function useAllStops(): MapStopPlace[] {
	const [stops, setStops] = useState<MapStopPlace[]>([]);

	useEffect(() => {
		fetch(STOPS_URL)
			.then((r) => r.json())
			.then((geojson: GeoJSON.FeatureCollection<GeoJSON.Point>) => {
				setStops(
					geojson.features.map((f) => ({
						id: f.properties?.id as string,
						name: f.properties?.name as string,
						latitude: f.geometry.coordinates[1],
						longitude: f.geometry.coordinates[0],
						transportMode: f.properties?.transportModes as string[],
					})),
				);
			})
			.catch(() => {});
	}, []);

	return stops;
}

const STOP_COLORS = {
	light: {
		bus: "#c5044e",
		metro: "#bf5826",
		tram: "#78469a",
		ferry: "#0c6693",
		rail: "#00367f",
		air: "#800664",
		coach: "#c5044e",
	},
	dark: {
		bus: "#ef7398",
		metro: "#dd973c",
		tram: "#b898e5",
		ferry: "#8ccfe2",
		rail: "#60a2d7",
		air: "#f2b8e5",
		coach: "#ef7398",
	},
} as const;

const CLUSTER_COLOR = "#6366f1";

function StopNativeLayer({
	stops,
	onSelect,
}: {
	stops: MapStopPlace[];
	onSelect: (stop: MapStopPlace) => void;
}) {
	const { map, isLoaded } = useMap();
	const theme = useResolvedTheme();
	const iconsReady = useStopIcons(map, isLoaded, theme);
	const uid = useId();
	const sourceId = `stops-src-${uid}`;
	const clusterLayerId = `stops-clusters-${uid}`;
	const clusterCountLayerId = `stops-cluster-count-${uid}`;
	const dotLayerId = `stops-dots-${uid}`;
	const symbolLayerId = `stops-symbols-${uid}`;

	const geojson = useMemo(
		(): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
			type: "FeatureCollection",
			features: stops.map((stop) => ({
				type: "Feature",
				id: stop.id,
				geometry: {
					type: "Point",
					coordinates: [stop.longitude, stop.latitude],
				},
				properties: {
					id: stop.id,
					name: stop.name,
					mode: primaryMode(stop.transportMode),
				},
			})),
		}),
		[stops],
	);

	const latestRef = useRef({ stops, onSelect });
	latestRef.current = { stops, onSelect };

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;

		const c = STOP_COLORS[theme];
		const modeColor: MapLibreGL.ExpressionSpecification = [
			"match",
			["get", "mode"],
			"rail",
			c.rail,
			"metro",
			c.metro,
			"tram",
			c.tram,
			"ferry",
			c.ferry,
			"air",
			c.air,
			"coach",
			c.coach,
			c.bus,
		];

		map.addSource(sourceId, {
			type: "geojson",
			data: geojson,
			cluster: true,
			clusterMaxZoom: 12,
			clusterRadius: 40,
		});

		map.addLayer({
			id: clusterLayerId,
			type: "circle",
			source: sourceId,
			filter: ["has", "point_count"],
			paint: {
				"circle-color": CLUSTER_COLOR,
				"circle-radius": ["step", ["get", "point_count"], 10, 20, 14, 100, 18],
				"circle-stroke-width": 2,
				"circle-stroke-color": "#ffffff",
				"circle-opacity": 0.85,
			},
		});

		map.addLayer({
			id: clusterCountLayerId,
			type: "symbol",
			source: sourceId,
			filter: ["has", "point_count"],
			layout: {
				"text-field": "{point_count_abbreviated}",
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": 11,
			},
			paint: { "text-color": "#ffffff" },
		});

		map.addLayer({
			id: dotLayerId,
			type: "circle",
			source: sourceId,
			maxzoom: 13,
			filter: ["!", ["has", "point_count"]],
			paint: {
				"circle-radius": [
					"interpolate",
					["linear"],
					["zoom"],
					10,
					2.5,
					11,
					3,
					12,
					4,
				],
				"circle-color": modeColor,
				"circle-stroke-width": 1,
				"circle-stroke-color": "#ffffff",
				"circle-opacity": 0.9,
			} as MapLibreGL.CircleLayerSpecification["paint"],
		});

		return () => {
			try {
				if (map.getLayer(clusterCountLayerId))
					map.removeLayer(clusterCountLayerId);
				if (map.getLayer(dotLayerId)) map.removeLayer(dotLayerId);
				if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map]);

	// Symbol layer added once icons are ready; removed on cleanup or icon reload
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map || !iconsReady) return;

		const textColor = theme === "dark" ? "#e5e7eb" : "#1f2937";
		const haloColor = theme === "dark" ? "#111827" : "#ffffff";

		map.addLayer({
			id: symbolLayerId,
			type: "symbol",
			source: sourceId,
			minzoom: 13,
			filter: ["!", ["has", "point_count"]],
			layout: {
				"icon-image": ["concat", "stop-icon-", ["get", "mode"]],
				"icon-size": 1,
				"icon-anchor": "bottom",
				"icon-allow-overlap": false,
				"icon-ignore-placement": false,
				// Labels fade in at zoom 14+ so they don't clutter at zoom 13
				"text-field": ["step", ["zoom"], "", 14, ["get", "name"]],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": ["interpolate", ["linear"], ["zoom"], 14, 10, 16, 12],
				"text-anchor": "top",
				"text-offset": [0, 0.2],
				"text-max-width": 8,
				"text-optional": true,
				"text-allow-overlap": false,
				"symbol-sort-key": [
					"match",
					["get", "mode"],
					"rail",
					1,
					"metro",
					2,
					"tram",
					3,
					"ferry",
					4,
					"air",
					5,
					"coach",
					6,
					7,
				],
			},
			paint: {
				"text-color": textColor,
				"text-halo-color": haloColor,
				"text-halo-width": 1.5,
			},
		});

		return () => {
			try {
				if (map.getLayer(symbolLayerId)) map.removeLayer(symbolLayerId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map, iconsReady]);

	useEffect(() => {
		if (!isLoaded || !map) return;
		const source = map.getSource(sourceId) as
			| MapLibreGL.GeoJSONSource
			| undefined;
		source?.setData(geojson);
	}, [isLoaded, map, geojson, sourceId]);

	useEffect(() => {
		if (!isLoaded || !map) return;

		const handleStopClick = (e: MapLibreGL.MapLayerMouseEvent) => {
			const feature = e.features?.[0];
			if (!feature) return;
			const stopId = feature.properties?.id as string | undefined;
			if (!stopId) return;
			const stop = latestRef.current.stops.find((s) => s.id === stopId);
			if (stop) latestRef.current.onSelect(stop);
		};

		const handleClusterClick = async (e: MapLibreGL.MapLayerMouseEvent) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [clusterLayerId],
			});
			if (!features.length) return;
			const clusterId = features[0].properties?.cluster_id as number;
			const coordinates = (features[0].geometry as GeoJSON.Point)
				.coordinates as [number, number];
			const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
			const zoom = await source.getClusterExpansionZoom(clusterId);
			map.easeTo({ center: coordinates, zoom });
		};

		const setCursor = (c: string) => () => {
			map.getCanvas().style.cursor = c;
		};

		map.on("click", dotLayerId, handleStopClick);
		map.on("click", symbolLayerId, handleStopClick);
		map.on("click", clusterLayerId, handleClusterClick);
		map.on("mouseenter", dotLayerId, setCursor("pointer"));
		map.on("mouseleave", dotLayerId, setCursor(""));
		map.on("mouseenter", symbolLayerId, setCursor("pointer"));
		map.on("mouseleave", symbolLayerId, setCursor(""));
		map.on("mouseenter", clusterLayerId, setCursor("pointer"));
		map.on("mouseleave", clusterLayerId, setCursor(""));

		return () => {
			map.off("click", dotLayerId, handleStopClick);
			map.off("click", symbolLayerId, handleStopClick);
			map.off("click", clusterLayerId, handleClusterClick);
			map.getCanvas().style.cursor = "";
		};
	}, [isLoaded, map, dotLayerId, symbolLayerId, clusterLayerId, sourceId]);

	return null;
}

function StopMarkers({ onSelect }: { onSelect: (stop: MapStopPlace) => void }) {
	const stops = useAllStops();
	return <StopNativeLayer stops={stops} onSelect={onSelect} />;
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
