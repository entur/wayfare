import { useQuery } from "@tanstack/react-query";
import { fetchVehiclePosition } from "../server-functions/vehicles";
import type { VehiclePosition } from "../types/vehicles";

const POLL_INTERVAL_MS = 10_000;
const STALE_MS = 5_000;

export function useVehiclePosition(serviceJourneyId: string | null) {
	return useQuery<VehiclePosition | null>({
		queryKey: ["vehicle-position", serviceJourneyId],
		queryFn: () =>
			fetchVehiclePosition({
				data: { serviceJourneyId: serviceJourneyId as string },
			}),
		enabled: !!serviceJourneyId,
		refetchInterval: POLL_INTERVAL_MS,
		refetchIntervalInBackground: false,
		staleTime: STALE_MS,
	});
}
