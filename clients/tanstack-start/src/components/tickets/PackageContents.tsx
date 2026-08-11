import { SeatIcon, TrainCarIcon } from "@entur/icons";
import { useQueries } from "@tanstack/react-query";
import { assetSeatNumber, isSeatFeature } from "../../lib/asset-features";
import { formatPrice } from "../../lib/format-price";
import { assetsCollectionQuery } from "../../server-functions/assets.queries";
import type { PackageOffer } from "../../types/documents";

interface PackageContentsProps {
	packageId: string;
	offers: PackageOffer[];
}

interface TravellerItem {
	legId: string;
	travellerLabel: string;
	serviceJourney?: string;
	productName?: string;
	assetId?: string;
	ancillaries: {
		name: string;
		price?: { amount?: number; currencyCode?: string };
	}[];
}

// Each offer represents one (traveller × leg) pair, so the same traveller
// shows up across several offers on a multi-leg journey — number travellers
// by first appearance rather than by offer, so they read as "Traveller 1/2/3"
// instead of one row per offer.
function buildTravellerItems(offers: PackageOffer[]): TravellerItem[] {
	const travellerOrder: string[] = [];
	const items: TravellerItem[] = [];

	for (const offer of offers) {
		const productName = offer.properties?.products?.[0]?.productName;
		const ancillaryCatalog = offer.properties?.ancillaries ?? [];

		for (const leg of offer.properties?.legs ?? []) {
			if (!leg.id) continue;
			const travellerId = leg.traveller ?? leg.id;
			if (!travellerOrder.includes(travellerId)) {
				travellerOrder.push(travellerId);
			}
			const travellerIndex = travellerOrder.indexOf(travellerId);

			const ancillaries = (leg.ancillaries ?? []).flatMap((ancillaryId) => {
				const match = ancillaryCatalog.find(
					(candidate) => candidate.ancillaryId === ancillaryId,
				);
				return match?.name ? [{ name: match.name, price: match.price }] : [];
			});

			items.push({
				legId: leg.id,
				travellerLabel: `Traveller ${travellerIndex + 1}`,
				serviceJourney: leg.serviceJourney,
				productName,
				assetId: leg.assets?.[0],
				ancillaries,
			});
		}
	}

	return items;
}

export default function PackageContents({
	packageId,
	offers,
}: PackageContentsProps) {
	const items = buildTravellerItems(offers);
	const serviceJourneys = [
		...new Set(
			items
				.map((item) => item.serviceJourney)
				.filter((sj): sj is string => !!sj),
		),
	];

	const assetQueries = useQueries({
		queries: serviceJourneys.map((serviceJourney) =>
			assetsCollectionQuery(packageId, serviceJourney),
		),
	});
	const featuresByServiceJourney = new Map(
		serviceJourneys.map((serviceJourney, i) => [
			serviceJourney,
			assetQueries[i]?.data?.features ?? [],
		]),
	);

	if (items.length === 0) return null;

	return (
		<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
			<h2 className="mb-3 text-sm font-semibold text-wayfare-text">
				What's included
			</h2>
			<div className="flex flex-col gap-3">
				{items.map((item) => {
					const features = item.serviceJourney
						? (featuresByServiceJourney.get(item.serviceJourney) ?? [])
						: [];
					const feature = item.assetId
						? features.find((candidate) => candidate.id === item.assetId)
						: undefined;
					const showSeat = feature && isSeatFeature(feature);

					return (
						<div
							key={item.legId}
							className="flex items-start justify-between gap-3 border-b border-wayfare-line pb-3 text-sm last:border-0 last:pb-0"
						>
							<div className="min-w-0">
								<p className="m-0 font-medium text-wayfare-text">
									{item.travellerLabel}
								</p>
								{item.productName && (
									<p className="m-0 text-xs text-wayfare-text-secondary">
										{item.productName}
									</p>
								)}
								{item.ancillaries.map((ancillary) => (
									<p
										key={ancillary.name}
										className="m-0 mt-0.5 text-xs text-wayfare-text-secondary"
									>
										{ancillary.name}
										{ancillary.price?.amount != null && (
											<span className="ml-1">
												·{" "}
												{formatPrice(
													ancillary.price.amount,
													ancillary.price.currencyCode ?? "NOK",
												)}
											</span>
										)}
									</p>
								))}
							</div>
							{showSeat && (
								<div className="flex shrink-0 items-center gap-3 text-xs text-wayfare-text-secondary">
									<span className="flex items-center gap-1">
										<SeatIcon aria-hidden="true" />
										{assetSeatNumber(feature) ?? item.assetId}
									</span>
									<span className="flex items-center gap-1">
										<TrainCarIcon aria-hidden="true" />
										{feature.properties.carriage}
									</span>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
