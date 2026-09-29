import { TrainCarIcon } from "@entur/icons";

type CarriageSelectorProps = {
	elements: Array<{
		carriageId: string;
		carriageIdentifier: string;
		/** Deck (floor) identifier, for multi-deck vehicles where it's worth distinguishing. */
		deck?: string;
	}>;
	selectedIdx: number;
	onSelect: (idx: number) => void;
};

export function CarriageSelector({
	elements,
	selectedIdx,
	onSelect,
}: CarriageSelectorProps) {
	return (
		<div className="overflow-x-auto px-1 pb-2">
			<div className="flex gap-1">
				{elements.map(({ carriageId, carriageIdentifier, deck }, idx) => {
					const isSelected = idx === selectedIdx;
					return (
						<button
							key={carriageId}
							type="button"
							onClick={() => onSelect(idx)}
							className={`flex shrink-0 flex-col items-center gap-1 rounded-sm px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wayfare-primary focus-visible:ring-offset-1 ${
								isSelected
									? "text-wayfare-primary"
									: "text-wayfare-text-secondary hover:text-wayfare-text"
							}`}
							aria-label={
								deck
									? `Carriage ${carriageIdentifier}, deck ${deck}`
									: `Carriage ${carriageIdentifier}`
							}
							aria-pressed={isSelected}
						>
							<TrainCarIcon aria-hidden="true" className="h-6 w-6" />
							<div
								className={`h-0.5 w-full ${
									isSelected ? "bg-wayfare-primary" : "bg-transparent"
								}`}
							/>
							<span className="text-xs font-semibold">
								{carriageIdentifier}
							</span>
							{deck && (
								<span className="text-[10px] leading-none text-wayfare-text-secondary">
									Deck {deck}
								</span>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
