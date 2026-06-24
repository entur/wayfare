import type { RecentStop } from "../../lib/recent-stops-storage";
import type { PlaceReference } from "../../types/common";
import type { EstimatedCall } from "../../types/departures";
import SegmentedControl from "../ui/SegmentedControl";
import StopsPanel from "./StopsPanel";
import ZonesPanel, { type ZoneSlot } from "./ZonesPanel";

export interface SelectedStop {
	id: string;
	name: string;
	coordinates: [number, number];
	modes: string[];
}

export type PanelMode = "stops" | "zones";

interface Props {
	panelMode: PanelMode;
	onPanelModeChange: (mode: PanelMode) => void;

	// Stops mode
	selectedStop: SelectedStop | null;
	onPlaceSearch: (place: PlaceReference | null) => void;
	onPickRecent: (stop: RecentStop) => void;
	onTravelFrom: (stop: SelectedStop) => void;
	onTravelTo: (stop: SelectedStop) => void;
	onClose: () => void;
	selectedJourneyId?: string | null;
	onSelectDeparture?: (call: EstimatedCall) => void;

	// Zones mode
	zoneFrom: PlaceReference | null;
	zoneTo: PlaceReference | null;
	onZoneFromChange: (place: PlaceReference | null) => void;
	onZoneToChange: (place: PlaceReference | null) => void;
	nextZoneSlot: ZoneSlot;
	onNextZoneSlotChange: (slot: ZoneSlot) => void;
	hiddenOperators: Set<string>;
	onToggleOperator: (op: string) => void;
	onToggleAllOperators: () => void;
	onSearchTripsWithZones: () => void;
}

const MODE_OPTIONS = [
	{ value: "stops" as const, label: "Stops" },
	{ value: "zones" as const, label: "Zones" },
];

export default function MapSidebar({
	panelMode,
	onPanelModeChange,
	selectedStop,
	onPlaceSearch,
	onPickRecent,
	onTravelFrom,
	onTravelTo,
	onClose,
	selectedJourneyId,
	onSelectDeparture,
	zoneFrom,
	zoneTo,
	onZoneFromChange,
	onZoneToChange,
	nextZoneSlot,
	onNextZoneSlotChange,
	hiddenOperators,
	onToggleOperator,
	onToggleAllOperators,
	onSearchTripsWithZones,
}: Props) {
	return (
		<div className="flex flex-col md:h-full md:overflow-y-auto">
			<div className="sticky top-0 z-10 border-b border-wayfare-line bg-wayfare-surface-strong p-3">
				<SegmentedControl
					legend="Map mode"
					options={MODE_OPTIONS}
					value={panelMode}
					onChange={onPanelModeChange}
				/>
			</div>
			{panelMode === "stops" ? (
				<StopsPanel
					selectedStop={selectedStop}
					onPlaceSearch={onPlaceSearch}
					onPickRecent={onPickRecent}
					onTravelFrom={onTravelFrom}
					onTravelTo={onTravelTo}
					onClose={onClose}
					selectedJourneyId={selectedJourneyId}
					onSelectDeparture={onSelectDeparture}
				/>
			) : (
				<ZonesPanel
					from={zoneFrom}
					to={zoneTo}
					onFromChange={onZoneFromChange}
					onToChange={onZoneToChange}
					nextSlot={nextZoneSlot}
					onNextSlotChange={onNextZoneSlotChange}
					hiddenOperators={hiddenOperators}
					onToggleOperator={onToggleOperator}
					onToggleAllOperators={onToggleAllOperators}
					onSearchTrips={onSearchTripsWithZones}
				/>
			)}
		</div>
	);
}
