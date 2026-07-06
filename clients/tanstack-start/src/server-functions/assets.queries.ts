import { queryOptions } from "@tanstack/react-query";
import { listAssets } from "./assets";

const THIRTY_SEC = 30_000;
const FIVE_MIN = 5 * 60_000;

export function assetsCollectionQuery(packageId: string, legId: string) {
	return queryOptions({
		queryKey: ["assets", packageId, legId] as const,
		queryFn: ({ signal }) =>
			listAssets({ data: { packageId, legId }, signal }),
		staleTime: THIRTY_SEC,
		gcTime: FIVE_MIN,
		enabled: !!packageId && !!legId,
	});
}
