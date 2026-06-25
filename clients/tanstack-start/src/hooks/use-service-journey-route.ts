import { useQuery } from "@tanstack/react-query";
import { fetchServiceJourneyRoute } from "../server-functions/vehicles";
import type { ServiceJourneyRoute } from "../types/vehicles";

const STALE_MS = 20_000;
const POLL_INTERVAL_MS = 30_000;

export function useServiceJourneyRoute(serviceJourneyId: string | null) {
	return useQuery<ServiceJourneyRoute | null>({
		queryKey: ["service-journey-route", serviceJourneyId],
		queryFn: () =>
			fetchServiceJourneyRoute({
				data: { serviceJourneyId: serviceJourneyId as string },
			}),
		enabled: !!serviceJourneyId,
		staleTime: STALE_MS,
		refetchInterval: POLL_INTERVAL_MS,
		refetchIntervalInBackground: false,
	});
}
