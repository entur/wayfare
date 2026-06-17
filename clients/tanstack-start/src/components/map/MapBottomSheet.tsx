import { useEffect, useRef, useState } from "react";

type Snap = "peek" | "half" | "full";

const HEIGHTS: Record<Snap, string> = {
	peek: "calc(96px + 3.5rem + env(safe-area-inset-bottom))",
	half: "50vh",
	full: "90vh",
};

const DRAG_THRESHOLD_PX = 8;
const FLICK_VELOCITY = 0.6;

interface Props {
	children: React.ReactNode;
	desiredSnap?: Snap;
}

function snapHeights(viewportH: number): Record<Snap, number> {
	return {
		peek: 152,
		half: viewportH * 0.5,
		full: viewportH * 0.9,
	};
}

function nearestSnap(heightPx: number, viewportH: number): Snap {
	const heights = snapHeights(viewportH);
	let best: Snap = "peek";
	let bestDist = Infinity;
	for (const s of ["peek", "half", "full"] as const) {
		const d = Math.abs(heights[s] - heightPx);
		if (d < bestDist) {
			bestDist = d;
			best = s;
		}
	}
	return best;
}

export default function MapBottomSheet({
	children,
	desiredSnap = "peek",
}: Props) {
	const [snap, setSnap] = useState<Snap>(desiredSnap);
	const [dragHeight, setDragHeight] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const prevDesired = useRef(desiredSnap);
	const dragStart = useRef<{
		y: number;
		height: number;
		t: number;
		startedOnContent: boolean;
	} | null>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (prevDesired.current !== desiredSnap) {
			prevDesired.current = desiredSnap;
			setSnap(desiredSnap);
		}
	}, [desiredSnap]);

	useEffect(() => {
		if (snap !== "full" && contentRef.current) {
			contentRef.current.scrollTop = 0;
		}
	}, [snap]);

	function cycleUp() {
		setSnap((s) => (s === "peek" ? "half" : s === "half" ? "full" : "peek"));
	}

	function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
		if (!sheetRef.current) return;
		if (e.pointerType === "mouse" && e.button !== 0) return;
		const rect = sheetRef.current.getBoundingClientRect();
		const target = e.target as Node;
		const startedOnContent = contentRef.current?.contains(target) ?? false;
		dragStart.current = {
			y: e.clientY,
			height: rect.height,
			t: performance.now(),
			startedOnContent,
		};
	}

	function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
		const start = dragStart.current;
		if (!start) return;

		if (snap === "full" && start.startedOnContent && !isDragging) {
			const scrollTop = contentRef.current?.scrollTop ?? 0;
			const dyPeek = start.y - e.clientY;
			if (scrollTop > 0 || dyPeek >= 0) {
				start.y = e.clientY;
				start.height =
					sheetRef.current?.getBoundingClientRect().height ?? start.height;
				start.t = performance.now();
				return;
			}
		}

		const dy = start.y - e.clientY;
		if (!isDragging && Math.abs(dy) < DRAG_THRESHOLD_PX) return;
		if (!isDragging) {
			setIsDragging(true);
			sheetRef.current?.setPointerCapture(e.pointerId);
		}
		const next = Math.min(
			Math.max(start.height + dy, 64),
			window.innerHeight * 0.95,
		);
		setDragHeight(next);
	}

	function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
		if (sheetRef.current?.hasPointerCapture(e.pointerId)) {
			sheetRef.current.releasePointerCapture(e.pointerId);
		}
		const start = dragStart.current;
		dragStart.current = null;

		if (!isDragging || !start || dragHeight == null) {
			setIsDragging(false);
			setDragHeight(null);
			return;
		}

		const dy = start.y - e.clientY;
		const dt = Math.max(1, performance.now() - start.t);
		const velocity = dy / dt;

		let target: Snap;
		if (velocity > FLICK_VELOCITY) {
			target = snap === "peek" ? "half" : "full";
		} else if (velocity < -FLICK_VELOCITY) {
			target = snap === "full" ? "half" : "peek";
		} else {
			target = nearestSnap(dragHeight, window.innerHeight);
		}

		setSnap(target);
		setIsDragging(false);
		setDragHeight(null);
	}

	const heightStyle =
		isDragging && dragHeight != null ? `${dragHeight}px` : HEIGHTS[snap];
	const contentScrollable = snap === "full";

	return (
		<div
			ref={sheetRef}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			className={`pointer-events-auto fixed inset-x-0 bottom-0 z-20 flex touch-none flex-col rounded-t-2xl border-t border-wayfare-line bg-wayfare-surface-strong shadow-2xl md:hidden ${
				isDragging ? "" : "transition-[height] duration-200 ease-out"
			}`}
			style={{ height: heightStyle }}
		>
			<button
				type="button"
				onClick={cycleUp}
				aria-label={snap === "full" ? "Collapse panel" : "Expand panel"}
				className="flex items-center justify-center py-3"
			>
				<span className="h-1.5 w-12 rounded-full bg-wayfare-line" />
			</button>
			<div
				ref={contentRef}
				className={`flex-1 ${
					contentScrollable ? "touch-pan-y overflow-y-auto" : "overflow-hidden"
				}`}
			>
				{children}
			</div>
		</div>
	);
}
