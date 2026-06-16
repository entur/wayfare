import { describe, expect, it } from "vitest";
import type { EstimatedCall } from "../types/departures";
import {
	delayMinutes,
	formatRelativeMinutes,
	groupByQuay,
} from "./departure-time";

function call(overrides: Partial<EstimatedCall> = {}): EstimatedCall {
	return {
		aimedDepartureTime: "2026-06-16T10:00:00+02:00",
		expectedDepartureTime: "2026-06-16T10:00:00+02:00",
		realtime: true,
		cancellation: false,
		destinationDisplay: { frontText: "Oslo S" },
		quay: { id: "Q1", publicCode: "1", name: "Spor 1" },
		serviceJourney: {
			line: { publicCode: "1", transportMode: "metro" },
		},
		...overrides,
	};
}

describe("delayMinutes", () => {
	it("returns 0 when expected equals aimed", () => {
		expect(
			delayMinutes({
				aimedDepartureTime: "2026-06-16T10:00:00Z",
				expectedDepartureTime: "2026-06-16T10:00:00Z",
			}),
		).toBe(0);
	});

	it("returns positive minutes when expected is after aimed", () => {
		expect(
			delayMinutes({
				aimedDepartureTime: "2026-06-16T10:00:00Z",
				expectedDepartureTime: "2026-06-16T10:03:30Z",
			}),
		).toBe(4);
	});

	it("returns negative minutes when expected is before aimed", () => {
		expect(
			delayMinutes({
				aimedDepartureTime: "2026-06-16T10:00:00Z",
				expectedDepartureTime: "2026-06-16T09:59:00Z",
			}),
		).toBe(-1);
	});
});

describe("formatRelativeMinutes", () => {
	const now = new Date("2026-06-16T10:00:00Z");

	it("renders 'now' when within the next minute", () => {
		expect(formatRelativeMinutes("2026-06-16T10:00:30Z", now)).toBe("now");
	});

	it("renders 'in N min' for upcoming departures", () => {
		expect(formatRelativeMinutes("2026-06-16T10:05:00Z", now)).toBe("in 5 min");
	});

	it("renders 'departed' for past departures", () => {
		expect(formatRelativeMinutes("2026-06-16T09:59:00Z", now)).toBe("departed");
	});
});

describe("groupByQuay", () => {
	it("buckets calls by quay id and preserves order within group", () => {
		const a = call({
			quay: { id: "Q1", publicCode: "1" },
			expectedDepartureTime: "2026-06-16T10:00:00Z",
		});
		const b = call({
			quay: { id: "Q2", publicCode: "2" },
			expectedDepartureTime: "2026-06-16T10:01:00Z",
		});
		const c = call({
			quay: { id: "Q1", publicCode: "1" },
			expectedDepartureTime: "2026-06-16T10:02:00Z",
		});

		const groups = groupByQuay([a, b, c]);

		expect(groups).toHaveLength(2);
		const q1 = groups.find((g) => g.quay.id === "Q1");
		const q2 = groups.find((g) => g.quay.id === "Q2");
		expect(q1?.calls).toEqual([a, c]);
		expect(q2?.calls).toEqual([b]);
	});

	it("orders groups by their earliest expected departure", () => {
		const later = call({
			quay: { id: "Q2", publicCode: "2" },
			expectedDepartureTime: "2026-06-16T10:10:00Z",
		});
		const earlier = call({
			quay: { id: "Q1", publicCode: "1" },
			expectedDepartureTime: "2026-06-16T10:01:00Z",
		});

		const groups = groupByQuay([later, earlier]);
		expect(groups.map((g) => g.quay.id)).toEqual(["Q1", "Q2"]);
	});

	it("uses 'unknown' as the id when quay is missing", () => {
		const noQuay = call({ quay: null });
		const groups = groupByQuay([noQuay]);
		expect(groups[0]?.quay.id).toBe("unknown");
	});
});
