import {
	FavoriteRouteIcon,
	StarredIcon,
	UnstarredIcon,
	UsersIcon,
} from "@entur/icons";
import { TravelHeader } from "@entur/travel";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { TimeMode, TravelerGroup } from "../../context/search-form";
import type { FavoriteRoute } from "../../lib/favorites-storage";
import {
	addFavorite,
	isFavorite,
	removeFavorite,
} from "../../lib/favorites-storage";
import type { RecentSearch } from "../../lib/recent-searches-storage";
import type { PlaceReference } from "../../types/common";

export interface QuickRoute {
	id: string;
	from: PlaceReference;
	to: PlaceReference;
	timeMode: TimeMode;
	travelDate: string;
	travelers: TravelerGroup[];
	isSavedFavorite?: boolean;
}

interface QuickRouteSectionProps {
	title: string;
	routes: QuickRoute[];
	showManageLink?: boolean;
	onSelect: (route: QuickRoute) => void;
	onRemove?: (id: string) => void;
}

function RouteCard({
	route,
	onSelect,
	onRemove,
}: {
	route: QuickRoute;
	onSelect: (r: QuickRoute) => void;
	onRemove?: (id: string) => void;
}) {
	const [fav, setFav] = useState(() => isFavorite(route.from, route.to));

	function toggleFavorite(e: React.MouseEvent) {
		e.stopPropagation();
		if (fav) {
			removeFavorite(fav.id);
			setFav(undefined);
		} else {
			const entry = addFavorite(route.from, route.to);
			setFav(entry);
		}
	}

	function handleRemove(e: React.MouseEvent) {
		e.stopPropagation();
		onRemove?.(route.id);
	}

	const fromName = route.from.name ?? route.from.placeId;
	const toName = route.to.name ?? route.to.placeId;

	return (
		<div
			className="flex min-w-0 cursor-pointer items-start gap-2 rounded-xl border p-3 transition-colors [border-color:var(--wayfare-line)] hover:[border-color:var(--wayfare-primary)]"
			style={{ background: "var(--wayfare-surface-strong)" }}
		>
			{/* Route — clickable, takes remaining space */}
			<button
				type="button"
				onClick={() => onSelect(route)}
				className="min-w-0 flex-1 cursor-pointer text-left focus:outline-none"
				aria-label={`Search ${fromName} to ${toName}`}
				style={{
					// @ts-expect-error - css custom props
					"--components-travel-travelheader-standard-text": "#000000",
					"--components-travel-travelheader-standard-stroke-line":
						"var(--wayfare-primary)",
				}}
			>
				<TravelHeader from={fromName} to={toName} size="medium" />
				<span
					className="mt-1 flex items-center gap-1 text-xs"
					style={{ color: "var(--wayfare-text-secondary)" }}
				>
					<UsersIcon aria-hidden="true" style={{ width: 12, height: 12 }} />
					{(() => {
						const total = route.travelers.reduce((sum, t) => sum + t.count, 0);
						return `${total} ${total === 1 ? "traveller" : "travellers"}`;
					})()}
				</span>
			</button>

			{/* Right-side actions, top-aligned */}
			<div className="flex shrink-0 items-center gap-1">
				{route.isSavedFavorite ? (
					<FavoriteRouteIcon
						aria-hidden="true"
						// @ts-expect-error - style prop accepted at runtime
						style={{ color: "var(--wayfare-primary)" }}
					/>
				) : (
					<>
						<button
							type="button"
							onClick={toggleFavorite}
							aria-label={fav ? "Remove from favorites" : "Save as favorite"}
							className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:opacity-70 focus:outline-none"
							style={{
								color: fav
									? "var(--wayfare-primary)"
									: "var(--wayfare-text-secondary)",
							}}
						>
							{fav ? (
								<StarredIcon aria-hidden="true" />
							) : (
								<UnstarredIcon aria-hidden="true" />
							)}
						</button>
						{onRemove && (
							<button
								type="button"
								onClick={handleRemove}
								aria-label="Remove"
								className="flex h-6 w-6 items-center justify-center rounded-lg transition-colors hover:opacity-70 focus:outline-none"
								style={{ color: "var(--wayfare-text-secondary)" }}
							>
								<svg
									width="10"
									height="10"
									viewBox="0 0 10 10"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M1 1l8 8M9 1L1 9"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export function toQuickRoute(
	item: RecentSearch | FavoriteRoute,
	isSavedFavorite: boolean,
	defaultTravelers: TravelerGroup[],
): QuickRoute {
	if (isSavedFavorite) {
		const fav = item as FavoriteRoute;
		return {
			id: fav.id,
			from: fav.from,
			to: fav.to,
			timeMode: "now",
			travelDate: new Date().toISOString().slice(0, 16),
			travelers: defaultTravelers,
			isSavedFavorite: true,
		};
	}
	const recent = item as RecentSearch;
	return { ...recent, isSavedFavorite: false };
}

export default function QuickRouteSection({
	title,
	routes,
	showManageLink,
	onSelect,
	onRemove,
}: QuickRouteSectionProps) {
	if (routes.length === 0) return null;

	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<p
					className="text-xs font-semibold uppercase tracking-wide"
					style={{ color: "var(--wayfare-text-secondary)" }}
				>
					{title}
				</p>
				{showManageLink && (
					<Link
						to="/settings"
						search={{ tab: "favorites" }}
						className="text-xs transition-opacity hover:opacity-70"
						style={{ color: "var(--wayfare-primary)" }}
					>
						Manage
					</Link>
				)}
			</div>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{routes.map((route) => (
					<RouteCard
						key={route.id}
						route={route}
						onSelect={onSelect}
						onRemove={onRemove}
					/>
				))}
			</div>
		</div>
	);
}
