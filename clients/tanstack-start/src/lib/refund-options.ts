import type { PackageOffer, RefundOptionItem } from "../types/documents";

export interface RefundOptionSummary {
	id: string;
	/** What the option refunds, in the user's terms. */
	title: string;
	productName: string | null;
	refund: number;
	fee: number;
	currency: string;
	deadline: Date | null;
}

const REFUND_TYPE_LABELS: Record<string, string> = {
	PACKAGE_REFUND: "Refund ticket",
	REMOVE_TRAVELLER: "Remove traveller",
	REMOVE_ANCILLARY: "Remove add-on",
};

function humanizeRefundType(refundType: string): string {
	const words = refundType.replace(/_/g, " ").toLowerCase();
	return words.charAt(0).toUpperCase() + words.slice(1);
}

// An offer is one (traveller × leg) pair, so number travellers by first
// appearance to match how PackageContents labels them.
function travellerLabelsByOffer(offers: PackageOffer[]): Map<string, string> {
	const travellerOrder: string[] = [];
	const labels = new Map<string, string>();
	for (const offer of offers) {
		for (const leg of offer.properties?.legs ?? []) {
			const travellerId = leg.traveller ?? leg.id;
			if (!travellerId) continue;
			if (!travellerOrder.includes(travellerId)) {
				travellerOrder.push(travellerId);
			}
			if (offer.id && !labels.has(offer.id)) {
				labels.set(
					offer.id,
					`Traveller ${travellerOrder.indexOf(travellerId) + 1}`,
				);
			}
		}
	}
	return labels;
}

/**
 * OMSA returns one option per refundable offer, all typed PACKAGE_REFUND, so
 * the raw refundType can't tell them apart. Name each one by the traveller it
 * belongs to and reduce the consequences to what is actually paid out.
 */
export function summarizeRefundOptions(
	options: RefundOptionItem[],
	offers: PackageOffer[],
): RefundOptionSummary[] {
	const travellerLabels = travellerLabelsByOffer(offers);

	return options.flatMap((option) => {
		const props = option.properties;
		const optionId = option.id ?? props?.id;
		if (!optionId || !props) return [];

		const consequences = props.consequences ?? [];
		const sumOf = (category: string) =>
			consequences
				.filter((line) => line.category === category)
				.reduce((total, line) => total + (line.amount?.amount ?? 0), 0);

		const offerId = consequences.find((line) => line.offer)?.offer;
		const offer = offers.find((candidate) => candidate.id === offerId);
		const travellerLabel = offerId ? travellerLabels.get(offerId) : undefined;
		const refundType = props.refundType ?? "";
		const deadline = consequences.find(
			(line) => line.expirationDate,
		)?.expirationDate;
		const deadlineDate = deadline ? new Date(deadline) : null;

		return [
			{
				id: optionId,
				title:
					travellerLabel ??
					REFUND_TYPE_LABELS[refundType] ??
					(refundType ? humanizeRefundType(refundType) : "Refund"),
				productName: offer?.properties?.products?.[0]?.productName ?? null,
				refund: sumOf("REFUND"),
				fee: sumOf("FEE"),
				currency:
					consequences.find((line) => line.amount?.currencyCode)?.amount
						?.currencyCode ?? "NOK",
				deadline:
					deadlineDate && Number.isFinite(deadlineDate.getTime())
						? deadlineDate
						: null,
			},
		];
	});
}
