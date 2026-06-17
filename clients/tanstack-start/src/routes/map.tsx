import {
	ClientOnly,
	createFileRoute,
	useNavigate,
} from "@tanstack/react-router";
import { ChevronDown, Layers } from "lucide-react";
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
	MapBottomSheet,
	MapControls,
	MapFillLayer,
	MapMarker,
	type MapRef,
	MapSidebar,
	MapView,
	MarkerContent,
	type SelectedStop,
	useMap,
} from "../components/map";
import { useResolvedTheme } from "../components/map/theme";
import { useStopIcons } from "../components/map/useStopIcons";
import { useSearchForm } from "../context/search-form";
import type { RecentStop } from "../lib/recent-stops-storage";
import { formatZoneName, OPERATOR_NAMES } from "../lib/zone-utils";
import type { PlaceReference } from "../types/common";

interface MapStopPlace {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	transportMode: string[];
}

export const Route = createFileRoute("/map")({ component: MapPage });

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

const FROM_COLOR = "#e90037";
const TO_COLOR = "#10b981";

function StopNativeLayer({
	stops,
	onSelect,
	fromStopId,
	toStopId,
}: {
	stops: MapStopPlace[];
	onSelect: (stop: MapStopPlace) => void;
	fromStopId?: string | null;
	toStopId?: string | null;
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
	const fromDotHighlightId = `stops-from-dot-${uid}`;
	const toDotHighlightId = `stops-to-dot-${uid}`;
	const fromSymbolHighlightId = `stops-from-symbol-${uid}`;
	const toSymbolHighlightId = `stops-to-symbol-${uid}`;

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

		const noFeature: MapLibreGL.FilterSpecification = ["==", ["get", "id"], ""];

		// Dot-zoom highlights (maxzoom 13) — added after symbol layer so they render on top in canvas order
		map.addLayer({
			id: fromDotHighlightId,
			type: "circle",
			source: sourceId,
			maxzoom: 13,
			filter: noFeature,
			paint: {
				"circle-radius": [
					"interpolate",
					["linear"],
					["zoom"],
					10,
					7,
					11,
					9,
					12,
					12,
				],
				"circle-color": FROM_COLOR,
				"circle-stroke-width": 2.5,
				"circle-stroke-color": "#ffffff",
				"circle-stroke-opacity": 1,
				"circle-opacity": 1,
			} as MapLibreGL.CircleLayerSpecification["paint"],
		});

		map.addLayer({
			id: toDotHighlightId,
			type: "circle",
			source: sourceId,
			maxzoom: 13,
			filter: noFeature,
			paint: {
				"circle-radius": [
					"interpolate",
					["linear"],
					["zoom"],
					10,
					7,
					11,
					9,
					12,
					12,
				],
				"circle-color": TO_COLOR,
				"circle-stroke-width": 2.5,
				"circle-stroke-color": "#ffffff",
				"circle-stroke-opacity": 1,
				"circle-opacity": 1,
			} as MapLibreGL.CircleLayerSpecification["paint"],
		});

		// Symbol-zoom highlights (minzoom 13) — circle centered on the icon via translate
		// The stop icon is 28px with anchor "bottom", so center is 14px above the feature coords
		map.addLayer({
			id: fromSymbolHighlightId,
			type: "circle",
			source: sourceId,
			minzoom: 13,
			filter: noFeature,
			paint: {
				"circle-radius": 18,
				"circle-color": FROM_COLOR,
				"circle-opacity": 0.18,
				"circle-stroke-width": 3,
				"circle-stroke-color": FROM_COLOR,
				"circle-stroke-opacity": 1,
				"circle-translate": [0, -14],
			} as MapLibreGL.CircleLayerSpecification["paint"],
		});

		map.addLayer({
			id: toSymbolHighlightId,
			type: "circle",
			source: sourceId,
			minzoom: 13,
			filter: noFeature,
			paint: {
				"circle-radius": 18,
				"circle-color": TO_COLOR,
				"circle-opacity": 0.18,
				"circle-stroke-width": 3,
				"circle-stroke-color": TO_COLOR,
				"circle-stroke-opacity": 1,
				"circle-translate": [0, -14],
			} as MapLibreGL.CircleLayerSpecification["paint"],
		});

		return () => {
			try {
				if (map.getLayer(symbolLayerId)) map.removeLayer(symbolLayerId);
				if (map.getLayer(fromDotHighlightId))
					map.removeLayer(fromDotHighlightId);
				if (map.getLayer(toDotHighlightId)) map.removeLayer(toDotHighlightId);
				if (map.getLayer(fromSymbolHighlightId))
					map.removeLayer(fromSymbolHighlightId);
				if (map.getLayer(toSymbolHighlightId))
					map.removeLayer(toSymbolHighlightId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map, iconsReady]);

	// Source cleanup runs last (after both layer-cleanup effects above) so the
	// source is never removed while layers still reference it.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;
		return () => {
			try {
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map]);

	useEffect(() => {
		if (!isLoaded || !map) return;
		const noFeature: MapLibreGL.FilterSpecification = ["==", ["get", "id"], ""];
		const fromFilter: MapLibreGL.FilterSpecification = fromStopId
			? [
					"all",
					["!", ["has", "point_count"]],
					["==", ["get", "id"], fromStopId],
				]
			: noFeature;
		const toFilter: MapLibreGL.FilterSpecification = toStopId
			? ["all", ["!", ["has", "point_count"]], ["==", ["get", "id"], toStopId]]
			: noFeature;
		if (map.getLayer(fromDotHighlightId))
			map.setFilter(fromDotHighlightId, fromFilter);
		if (map.getLayer(toDotHighlightId))
			map.setFilter(toDotHighlightId, toFilter);
		if (map.getLayer(fromSymbolHighlightId))
			map.setFilter(fromSymbolHighlightId, fromFilter);
		if (map.getLayer(toSymbolHighlightId))
			map.setFilter(toSymbolHighlightId, toFilter);
	}, [
		isLoaded,
		map,
		fromStopId,
		toStopId,
		fromDotHighlightId,
		toDotHighlightId,
		fromSymbolHighlightId,
		toSymbolHighlightId,
	]);

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

function StopMarkers({
	onSelect,
	fromStopId,
	toStopId,
}: {
	onSelect: (stop: MapStopPlace) => void;
	fromStopId?: string | null;
	toStopId?: string | null;
}) {
	const stops = useAllStops();
	return (
		<StopNativeLayer
			stops={stops}
			onSelect={onSelect}
			fromStopId={fromStopId}
			toStopId={toStopId}
		/>
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

const OPERATOR_FILL_COLORS: Record<string, string> = {
	RUT: "#ef4444",
	ATB: "#f97316",
	SKY: "#eab308",
	BRA: "#22c55e",
	INN: "#14b8a6",
	KOL: "#3b82f6",
	MOR: "#8b5cf6",
	AKT: "#ec4899",
	NOR: "#06b6d4",
	OST: "#84cc16",
	FIN: "#f59e0b",
	TEL: "#10b981",
	TRO: "#6366f1",
	VKT: "#d946ef",
};

const ALL_OPERATORS = Object.keys(OPERATOR_NAMES).sort((a, b) =>
	OPERATOR_NAMES[a].localeCompare(OPERATOR_NAMES[b]),
);

const ZONE_COLOR_MATCH: MapLibreGL.ExpressionSpecification = [
	"match",
	["get", "operator"],
	"RUT",
	"#b91c1c",
	"ATB",
	"#c2410c",
	"SKY",
	"#a16207",
	"BRA",
	"#15803d",
	"INN",
	"#0f766e",
	"KOL",
	"#1d4ed8",
	"MOR",
	"#6d28d9",
	"AKT",
	"#be185d",
	"NOR",
	"#0e7490",
	"OST",
	"#4d7c0f",
	"FIN",
	"#b45309",
	"TEL",
	"#047857",
	"TRO",
	"#4338ca",
	"VKT",
	"#a21caf",
	"#1a56db",
];

function ZoneLegend({
	hiddenOperators,
	onToggle,
	onToggleAll,
}: {
	hiddenOperators: Set<string>;
	onToggle: (op: string) => void;
	onToggleAll: () => void;
}) {
	const [collapsed, setCollapsed] = useState(false);
	const allHidden = hiddenOperators.size === ALL_OPERATORS.length;

	return (
		<div className="pointer-events-auto w-44 rounded-xl border border-wayfare-line bg-wayfare-surface/95 shadow-lg backdrop-blur-sm">
			<button
				type="button"
				onClick={() => setCollapsed((v) => !v)}
				className="flex w-full items-center justify-between px-3 py-2"
			>
				<span className="text-xs font-semibold text-wayfare-text">
					Operators
				</span>
				<ChevronDown
					className={`size-3.5 text-wayfare-text-secondary transition-transform ${collapsed ? "" : "rotate-180"}`}
				/>
			</button>

			{!collapsed && (
				<div className="border-t border-wayfare-line px-2 pb-2 pt-1">
					<button
						type="button"
						onClick={onToggleAll}
						className="mb-1 w-full rounded px-1.5 py-0.5 text-left text-xs text-wayfare-text-secondary hover:bg-wayfare-bg"
					>
						{allHidden ? "Show all" : "Hide all"}
					</button>
					<div className="max-h-64 space-y-0.5 overflow-y-auto">
						{ALL_OPERATORS.map((op) => {
							const visible = !hiddenOperators.has(op);
							return (
								<button
									key={op}
									type="button"
									onClick={() => onToggle(op)}
									className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-opacity hover:bg-wayfare-bg ${visible ? "" : "opacity-40"}`}
								>
									<span
										className="size-2.5 shrink-0 rounded-sm"
										style={{ backgroundColor: OPERATOR_FILL_COLORS[op] }}
									/>
									<span className="truncate text-xs text-wayfare-text">
										{OPERATOR_NAMES[op]}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

function MapContent() {
	const { state, dispatch } = useSearchForm();
	const navigate = useNavigate();
	const theme = useResolvedTheme();
	const mapRef = useRef<MapRef | null>(null);
	const [selectedStop, setSelectedStop] = useState<SelectedStop | null>(null);
	const [showZones, setShowZones] = useState(false);
	const [hiddenOperators, setHiddenOperators] = useState<Set<string>>(
		new Set(),
	);
	const [userPosition, setUserPosition] = useState<{
		longitude: number;
		latitude: number;
	} | null>(null);

	const handleLocate = useCallback(
		(coords: { longitude: number; latitude: number }) => {
			setUserPosition(coords);
		},
		[],
	);

	const toggleOperator = useCallback((op: string) => {
		setHiddenOperators((prev) => {
			const next = new Set(prev);
			if (next.has(op)) next.delete(op);
			else next.add(op);
			return next;
		});
	}, []);

	const toggleAllOperators = useCallback(() => {
		setHiddenOperators((prev) =>
			prev.size === ALL_OPERATORS.length ? new Set() : new Set(ALL_OPERATORS),
		);
	}, []);

	const visibleFilter = useMemo((): MapLibreGL.FilterSpecification | null => {
		if (hiddenOperators.size === 0) return null;
		const visible = ALL_OPERATORS.filter((op) => !hiddenOperators.has(op));
		if (visible.length === 0) return ["==", ["literal", false], true];
		return ["match", ["get", "operator"], visible, true, false];
	}, [hiddenOperators]);

	const zoneLabelPaint = useMemo<MapLibreGL.SymbolLayerSpecification["paint"]>(
		() =>
			theme === "dark"
				? {
						"icon-color": "rgba(255,255,255,0.82)",
						"icon-opacity": 0.72,
						"text-color": ZONE_COLOR_MATCH,
					}
				: {
						"icon-color": ZONE_COLOR_MATCH,
						"icon-opacity": 0.72,
						"text-color": "#ffffff",
					},
		[theme],
	);

	const handleZoneClick = useCallback(
		(
			feature: GeoJSON.Feature<
				GeoJSON.Polygon | GeoJSON.MultiPolygon,
				FareZoneProperties
			>,
		) => {
			const operatorName =
				OPERATOR_NAMES[feature.properties.operator] ??
				feature.properties.operator;
			const place: PlaceReference = {
				placeId: feature.properties.id,
				name: formatZoneName(feature.properties.name, operatorName),
				type: "zone",
			};
			if (!state.from) {
				dispatch({ type: "SET_FROM", payload: place });
			} else if (!state.to) {
				dispatch({ type: "SET_TO", payload: place });
			} else {
				dispatch({ type: "SET_FROM", payload: place });
			}
		},
		[dispatch, state.from, state.to],
	);

	const handleStopSelect = useCallback((stop: MapStopPlace) => {
		setSelectedStop({
			id: stop.id,
			name: stop.name,
			coordinates: [stop.longitude, stop.latitude],
			modes: stop.transportMode,
		});
		const currentZoom = mapRef.current?.getZoom?.() ?? 13;
		mapRef.current?.flyTo({
			center: [stop.longitude, stop.latitude],
			zoom: Math.max(currentZoom, 13),
			duration: 600,
		});
	}, []);

	const handlePlaceSearch = useCallback((place: PlaceReference | null) => {
		if (!place || place.type !== "stop" || !place.coordinates) return;
		setSelectedStop({
			id: place.placeId,
			name: place.name ?? "",
			coordinates: place.coordinates,
			modes: [],
		});
		mapRef.current?.flyTo({
			center: place.coordinates,
			zoom: 14,
			duration: 800,
		});
	}, []);

	const handlePickRecent = useCallback((s: RecentStop) => {
		setSelectedStop({
			id: s.id,
			name: s.name,
			coordinates: s.coordinates,
			modes: [],
		});
		mapRef.current?.flyTo({ center: s.coordinates, zoom: 14, duration: 800 });
	}, []);

	const handleTravelFrom = useCallback(
		(s: SelectedStop) => {
			const place: PlaceReference = {
				placeId: s.id,
				name: s.name,
				type: "stop",
				coordinates: s.coordinates,
			};
			dispatch({ type: "SET_FROM", payload: place });
			navigate({ to: "/", search: { focus: "to" } });
		},
		[dispatch, navigate],
	);

	const handleTravelTo = useCallback(
		(s: SelectedStop) => {
			const place: PlaceReference = {
				placeId: s.id,
				name: s.name,
				type: "stop",
				coordinates: s.coordinates,
			};
			dispatch({ type: "SET_TO", payload: place });
			navigate({ to: "/", search: { focus: "from" } });
		},
		[dispatch, navigate],
	);

	const fromStopId = state.from?.type === "stop" ? state.from.placeId : null;
	const toStopId = state.to?.type === "stop" ? state.to.placeId : null;

	return (
		<div className="flex h-full w-full">
			<aside className="hidden w-[380px] shrink-0 border-r border-wayfare-line bg-wayfare-surface md:block">
				<MapSidebar
					selectedStop={selectedStop}
					onPlaceSearch={handlePlaceSearch}
					onPickRecent={handlePickRecent}
					onTravelFrom={handleTravelFrom}
					onTravelTo={handleTravelTo}
					onClose={() => setSelectedStop(null)}
				/>
			</aside>

			<div className="relative flex-1">
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
							labelLayout={{
								"text-field": [
									"format",
									["get", "name"],
									{},
									"\n",
									{},
									["get", "id"],
									{ "font-scale": 0.75 },
								],
								"text-size": 11,
								"text-font": ["Montserrat Bold", "Open Sans Regular"],
								"text-anchor": "center",
								"text-max-width": 10,
							}}
							labelPaint={zoneLabelPaint}
							labelBackground
							labelMinzoom={4}
							filter={visibleFilter}
							onClick={handleZoneClick}
						/>
					)}

					{!showZones && (
						<StopMarkers
							onSelect={handleStopSelect}
							fromStopId={fromStopId}
							toStopId={toStopId}
						/>
					)}

					{userPosition && (
						<MapMarker
							longitude={userPosition.longitude}
							latitude={userPosition.latitude}
						>
							<MarkerContent>
								<div className="relative flex h-5 w-5 items-center justify-center">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50" />
									<span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
								</div>
							</MarkerContent>
						</MapMarker>
					)}

					<ZoomHint />
					<MapControls
						position="bottom-right"
						showZoom
						showCompass
						showLocate
						onLocate={handleLocate}
					/>
				</MapView>

				<div className="pointer-events-none absolute top-3 right-3 z-10">
					<div className="pointer-events-auto">
						<ZoneToggleButton
							showZones={showZones}
							onToggle={() => setShowZones((v) => !v)}
						/>
					</div>
				</div>

				{showZones && (
					<div className="pointer-events-none absolute inset-0 z-10">
						<div className="absolute top-14 right-3">
							<ZoneLegend
								hiddenOperators={hiddenOperators}
								onToggle={toggleOperator}
								onToggleAll={toggleAllOperators}
							/>
						</div>
					</div>
				)}

				<MapBottomSheet desiredSnap={selectedStop ? "half" : "peek"}>
					<MapSidebar
						selectedStop={selectedStop}
						onPlaceSearch={handlePlaceSearch}
						onPickRecent={handlePickRecent}
						onTravelFrom={handleTravelFrom}
						onTravelTo={handleTravelTo}
						onClose={() => setSelectedStop(null)}
					/>
				</MapBottomSheet>
			</div>
		</div>
	);
}

function MapPage() {
	return (
		<div className="flex-1 min-h-96">
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
