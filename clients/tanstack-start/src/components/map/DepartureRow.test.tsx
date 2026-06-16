// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { EstimatedCall } from "../../types/departures";
import DepartureRow from "./DepartureRow";

afterEach(() => {
	cleanup();
});

const NOW = new Date("2026-06-16T10:00:00Z");

function call(overrides: Partial<EstimatedCall> = {}): EstimatedCall {
	return {
		aimedDepartureTime: "2026-06-16T10:05:00Z",
		expectedDepartureTime: "2026-06-16T10:05:00Z",
		realtime: true,
		cancellation: false,
		destinationDisplay: { frontText: "Oslo S" },
		quay: { id: "Q1", publicCode: "1", name: "Spor 1" },
		serviceJourney: {
			line: {
				publicCode: "1",
				transportMode: "metro",
				presentation: { colour: "ff7f00", textColour: "ffffff" },
			},
		},
		...overrides,
	};
}

describe("DepartureRow", () => {
	it("renders line code, destination, and relative time", () => {
		render(<DepartureRow call={call()} now={NOW} />);
		expect(screen.getByText("1")).toBeTruthy();
		expect(screen.getByText("Oslo S")).toBeTruthy();
		expect(screen.getByText("in 5 min")).toBeTruthy();
	});

	it("renders a delayed status when expected exceeds aimed", () => {
		render(
			<DepartureRow
				call={call({
					aimedDepartureTime: "2026-06-16T10:05:00Z",
					expectedDepartureTime: "2026-06-16T10:08:00Z",
				})}
				now={NOW}
			/>,
		);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"delayed-low",
		);
	});

	it("renders a cancelled status dot when cancelled", () => {
		render(<DepartureRow call={call({ cancellation: true })} now={NOW} />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"cancelled",
		);
	});

	it("colours the expected-time text by delay status", () => {
		render(
			<DepartureRow
				call={call({
					aimedDepartureTime: "2026-06-16T10:05:00Z",
					expectedDepartureTime: "2026-06-16T10:20:00Z",
				})}
				now={NOW}
			/>,
		);
		const times = screen.getAllByText(/^\d?\d:\d\d(\s?[AP]M)?$/);
		const expectedTime = times.find((el) => el.className.includes("text-sm"));
		expect(expectedTime?.className).toMatch(/text-red-600/);
	});
});
