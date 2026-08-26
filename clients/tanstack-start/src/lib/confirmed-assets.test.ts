import { describe, expect, it } from "vitest";
import type { ConfirmedPackage } from "../types/purchase";
import {
	confirmedAssetIdsByLeg,
	retainConfirmedAssetInfo,
} from "./confirmed-assets";

function packageWithAssets(
	assetsByLeg: Record<string, string[]>,
): ConfirmedPackage {
	return {
		status: "PENDING",
		price: { amount: 0, currencyCode: "NOK" },
		offers: [
			{
				properties: {
					legs: Object.entries(assetsByLeg).map(([id, assets]) => ({
						id,
						assets,
					})),
				},
			},
		],
	};
}

describe("confirmed assets", () => {
	it("reads the held asset for each leg from the package", () => {
		expect(
			confirmedAssetIdsByLeg(
				packageWithAssets({ adult: ["3-104"], child: ["5-194"] }),
			),
		).toEqual({ adult: "3-104", child: "5-194" });
	});

	it("drops cached selections that are not held by the package", () => {
		const selected = {
			adult: { assetId: "3-104", carriage: "3" },
			child: { assetId: "5-194", carriage: "5" },
		};

		expect(retainConfirmedAssetInfo(selected, { child: "5-194" })).toEqual({
			child: selected.child,
		});
	});
});
