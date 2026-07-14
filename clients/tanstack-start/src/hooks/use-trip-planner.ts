import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { buildTripVariables, type TripFilters } from "../lib/trip-filters";
import type { TripSearchParams } from "../lib/trip-session";
import { planTrip } from "../server-functions/trip-planner";
import type { TripQueryResult } from "../types/trip-planner";

export function useTripPlanner(
	params: TripSearchParams | null,
	filters: TripFilters,
) {
	const query = useInfiniteQuery({
		queryKey: [
			"trip",
			params?.from.placeId,
			params?.to.placeId,
			params?.dateTime,
			params?.timeMode,
			filters,
		],
		queryFn: ({ pageParam }): Promise<TripQueryResult> => {
			if (!params) throw new Error("Missing trip search params");
			return planTrip({
				data: buildTripVariables(params, filters, pageParam),
			}) as Promise<TripQueryResult>;
		},
		enabled: params != null,
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextPageCursor ?? undefined,
		staleTime: 60_000,
	});

	const patterns = useMemo(
		() => query.data?.pages.flatMap((page) => page.tripPatterns),
		[query.data],
	);

	return { ...query, patterns };
}
