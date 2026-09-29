import { createServerFn } from "@tanstack/react-start";
import type { TripQueryVariables } from "../lib/trip-filters";
import { devConfigMiddleware } from "../server/middleware";
import { createJourneyPlannerClient } from "../server/omsa-client";
import type { TripQueryResult } from "../types/trip-planner";
import { SITUATION_FRAGMENT } from "./graphql-fragments";

const TRIP_QUERY = `
  query TripSearch(
    $from: Location!
    $to: Location!
    $dateTime: DateTime
    $arriveBy: Boolean
    $numTripPatterns: Int
    $pageCursor: String
    $modes: Modes
    $walkReluctance: Float
    $transferPenalty: Int
    $transferSlack: Int
  ) {
    trip(
      from: $from
      to: $to
      dateTime: $dateTime
      arriveBy: $arriveBy
      numTripPatterns: $numTripPatterns
      pageCursor: $pageCursor
      modes: $modes
      walkReluctance: $walkReluctance
      transferPenalty: $transferPenalty
      transferSlack: $transferSlack
    ) {
      nextPageCursor
      previousPageCursor
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
          datedServiceJourney { id }
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

interface TripQueryData {
	trip: TripQueryResult;
}

export const planTrip = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.validator((data: TripQueryVariables) => data)
	.handler(async ({ data, context }) => {
		const journeyPlanner = createJourneyPlannerClient(context.devConfig);
		const result = await journeyPlanner.query<TripQueryData>(TRIP_QUERY, data);
		return result.trip;
	});
