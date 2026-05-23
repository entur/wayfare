import { X } from "lucide-react";
import MapLibreGL, { type MarkerOptions, type PopupOptions } from "maplibre-gl";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { useMap } from "./context";

type MarkerContextValue = {
	marker: MapLibreGL.Marker;
	map: MapLibreGL.Map | null;
};

const MarkerContext = createContext<MarkerContextValue | null>(null);

function useMarkerContext() {
	const context = useContext(MarkerContext);
	if (!context) {
		throw new Error("Marker components must be used within MapMarker");
	}
	return context;
}

type MapMarkerProps = {
	/** Longitude coordinate for marker position */
	longitude: number;
	/** Latitude coordinate for marker position */
	latitude: number;
	/** Marker subcomponents (MarkerContent, MarkerPopup, MarkerTooltip, MarkerLabel) */
	children: ReactNode;
	/** Callback when marker is clicked */
	onClick?: (e: MouseEvent) => void;
	/** Callback when mouse enters marker */
	onMouseEnter?: (e: MouseEvent) => void;
	/** Callback when mouse leaves marker */
	onMouseLeave?: (e: MouseEvent) => void;
	/** Callback when marker drag starts (requires draggable: true) */
	onDragStart?: (lngLat: { lng: number; lat: number }) => void;
	/** Callback during marker drag (requires draggable: true) */
	onDrag?: (lngLat: { lng: number; lat: number }) => void;
	/** Callback when marker drag ends (requires draggable: true) */
	onDragEnd?: (lngLat: { lng: number; lat: number }) => void;
} & Omit<MarkerOptions, "element">;

function MapMarker({
	longitude,
	latitude,
	children,
	onClick,
	onMouseEnter,
	onMouseLeave,
	onDragStart,
	onDrag,
	onDragEnd,
	draggable = false,
	...markerOptions
}: MapMarkerProps) {
	const { map } = useMap();

	const callbacksRef = useRef({
		onClick,
		onMouseEnter,
		onMouseLeave,
		onDragStart,
		onDrag,
		onDragEnd,
	});
	callbacksRef.current = {
		onClick,
		onMouseEnter,
		onMouseLeave,
		onDragStart,
		onDrag,
		onDragEnd,
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	const marker = useMemo(() => {
		const markerInstance = new MapLibreGL.Marker({
			...markerOptions,
			element: document.createElement("div"),
			draggable,
		}).setLngLat([longitude, latitude]);

		const handleClick = (e: MouseEvent) => callbacksRef.current.onClick?.(e);
		const handleMouseEnter = (e: MouseEvent) =>
			callbacksRef.current.onMouseEnter?.(e);
		const handleMouseLeave = (e: MouseEvent) =>
			callbacksRef.current.onMouseLeave?.(e);

		markerInstance.getElement()?.addEventListener("click", handleClick);
		markerInstance
			.getElement()
			?.addEventListener("mouseenter", handleMouseEnter);
		markerInstance
			.getElement()
			?.addEventListener("mouseleave", handleMouseLeave);

		const handleDragStart = () => {
			const lngLat = markerInstance.getLngLat();
			callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDrag = () => {
			const lngLat = markerInstance.getLngLat();
			callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat });
		};
		const handleDragEnd = () => {
			const lngLat = markerInstance.getLngLat();
			callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat });
		};

		markerInstance.on("dragstart", handleDragStart);
		markerInstance.on("drag", handleDrag);
		markerInstance.on("dragend", handleDragEnd);

		return markerInstance;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!map) return;

		marker.addTo(map);

		return () => {
			marker.remove();
		};
	}, [map]);

	if (
		marker.getLngLat().lng !== longitude ||
		marker.getLngLat().lat !== latitude
	) {
		marker.setLngLat([longitude, latitude]);
	}
	if (marker.isDraggable() !== draggable) {
		marker.setDraggable(draggable);
	}

	const currentOffset = marker.getOffset();
	const newOffset = markerOptions.offset ?? [0, 0];
	const [newOffsetX, newOffsetY] = Array.isArray(newOffset)
		? newOffset
		: [newOffset.x, newOffset.y];
	if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
		marker.setOffset(newOffset);
	}

	if (marker.getRotation() !== markerOptions.rotation) {
		marker.setRotation(markerOptions.rotation ?? 0);
	}
	if (marker.getRotationAlignment() !== markerOptions.rotationAlignment) {
		marker.setRotationAlignment(markerOptions.rotationAlignment ?? "auto");
	}
	if (marker.getPitchAlignment() !== markerOptions.pitchAlignment) {
		marker.setPitchAlignment(markerOptions.pitchAlignment ?? "auto");
	}

	return (
		<MarkerContext.Provider value={{ marker, map }}>
			{children}
		</MarkerContext.Provider>
	);
}

type MarkerContentProps = {
	/** Custom marker content. Defaults to a blue dot if not provided */
	children?: ReactNode;
	/** Additional CSS classes for the marker container */
	className?: string;
};

function MarkerContent({ children, className }: MarkerContentProps) {
	const { marker } = useMarkerContext();

	return createPortal(
		<div className={cn("relative cursor-pointer", className)}>
			{children || <DefaultMarkerIcon />}
		</div>,
		marker.getElement(),
	);
}

function DefaultMarkerIcon() {
	return (
		<div className="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
	);
}

function PopupCloseButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Close popup"
			className="hover:bg-wayfare-line text-wayfare-text absolute top-0.5 right-0.5 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-wayfare-primary"
		>
			<X className="size-3.5" />
		</button>
	);
}

type MarkerPopupProps = {
	/** Popup content */
	children: ReactNode;
	/** Additional CSS classes for the popup container */
	className?: string;
	/** Show a close button in the popup (default: false) */
	closeButton?: boolean;
	/** Open the popup on hover instead of click (default: false) */
	openOnHover?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MarkerPopup({
	children,
	className,
	closeButton = false,
	openOnHover = false,
	...popupOptions
}: MarkerPopupProps) {
	const { marker, map } = useMarkerContext();
	const container = useMemo(() => document.createElement("div"), []);
	const prevPopupOptions = useRef(popupOptions);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	const popup = useMemo(() => {
		const popupInstance = new MapLibreGL.Popup({
			className: "map-popup",
			offset: 16,
			...popupOptions,
			closeButton: false,
		})
			.setMaxWidth("none")
			.setDOMContent(container);

		return popupInstance;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!map) return;

		popup.setDOMContent(container);

		if (openOnHover) {
			const el = marker.getElement();
			const handleMouseEnter = () =>
				popup.setLngLat(marker.getLngLat()).addTo(map);
			const handleMouseLeave = () => popup.remove();
			el?.addEventListener("mouseenter", handleMouseEnter);
			el?.addEventListener("mouseleave", handleMouseLeave);
			return () => {
				el?.removeEventListener("mouseenter", handleMouseEnter);
				el?.removeEventListener("mouseleave", handleMouseLeave);
				popup.remove();
			};
		}

		marker.setPopup(popup);
		return () => {
			marker.setPopup(null);
		};
	}, [map]);

	if (popup.isOpen()) {
		const prev = prevPopupOptions.current;

		if (prev.offset !== popupOptions.offset) {
			popup.setOffset(popupOptions.offset ?? 16);
		}
		if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
			popup.setMaxWidth(popupOptions.maxWidth ?? "none");
		}

		prevPopupOptions.current = popupOptions;
	}

	const handleClose = () => popup.remove();

	return createPortal(
		<div
			className={cn(
				"bg-wayfare-surface text-wayfare-text relative max-w-62 rounded-md border border-wayfare-line p-3 shadow-md",
				"animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
				className,
			)}
		>
			{closeButton && <PopupCloseButton onClick={handleClose} />}
			{children}
		</div>,
		container,
	);
}

type MarkerTooltipProps = {
	/** Tooltip content */
	children: ReactNode;
	/** Additional CSS classes for the tooltip container */
	className?: string;
} & Omit<PopupOptions, "className" | "closeButton" | "closeOnClick">;

function MarkerTooltip({
	children,
	className,
	...popupOptions
}: MarkerTooltipProps) {
	const { marker, map } = useMarkerContext();
	const container = useMemo(() => document.createElement("div"), []);
	const prevTooltipOptions = useRef(popupOptions);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	const tooltip = useMemo(() => {
		const tooltipInstance = new MapLibreGL.Popup({
			className: "map-tooltip",
			offset: 16,
			...popupOptions,
			closeOnClick: true,
			closeButton: false,
		}).setMaxWidth("none");

		return tooltipInstance;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!map) return;

		tooltip.setDOMContent(container);

		const handleMouseEnter = () => {
			tooltip.setLngLat(marker.getLngLat()).addTo(map);
		};
		const handleMouseLeave = () => tooltip.remove();

		marker.getElement()?.addEventListener("mouseenter", handleMouseEnter);
		marker.getElement()?.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			marker.getElement()?.removeEventListener("mouseenter", handleMouseEnter);
			marker.getElement()?.removeEventListener("mouseleave", handleMouseLeave);
			tooltip.remove();
		};
	}, [map]);

	if (tooltip.isOpen()) {
		const prev = prevTooltipOptions.current;

		if (prev.offset !== popupOptions.offset) {
			tooltip.setOffset(popupOptions.offset ?? 16);
		}
		if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
			tooltip.setMaxWidth(popupOptions.maxWidth ?? "none");
		}

		prevTooltipOptions.current = popupOptions;
	}

	return createPortal(
		<div
			className={cn(
				"bg-wayfare-text text-wayfare-bg pointer-events-none rounded-md px-2 py-1 text-xs text-balance shadow-md",
				"animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
				className,
			)}
		>
			{children}
		</div>,
		container,
	);
}

type MarkerLabelProps = {
	/** Label text content */
	children: ReactNode;
	/** Additional CSS classes for the label */
	className?: string;
	/** Position of the label relative to the marker (default: "top") */
	position?: "top" | "bottom";
};

function MarkerLabel({
	children,
	className,
	position = "top",
}: MarkerLabelProps) {
	const positionClasses = {
		top: "bottom-full mb-1",
		bottom: "top-full mt-1",
	};

	return (
		<div
			className={cn(
				"absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
				"text-wayfare-text text-[10px] font-medium [text-shadow:0_0_4px_var(--color-wayfare-surface-strong),0_0_4px_var(--color-wayfare-surface-strong)]",
				positionClasses[position],
				className,
			)}
		>
			{children}
		</div>
	);
}

export { MapMarker, MarkerContent, MarkerLabel, MarkerPopup, MarkerTooltip };
