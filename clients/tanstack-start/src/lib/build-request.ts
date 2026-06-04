import type { TravelerGroup } from "../context/search-form";
import type { IndividualTraveller, UserProfile } from "../types/search";

export function buildRequest(travelers: TravelerGroup[]): {
	profiles: UserProfile[];
	travellers: IndividualTraveller[];
} {
	const profiles: UserProfile[] = [];
	const travellers: IndividualTraveller[] = [];

	for (const t of travelers) {
		const entitlementType =
			t.ageGroup === "STUDENT"
				? "STUDENT"
				: t.ageGroup === "MILITARY"
					? "MILITARY"
					: undefined;
		const entitlements = entitlementType
			? {
					entitlements: {
						entitlementsGiven: [
							{ type: "entitlement" as const, entitlementType },
						],
					},
				}
			: {};
		// STUDENT goes as individual_traveller (age required); MILITARY is an adult with entitlement
		const profileAgeGroup =
			t.ageGroup === "STUDENT"
				? undefined
				: t.ageGroup === "MILITARY"
					? "ADULT"
					: t.ageGroup;

		// For entitlement groups (STUDENT, MILITARY) age verifies eligibility so it
		// warrants an individual_traveller. For plain age groups (ADULT, SENIOR, …)
		// ageGroup on user_profile is sufficient — don't downgrade to individual_traveller
		// just because the user happened to specify an age.
		const ageCountsAsNamed = entitlementType != null;
		const named =
			t.individuals?.filter(
				(i) => i.name || i.customerId || (ageCountsAsNamed && i.age != null),
			) ?? [];

		if (named.length > 0) {
			named.forEach((person, j) => {
				travellers.push({
					id: `${t.id}_${j}`,
					type: "individual_traveller",
					...(person.age != null
						? { age: person.age }
						: t.minAge != null
							? { age: t.minAge }
							: {}),
					...(person.name ? { fullName: person.name } : {}),
					...(person.customerId
						? { customerReference: person.customerId }
						: {}),
					...entitlements,
				});
			});
			const unnamedCount = t.count - named.length;
			if (unnamedCount > 0) {
				profiles.push({
					id: `${t.id}_anon`,
					type: "user_profile",
					count: unnamedCount,
					...(profileAgeGroup != null ? { ageGroup: profileAgeGroup } : {}),
					...(t.minAge != null ? { minimumAge: t.minAge } : {}),
					...(t.maxAge != null ? { maximumAge: t.maxAge } : {}),
					...entitlements,
				});
			}
		} else {
			profiles.push({
				id: t.id,
				type: "user_profile",
				count: t.count,
				...(profileAgeGroup != null ? { ageGroup: profileAgeGroup } : {}),
				...(t.minAge != null ? { minimumAge: t.minAge } : {}),
				...(t.maxAge != null ? { maximumAge: t.maxAge } : {}),
				...entitlements,
			});
		}
	}

	return { profiles, travellers };
}
