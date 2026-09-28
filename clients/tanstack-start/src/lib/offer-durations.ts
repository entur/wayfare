import type { OfferBundle } from "../components/checkout/BundleCard";
import type { Offer } from "../types/search";
import { getEffectiveZones } from "./zone-utils";

export const OTHER_PRODUCTS_KEY = "other";

export interface DurationGroup {
	key: string;
	label: string;
	bundles: OfferBundle[];
}

// Bike share and similar add-ons come back with no fare zones and no travel
// class, unlike transit tickets. OMSA has no field that says so directly.
export function isOtherProduct(offer: Offer): boolean {
	const properties = offer.properties;
	const hasZones =
		getEffectiveZones(properties?.summary?.geographicalValidity).length > 0;
	const hasClass = !!properties?.products?.some((product) =>
		product.service?.some((service) => service.class),
	);
	return !hasZones && !hasClass;
}

export function durationHours(iso: string | undefined): number | null {
	const match = iso?.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/);
	if (!match || !(match[1] || match[2] || match[3])) return null;
	const [, days = "0", hours = "0", minutes = "0"] = match;
	return Number(days) * 24 + Number(hours) + Number(minutes) / 60;
}

export function durationLabel(
	validityPeriodType: string | undefined,
	hours: number | null,
): string {
	if (validityPeriodType === "SINGLE_TRIP") return "Single ticket";
	if (hours == null) return "Tickets";
	if (hours <= 24 || hours % 24 !== 0) return `${hours} hours`;
	return `${hours / 24} days`;
}

function validityOf(bundle: OfferBundle) {
	const period = bundle.offers[0]?.properties?.usageValidityPeriods?.[0];
	const hours = durationHours(period?.standardDuration);
	return {
		key: `${period?.validityPeriodType ?? ""}:${period?.standardDuration ?? ""}`,
		label: durationLabel(period?.validityPeriodType, hours),
		hours,
	};
}

/** Groups bundles by validity, shortest first, with other products last. */
export function groupBundlesByDuration(
	bundles: OfferBundle[],
): DurationGroup[] {
	const groups = new Map<string, DurationGroup & { hours: number | null }>();
	const other: OfferBundle[] = [];

	for (const bundle of bundles) {
		if (bundle.offers.every(isOtherProduct)) {
			other.push(bundle);
			continue;
		}
		const { key, label, hours } = validityOf(bundle);
		const group = groups.get(key) ?? { key, label, hours, bundles: [] };
		group.bundles.push(bundle);
		groups.set(key, group);
	}

	const sorted = [...groups.values()]
		.sort((a, b) => (a.hours ?? Infinity) - (b.hours ?? Infinity))
		.map(({ key, label, bundles }) => ({ key, label, bundles }));
	return other.length > 0
		? [
				...sorted,
				{ key: OTHER_PRODUCTS_KEY, label: "Other products", bundles: other },
			]
		: sorted;
}
