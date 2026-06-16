// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { EstimatedCall } from "../../types/departures";
import DepartureBoard from "./DepartureBoard";

afterEach(() => {
	cleanup();
});

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
	it("renders a quay header per group when publicCodes differ", () => {
		const calls = [
			call({ quay: { id: "Q1", publicCode: "1", name: null } }),
			call({ quay: { id: "Q2", publicCode: "2", name: null } }),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.getByText("Platform 1")).toBeTruthy();
		expect(screen.getByText("Platform 2")).toBeTruthy();
	});

	it("caps the flat list at 5 rows by default", () => {
		const calls = Array.from({ length: 8 }, (_, i) =>
			call({
				quay: { id: "Q1", publicCode: "1", name: null },
				destinationDisplay: { frontText: `Dest ${i}` },
				expectedDepartureTime: `2026-06-16T10:0${i}:00Z`,
				aimedDepartureTime: `2026-06-16T10:0${i}:00Z`,
			}),
		);
		render(<DepartureBoard calls={calls} />);
		expect(screen.getAllByRole("listitem")).toHaveLength(5);
		expect(screen.getByRole("button", { name: /show 3 more/i })).toBeTruthy();
	});

	it("expands when 'Show more' is clicked", () => {
		const calls = Array.from({ length: 8 }, (_, i) =>
			call({
				quay: { id: "Q1", publicCode: "1", name: null },
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

	it("shows no platform header for a single quay", () => {
		const calls = [
			call({
				quay: { id: "Q1", publicCode: "1", name: "Spor 1" },
			}),
			call({
				quay: { id: "Q1", publicCode: "1", name: "Spor 1" },
				destinationDisplay: { frontText: "Other" },
			}),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.queryByText("Platform 1")).toBeNull();
		expect(screen.queryByText("Spor 1")).toBeNull();
	});

	it("flattens when all quays share the same label", () => {
		const calls = [
			call({
				quay: { id: "Q1", publicCode: null, name: "Jevnaker stasjon" },
				destinationDisplay: { frontText: "A" },
			}),
			call({
				quay: { id: "Q2", publicCode: null, name: "Jevnaker stasjon" },
				destinationDisplay: { frontText: "B" },
			}),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.queryByText("Jevnaker stasjon")).toBeNull();
		expect(screen.queryByText("Other")).toBeNull();
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("flattens when every quay has no label at all", () => {
		const calls = [
			call({ quay: { id: "Q1", publicCode: null, name: null } }),
			call({ quay: { id: "Q2", publicCode: null, name: null } }),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.queryByText("Other")).toBeNull();
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("uses the quay name as header when publicCode is missing but names differ", () => {
		const calls = [
			call({
				quay: { id: "Q1", publicCode: null, name: "Mot sentrum" },
			}),
			call({
				quay: { id: "Q2", publicCode: null, name: "Mot Oslo" },
			}),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.getByText("Mot sentrum")).toBeTruthy();
		expect(screen.getByText("Mot Oslo")).toBeTruthy();
	});

	it("falls back to 'Other' for label-less quays only when other groups have labels", () => {
		const calls = [
			call({ quay: { id: "Q1", publicCode: "1", name: null } }),
			call({ quay: { id: "Q2", publicCode: null, name: null } }),
		];
		render(<DepartureBoard calls={calls} />);
		expect(screen.getByText("Platform 1")).toBeTruthy();
		expect(screen.getByText("Other")).toBeTruthy();
	});
});
