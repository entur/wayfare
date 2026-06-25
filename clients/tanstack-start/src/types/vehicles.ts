export interface VehiclePosition {
	vehicleId: string;
	latitude: number;
	longitude: number;
	bearing?: number | null;
	delay?: number | null;
	speed?: number | null;
	lastUpdated: string;
	progressPercentage?: number | null;
}

export interface ServiceJourneyStop {
	quayId?: string | null;
	name: string;
	latitude: number;
	longitude: number;
	realtime?: boolean | null;
	aimedArrivalTime?: string | null;
	expectedArrivalTime?: string | null;
	actualArrivalTime?: string | null;
	aimedDepartureTime?: string | null;
	expectedDepartureTime?: string | null;
	actualDepartureTime?: string | null;
}

export interface ServiceJourneyRoute {
	points: string;
	stops: ServiceJourneyStop[];
}
