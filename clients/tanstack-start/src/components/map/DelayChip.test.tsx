// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DelayChip from "./DelayChip";

describe("DelayChip", () => {
	it("renders 'On time' when delay is zero and not cancelled", () => {
		render(<DelayChip delayMinutes={0} cancelled={false} realtime />);
		expect(screen.getByText("On time")).toBeTruthy();
	});

	it("renders '+3 min' when delay is positive", () => {
		render(<DelayChip delayMinutes={3} cancelled={false} realtime />);
		expect(screen.getByText("+3 min")).toBeTruthy();
	});

	it("renders '-2 min' when delay is negative", () => {
		render(<DelayChip delayMinutes={-2} cancelled={false} realtime />);
		expect(screen.getByText("-2 min")).toBeTruthy();
	});

	it("renders 'Cancelled' regardless of delay", () => {
		render(<DelayChip delayMinutes={5} cancelled realtime />);
		expect(screen.getByText("Cancelled")).toBeTruthy();
	});

	it("renders 'Scheduled' when no realtime data", () => {
		render(<DelayChip delayMinutes={0} cancelled={false} realtime={false} />);
		expect(screen.getByText("Scheduled")).toBeTruthy();
	});
});
