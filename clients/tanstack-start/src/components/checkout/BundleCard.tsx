import { useState } from "react";
import { formatPrice } from "../../lib/format-price";
import type { IndividualTraveller, Offer } from "../../types/search";

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
	travellers?: IndividualTraveller[];
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

export function buildBundles(offers: Offer[]): OfferBundle[] {
	const grouped = new Map<number | string, Offer[]>();

	for (const [idx, offer] of offers.entries()) {
		const group =
			offer.properties?.summary?.recommendationGroup ?? `ungrouped-${idx}`;
		if (!grouped.has(group)) grouped.set(group, []);
		grouped.get(group)!.push(offer);
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
	travellers = [],
	selected = false,
	onSelect,
}: BundleCardProps) {
	const [expanded, setExpanded] = useState(false);

	const typeLabel = bundle.recommendationType
		? (RECOMMENDATION_LABELS[bundle.recommendationType] ??
			bundle.recommendationType)
		: null;

	const offerCount = bundle.offers.length;

	const bundleTravellerIds = new Set(
		bundle.offers.flatMap(getOfferTravellerIds),
	);
	const coveredTravellers = travellers.filter((t) =>
		bundleTravellerIds.has(t.id),
	);

	return (
		<label
			className="block cursor-pointer rounded-xl border p-4 transition-all"
			style={{
				borderColor: selected
					? "var(--wayfare-primary)"
					: "var(--wayfare-line)",
				background: selected
					? "var(--wayfare-accent-soft)"
					: "var(--wayfare-surface-strong)",
			}}
		>
			{/* sr-only radio — clicking the label anywhere (except the button) selects it */}
			<input
				type="radio"
				name="bundle-selection"
				checked={selected}
				onChange={() => onSelect?.()}
				className="sr-only"
			/>
			<div className="flex items-start gap-3">
				{/* Visible radio indicator */}
				<div
					className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center"
					style={{
						borderColor: selected
							? "var(--wayfare-primary)"
							: "var(--wayfare-text-secondary)",
					}}
				>
					{selected && (
						<div
							className="h-2 w-2 rounded-full"
							style={{ background: "var(--wayfare-primary)" }}
						/>
					)}
				</div>

				<div className="min-w-0 flex-1">
					{/* Header: type badge + total price */}
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
								<span
									className="text-sm font-semibold"
									style={{ color: "var(--wayfare-text)" }}
								>
									{bundle.offers[0]?.properties?.summary?.name ??
										bundle.offers[0]?.properties?.products?.[0]?.productName ??
										"Travel offer"}
								</span>
							)}
						</div>
						<span
							className="shrink-0 text-sm font-bold"
							style={{ color: "var(--wayfare-primary)" }}
						>
							{formatPrice(bundle.totalPrice, bundle.currency)}
						</span>
					</div>

					{/* Traveller pills — only those covered by this bundle */}
					{coveredTravellers.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{coveredTravellers.map((t) => (
								<span
									key={t.id}
									className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
									style={{
										background: "var(--wayfare-bg)",
										color: "var(--wayfare-text-secondary)",
										border: "1px solid var(--wayfare-line)",
									}}
								>
									{t.age != null ? `${t.age} yrs` : t.id}
								</span>
							))}
						</div>
					)}

					{/* Expand/collapse toggle — clicking this must NOT propagate to the label */}
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setExpanded((v) => !v);
						}}
						className="mt-2 flex items-center gap-1 text-xs"
						style={{
							color: "var(--wayfare-primary)",
							background: "none",
							border: "none",
							padding: 0,
							cursor: "pointer",
						}}
					>
						<span>{expanded ? "▾" : "▸"}</span>
						{offerCount === 1
							? "1 included offer"
							: `${offerCount} included offers`}
					</button>

					{/* Individual offer rows */}
					{expanded && (
						<div
							className="mt-3 flex flex-col gap-2.5 pt-3"
							style={{ borderTop: "1px solid var(--wayfare-line)" }}
						>
							{bundle.offers.map((offer) => {
								const name =
									offer.properties?.summary?.name ??
									offer.properties?.products?.[0]?.productName ??
									"Travel offer";
								const price = offer.properties?.price;
								const ids = getOfferTravellerIds(offer);
								const offerTravellers = travellers.filter((t) =>
									ids.includes(t.id),
								);

								const travellerText =
									offerTravellers.length > 0
										? `${offerTravellers.length} traveller${offerTravellers.length !== 1 ? "s" : ""} (${offerTravellers.map((t) => (t.age != null ? `${t.age} yrs` : t.id)).join(", ")})`
										: ids.length > 0
											? `${ids.length} traveller${ids.length !== 1 ? "s" : ""}`
											: null;

								return (
									<div
										key={offer.id}
										className="flex items-start justify-between gap-3"
									>
										<div className="min-w-0">
											<p
												className="text-xs font-medium"
												style={{ color: "var(--wayfare-text)", margin: 0 }}
											>
												{name}
											</p>
											{travellerText && (
												<p
													className="text-xs"
													style={{
														color: "var(--wayfare-text-secondary)",
														margin: 0,
													}}
												>
													{travellerText}
												</p>
											)}
										</div>
										{price && (
											<span
												className="shrink-0 text-xs font-semibold"
												style={{ color: "var(--wayfare-text)" }}
											>
												{formatPrice(price.amount, price.currencyCode ?? "NOK")}
											</span>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</label>
	);
}
