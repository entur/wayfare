import type { OtpTransportMode, TripPattern } from "../types/trip-planner";
import type { TripSearchParams } from "./trip-session";

export type TransportModeGroup = "rail" | "bus" | "metroTram" | "water" | "air";

export const ALL_MODE_GROUPS: readonly TransportModeGroup[] = [
	"rail",
	"bus",
	"metroTram",
	"water",
	"air",
];

export const MODE_GROUP_LABELS: Record<TransportModeGroup, string> = {
	rail: "Train",
	bus: "Bus",
	metroTram: "Metro & tram",
	water: "Boat",
	air: "Air",
};

const MODE_GROUP_TO_TRANSPORT_MODES: Record<TransportModeGroup, string[]> = {
	rail: ["rail"],
	bus: ["bus", "coach"],
	metroTram: ["metro", "tram"],
	water: ["water"],
	air: ["air"],
};

const TRANSPORT_MODE_TO_GROUP: Partial<
	Record<OtpTransportMode, TransportModeGroup>
> = {
	rail: "rail",
	bus: "bus",
	coach: "bus",
	metro: "metroTram",
	tram: "metroTram",
	water: "water",
	ferry: "water",
	air: "air",
};

export interface TripFilters {
	modes: TransportModeGroup[];
	fewerTransfers: boolean;
	lessWalking: boolean;
}

export const DEFAULT_FILTERS: TripFilters = {
	modes: [...ALL_MODE_GROUPS],
	fewerTransfers: false,
	lessWalking: false,
};

export function isDefaultFilters(filters: TripFilters): boolean {
	return (
		filters.modes.length === ALL_MODE_GROUPS.length &&
		!filters.fewerTransfers &&
		!filters.lessWalking
	);
}

/** URL search-param shape for /trips. Defaults are omitted to keep URLs clean. */
export interface TripFilterSearch {
	modes?: TransportModeGroup[];
	fewerTransfers?: boolean;
	lessWalking?: boolean;
}

function isModeGroup(value: unknown): value is TransportModeGroup {
	return (
		typeof value === "string" &&
		(ALL_MODE_GROUPS as readonly string[]).includes(value)
	);
}

export function parseTripFilterSearch(
	search: Record<string, unknown>,
): TripFilterSearch {
	const result: TripFilterSearch = {};
	const rawModes = search.modes;
	const modes = (Array.isArray(rawModes) ? rawModes : [rawModes]).filter(
		isModeGroup,
	);
	if (modes.length > 0 && modes.length < ALL_MODE_GROUPS.length) {
		result.modes = ALL_MODE_GROUPS.filter((g) => modes.includes(g));
	}
	if (search.fewerTransfers === true) result.fewerTransfers = true;
	if (search.lessWalking === true) result.lessWalking = true;
	return result;
}

export function filtersFromSearch(search: TripFilterSearch): TripFilters {
	return {
		modes: search.modes ?? [...ALL_MODE_GROUPS],
		fewerTransfers: search.fewerTransfers ?? false,
		lessWalking: search.lessWalking ?? false,
	};
}

export function searchFromFilters(filters: TripFilters): TripFilterSearch {
	const search: TripFilterSearch = {};
	if (filters.modes.length < ALL_MODE_GROUPS.length) {
		search.modes = filters.modes;
	}
	if (filters.fewerTransfers) search.fewerTransfers = true;
	if (filters.lessWalking) search.lessWalking = true;
	return search;
}

/**
 * Match by the line's advertised mode rather than only the vehicle used for a
 * leg. This keeps rail services operated by a temporary replacement bus under
 * the rail filter while still excluding ordinary bus connections.
 */
export function patternMatchesFilters(
	pattern: TripPattern,
	filters: TripFilters,
): boolean {
	return pattern.legs.every((leg) => {
		const mode = leg.line?.transportMode ?? leg.mode;
		const group = TRANSPORT_MODE_TO_GROUP[mode];
		return group == null || filters.modes.includes(group);
	});
}

export interface TripQueryVariables {
	from: { place: string };
	to: { place: string };
	dateTime: string;
	arriveBy: boolean;
	numTripPatterns: number;
	pageCursor?: string;
	modes?: {
		accessMode: string;
		egressMode: string;
		transportModes: { transportMode: string }[];
	};
	walkReluctance?: number;
	transferPenalty?: number;
	transferSlack?: number;
}

export const NUM_TRIP_PATTERNS = 10;

export function buildTripVariables(
	params: Pick<TripSearchParams, "from" | "to" | "dateTime" | "timeMode">,
	filters: TripFilters,
	pageCursor?: string,
): TripQueryVariables {
	const variables: TripQueryVariables = {
		from: { place: params.from.placeId },
		to: { place: params.to.placeId },
		dateTime: params.dateTime,
		arriveBy: params.timeMode === "arrive",
		numTripPatterns: NUM_TRIP_PATTERNS,
	};
	if (pageCursor) variables.pageCursor = pageCursor;
	if (filters.modes.length < ALL_MODE_GROUPS.length) {
		const transportModes = filters.modes.flatMap(
			(group) => MODE_GROUP_TO_TRANSPORT_MODES[group],
		);
		// JourneyPlanner filters on the vehicle mode of every leg. Rail searches
		// must therefore include buses so rail-replacement legs remain candidates;
		// ordinary buses are removed client-side using line.transportMode.
		if (filters.modes.includes("rail")) {
			transportModes.push("bus", "coach");
		}
		variables.modes = {
			accessMode: "foot",
			egressMode: "foot",
			transportModes: [...new Set(transportModes)].map((transportMode) => ({
				transportMode,
			})),
		};
	}
	if (filters.fewerTransfers) {
		variables.transferPenalty = 600;
		variables.transferSlack = 300;
	}
	if (filters.lessWalking) {
		variables.walkReluctance = 5;
	}
	return variables;
}
