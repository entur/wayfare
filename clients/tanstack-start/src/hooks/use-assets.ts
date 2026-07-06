import { useMutation } from "@tanstack/react-query";
import { assignAsset } from "../server-functions/assets";
import type { AssignAssetRequest } from "../types/assets";
import type { ConfirmedPackage } from "../types/purchase";

export function useAssignAsset() {
	return useMutation<ConfirmedPackage, Error, AssignAssetRequest>({
		mutationFn: (req) =>
			assignAsset({ data: req }) as Promise<ConfirmedPackage>,
	});
}
