import type { OfferBundle } from "../components/checkout/BundleCard";

export function cheapestCompleteBundles(
	bundles: OfferBundle[],
	legCount: number,
): OfferBundle[] | null {
	if (legCount < 1) return null;
	const travellers = [
		...new Set(
			bundles.flatMap((bundle) =>
				bundle.offers.flatMap((offer) =>
					(offer.properties?.legs ?? [])
						.map((leg) => leg.traveller)
						.filter((id): id is string => !!id),
				),
			),
		),
	];
	if (travellers.length === 0) return null;
	const required = travellers.flatMap((id) =>
		Array.from({ length: legCount }, (_, index) => `${id}:${index + 1}`),
	);
	const coverage = bundles.map(
		(bundle) =>
			new Set(
				bundle.offers.flatMap((offer) =>
					(offer.properties?.legs ?? [])
						.filter((leg) => leg.traveller && leg.sequenceNumber != null)
						.map((leg) => `${leg.traveller}:${leg.sequenceNumber}`),
				),
			),
	);
	let best: OfferBundle[] | null = null;
	let bestPrice = Infinity;
	function search(
		index: number,
		selected: OfferBundle[],
		covered: Set<string>,
		price: number,
		currency?: string,
	) {
		if (required.every((pair) => covered.has(pair))) {
			if (price < bestPrice) {
				best = [...selected];
				bestPrice = price;
			}
			return;
		}
		if (index === bundles.length || price >= bestPrice) return;
		search(index + 1, selected, covered, price, currency);
		const bundle = bundles[index];
		if (currency && bundle.currency !== currency) return;
		if ([...coverage[index]].some((pair) => covered.has(pair))) return;
		const next = new Set([...covered, ...coverage[index]]);
		selected.push(bundle);
		search(
			index + 1,
			selected,
			next,
			price + bundle.totalPrice,
			currency ?? bundle.currency,
		);
		selected.pop();
	}
	search(0, [], new Set(), 0);
	return best;
}
