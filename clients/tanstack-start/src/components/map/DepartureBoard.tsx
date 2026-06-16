import { useState } from "react";
import { groupByQuay } from "../../lib/departure-time";
import type { EstimatedCall } from "../../types/departures";
import DepartureRow from "./DepartureRow";

const VISIBLE_PER_QUAY = 5;

interface Props {
	calls: EstimatedCall[];
}

export default function DepartureBoard({ calls }: Props) {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	if (calls.length === 0) {
		return (
			<div className="px-4 py-8 text-center text-sm text-wayfare-text-secondary">
				No upcoming departures
			</div>
		);
	}

	const groups = groupByQuay(calls);
	const now = new Date();

	return (
		<div className="flex flex-col gap-4">
			{groups.map((group) => {
				const isExpanded = expanded.has(group.quay.id);
				const visible = isExpanded
					? group.calls
					: group.calls.slice(0, VISIBLE_PER_QUAY);
				const hiddenCount = group.calls.length - visible.length;
				const label = group.quay.publicCode
					? `Platform ${group.quay.publicCode}`
					: "Other";

				return (
					<section key={group.quay.id}>
						<div className="mb-1 flex items-center justify-between px-1">
							<span className="text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
								{label}
							</span>
							<span className="text-[10px] text-wayfare-text-secondary">
								{group.calls.length} departures
							</span>
						</div>
						<ul className="divide-y divide-wayfare-line rounded-lg border border-wayfare-line bg-wayfare-surface px-3">
							{visible.map((c) => (
								<DepartureRow
									key={`${group.quay.id}-${c.expectedDepartureTime}-${c.serviceJourney?.line?.publicCode ?? ""}-${c.destinationDisplay?.frontText ?? ""}`}
									call={c}
									now={now}
								/>
							))}
						</ul>
						{hiddenCount > 0 && (
							<button
								type="button"
								onClick={() =>
									setExpanded((prev) => {
										const next = new Set(prev);
										next.add(group.quay.id);
										return next;
									})
								}
								className="mt-1 w-full rounded-md px-2 py-1 text-xs text-wayfare-text-secondary hover:bg-wayfare-bg"
							>
								Show {hiddenCount} more
							</button>
						)}
					</section>
				);
			})}
		</div>
	);
}
