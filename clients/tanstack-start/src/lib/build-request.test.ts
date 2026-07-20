import { describe, expect, it } from "vitest";
import type { TravelerGroup } from "../context/search-form";
import { buildRequest } from "./build-request";

describe("buildRequest", () => {
	it("builds an anonymous profile for an unnamed traveller group", () => {
		const travelers: TravelerGroup[] = [
			{ id: "adult", ageGroup: "ADULT", count: 2, minAge: 18 },
		];

		expect(buildRequest(travelers)).toEqual({
			profiles: [
				{
					id: "adult",
					type: "user_profile",
					count: 2,
					ageGroup: "ADULT",
					minimumAge: 18,
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
				minAge: 18,
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
					minimumAge: 18,
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
	] as const)("maps %s eligibility to an entitlement", (ageGroup, entitlementType, profileAgeGroup) => {
		const travelers: TravelerGroup[] = [
			{
				id: ageGroup.toLowerCase(),
				ageGroup,
				count: 1,
				minAge: 20,
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
				minimumAge: 20,
				entitlements: {
					entitlementsGiven: [{ type: "entitlement", entitlementType }],
				},
			},
		]);
	});
});
