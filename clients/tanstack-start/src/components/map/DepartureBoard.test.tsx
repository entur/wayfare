// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { EstimatedCall } from "../../types/departures";
import DepartureBoard from "./DepartureBoard";

function call(overrides: Partial<EstimatedCall> = {}): EstimatedCall {
	return {
		aimedDepartureTime: "2026-06-16T10:00:00Z",
		expectedDepartureTime: "2026-06-16T10:00:00Z",
		realtime: true,
		cancellation: false,
		destinationDisplay: { frontText: "Dest" },
		quay: { id: "Q1", publicCode: "1", name: null },
		serviceJourney: {
			line: { publicCode: "L1", transportMode: "metro", presentation: null },
		},
		...overrides,
	};
}

describe("DepartureBoard", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders a quay header per group", () => {
		const calls = [
			call({ quay: { id: "Q1", publicCode: "1" } }),
			call({ quay: { id: "Q2", publicCode: "2" } }),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.getByText("Platform 1")).toBeTruthy();
		expect(screen.getByText("Platform 2")).toBeTruthy();
	});

	it("caps each quay at 5 rows by default", () => {
		const calls = Array.from({ length: 8 }, (_, i) =>
			call({
				quay: { id: "Q1", publicCode: "1" },
				destinationDisplay: { frontText: `Dest ${i}` },
				expectedDepartureTime: `2026-06-16T10:0${i}:00Z`,
				aimedDepartureTime: `2026-06-16T10:0${i}:00Z`,
			}),
		);
		render(<DepartureBoard calls={calls} />);
		expect(screen.getAllByRole("listitem")).toHaveLength(5);
		expect(screen.getByRole("button", { name: /show 3 more/i })).toBeTruthy();
	});

	it("expands a quay group when 'Show more' is clicked", () => {
		const calls = Array.from({ length: 8 }, (_, i) =>
			call({
				quay: { id: "Q1", publicCode: "1" },
				destinationDisplay: { frontText: `Dest ${i}` },
				expectedDepartureTime: `2026-06-16T10:0${i}:00Z`,
				aimedDepartureTime: `2026-06-16T10:0${i}:00Z`,
			}),
		);
		render(<DepartureBoard calls={calls} />);
		fireEvent.click(screen.getByRole("button", { name: /show 3 more/i }));
		expect(screen.getAllByRole("listitem")).toHaveLength(8);
	});

	it("renders an empty state when no calls", () => {
		render(<DepartureBoard calls={[]} />);
		expect(screen.getByText(/no upcoming departures/i)).toBeTruthy();
	});

	it("labels group as 'Other' when publicCode is missing", () => {
		const calls = [call({ quay: { id: "Q1", publicCode: null } })];
		const { container } = render(<DepartureBoard calls={calls} />);
		expect(within(container).getByText("Other")).toBeTruthy();
	});
});
