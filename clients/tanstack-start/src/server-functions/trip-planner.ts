import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import { createJourneyPlannerClient } from "../server/omsa-client";
import type { TripPattern } from "../types/trip-planner";
import { SITUATION_FRAGMENT } from "./graphql-fragments";

const TRIP_QUERY = `
  query TripSearch($from: Location!, $to: Location!, $dateTime: DateTime) {
    trip(
      from: $from
      to: $to
      dateTime: $dateTime
      numTripPatterns: 6
    ) {
      tripPatterns {
        expectedStartTime
        expectedEndTime
        duration
        legs {
          mode
          expectedStartTime
          expectedEndTime
          realtime
          pointsOnLink {
            points
            length
          }
          fromPlace {
            name
            quay {
              id
              stopPlace { id }
              latitude
              longitude
            }
          }
          toPlace {
            name
            quay {
              id
              stopPlace { id }
              latitude
              longitude
            }
          }
          serviceJourney {
            id
            situations { ${SITUATION_FRAGMENT} }
          }
          line {
            publicCode
            name
            transportMode
            situations { ${SITUATION_FRAGMENT} }
          }
          authority { name }
        }
      }
    }
  }
`;

interface TripQueryVariables {
	from: { place: string };
	to: { place: string };
	dateTime: string;
}

interface TripQueryData {
	trip: { tripPatterns: TripPattern[] };
}

export const planTrip = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: TripQueryVariables) => data)
	.handler(async ({ data, context }) => {
		const journeyPlanner = createJourneyPlannerClient(context.devConfig);
		const result = await journeyPlanner.query<TripQueryData>(TRIP_QUERY, data);
		return result.trip.tripPatterns;
	});
