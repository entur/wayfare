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
	name: string;
	latitude: number;
	longitude: number;
}

export interface ServiceJourneyRoute {
	points: string;
	stops: ServiceJourneyStop[];
}
