import { useState } from "react";
import { groupByQuay } from "../../lib/departure-time";
import type { EstimatedCall, QuayDepartures } from "../../types/departures";
import DepartureRow from "./DepartureRow";

const VISIBLE_PER_GROUP = 5;
const FLAT_GROUP_KEY = "__flat__";

interface Props {
	calls: EstimatedCall[];
}

function quayLabel(group: QuayDepartures): string | null {
	if (group.quay.publicCode) return `Platform ${group.quay.publicCode}`;
	if (group.quay.name?.trim()) return group.quay.name.trim();
	return null;
}

function shouldFlatten(groups: QuayDepartures[]): boolean {
	if (groups.length <= 1) return true;
	const labels = groups.map(quayLabel);
	const unique = new Set(labels);
	if (unique.size === 1) return true; // all identical (incl. all-null)
	return false;
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
	const flat = shouldFlatten(groups);

	const renderList = (
		key: string,
		groupCalls: EstimatedCall[],
		label: string | null,
	) => {
		const isExpanded = expanded.has(key);
		const visible = isExpanded
			? groupCalls
			: groupCalls.slice(0, VISIBLE_PER_GROUP);
		const hiddenCount = groupCalls.length - visible.length;
		return (
			<section key={key}>
				{label && (
					<div className="mb-1 flex items-center justify-between px-1">
						<span className="text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							{label}
						</span>
						<span className="text-[10px] text-wayfare-text-secondary">
							{groupCalls.length} departures
						</span>
					</div>
				)}
				<ul className="divide-y divide-wayfare-line rounded-lg border border-wayfare-line bg-wayfare-surface px-3">
					{visible.map((c) => (
						<DepartureRow
							key={`${key}-${c.aimedDepartureTime}-${c.serviceJourney?.line?.publicCode ?? ""}-${c.destinationDisplay?.frontText ?? ""}`}
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
								next.add(key);
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
	};

	if (flat) {
		return (
			<div className="flex flex-col gap-4">
				{renderList(FLAT_GROUP_KEY, calls, null)}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{groups.map((group) => {
				const label = quayLabel(group) ?? "Other";
				return renderList(group.quay.id, group.calls, label);
			})}
		</div>
	);
}
