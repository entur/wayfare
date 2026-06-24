import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import {
	createJourneyPlannerClient,
	createVehiclePositionsClient,
} from "../server/omsa-client";
import type { ServiceJourneyRoute, VehiclePosition } from "../types/vehicles";

const VEHICLE_POSITION_QUERY = `
	query VehiclePosition($serviceJourneyId: String!) {
		vehicles(serviceJourneyId: $serviceJourneyId) {
			vehicleId
			location { latitude longitude }
			bearing
			delay
			speed
			lastUpdated
			progressBetweenStops { percentage }
		}
	}
`;

interface RawVehicle {
	vehicleId: string;
	location: { latitude: number; longitude: number };
	bearing?: number | null;
	delay?: number | null;
	speed?: number | null;
	lastUpdated: string;
	progressBetweenStops?: { percentage?: number | null } | null;
}

interface VehiclePositionData {
	vehicles: RawVehicle[];
}

export const fetchVehiclePosition = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: { serviceJourneyId: string }) => data)
	.handler(async ({ data, context }): Promise<VehiclePosition | null> => {
		const client = createVehiclePositionsClient(context.devConfig);
		const result = await client.query<VehiclePositionData>(
			VEHICLE_POSITION_QUERY,
			{ serviceJourneyId: data.serviceJourneyId },
		);
		const v = result.vehicles[0];
		if (!v) return null;
		return {
			vehicleId: v.vehicleId,
			latitude: v.location.latitude,
			longitude: v.location.longitude,
			bearing: v.bearing,
			delay: v.delay,
			speed: v.speed,
			lastUpdated: v.lastUpdated,
			progressPercentage: v.progressBetweenStops?.percentage,
		};
	});

const SERVICE_JOURNEY_ROUTE_QUERY = `
	query ServiceJourneyRoute($id: String!) {
		serviceJourney(id: $id) {
			pointsOnLink { points }
			estimatedCalls {
				quay {
					name
					latitude
					longitude
				}
			}
		}
	}
`;

interface RawServiceJourneyData {
	serviceJourney: {
		pointsOnLink: { points: string } | null;
		estimatedCalls: Array<{
			quay: {
				name?: string | null;
				latitude?: number | null;
				longitude?: number | null;
			} | null;
		}>;
	} | null;
}

export const fetchServiceJourneyRoute = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: { serviceJourneyId: string }) => data)
	.handler(async ({ data, context }): Promise<ServiceJourneyRoute | null> => {
		const client = createJourneyPlannerClient(context.devConfig);
		const result = await client.query<RawServiceJourneyData>(
			SERVICE_JOURNEY_ROUTE_QUERY,
			{ id: data.serviceJourneyId },
		);
		const sj = result.serviceJourney;
		if (!sj?.pointsOnLink?.points) return null;
		const stops = sj.estimatedCalls
			.map((c) => c.quay)
			.filter(
				(q): q is NonNullable<typeof q> =>
					q !== null &&
					q !== undefined &&
					q.latitude != null &&
					q.longitude != null,
			)
			.map((q) => ({
				name: q.name ?? "",
				latitude: q.latitude as number,
				longitude: q.longitude as number,
			}));
		return { points: sj.pointsOnLink.points, stops };
	});
