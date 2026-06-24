import { useQuery } from "@tanstack/react-query";
import { fetchJourneySituations } from "../server-functions/situations";
import type { PtSituationElement } from "../types/situations";

const STALE_MS = 60_000;

export function useJourneySituations(serviceJourneyIds: string[]) {
	const ids = serviceJourneyIds.filter(Boolean);
	return useQuery<PtSituationElement[]>({
		queryKey: ["journey-situations", ...ids.sort()],
		queryFn: () => fetchJourneySituations({ data: { serviceJourneyIds: ids } }),
		enabled: ids.length > 0,
		staleTime: STALE_MS,
	});
}
