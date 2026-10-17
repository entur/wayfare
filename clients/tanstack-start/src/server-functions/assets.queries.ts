import type { QueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import type { AssetFeatureCollection } from "../types/assets";
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

function mergeCarriage(
	collection: AssetFeatureCollection,
	carriage: string,
	fresh: AssetFeatureCollection,
): AssetFeatureCollection {
	const untouched = collection.features.filter(
		(f) => f.properties.carriage !== carriage,
	);
	const features = [...untouched, ...fresh.features];
	const removedCount = collection.features.length - untouched.length;
	return {
		...collection,
		features,
		numberReturned: features.length,
		numberMatched: collection.numberMatched - removedCount + fresh.features.length,
	};
}

/**
 * Refetches just one carriage (via the `carriage` filter) after an
 * assign-asset call or a 409 conflict, and patches the result into the
 * already-cached full-journey collection — cheaper than invalidating and
 * re-pulling every carriage in the train for a change that touched one.
 */
export async function refetchCarriageAssets(
	queryClient: QueryClient,
	packageId: string,
	serviceJourney: string,
	carriage: string,
): Promise<void> {
	const queryKey = ["assets", packageId, serviceJourney] as const;
	const previous = queryClient.getQueryData<AssetFeatureCollection>(queryKey);
	if (!previous) {
		// Nothing cached to patch — fall back to a full refetch.
		await queryClient.invalidateQueries({ queryKey });
		return;
	}
	const fresh = await listAssets({ data: { packageId, serviceJourney, carriage } });
	queryClient.setQueryData<AssetFeatureCollection>(queryKey, (current) =>
		current ? mergeCarriage(current, carriage, fresh) : current,
	);
}
