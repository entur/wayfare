import { SeatIcon, TrainCarIcon } from "@entur/icons";
import { formatPrice } from "../../lib/format-price";
import type { PackageOffer } from "../../types/documents";

interface PackageContentsProps {
	offers: PackageOffer[];
}

interface TravellerItem {
	legId: string;
	travellerLabel: string;
	productName?: string;
	assetId?: string;
	ancillaries: {
		name: string;
		price?: { amount?: number; currencyCode?: string };
	}[];
}

// GET /collections/assets/items only works for packages still open for seat
// selection — a CONFIRMED package 400s ("Assets can only be selected for
// customizable packages"). The confirmed asset id itself already encodes
// carriage and seat number as "<carriage>-<seatNumber>", so parse that
// directly instead of trying to resolve it against the (now closed) seatmap.
function parseSeatAssetId(
	assetId: string,
): { carriage: string; seatNumber: string } | null {
	const match = assetId.match(/^(.+)-([^-]+)$/);
	if (!match) return null;
	return { carriage: match[1], seatNumber: match[2] };
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
				productName,
				assetId: leg.assets?.[0],
				ancillaries,
			});
		}
	}

	return items;
}

export default function PackageContents({ offers }: PackageContentsProps) {
	const items = buildTravellerItems(offers);
	if (items.length === 0) return null;

	return (
		<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
			<h2 className="mb-3 text-sm font-semibold text-wayfare-text">
				What's included
			</h2>
			<div className="flex flex-col gap-3">
				{items.map((item) => {
					const seat = item.assetId ? parseSeatAssetId(item.assetId) : null;

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
							{seat && (
								<div className="flex shrink-0 items-center gap-3 text-xs text-wayfare-text-secondary">
									<span className="flex items-center gap-1">
										<SeatIcon aria-hidden="true" />
										{seat.seatNumber}
									</span>
									<span className="flex items-center gap-1">
										<TrainCarIcon aria-hidden="true" />
										{seat.carriage}
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
