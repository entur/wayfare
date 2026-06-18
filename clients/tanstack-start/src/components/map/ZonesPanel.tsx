import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { OPERATOR_NAMES } from "../../lib/zone-utils";
import type { PlaceReference } from "../../types/common";
import ZoneSelector from "../search/ZoneSelector";
import SegmentedControl from "../ui/SegmentedControl";

export type ZoneSlot = "from" | "to";

const ALL_OPERATORS = Object.keys(OPERATOR_NAMES).sort((a, b) =>
	OPERATOR_NAMES[a].localeCompare(OPERATOR_NAMES[b]),
);

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

interface Props {
	from: PlaceReference | null;
	to: PlaceReference | null;
	onFromChange: (place: PlaceReference | null) => void;
	onToChange: (place: PlaceReference | null) => void;
	nextSlot: ZoneSlot;
	onNextSlotChange: (slot: ZoneSlot) => void;
	hiddenOperators: Set<string>;
	onToggleOperator: (op: string) => void;
	onToggleAllOperators: () => void;
	onSearchTrips: () => void;
}

const SLOT_OPTIONS = [
	{ value: "from" as const, label: "From" },
	{ value: "to" as const, label: "To" },
];

export default function ZonesPanel({
	from,
	to,
	onFromChange,
	onToChange,
	nextSlot,
	onNextSlotChange,
	hiddenOperators,
	onToggleOperator,
	onToggleAllOperators,
	onSearchTrips,
}: Props) {
	const [operatorsCollapsed, setOperatorsCollapsed] = useState(true);
	const allHidden = hiddenOperators.size === ALL_OPERATORS.length;
	const bothPicked = Boolean(from?.type === "zone" && to?.type === "zone");

	return (
		<div className="mobile-tabbar-pad flex flex-col gap-4 p-4">
			<div>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					Next tap fills
				</p>
				<SegmentedControl
					legend="Next zone tap fills"
					options={SLOT_OPTIONS}
					value={nextSlot}
					onChange={onNextSlotChange}
				/>
				<p className="mt-2 text-xs text-wayfare-text-secondary">
					Tap any zone on the map to set it as the{" "}
					{nextSlot === "from" ? "departure" : "destination"} zone, or search
					below.
				</p>
			</div>

			<ZoneSelector
				from={from}
				to={to}
				onFromChange={onFromChange}
				onToChange={onToChange}
			/>

			<button
				type="button"
				onClick={onSearchTrips}
				disabled={!bothPicked}
				className="flex items-center justify-center gap-2 rounded-lg bg-wayfare-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
			>
				<Search className="size-4" />
				Search trips with these zones
			</button>

			<div className="rounded-lg border border-wayfare-line bg-wayfare-surface">
				<button
					type="button"
					onClick={() => setOperatorsCollapsed((v) => !v)}
					className="flex w-full items-center justify-between px-3 py-2 text-left"
				>
					<span className="text-xs font-semibold uppercase tracking-wide text-wayfare-text">
						Operators
					</span>
					<ChevronDown
						className={`size-4 text-wayfare-text-secondary transition-transform ${operatorsCollapsed ? "" : "rotate-180"}`}
					/>
				</button>
				{!operatorsCollapsed && (
					<div className="border-t border-wayfare-line px-2 pb-2 pt-1">
						<button
							type="button"
							onClick={onToggleAllOperators}
							className="mb-1 w-full rounded px-1.5 py-1 text-left text-xs text-wayfare-text-secondary hover:bg-wayfare-bg"
						>
							{allHidden ? "Show all" : "Hide all"}
						</button>
						<div className="space-y-0.5">
							{ALL_OPERATORS.map((op) => {
								const visible = !hiddenOperators.has(op);
								return (
									<button
										key={op}
										type="button"
										onClick={() => onToggleOperator(op)}
										className={`flex w-full items-center gap-2 rounded px-1.5 py-1.5 text-left transition-opacity hover:bg-wayfare-bg ${visible ? "" : "opacity-40"}`}
									>
										<span
											className="size-3 shrink-0 rounded-sm"
											style={{ backgroundColor: OPERATOR_FILL_COLORS[op] }}
										/>
										<span className="truncate text-sm text-wayfare-text">
											{OPERATOR_NAMES[op]}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
