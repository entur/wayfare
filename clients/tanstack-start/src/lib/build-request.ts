import type { TravelerGroup } from "../context/search-form";
import type { IndividualTraveller, UserProfile } from "../types/search";
import { travelerCategory } from "./traveler-categories";

export function buildRequest(travelers: TravelerGroup[]): {
	profiles: UserProfile[];
	travellers: IndividualTraveller[];
} {
	const profiles: UserProfile[] = [];
	const travellers: IndividualTraveller[] = [];

	for (const t of travelers) {
		const category = travelerCategory(t.ageGroup);
		const entitlements = category?.entitlement
			? {
					entitlements: {
						entitlementsGiven: [
							{
								type: "entitlement" as const,
								entitlementType: category.entitlement,
							},
						],
					},
				}
			: {};

		// individual_traveller has no ageGroup, so only people with an age (or the
		// signed-in customer) go as individuals. Everyone else is a profile.
		const named =
			t.individuals?.filter((i) => i.age != null || i.customerId) ?? [];

		named.forEach((person, j) => {
			travellers.push({
				id: `${t.id}_${j}`,
				type: "individual_traveller",
				...(person.age != null ? { age: person.age } : {}),
				...(person.name ? { fullName: person.name } : {}),
				...(person.customerId ? { customerReference: person.customerId } : {}),
				...entitlements,
			});
		});

		const unnamedCount = t.count - named.length;
		if (unnamedCount > 0) {
			profiles.push({
				id: named.length > 0 ? `${t.id}_anon` : t.id,
				type: "user_profile",
				count: unnamedCount,
				...(category?.ageGroup ? { ageGroup: category.ageGroup } : {}),
				...entitlements,
			});
		}
	}

	return { profiles, travellers };
}
