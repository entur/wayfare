import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
	forwardRef,
	type ReactNode,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";

import { cn } from "@/lib/utils";
import { MapContext } from "./context";
import type { Theme } from "./theme";
import { defaultStyles, useResolvedTheme } from "./theme";

type MapRef = MapLibreGL.Map;

/** Map viewport state */
type MapViewport = {
	/** Center coordinates [longitude, latitude] */
	center: [number, number];
	/** Zoom level */
	zoom: number;
	/** Bearing (rotation) in degrees */
	bearing: number;
	/** Pitch (tilt) in degrees */
	pitch: number;
};

type MapStyleOption = string | MapLibreGL.StyleSpecification;

type MapProps = {
	children?: ReactNode;
	/** Additional CSS classes for the map container */
	className?: string;
	/**
	 * Theme for the map. If not provided, automatically detects system preference.
	 * Pass your theme value here.
	 */
	theme?: Theme;
	/** Custom map styles for light and dark themes. Overrides the default Carto styles. */
	styles?: {
		light?: MapStyleOption;
		dark?: MapStyleOption;
	};
	/** Map projection type. Use `{ type: "globe" }` for 3D globe view. */
	projection?: MapLibreGL.ProjectionSpecification;
	/**
	 * Controlled viewport. When provided with onViewportChange,
	 * the map becomes controlled and viewport is driven by this prop.
	 */
	viewport?: Partial<MapViewport>;
	/**
	 * Callback fired continuously as the viewport changes (pan, zoom, rotate, pitch).
	 * Can be used standalone to observe changes, or with `viewport` prop
	 * to enable controlled mode where the map viewport is driven by your state.
	 */
	onViewportChange?: (viewport: MapViewport) => void;
	/** Show a loading indicator on the map */
	loading?: boolean;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

function DefaultLoader() {
	return (
		<div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs">
			<div className="flex gap-1">
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" />
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" />
				<span className="bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" />
			</div>
		</div>
	);
}

function getViewport(map: MapLibreGL.Map): MapViewport {
	const center = map.getCenter();
	return {
		center: [center.lng, center.lat],
		zoom: map.getZoom(),
		bearing: map.getBearing(),
		pitch: map.getPitch(),
	};
}

const MapView = forwardRef<MapRef, MapProps>(function MapView(
	{
		children,
		className,
		theme: themeProp,
		styles,
		projection,
		viewport,
		onViewportChange,
		loading = false,
		...props
	},
	ref,
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isStyleLoaded, setIsStyleLoaded] = useState(false);
	const currentStyleRef = useRef<MapStyleOption | null>(null);
	const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const internalUpdateRef = useRef(false);
	const resolvedTheme = useResolvedTheme(themeProp);

	const isControlled = viewport !== undefined && onViewportChange !== undefined;

	const onViewportChangeRef = useRef(onViewportChange);
	onViewportChangeRef.current = onViewportChange;

	const mapStyles = useMemo(
		() => ({
			dark: styles?.dark ?? defaultStyles.dark,
			light: styles?.light ?? defaultStyles.light,
		}),
		[styles],
	);

	useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance]);

	const clearStyleTimeout = useCallback(() => {
		if (styleTimeoutRef.current) {
			clearTimeout(styleTimeoutRef.current);
			styleTimeoutRef.current = null;
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!containerRef.current) return;

		const initialStyle =
			resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
		currentStyleRef.current = initialStyle;

		const map = new MapLibreGL.Map({
			container: containerRef.current,
			style: initialStyle,
			renderWorldCopies: false,
			attributionControl: {
				compact: true,
			},
			...props,
			...viewport,
		});

		const styleDataHandler = () => {
			clearStyleTimeout();
			// Workaround for race conditions with style loading — forces layer ops
			// to wait until the style is fully processed before re-rendering.
			styleTimeoutRef.current = setTimeout(() => {
				setIsStyleLoaded(true);
				if (projection) {
					map.setProjection(projection);
				}
			}, 100);
		};
		const loadHandler = () => setIsLoaded(true);

		const handleMove = () => {
			if (internalUpdateRef.current) return;
			onViewportChangeRef.current?.(getViewport(map));
		};

		map.on("load", loadHandler);
		map.on("styledata", styleDataHandler);
		map.on("move", handleMove);
		setMapInstance(map);

		return () => {
			clearStyleTimeout();
			map.off("load", loadHandler);
			map.off("styledata", styleDataHandler);
			map.off("move", handleMove);
			map.remove();
			setIsLoaded(false);
			setIsStyleLoaded(false);
			setMapInstance(null);
		};
	}, []);

	// Sync controlled viewport to map
	useEffect(() => {
		if (!mapInstance || !isControlled || !viewport) return;
		if (mapInstance.isMoving()) return;

		const current = getViewport(mapInstance);
		const next = {
			center: viewport.center ?? current.center,
			zoom: viewport.zoom ?? current.zoom,
			bearing: viewport.bearing ?? current.bearing,
			pitch: viewport.pitch ?? current.pitch,
		};

		if (
			next.center[0] === current.center[0] &&
			next.center[1] === current.center[1] &&
			next.zoom === current.zoom &&
			next.bearing === current.bearing &&
			next.pitch === current.pitch
		) {
			return;
		}

		internalUpdateRef.current = true;
		mapInstance.jumpTo(next);
		internalUpdateRef.current = false;
	}, [mapInstance, isControlled, viewport]);

	// Handle style change on theme switch
	useEffect(() => {
		if (!mapInstance || !resolvedTheme) return;

		const newStyle =
			resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;

		if (currentStyleRef.current === newStyle) return;

		clearStyleTimeout();
		currentStyleRef.current = newStyle;
		setIsStyleLoaded(false);

		mapInstance.setStyle(newStyle, { diff: true });
	}, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);

	const contextValue = useMemo(
		() => ({
			map: mapInstance,
			isLoaded: isLoaded && isStyleLoaded,
		}),
		[mapInstance, isLoaded, isStyleLoaded],
	);

	return (
		<MapContext.Provider value={contextValue}>
			<div
				ref={containerRef}
				className={cn("relative h-full w-full", className)}
			>
				{(!isLoaded || loading) && <DefaultLoader />}
				{mapInstance && children}
			</div>
		</MapContext.Provider>
	);
});

export type { MapProps, MapRef, MapStyleOption, MapViewport };
export { MapView };
