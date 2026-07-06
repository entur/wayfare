import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "../server/middleware";
import { createOmsaClient } from "../server/omsa-client";
import type { AssetFeatureCollection, AssignAssetRequest } from "../types/assets";
import type { ConfirmedPackage } from "../types/purchase";

export const listAssets = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.inputValidator(
		(data: { packageId: string; legId: string }) => data,
	)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.get<AssetFeatureCollection>("/collections/assets/items", {
			packageId: data.packageId,
			legId: data.legId,
			limit: "10000",
		});
	});

export const assignAsset = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.inputValidator((data: AssignAssetRequest) => data)
	.handler(async ({ data, context }) => {
		const omsa = createOmsaClient(context.devConfig);
		return omsa.post<ConfirmedPackage>("/processes/assign-asset/execute", data);
	});
