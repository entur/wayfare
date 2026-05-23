import { X } from "lucide-react";
import MapLibreGL, { type PopupOptions } from "maplibre-gl";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import { useMap } from "./context";

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

type MapPopupProps = {
	/** Longitude coordinate for popup position */
	longitude: number;
	/** Latitude coordinate for popup position */
	latitude: number;
	/** Callback when popup is closed */
	onClose?: () => void;
	/** Popup content */
	children: ReactNode;
	/** Additional CSS classes for the popup container */
	className?: string;
	/** Show a close button in the popup (default: false) */
	closeButton?: boolean;
} & Omit<PopupOptions, "className" | "closeButton">;

function MapPopup({
	longitude,
	latitude,
	onClose,
	children,
	className,
	closeButton = false,
	...popupOptions
}: MapPopupProps) {
	const { map } = useMap();
	const popupOptionsRef = useRef(popupOptions);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;
	const container = useMemo(() => document.createElement("div"), []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	const popup = useMemo(() => {
		const popupInstance = new MapLibreGL.Popup({
			className: "map-popup",
			offset: 16,
			...popupOptions,
			closeButton: false,
		})
			.setMaxWidth("none")
			.setLngLat([longitude, latitude]);

		return popupInstance;
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		if (!map) return;

		const onCloseProp = () => onCloseRef.current?.();

		popup.on("close", onCloseProp);

		popup.setDOMContent(container);
		popup.addTo(map);

		return () => {
			popup.off("close", onCloseProp);
			if (popup.isOpen()) {
				popup.remove();
			}
		};
	}, [map]);

	if (popup.isOpen()) {
		const prev = popupOptionsRef.current;

		if (
			popup.getLngLat().lng !== longitude ||
			popup.getLngLat().lat !== latitude
		) {
			popup.setLngLat([longitude, latitude]);
		}

		if (prev.offset !== popupOptions.offset) {
			popup.setOffset(popupOptions.offset ?? 16);
		}
		if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
			popup.setMaxWidth(popupOptions.maxWidth ?? "none");
		}
		popupOptionsRef.current = popupOptions;
	}

	const handleClose = () => {
		popup.remove();
	};

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

export { MapPopup };
