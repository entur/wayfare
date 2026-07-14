import { queryOptions } from "@tanstack/react-query";
import { getSeatmapImage, listAssets } from "./assets";

const THIRTY_SEC = 30_000;
const FIVE_MIN = 5 * 60_000;
const ONE_HOUR = 60 * 60_000;

export function assetsCollectionQuery(
	packageId: string,
	serviceJourney: string,
) {
	return queryOptions({
		queryKey: ["assets", packageId, serviceJourney] as const,
		queryFn: ({ signal }) =>
			listAssets({ data: { packageId, serviceJourney }, signal }),
		staleTime: THIRTY_SEC,
		gcTime: FIVE_MIN,
		enabled: !!packageId && !!serviceJourney,
	});
}

export function seatmapImageQuery(href: string | undefined) {
	return queryOptions({
		queryKey: ["seatmap-image", href] as const,
		queryFn: ({ signal }) =>
			getSeatmapImage({ data: { href: href ?? "" }, signal }),
		staleTime: ONE_HOUR,
		gcTime: ONE_HOUR,
		enabled: !!href,
	});
}
