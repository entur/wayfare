import { describe, expect, it } from "vitest";
import type { TripPattern } from "../types/trip-planner";
import {
	ALL_MODE_GROUPS,
	buildTripVariables,
	DEFAULT_FILTERS,
	DEFAULT_MODE_GROUPS,
	filtersFromSearch,
	isDefaultFilters,
	patternMatchesFilters,
	searchFromFilters,
	type TripFilters,
} from "./trip-filters";
import type { TripSearchParams } from "./trip-session";

const params = {
	from: { placeId: "NSR:StopPlace:337", name: "Oslo S" },
	to: { placeId: "NSR:StopPlace:656", name: "Tønsberg stasjon" },
	dateTime: "2026-07-14T13:39:00+02:00",
	timeMode: "depart",
	travelers: [],
} as TripSearchParams;

const withoutBus: TripFilters = {
	...DEFAULT_FILTERS,
	modes: ALL_MODE_GROUPS.filter((group) => group !== "bus"),
};

function patternWithLeg(
	mode: "rail" | "bus" | "coach",
	lineTransportMode: "rail" | "bus" | "coach" | null,
): TripPattern {
	return {
		expectedStartTime: "2026-07-14T13:53:00+02:00",
		expectedEndTime: "2026-07-14T15:30:00+02:00",
		duration: 5820,
		legs: [
			{
				mode,
				expectedStartTime: "2026-07-14T13:53:00+02:00",
				expectedEndTime: "2026-07-14T15:30:00+02:00",
				fromPlace: { name: "Oslo S" },
				toPlace: { name: "Tønsberg stasjon" },
				line: lineTransportMode
					? { publicCode: "RE11", transportMode: lineTransportMode }
					: null,
			},
		],
	};
}

describe("replacement bus filtering", () => {
	it("requests bus candidates when rail is enabled", () => {
		const modes = buildTripVariables(
			params,
			withoutBus,
		).modes?.transportModes.map(({ transportMode }) => transportMode);

		expect(modes).toContain("rail");
		expect(modes).toContain("bus");
		expect(modes).toContain("coach");
	});

	it("keeps a bus leg advertised as a rail service", () => {
		expect(
			patternMatchesFilters(patternWithLeg("bus", "rail"), withoutBus),
		).toBe(true);
	});

	it("removes ordinary bus and coach services", () => {
		expect(
			patternMatchesFilters(patternWithLeg("bus", "bus"), withoutBus),
		).toBe(false);
		expect(
			patternMatchesFilters(patternWithLeg("coach", "coach"), withoutBus),
		).toBe(false);
	});

	it("falls back to the leg mode when line metadata is missing", () => {
		expect(patternMatchesFilters(patternWithLeg("bus", null), withoutBus)).toBe(
			false,
		);
	});
});

describe("transport mode requests", () => {
	it("requests both water and ferry modes for the water group", () => {
		const waterOnly: TripFilters = {
			...DEFAULT_FILTERS,
			modes: ["water"],
		};
		const modes = buildTripVariables(
			params,
			waterOnly,
		).modes?.transportModes.map(({ transportMode }) => transportMode);

		expect(modes).toEqual(["water", "ferry"]);
	});
});

describe("default modes", () => {
	it("excludes air from the built-in default", () => {
		expect(DEFAULT_MODE_GROUPS).not.toContain("air");
		expect(DEFAULT_FILTERS.modes).not.toContain("air");
	});

	it("falls back to the built-in default when no search params are set", () => {
		expect(filtersFromSearch({}).modes).toEqual(DEFAULT_MODE_GROUPS);
	});

	it("falls back to a custom default when one is provided", () => {
		const customDefault = ["rail", "air"] as const;
		expect(filtersFromSearch({}, customDefault).modes).toEqual(customDefault);
	});

	it("omits modes from the URL when they match the active default", () => {
		const filters: TripFilters = { ...DEFAULT_FILTERS };
		expect(searchFromFilters(filters).modes).toBeUndefined();

		const customDefault = ["rail", "air"] as const;
		expect(
			searchFromFilters(
				{ ...filters, modes: [...customDefault] },
				customDefault,
			).modes,
		).toBeUndefined();
	});

	it("keeps modes in the URL when they deviate from the active default", () => {
		const filters: TripFilters = { ...DEFAULT_FILTERS, modes: ["rail"] };
		expect(searchFromFilters(filters).modes).toEqual(["rail"]);
	});

	it("treats an explicit match with the default as the default state", () => {
		expect(isDefaultFilters({ ...DEFAULT_FILTERS })).toBe(true);
		expect(
			isDefaultFilters({ ...DEFAULT_FILTERS, modes: [...ALL_MODE_GROUPS] }),
		).toBe(false);
	});
});
