import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { formatPrice } from "../../lib/format-price";
import { getPackages } from "../../lib/ticket-storage";
import type { PlaceReference } from "../../types/common";

const MAX_PURCHASES = 3;

interface RecentPurchasesSectionProps {
	onRebook: (route: { from: PlaceReference; to: PlaceReference }) => void;
}

export default function RecentPurchasesSection({
	onRebook,
}: RecentPurchasesSectionProps) {
	const purchases = useMemo(
		() =>
			getPackages()
				.filter((p) => p.status === "CONFIRMED" && p.route)
				.slice(0, MAX_PURCHASES),
		[],
	);

	if (purchases.length === 0) return null;

	return (
		<div>
			<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
				Recent purchases
			</p>
			<div className="flex flex-col gap-2">
				{purchases.map((pkg) => {
					const from = pkg.route?.from as PlaceReference;
					const to = pkg.route?.to as PlaceReference;
					const fromName = from.name ?? from.placeId;
					const toName = to.name ?? to.placeId;
					return (
						<div
							key={pkg.packageId}
							className="flex items-center justify-between gap-3 rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-3 py-2.5 text-sm"
						>
							{/* Route */}
							<Link
								to="/tickets/$packageId"
								params={{ packageId: pkg.packageId }}
								className="flex min-w-0 flex-1 items-center gap-2 hover:opacity-70 focus:outline-none"
							>
								<span className="truncate font-medium text-wayfare-text">
									{fromName}
								</span>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									aria-hidden="true"
									className="shrink-0 text-wayfare-text-secondary"
								>
									<path
										d="M2 6h8M7 3l3 3-3 3"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span className="truncate font-medium text-wayfare-text">
									{toName}
								</span>
							</Link>

							{/* Price + rebook */}
							<div className="flex shrink-0 items-center gap-3">
								<span className="text-xs text-wayfare-text-secondary">
									{formatPrice(
										pkg.price.amount,
										pkg.price.currencyCode ?? "NOK",
									)}
								</span>
								<button
									type="button"
									onClick={() => onRebook({ from, to })}
									className="rounded-lg border border-wayfare-primary bg-wayfare-accent-soft px-2.5 py-1 text-xs font-medium text-wayfare-primary transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-wayfare-primary/30"
								>
									Rebook
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
