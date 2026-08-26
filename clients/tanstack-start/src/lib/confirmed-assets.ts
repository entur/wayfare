import type { SelectedAssetInfo } from "../types/assets";
import type { ConfirmedPackage } from "../types/purchase";

export function confirmedAssetIdsByLeg(
	pkg: ConfirmedPackage,
): Record<string, string> {
	const confirmed: Record<string, string> = {};
	for (const offer of pkg.offers ?? []) {
		for (const leg of offer.properties?.legs ?? []) {
			const assetId = leg.assets?.[0];
			if (assetId) confirmed[leg.id] = assetId;
		}
	}
	return confirmed;
}

export function retainConfirmedAssetInfo(
	selected: Record<string, SelectedAssetInfo>,
	confirmed: Record<string, string>,
): Record<string, SelectedAssetInfo> {
	return Object.fromEntries(
		Object.entries(selected).filter(
			([legId, asset]) => confirmed[legId] === asset.assetId,
		),
	);
}
