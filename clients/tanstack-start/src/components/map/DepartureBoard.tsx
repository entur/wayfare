import { useState } from "react";
import { groupByQuay } from "../../lib/departure-time";
import type { EstimatedCall, QuayDepartures } from "../../types/departures";
import DepartureRow from "./DepartureRow";

const VISIBLE_PER_GROUP = 5;
const FLAT_GROUP_KEY = "__flat__";

interface Props {
	calls: EstimatedCall[];
}

function directionLabel(group: QuayDepartures): string | null {
	const seen = new Set<string>();
	const destinations: string[] = [];
	for (const c of group.calls) {
		const d = c.destinationDisplay?.frontText?.trim();
		if (d && !seen.has(d)) {
			seen.add(d);
			destinations.push(d);
			if (destinations.length === 2) break;
		}
	}
	if (destinations.length === 0) return null;
	return `Towards ${destinations.join(", ")}`;
}

function labelForGroup(
	group: QuayDepartures,
	useNames: boolean,
): string | null {
	if (group.quay.publicCode) return `Platform ${group.quay.publicCode}`;
	if (useNames && group.quay.name?.trim()) return group.quay.name.trim();
	return directionLabel(group);
}

function namesAreDistinct(groups: QuayDepartures[]): boolean {
	const names: string[] = [];
	for (const g of groups) {
		const n = g.quay.name?.trim();
		if (!n) return false;
		names.push(n);
	}
	return new Set(names).size === groups.length;
}

function shouldFlatten(labels: (string | null)[]): boolean {
	if (labels.length <= 1) return true;
	return new Set(labels).size === 1; // all identical (incl. all-null)
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
	const useNames = namesAreDistinct(groups);
	const labels = groups.map((g) => labelForGroup(g, useNames));
	const flat = shouldFlatten(labels);

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
			{groups.map((group, idx) => {
				const label = labels[idx] ?? "Other";
				return renderList(group.quay.id, group.calls, label);
			})}
		</div>
	);
}
