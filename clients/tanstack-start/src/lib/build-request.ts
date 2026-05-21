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
		// STUDENT and MILITARY don't map to a UserProfile ageGroup
		const profileAgeGroup =
			t.ageGroup !== "STUDENT" && t.ageGroup !== "MILITARY"
				? t.ageGroup
				: undefined;

		const named =
			t.individuals?.filter((i) => i.name || i.age != null || i.customerId) ??
			[];

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
