// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
	addRecentStop,
	getRecentStops,
	type RecentStop,
} from "./recent-stops-storage";

const STOP_A: RecentStop = {
	id: "NSR:StopPlace:1",
	name: "Oslo S",
	coordinates: [10.75, 59.91],
};

const STOP_B: RecentStop = {
	id: "NSR:StopPlace:2",
	name: "Jernbanetorget",
	coordinates: [10.75, 59.91],
};

beforeEach(() => {
	localStorage.clear();
});

describe("recent-stops-storage", () => {
	it("returns empty list when nothing is stored", () => {
		expect(getRecentStops()).toEqual([]);
	});

	it("adds a stop and returns it", () => {
		addRecentStop(STOP_A);
		expect(getRecentStops()).toEqual([STOP_A]);
	});

	it("moves a re-added stop to the front", () => {
		addRecentStop(STOP_A);
		addRecentStop(STOP_B);
		addRecentStop(STOP_A);
		expect(getRecentStops().map((s) => s.id)).toEqual([STOP_A.id, STOP_B.id]);
	});

	it("caps the list at 8 entries", () => {
		for (let i = 0; i < 10; i++) {
			addRecentStop({ id: `s${i}`, name: `Stop ${i}`, coordinates: [0, 0] });
		}
		const stops = getRecentStops();
		expect(stops).toHaveLength(8);
		expect(stops[0]?.id).toBe("s9");
	});

	it("recovers from corrupt JSON", () => {
		localStorage.setItem("wayfare:recent-stops", "not-json");
		expect(getRecentStops()).toEqual([]);
	});
});
