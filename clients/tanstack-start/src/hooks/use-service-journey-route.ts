import { useQuery } from "@tanstack/react-query";
import { fetchServiceJourneyRoute } from "../server-functions/vehicles";
import type { ServiceJourneyRoute } from "../types/vehicles";

const STALE_MS = 5 * 60_000;

export function useServiceJourneyRoute(serviceJourneyId: string | null) {
	return useQuery<ServiceJourneyRoute | null>({
		queryKey: ["service-journey-route", serviceJourneyId],
		queryFn: () =>
			fetchServiceJourneyRoute({
				data: { serviceJourneyId: serviceJourneyId as string },
			}),
		enabled: !!serviceJourneyId,
		staleTime: STALE_MS,
	});
}
