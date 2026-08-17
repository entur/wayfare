// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
	getDefaultTripModes,
	setDefaultTripModes,
} from "./preferences-storage";

beforeEach(() => {
	window.localStorage.clear();
});

describe("default trip modes", () => {
	it("returns undefined when nothing is stored", () => {
		expect(getDefaultTripModes()).toBeUndefined();
	});

	it("stores and returns a chosen set of modes", () => {
		setDefaultTripModes(["rail", "bus"]);
		expect(getDefaultTripModes()).toEqual(["rail", "bus"]);
	});

	it("clears the setting when passed null", () => {
		setDefaultTripModes(["rail"]);
		setDefaultTripModes(null);
		expect(getDefaultTripModes()).toBeUndefined();
	});

	it("clears the setting when passed an empty list", () => {
		setDefaultTripModes(["rail"]);
		setDefaultTripModes([]);
		expect(getDefaultTripModes()).toBeUndefined();
	});

	it("drops invalid mode values from corrupt storage", () => {
		window.localStorage.setItem(
			"wayfare:preferences",
			JSON.stringify({ defaultTripModes: ["rail", "spaceship"] }),
		);
		expect(getDefaultTripModes()).toEqual(["rail"]);
	});

	it("recovers from corrupt JSON", () => {
		window.localStorage.setItem("wayfare:preferences", "not-json");
		expect(getDefaultTripModes()).toBeUndefined();
	});
});
