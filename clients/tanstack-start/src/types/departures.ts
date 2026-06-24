import type { PtSituationElement } from "./situations";

export interface DepartureLinePresentation {
	colour?: string | null;
	textColour?: string | null;
}

export interface DepartureLine {
	publicCode?: string | null;
	transportMode?: string | null;
	presentation?: DepartureLinePresentation | null;
}

export interface DepartureServiceJourney {
	id?: string | null;
	line?: DepartureLine | null;
}

export interface DepartureQuay {
	id: string;
	publicCode?: string | null;
	name?: string | null;
}

export interface DepartureDestinationDisplay {
	frontText?: string | null;
}

export interface EstimatedCall {
	aimedDepartureTime: string;
	expectedDepartureTime: string;
	realtime: boolean;
	cancellation: boolean;
	destinationDisplay?: DepartureDestinationDisplay | null;
	quay?: DepartureQuay | null;
	serviceJourney?: DepartureServiceJourney | null;
	situations?: PtSituationElement[] | null;
}

export interface StopDepartures {
	stopPlaceId: string;
	fetchedAt: string;
	calls: EstimatedCall[];
	stopSituations: PtSituationElement[];
}

export interface QuayDepartures {
	quay: DepartureQuay;
	calls: EstimatedCall[];
}
