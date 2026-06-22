import { useState } from "react";
import { formatPrice } from "../../lib/format-price";
import { partyLabel, type TravelParty } from "../../lib/travel-party";
import {
	formatZoneList,
	getEffectiveZones,
	sortFareZones,
} from "../../lib/zone-utils";
import type { Offer, ZoneLabel } from "../../types/search";

export interface OfferBundle {
	groupKey: number | string;
	recommendationType?: string;
	offers: Offer[];
	totalPrice: number;
	currency: string;
	sequences: number[];
}

interface BundleCardProps {
	bundle: OfferBundle;
	parties?: TravelParty[];
	selected?: boolean;
	onSelect?: () => void;
}

const RECOMMENDATION_LABELS: Record<string, string> = {
	CHEAPEST: "Best price",
	FASTEST: "Fastest",
	BEST: "Best match",
};

function getOfferTravellerIds(offer: Offer): string[] {
	return [
		...new Set(
			(offer.properties?.legs ?? [])
				.map((l) => l.traveller)
				.filter(Boolean) as string[],
		),
	];
}

function getOfferFareZones(offer: Offer): ZoneLabel[] {
	return getEffectiveZones(offer.properties?.summary?.geographicalValidity);
}

function getBundleFareZones(offers: Offer[]): ZoneLabel[] {
	const merged = new Map<string, ZoneLabel>();
	for (const offer of offers) {
		for (const zone of getOfferFareZones(offer)) merged.set(zone.id, zone);
	}
	return sortFareZones([...merged.values()]);
}

export function buildBundles(offers: Offer[]): OfferBundle[] {
	const grouped = new Map<number | string, Offer[]>();
	let syntheticIdx = 0;

	for (const offer of offers) {
		const recommendationGroup = offer.properties?.summary?.recommendationGroup;
		if (recommendationGroup != null) {
			if (!grouped.has(recommendationGroup))
				grouped.set(recommendationGroup, []);
			grouped.get(recommendationGroup)?.push(offer);
		} else {
			grouped.set(offer.id ?? `synthetic:${syntheticIdx++}`, [offer]);
		}
	}

	const bundles: OfferBundle[] = [];
	for (const [groupKey, groupOffers] of grouped.entries()) {
		const sorted = [...groupOffers].sort(
			(a, b) =>
				(a.properties?.summary?.recommendationRank ?? 0) -
				(b.properties?.summary?.recommendationRank ?? 0),
		);
		const recommendationType =
			sorted[0]?.properties?.summary?.recommendationType;
		const totalPrice = sorted.reduce(
			(sum, o) => sum + (o.properties?.price?.amount ?? 0),
			0,
		);
		const currency = sorted[0]?.properties?.price?.currencyCode ?? "NOK";
		const sequences = [
			...new Set(
				sorted.flatMap((o) =>
					(o.properties?.legs ?? [])
						.map((l) => l.sequenceNumber)
						.filter((s): s is number => s != null),
				),
			),
		].sort((a, b) => a - b);
		bundles.push({
			groupKey,
			recommendationType,
			offers: sorted,
			totalPrice,
			currency,
			sequences,
		});
	}

	return bundles.sort((a, b) => {
		if (typeof a.groupKey === "number" && typeof b.groupKey === "number")
			return a.groupKey - b.groupKey;
		if (typeof a.groupKey === "number") return -1;
		if (typeof b.groupKey === "number") return 1;
		return 0;
	});
}

export default function BundleCard({
	bundle,
	parties = [],
	selected = false,
	onSelect,
}: BundleCardProps) {
	const [expanded, setExpanded] = useState(false);

	const typeLabel = bundle.recommendationType
		? (RECOMMENDATION_LABELS[bundle.recommendationType] ??
			bundle.recommendationType)
		: null;

	const offerCount = bundle.offers.length;

	const bundlePartyIds = new Set(bundle.offers.flatMap(getOfferTravellerIds));
	const coveredParties = parties.filter((p) => bundlePartyIds.has(p.id));
	const bundleZones = getBundleFareZones(bundle.offers);

	return (
		<label
			className={`block cursor-pointer rounded-xl border p-4 transition-all ${selected ? "border-wayfare-primary bg-wayfare-accent-soft" : "border-wayfare-line bg-wayfare-surface-strong"}`}
		>
			<input
				type="checkbox"
				checked={selected}
				onChange={() => onSelect?.()}
				className="sr-only"
			/>
			<div className="flex items-start gap-3">
				<div
					className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors ${selected ? "border-wayfare-primary bg-wayfare-primary" : "border-wayfare-text-secondary"}`}
				>
					{selected && (
						<svg
							viewBox="0 0 10 8"
							className="h-2.5 w-2.5"
							fill="none"
							stroke="white"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M1 4l3 3 5-6" />
						</svg>
					)}
				</div>

				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2">
							{typeLabel ? (
								<span
									className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
									style={{
										background: "rgba(22,163,74,0.10)",
										color: "rgb(22,163,74)",
									}}
								>
									{typeLabel}
								</span>
							) : (
								<span className="text-sm font-semibold text-wayfare-text">
									{bundle.offers[0]?.properties?.summary?.name ??
										bundle.offers[0]?.properties?.products?.[0]?.productName ??
										"Travel offer"}
								</span>
							)}
						</div>
						<span className="shrink-0 text-sm font-bold text-wayfare-primary">
							{formatPrice(bundle.totalPrice, bundle.currency)}
						</span>
					</div>

					{coveredParties.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{coveredParties.map((p) => (
								<span
									key={p.id}
									className="inline-flex items-center rounded-full border border-wayfare-line bg-wayfare-bg px-2 py-0.5 text-xs text-wayfare-text-secondary"
								>
									{partyLabel(p)}
								</span>
							))}
						</div>
					)}

					{bundleZones.length > 0 && (
						<p className="m-0 mt-2 text-xs text-wayfare-text-secondary">
							<span className="font-semibold">Valid in:</span>{" "}
							{formatZoneList(bundleZones)}
						</p>
					)}

					{offerCount > 1 && (
						<>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									setExpanded((v) => !v);
								}}
								className="mt-2 flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-xs text-wayfare-primary"
							>
								<span>{expanded ? "▾" : "▸"}</span>
								{`${offerCount} included offers`}
							</button>

							{expanded && (
								<div className="mt-3 flex flex-col gap-2.5 border-t border-wayfare-line pt-3">
									{bundle.offers.map((offer) => {
										const name =
											offer.properties?.summary?.name ??
											offer.properties?.products?.[0]?.productName ??
											"Travel offer";
										const price = offer.properties?.price;
										const ids = getOfferTravellerIds(offer);
										const offerParties = parties.filter((p) =>
											ids.includes(p.id),
										);

										const travellerText =
											offerParties.length > 0
												? offerParties.map(partyLabel).join(", ")
												: ids.length > 0
													? `${ids.length} traveller${ids.length !== 1 ? "s" : ""}`
													: null;
										const offerZones = sortFareZones(getOfferFareZones(offer));

										return (
											<div
												key={offer.id}
												className="flex items-start justify-between gap-3"
											>
												<div className="min-w-0">
													<p className="m-0 text-xs font-medium text-wayfare-text">
														{name}
													</p>
													{travellerText && (
														<p className="m-0 text-xs text-wayfare-text-secondary">
															{travellerText}
														</p>
													)}
													{offerZones.length > 0 && (
														<p className="m-0 text-xs text-wayfare-text-secondary">
															{formatZoneList(offerZones)}
														</p>
													)}
												</div>
												{price && (
													<span className="shrink-0 text-xs font-semibold text-wayfare-text">
														{formatPrice(
															price.amount,
															price.currencyCode ?? "NOK",
														)}
													</span>
												)}
											</div>
										);
									})}
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</label>
	);
}
