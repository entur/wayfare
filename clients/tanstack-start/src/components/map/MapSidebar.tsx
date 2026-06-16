import { useEffect, useState } from "react";
import { useStopDepartures } from "../../hooks/use-stop-departures";
import {
	addRecentStop,
	getRecentStops,
	type RecentStop,
} from "../../lib/recent-stops-storage";
import type { PlaceReference } from "../../types/common";
import PlaceSearch from "../search/PlaceSearch";
import DepartureBoard from "./DepartureBoard";
import MapSidebarStopHeader from "./MapSidebarStopHeader";

export interface SelectedStop {
	id: string;
	name: string;
	coordinates: [number, number];
	modes: string[];
}

interface Props {
	selectedStop: SelectedStop | null;
	onPlaceSearch: (place: PlaceReference | null) => void;
	onPickRecent: (stop: RecentStop) => void;
	onTravelFrom: (stop: SelectedStop) => void;
	onTravelTo: (stop: SelectedStop) => void;
	onClose: () => void;
}

function formatUpdatedAt(iso: string | undefined): string {
	if (!iso) return "";
	const d = new Date(iso);
	return d.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export default function MapSidebar({
	selectedStop,
	onPlaceSearch,
	onPickRecent,
	onTravelFrom,
	onTravelTo,
	onClose,
}: Props) {
	const departures = useStopDepartures(selectedStop?.id ?? null);
	const [recent, setRecent] = useState<RecentStop[]>([]);

	useEffect(() => {
		setRecent(getRecentStops());
	}, []);

	useEffect(() => {
		if (selectedStop) {
			addRecentStop({
				id: selectedStop.id,
				name: selectedStop.name,
				coordinates: selectedStop.coordinates,
			});
			setRecent(getRecentStops());
		}
	}, [selectedStop]);

	if (!selectedStop) {
		return (
			<div className="flex h-full flex-col gap-4 p-4">
				<h2 className="text-base font-semibold text-wayfare-text">
					Explore stops
				</h2>
				<p className="text-sm text-wayfare-text-secondary">
					Click any stop on the map for live departures, or search by name.
				</p>
				<PlaceSearch
					label="Search stops"
					value={null}
					onChange={onPlaceSearch}
					placeholder="Stop or station name"
				/>
				{recent.length > 0 && (
					<div>
						<h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							Recently viewed
						</h3>
						<ul className="divide-y divide-wayfare-line rounded-lg border border-wayfare-line bg-wayfare-surface">
							{recent.map((s) => (
								<li key={s.id}>
									<button
										type="button"
										onClick={() => onPickRecent(s)}
										className="w-full px-3 py-2 text-left text-sm text-wayfare-text hover:bg-wayfare-bg"
									>
										{s.name}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<MapSidebarStopHeader
				name={selectedStop.name}
				modes={selectedStop.modes}
				onTravelFrom={() => onTravelFrom(selectedStop)}
				onTravelTo={() => onTravelTo(selectedStop)}
				onClose={onClose}
			/>
			<div className="flex-1 overflow-y-auto p-4">
				{departures.isLoading && (
					<div className="text-center text-sm text-wayfare-text-secondary">
						Loading departures…
					</div>
				)}
				{departures.isError && (
					<div className="text-center text-sm text-red-600">
						Could not load departures
					</div>
				)}
				{departures.data && (
					<>
						<DepartureBoard calls={departures.data.calls} />
						<div className="mt-3 text-right text-[10px] text-wayfare-text-secondary">
							Updated {formatUpdatedAt(departures.data.fetchedAt)} · refreshes
							every 30 s
						</div>
					</>
				)}
			</div>
		</div>
	);
}
