import { useState } from "react";
import type { QuickRoute } from "./QuickRouteSection";

const travelerLabels = {
	ADULT: "adult",
	CHILD: "child",
	YOUTH: "youth",
	SENIOR: "senior",
	INFANT: "infant",
	STUDENT: "student",
	MILITARY: "military",
} as const;

function travelerSummary(route: QuickRoute): string {
	return route.travelers
		.filter((group) => group.count > 0)
		.map((group) => {
			const label = travelerLabels[group.ageGroup];
			const plural = label === "child" ? "children" : `${label}s`;
			return `${group.count} ${group.count === 1 ? label : plural}`;
		})
		.join(", ");
}

interface RecentRoutesSectionProps {
	routes: QuickRoute[];
	onSelect: (route: QuickRoute) => void;
}

export default function RecentRoutesSection({
	routes,
	onSelect,
}: RecentRoutesSectionProps) {
	const [expanded, setExpanded] = useState(false);
	if (routes.length === 0) return null;

	const visibleRoutes = expanded ? routes : routes.slice(0, 2);
	return (
		<section>
			<div className="mb-2 flex items-center justify-between">
				<h2 className="text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					Recent searches
				</h2>
				{routes.length > 2 && (
					<button
						type="button"
						onClick={() => setExpanded((value) => !value)}
						className="text-xs text-wayfare-primary hover:opacity-70"
					>
						{expanded ? "Show less" : "See all"}
					</button>
				)}
			</div>
			<div className="divide-y divide-wayfare-line rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
				{visibleRoutes.map((route) => {
					const from = route.from.name ?? route.from.placeId;
					const to = route.to.name ?? route.to.placeId;
					const travelers = travelerSummary(route);
					return (
						<div
							key={route.id}
							className="flex min-w-0 items-center gap-2 px-3 py-2"
						>
							<div className="min-w-0 flex-1">
								<p
									className="truncate text-sm text-wayfare-text"
									title={`${from} to ${to}`}
								>
									{from} → {to}
								</p>
								<p className="text-xs text-wayfare-text-secondary">
									{travelers}
								</p>
							</div>
							<button
								type="button"
								onClick={() => onSelect(route)}
								className="shrink-0 text-sm font-medium text-wayfare-primary hover:opacity-70"
								aria-label={`Search again from ${from} to ${to}, ${travelers}`}
							>
								Search again
							</button>
						</div>
					);
				})}
			</div>
		</section>
	);
}
