import type MapLibreGL from "maplibre-gl";
import { useEffect, useId, useRef } from "react";

import { useMap } from "./context";

type MapClusterLayerProps<
	P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
> = {
	/** GeoJSON FeatureCollection data or URL to fetch GeoJSON from */
	data: string | GeoJSON.FeatureCollection<GeoJSON.Point, P>;
	/** Maximum zoom level to cluster points on (default: 14) */
	clusterMaxZoom?: number;
	/** Radius of each cluster when clustering points in pixels (default: 50) */
	clusterRadius?: number;
	/** Colors for cluster circles: [small, medium, large] based on point count (default: ["#22c55e", "#eab308", "#ef4444"]) */
	clusterColors?: [string, string, string];
	/** Point count thresholds for color/size steps: [medium, large] (default: [100, 750]) */
	clusterThresholds?: [number, number];
	/** Color for unclustered individual points (default: "#3b82f6") */
	pointColor?: string;
	/** Callback when an unclustered point is clicked */
	onPointClick?: (
		feature: GeoJSON.Feature<GeoJSON.Point, P>,
		coordinates: [number, number],
	) => void;
	/** Callback when a cluster is clicked. If not provided, zooms into the cluster */
	onClusterClick?: (
		clusterId: number,
		coordinates: [number, number],
		pointCount: number,
	) => void;
};

function MapClusterLayer<
	P extends GeoJSON.GeoJsonProperties = GeoJSON.GeoJsonProperties,
>({
	data,
	clusterMaxZoom = 14,
	clusterRadius = 50,
	clusterColors = ["#22c55e", "#eab308", "#ef4444"],
	clusterThresholds = [100, 750],
	pointColor = "#3b82f6",
	onPointClick,
	onClusterClick,
}: MapClusterLayerProps<P>) {
	const { map, isLoaded } = useMap();
	const id = useId();
	const sourceId = `cluster-source-${id}`;
	const clusterLayerId = `clusters-${id}`;
	const clusterCountLayerId = `cluster-count-${id}`;
	const unclusteredLayerId = `unclustered-point-${id}`;

	const stylePropsRef = useRef({
		clusterColors,
		clusterThresholds,
		pointColor,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!isLoaded || !map) return;

		map.addSource(sourceId, {
			type: "geojson",
			data,
			cluster: true,
			clusterMaxZoom,
			clusterRadius,
		});

		map.addLayer({
			id: clusterLayerId,
			type: "circle",
			source: sourceId,
			filter: ["has", "point_count"],
			paint: {
				"circle-color": [
					"step",
					["get", "point_count"],
					clusterColors[0],
					clusterThresholds[0],
					clusterColors[1],
					clusterThresholds[1],
					clusterColors[2],
				],
				"circle-radius": [
					"step",
					["get", "point_count"],
					20,
					clusterThresholds[0],
					30,
					clusterThresholds[1],
					40,
				],
				"circle-stroke-width": 1,
				"circle-stroke-color": "#fff",
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
				"text-font": ["Open Sans"],
				"text-size": 12,
			},
			paint: {
				"text-color": "#fff",
			},
		});

		map.addLayer({
			id: unclusteredLayerId,
			type: "circle",
			source: sourceId,
			filter: ["!", ["has", "point_count"]],
			paint: {
				"circle-color": pointColor,
				"circle-radius": 5,
				"circle-stroke-width": 2,
				"circle-stroke-color": "#fff",
			},
		});

		return () => {
			try {
				if (map.getLayer(clusterCountLayerId))
					map.removeLayer(clusterCountLayerId);
				if (map.getLayer(unclusteredLayerId))
					map.removeLayer(unclusteredLayerId);
				if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
				if (map.getSource(sourceId)) map.removeSource(sourceId);
			} catch {
				// ignore
			}
		};
	}, [isLoaded, map, sourceId]);

	useEffect(() => {
		if (!isLoaded || !map || typeof data === "string") return;

		const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
		if (source) {
			source.setData(data);
		}
	}, [isLoaded, map, data, sourceId]);

	useEffect(() => {
		if (!isLoaded || !map) return;

		const prev = stylePropsRef.current;
		const colorsChanged =
			prev.clusterColors !== clusterColors ||
			prev.clusterThresholds !== clusterThresholds;

		if (map.getLayer(clusterLayerId) && colorsChanged) {
			map.setPaintProperty(clusterLayerId, "circle-color", [
				"step",
				["get", "point_count"],
				clusterColors[0],
				clusterThresholds[0],
				clusterColors[1],
				clusterThresholds[1],
				clusterColors[2],
			]);
			map.setPaintProperty(clusterLayerId, "circle-radius", [
				"step",
				["get", "point_count"],
				20,
				clusterThresholds[0],
				30,
				clusterThresholds[1],
				40,
			]);
		}

		if (map.getLayer(unclusteredLayerId) && prev.pointColor !== pointColor) {
			map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
		}

		stylePropsRef.current = { clusterColors, clusterThresholds, pointColor };
	}, [
		isLoaded,
		map,
		clusterLayerId,
		unclusteredLayerId,
		clusterColors,
		clusterThresholds,
		pointColor,
	]);

	useEffect(() => {
		if (!isLoaded || !map) return;

		const handleClusterClick = async (
			e: MapLibreGL.MapMouseEvent & {
				features?: MapLibreGL.MapGeoJSONFeature[];
			},
		) => {
			const features = map.queryRenderedFeatures(e.point, {
				layers: [clusterLayerId],
			});
			if (!features.length) return;

			const feature = features[0];
			const clusterId = feature.properties?.cluster_id as number;
			const pointCount = feature.properties?.point_count as number;
			const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
				number,
				number,
			];

			if (onClusterClick) {
				onClusterClick(clusterId, coordinates, pointCount);
			} else {
				const source = map.getSource(sourceId) as MapLibreGL.GeoJSONSource;
				const zoom = await source.getClusterExpansionZoom(clusterId);
				map.easeTo({ center: coordinates, zoom });
			}
		};

		const handlePointClick = (
			e: MapLibreGL.MapMouseEvent & {
				features?: MapLibreGL.MapGeoJSONFeature[];
			},
		) => {
			if (!onPointClick || !e.features?.length) return;

			const feature = e.features[0];
			const coordinates = (
				feature.geometry as GeoJSON.Point
			).coordinates.slice() as [number, number];

			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			onPointClick(
				feature as unknown as GeoJSON.Feature<GeoJSON.Point, P>,
				coordinates,
			);
		};

		const handleMouseEnterCluster = () => {
			map.getCanvas().style.cursor = "pointer";
		};
		const handleMouseLeaveCluster = () => {
			map.getCanvas().style.cursor = "";
		};
		const handleMouseEnterPoint = () => {
			if (onPointClick) {
				map.getCanvas().style.cursor = "pointer";
			}
		};
		const handleMouseLeavePoint = () => {
			map.getCanvas().style.cursor = "";
		};

		map.on("click", clusterLayerId, handleClusterClick);
		map.on("click", unclusteredLayerId, handlePointClick);
		map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
		map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
		map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
		map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);

		return () => {
			map.off("click", clusterLayerId, handleClusterClick);
			map.off("click", unclusteredLayerId, handlePointClick);
			map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
			map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
			map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
			map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
		};
	}, [
		isLoaded,
		map,
		clusterLayerId,
		unclusteredLayerId,
		sourceId,
		onClusterClick,
		onPointClick,
	]);

	return null;
}

export { MapClusterLayer };
