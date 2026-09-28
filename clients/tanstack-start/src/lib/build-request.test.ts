import { describe, expect, it } from "vitest";
import type { TravelerGroup } from "../context/search-form";
import { buildRequest } from "./build-request";

describe("buildRequest", () => {
	it("builds an anonymous profile for an unnamed traveller group", () => {
		const travelers: TravelerGroup[] = [
			{ id: "adult", ageGroup: "ADULT", count: 2 },
		];

		expect(buildRequest(travelers)).toEqual({
			profiles: [
				{
					id: "adult",
					type: "user_profile",
					count: 2,
					ageGroup: "ADULT",
				},
			],
			travellers: [],
		});
	});

	it("separates named travellers from the anonymous remainder", () => {
		const travelers: TravelerGroup[] = [
			{
				id: "adult",
				ageGroup: "ADULT",
				count: 2,
				individuals: [{ name: "Ada", age: 34, customerId: "customer-1" }],
			},
		];

		expect(buildRequest(travelers)).toEqual({
			profiles: [
				{
					id: "adult_anon",
					type: "user_profile",
					count: 1,
					ageGroup: "ADULT",
				},
			],
			travellers: [
				{
					id: "adult_0",
					type: "individual_traveller",
					age: 34,
					fullName: "Ada",
					customerReference: "customer-1",
				},
			],
		});
	});

	it.each([
		["STUDENT", "STUDENT", undefined],
		["MILITARY", "MILITARY", "ADULT"],
	] as const)(
		"maps %s eligibility to an entitlement",
		(ageGroup, entitlementType, profileAgeGroup) => {
			const travelers: TravelerGroup[] = [
				{
					id: ageGroup.toLowerCase(),
					ageGroup,
					count: 1,
				},
			];

			const result = buildRequest(travelers);

			expect(result.travellers).toEqual([]);
			expect(result.profiles).toEqual([
				{
					id: ageGroup.toLowerCase(),
					type: "user_profile",
					count: 1,
					...(profileAgeGroup ? { ageGroup: profileAgeGroup } : {}),
					entitlements: {
						entitlementsGiven: [{ type: "entitlement", entitlementType }],
					},
				},
			]);
		},
	);

	it("sends each child as an individual traveller with their age", () => {
		const travelers: TravelerGroup[] = [
			{
				id: "child",
				ageGroup: "CHILD",
				count: 2,
				individuals: [{ age: 7 }, { age: 12, name: "Kari" }],
			},
		];

		expect(buildRequest(travelers)).toEqual({
			profiles: [],
			travellers: [
				{ id: "child_0", type: "individual_traveller", age: 7 },
				{
					id: "child_1",
					type: "individual_traveller",
					age: 12,
					fullName: "Kari",
				},
			],
		});
	});

	it("sends seniors as a profile without an entered age", () => {
		const travelers: TravelerGroup[] = [
			{ id: "senior", ageGroup: "SENIOR", count: 1 },
		];

		expect(buildRequest(travelers).profiles).toEqual([
			{
				id: "senior",
				type: "user_profile",
				count: 1,
				ageGroup: "SENIOR",
			},
		]);
	});

	it("sends named adults with an age as individuals and the rest as an adult profile", () => {
		const travelers: TravelerGroup[] = [
			{
				id: "adult",
				ageGroup: "ADULT",
				count: 2,
				individuals: [{ name: "Ada", age: 40 }, {}],
			},
		];

		expect(buildRequest(travelers)).toEqual({
			profiles: [
				{ id: "adult_anon", type: "user_profile", count: 1, ageGroup: "ADULT" },
			],
			travellers: [
				{
					id: "adult_0",
					type: "individual_traveller",
					age: 40,
					fullName: "Ada",
				},
			],
		});
	});
});
