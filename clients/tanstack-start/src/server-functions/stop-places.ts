import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import { createJourneyPlannerClient } from "../server/omsa-client";

const STOPS_IN_BOUNDS_QUERY = `
  query StopsInBounds(
    $minLat: Float!
    $maxLat: Float!
    $minLon: Float!
    $maxLon: Float!
  ) {
    stopPlacesByBbox(
      minimumLatitude: $minLat
      maximumLatitude: $maxLat
      minimumLongitude: $minLon
      maximumLongitude: $maxLon
    ) {
      id
      name
      latitude
      longitude
      transportMode
    }
  }
`;

interface StopsInBoundsInput {
	minLat: number;
	maxLat: number;
	minLon: number;
	maxLon: number;
}

export interface MapStopPlace {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	transportMode: string[];
}

interface StopsQueryData {
	stopPlacesByBbox: MapStopPlace[];
}

export const getStopsInBounds = createServerFn({ method: "GET" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: StopsInBoundsInput) => data)
	.handler(async ({ data, context }) => {
		const journeyPlanner = createJourneyPlannerClient(context.devConfig);
		const result = await journeyPlanner.query<StopsQueryData>(
			STOPS_IN_BOUNDS_QUERY,
			{
				minLat: data.minLat,
				maxLat: data.maxLat,
				minLon: data.minLon,
				maxLon: data.maxLon,
			},
		);
		return result.stopPlacesByBbox;
	});
