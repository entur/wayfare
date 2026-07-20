import { describe, expect, it } from "vitest";
import { stringifyJsonLog } from "./omsa-client";

describe("stringifyJsonLog", () => {
	it("replaces circular references", () => {
		const body: Record<string, unknown> = { id: "ticket-1" };
		body.self = body;

		expect(JSON.parse(stringifyJsonLog({ body }))).toEqual({
			body: {
				id: "ticket-1",
				self: "[Circular]",
			},
		});
	});

	it("keeps repeated non-circular references", () => {
		const ticket = { id: "ticket-1" };

		expect(
			JSON.parse(stringifyJsonLog({ first: ticket, second: ticket })),
		).toEqual({
			first: ticket,
			second: ticket,
		});
	});

	it("converts BigInt values to strings", () => {
		expect(JSON.parse(stringifyJsonLog({ value: 12n }))).toEqual({
			value: "12",
		});
	});
});
