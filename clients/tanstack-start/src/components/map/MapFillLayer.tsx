import type MapLibreGL from "maplibre-gl";
import { useEffect, useId, useMemo, useRef } from "react";

import { useMap } from "./context";

function createRoundedRectSDF(w: number, h: number, r: number) {
	const data = new Uint8ClampedArray(w * h * 4);
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const cx = Math.max(r, Math.min(w - r, x));
			const cy = Math.max(r, Math.min(h - r, y));
			const dx = x - cx;
			const dy = y - cy;
			const v = dx * dx + dy * dy <= r * r ? 255 : 0;
			const i = (y * w + x) * 4;
			data[i] = v;
			data[i + 1] = v;
			data[i + 2] = v;
			data[i + 3] = v;
		}
	}
	return { width: w, height: h, data };
}

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
	/** Layout for an optional symbol layer rendering labels at polygon centroids. */
	labelLayout?: MapLibreGL.SymbolLayerSpecification["layout"];
	/** Paint for the symbol label layer. Updated reactively (e.g. on theme change). */
	labelPaint?: MapLibreGL.SymbolLayerSpecification["paint"];
	/** Min zoom at which the label layer becomes visible. */
	labelMinzoom?: number;
	/** When true, adds a programmatic SDF rounded-rectangle behind each label. Color it via icon-color in labelPaint. */
	labelBackground?: boolean;
	/** Filter expression applied to all sublayers. Updated reactively. */
	filter?: MapLibreGL.FilterSpecification | null;
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
	labelLayout,
	labelPaint,
	labelMinzoom,
	labelBackground = false,
	filter,
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
	const labelLayerId = `fill-label-layer-${id}`;
	const labelImageName = `fill-label-bg-${id}`;

	const mergedPaint = useMemo(
		() => mergeFillPaint({ ...DEFAULT_FILL_PAINT, ...paint }, hoverPaint),
		[paint, hoverPaint],
	);

	const latestRef = useRef({
		data,
		onClick,
		onHover,
		labelLayout,
		labelPaint,
		filter,
	});
	latestRef.current = {
		data,
		onClick,
		onHover,
		labelLayout,
		labelPaint,
		filter,
	};
	// labelLayout/labelPaint are read via latestRef at layer-creation time (setup effect)

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;

		map.addSource(sourceId, {
			type: "geojson",
			data,
			promoteId: "id",
		});

		const initialFilter = latestRef.current.filter ?? undefined;

		map.addLayer(
			{
				id: fillLayerId,
				type: "fill",
				source: sourceId,
				paint: mergedPaint,
				...(initialFilter && { filter: initialFilter }),
			},
			beforeId,
		);

		if (outlinePaint) {
			map.addLayer(
				{
					id: outlineLayerId,
					type: "line",
					source: sourceId,
					paint: outlinePaint,
					...(initialFilter && { filter: initialFilter }),
				},
				beforeId,
			);
		}

		if (latestRef.current.labelLayout) {
			if (labelBackground) {
				// 64×40 physical pixels at pixelRatio 2 → 32×20 logical px, 8px logical radius
				map.addImage(labelImageName, createRoundedRectSDF(64, 40, 16), {
					sdf: true,
					stretchX: [[18, 46]],
					stretchY: [[16, 24]],
					content: [18, 16, 46, 24],
					pixelRatio: 2,
				});
			}

			const layout: MapLibreGL.SymbolLayerSpecification["layout"] = {
				...latestRef.current.labelLayout,
				...(labelBackground && {
					"icon-image": labelImageName,
					"icon-text-fit": "both",
					"icon-text-fit-padding": [0, 2, 0, 2],
				}),
			};

			map.addLayer(
				{
					id: labelLayerId,
					type: "symbol",
					source: sourceId,
					minzoom: labelMinzoom,
					layout,
					paint: latestRef.current.labelPaint,
					...(initialFilter && { filter: initialFilter }),
				},
				beforeId,
			);
		}

		return () => {
			try {
				if (map.getLayer(labelLayerId)) map.removeLayer(labelLayerId);
				if (labelBackground && map.hasImage(labelImageName))
					map.removeImage(labelImageName);
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
		if (!isLoaded || !map?.getLayer(labelLayerId) || !labelPaint) return;
		for (const [key, value] of Object.entries(labelPaint)) {
			map.setPaintProperty(labelLayerId, key as never, value as never);
		}
	}, [isLoaded, map, labelLayerId, labelPaint]);

	useEffect(() => {
		if (!isLoaded || !map) return;
		const f = filter ?? null;
		if (map.getLayer(fillLayerId)) map.setFilter(fillLayerId, f);
		if (map.getLayer(outlineLayerId)) map.setFilter(outlineLayerId, f);
		if (map.getLayer(labelLayerId)) map.setFilter(labelLayerId, f);
	}, [isLoaded, map, fillLayerId, outlineLayerId, labelLayerId, filter]);

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
