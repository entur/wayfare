// @vitest-environment jsdom
import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DepartureStatusDot from "./DepartureStatusDot";

afterEach(() => {
	cleanup();
});

describe("DepartureStatusDot", () => {
	it("renders 'scheduled' when not realtime", () => {
		render(
			<DepartureStatusDot
				delayMinutes={0}
				cancelled={false}
				realtime={false}
			/>,
		);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"scheduled",
		);
	});

	it("renders 'on-time' when realtime and not delayed", () => {
		render(<DepartureStatusDot delayMinutes={0} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"on-time",
		);
	});

	it("renders 'on-time' when running early", () => {
		render(<DepartureStatusDot delayMinutes={-2} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"on-time",
		);
	});

	it("renders 'delayed-low' for 1–4 minute delays", () => {
		render(<DepartureStatusDot delayMinutes={3} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"delayed-low",
		);
	});

	it("renders 'delayed-mid' for 5–9 minute delays", () => {
		render(<DepartureStatusDot delayMinutes={7} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"delayed-mid",
		);
	});

	it("renders 'delayed-high' for 10+ minute delays", () => {
		render(<DepartureStatusDot delayMinutes={15} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"delayed-high",
		);
	});

	it("renders 'cancelled' regardless of delay or realtime", () => {
		render(<DepartureStatusDot delayMinutes={3} cancelled realtime={false} />);
		expect(screen.getByRole("status").getAttribute("data-status")).toBe(
			"cancelled",
		);
	});

	it("includes a descriptive aria-label", () => {
		render(<DepartureStatusDot delayMinutes={5} cancelled={false} realtime />);
		expect(screen.getByRole("status").getAttribute("aria-label")).toMatch(
			/5 min/i,
		);
	});
});
