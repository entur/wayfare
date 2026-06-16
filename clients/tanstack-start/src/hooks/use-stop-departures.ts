import { useQuery } from "@tanstack/react-query";
import { fetchStopDepartures } from "../server-functions/departures";
import type { StopDepartures } from "../types/departures";

const POLL_INTERVAL_MS = 30_000;
const STALE_MS = 15_000;

export function useStopDepartures(stopPlaceId: string | null) {
	return useQuery<StopDepartures>({
		queryKey: ["stop-departures", stopPlaceId],
		queryFn: () => fetchStopDepartures({ data: { id: stopPlaceId as string } }),
		enabled: !!stopPlaceId,
		refetchInterval: POLL_INTERVAL_MS,
		refetchIntervalInBackground: false,
		staleTime: STALE_MS,
	});
}
