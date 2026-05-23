import type MapLibreGL from "maplibre-gl";
import { useEffect, useId, useMemo, useRef } from "react";

import { useMap } from "./context";

type MapFillLayerProps<
	P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
	/** GeoJSON FeatureCollection of polygons, or a URL to fetch GeoJSON from */
	data:
		| GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, P>
		| string;
	/** Optional unique id prefix for source/layers. Auto-generated if not provided. */
	id?: string;
	/** MapLibre fill-layer paint properties. Defaults to semi-transparent blue. */
	paint?: MapLibreGL.FillLayerSpecification["paint"];
	/** Paint overrides applied to the feature currently under the cursor. */
	hoverPaint?: MapLibreGL.FillLayerSpecification["paint"];
	/** Paint for an optional outline layer rendered on top of the fill. */
	outlinePaint?: MapLibreGL.LineLayerSpecification["paint"];
	/** Callback when a feature is clicked. */
	onClick?: (
		feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, P>,
		e: MapLibreGL.MapMouseEvent,
	) => void;
	/** Callback when the hovered feature changes. Null when cursor leaves. */
	onHover?: (
		feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, P> | null,
	) => void;
	/** Whether the layer responds to mouse events (default: true). */
	interactive?: boolean;
	/** Optional layer id to insert before (z-order control). */
	beforeId?: string;
};

const DEFAULT_FILL_PAINT: MapLibreGL.FillLayerSpecification["paint"] = {
	"fill-color": "#4285F4",
	"fill-opacity": 0.15,
};

const DEFAULT_HOVER_FILL_PAINT: MapLibreGL.FillLayerSpecification["paint"] = {
	"fill-opacity": 0.35,
};

function mergeFillPaint(
	paint: MapLibreGL.FillLayerSpecification["paint"],
	hoverPaint: MapLibreGL.FillLayerSpecification["paint"] | undefined,
): MapLibreGL.FillLayerSpecification["paint"] {
	if (!hoverPaint) return paint;
	const merged: Record<string, unknown> = { ...paint };
	for (const [key, hoverValue] of Object.entries(hoverPaint)) {
		if (hoverValue === undefined) continue;
		const baseValue = merged[key];
		merged[key] =
			baseValue === undefined
				? hoverValue
				: [
						"case",
						["boolean", ["feature-state", "hover"], false],
						hoverValue,
						baseValue,
					];
	}
	return merged as MapLibreGL.FillLayerSpecification["paint"];
}

function MapFillLayer<
	P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
	data,
	id: propId,
	paint,
	hoverPaint = DEFAULT_HOVER_FILL_PAINT,
	outlinePaint,
	onClick,
	onHover,
	interactive = true,
	beforeId,
}: MapFillLayerProps<P>) {
	const { map, isLoaded } = useMap();
	const autoId = useId();
	const id = propId ?? autoId;
	const sourceId = `fill-source-${id}`;
	const fillLayerId = `fill-layer-${id}`;
	const outlineLayerId = `fill-outline-layer-${id}`;

	const mergedPaint = useMemo(
		() => mergeFillPaint({ ...DEFAULT_FILL_PAINT, ...paint }, hoverPaint),
		[paint, hoverPaint],
	);

	const latestRef = useRef({ data, onClick, onHover });
	latestRef.current = { data, onClick, onHover };

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;

		map.addSource(sourceId, {
			type: "geojson",
			data,
			promoteId: "id",
		});

		map.addLayer(
			{ id: fillLayerId, type: "fill", source: sourceId, paint: mergedPaint },
			beforeId,
		);

		if (outlinePaint) {
			map.addLayer(
				{
					id: outlineLayerId,
					type: "line",
					source: sourceId,
					paint: outlinePaint,
				},
				beforeId,
			);
		}

		return () => {
			try {
				if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
				if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map]);

	useEffect(() => {
		if (!isLoaded || !map || typeof data === "string") return;
		const source = map.getSource(sourceId) as
			| MapLibreGL.GeoJSONSource
			| undefined;
		source?.setData(data);
	}, [isLoaded, map, data, sourceId]);

	useEffect(() => {
		if (!isLoaded || !map?.getLayer(fillLayerId)) return;
		for (const [key, value] of Object.entries(mergedPaint ?? {})) {
			map.setPaintProperty(
				fillLayerId,
				key as keyof MapLibreGL.FillLayerSpecification["paint"],
				value as never,
			);
		}
	}, [isLoaded, map, fillLayerId, mergedPaint]);

	useEffect(() => {
		if (!isLoaded || !map || !interactive) return;

		let hoveredId: string | number | null = null;

		const setHover = (next: string | number | null) => {
			if (next === hoveredId) return;
			const sourceExists = !!map.getSource(sourceId);
			if (hoveredId != null && sourceExists) {
				map.setFeatureState(
					{ source: sourceId, id: hoveredId },
					{ hover: false },
				);
			}
			hoveredId = next;
			if (next != null && sourceExists) {
				map.setFeatureState({ source: sourceId, id: next }, { hover: true });
			}
		};

		const getEventFeature = (e: MapLibreGL.MapLayerMouseEvent) => {
			const raw = e.features?.[0];
			if (!raw) return undefined;
			const d = latestRef.current.data;
			if (typeof d !== "string") {
				const featureId = raw.id;
				return featureId == null
					? (raw as unknown as GeoJSON.Feature<
							GeoJSON.Polygon | GeoJSON.MultiPolygon,
							P
						>)
					: (d.features.find(
							(f) => String(f.id ?? f.properties?.id) === String(featureId),
						) as
							| GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon, P>
							| undefined);
			}
			return raw as unknown as GeoJSON.Feature<
				GeoJSON.Polygon | GeoJSON.MultiPolygon,
				P
			>;
		};

		const handleMouseMove = (e: MapLibreGL.MapLayerMouseEvent) => {
			const featureId = e.features?.[0]?.id as string | number | undefined;
			if (featureId == null || featureId === hoveredId) return;
			setHover(featureId);
			map.getCanvas().style.cursor = interactive ? "pointer" : "";
			const feature = getEventFeature(e);
			if (feature) {
				latestRef.current.onHover?.(feature);
			}
		};

		const handleMouseLeave = () => {
			setHover(null);
			map.getCanvas().style.cursor = "";
			latestRef.current.onHover?.(null);
		};

		const handleClick = (e: MapLibreGL.MapLayerMouseEvent) => {
			const feature = getEventFeature(e);
			if (!feature) return;
			latestRef.current.onClick?.(feature, e);
		};

		map.on("mousemove", fillLayerId, handleMouseMove);
		map.on("mouseleave", fillLayerId, handleMouseLeave);
		map.on("click", fillLayerId, handleClick);

		return () => {
			map.off("mousemove", fillLayerId, handleMouseMove);
			map.off("mouseleave", fillLayerId, handleMouseLeave);
			map.off("click", fillLayerId, handleClick);
			setHover(null);
			map.getCanvas().style.cursor = "";
		};
	}, [isLoaded, map, fillLayerId, sourceId, interactive]);

	return null;
}

export { MapFillLayer };
