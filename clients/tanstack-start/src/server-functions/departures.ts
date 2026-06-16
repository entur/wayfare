import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import { createJourneyPlannerClient } from "../server/omsa-client";
import type { EstimatedCall, StopDepartures } from "../types/departures";

const STOP_DEPARTURES_QUERY = `
	query StopDepartures($id: String!, $numberOfDepartures: Int!, $timeRange: Int!) {
		stopPlace(id: $id) {
			id
			estimatedCalls(
				numberOfDepartures: $numberOfDepartures
				timeRange: $timeRange
			) {
				aimedDepartureTime
				expectedDepartureTime
				realtime
				cancellation
				destinationDisplay { frontText }
				quay { id publicCode name }
				serviceJourney {
					line {
						publicCode
						transportMode
						presentation { colour textColour }
					}
				}
			}
		}
	}
`;

interface StopDeparturesVariables {
	id: string;
	numberOfDepartures?: number;
	timeRange?: number;
}

interface StopDeparturesData {
	stopPlace: { id: string; estimatedCalls: EstimatedCall[] } | null;
}

export const fetchStopDepartures = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: StopDeparturesVariables) => data)
	.handler(async ({ data, context }): Promise<StopDepartures> => {
		const journeyPlanner = createJourneyPlannerClient(context.devConfig);
		const result = await journeyPlanner.query<StopDeparturesData>(
			STOP_DEPARTURES_QUERY,
			{
				id: data.id,
				numberOfDepartures: data.numberOfDepartures ?? 20,
				timeRange: data.timeRange ?? 7200,
			},
		);
		return {
			stopPlaceId: data.id,
			fetchedAt: new Date().toISOString(),
			calls: result.stopPlace?.estimatedCalls ?? [],
		};
	});
