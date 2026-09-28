import { describe, expect, it } from "vitest";
import { hasMissingAges } from "./traveler-categories";

describe("hasMissingAges", () => {
	it("requires an age for every child and student", () => {
		expect(
			hasMissingAges([
				{ id: "child", ageGroup: "CHILD", count: 2, individuals: [{ age: 8 }] },
			]),
		).toBe(true);
		expect(
			hasMissingAges([
				{ id: "student", ageGroup: "STUDENT", count: 1, individuals: [{}] },
			]),
		).toBe(true);
		expect(
			hasMissingAges([
				{ id: "child", ageGroup: "CHILD", count: 1, individuals: [{ age: 8 }] },
			]),
		).toBe(false);
	});

	it("doesn't require ages for other categories", () => {
		expect(
			hasMissingAges([
				{ id: "adult", ageGroup: "ADULT", count: 1 },
				{ id: "senior", ageGroup: "SENIOR", count: 1 },
				{ id: "military", ageGroup: "MILITARY", count: 1 },
			]),
		).toBe(false);
	});

	it("requires an age for anyone given a name, except the signed-in customer", () => {
		expect(
			hasMissingAges([
				{
					id: "adult",
					ageGroup: "ADULT",
					count: 1,
					individuals: [{ name: "Ada" }],
				},
			]),
		).toBe(true);
		expect(
			hasMissingAges([
				{
					id: "adult",
					ageGroup: "ADULT",
					count: 1,
					individuals: [{ name: "Ada", customerId: "customer-1" }],
				},
			]),
		).toBe(false);
	});
});
