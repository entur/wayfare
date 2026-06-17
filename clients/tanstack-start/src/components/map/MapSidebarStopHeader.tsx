import { MapPin, Navigation, X } from "lucide-react";

interface Props {
	name: string;
	modes: string[];
	onTravelFrom: () => void;
	onTravelTo: () => void;
	onClose: () => void;
}

export default function MapSidebarStopHeader({
	name,
	modes,
	onTravelFrom,
	onTravelTo,
	onClose,
}: Props) {
	return (
		<div className="border-b border-wayfare-line px-4 pb-3 pt-4">
			<div className="mb-2 flex items-start justify-between gap-2">
				<h2 className="text-base font-semibold text-wayfare-text">{name}</h2>
				<button
					type="button"
					onClick={onClose}
					aria-label="Clear selection"
					className="rounded-md p-1 text-wayfare-text-secondary hover:bg-wayfare-bg"
				>
					<X className="size-4" />
				</button>
			</div>
			{modes.length > 0 && (
				<div className="mb-3 flex flex-wrap gap-1">
					{modes.map((m) => (
						<span
							key={m}
							className="rounded-full bg-wayfare-bg px-2 py-0.5 text-[10px] uppercase tracking-wide text-wayfare-text-secondary"
						>
							{m}
						</span>
					))}
				</div>
			)}
			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					onClick={onTravelFrom}
					className="flex items-center justify-center gap-1.5 rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm font-medium text-wayfare-text hover:bg-wayfare-bg"
				>
					<Navigation className="size-4" />
					Travel from
				</button>
				<button
					type="button"
					onClick={onTravelTo}
					className="flex items-center justify-center gap-1.5 rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm font-medium text-wayfare-text hover:bg-wayfare-bg"
				>
					<MapPin className="size-4" />
					Travel to
				</button>
			</div>
		</div>
	);
}
