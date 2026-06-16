import { ChevronUp } from "lucide-react";
import { useState } from "react";

type Snap = "peek" | "half" | "full";

const HEIGHTS: Record<Snap, string> = {
	peek: "96px",
	half: "50vh",
	full: "90vh",
};

interface Props {
	children: React.ReactNode;
	initialSnap?: Snap;
}

export default function MapBottomSheet({
	children,
	initialSnap = "peek",
}: Props) {
	const [snap, setSnap] = useState<Snap>(initialSnap);

	function cycleUp() {
		setSnap((s) => (s === "peek" ? "half" : s === "half" ? "full" : "peek"));
	}

	return (
		<div
			className="pointer-events-auto fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-2xl border-t border-wayfare-line bg-wayfare-surface shadow-2xl transition-[height] duration-200 ease-out md:hidden"
			style={{ height: HEIGHTS[snap] }}
		>
			<button
				type="button"
				onClick={cycleUp}
				aria-label="Expand panel"
				className="flex items-center justify-center py-2"
			>
				<span className="h-1 w-12 rounded-full bg-wayfare-line" />
				<ChevronUp className="ml-2 size-4 text-wayfare-text-secondary" />
			</button>
			<div className="flex-1 overflow-y-auto">{children}</div>
		</div>
	);
}
