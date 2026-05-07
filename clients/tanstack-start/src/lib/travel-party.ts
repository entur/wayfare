import type { IndividualTraveller, UserProfile } from "../types/search";

export type TravelParty = UserProfile | IndividualTraveller;

const AGE_GROUP_LABELS: Record<string, string> = {
	ADULT: "Adult",
	CHILD: "Child",
	YOUTH: "Youth",
	SENIOR: "Senior",
	INFANT: "Infant",
	ANYONE: "Traveller",
};

export function partyLabel(p: TravelParty): string {
	if (p.type === "user_profile") {
		const entitlements = p.entitlements?.entitlementsGiven?.map((e) => e.entitlementType) ?? [];
		const base = (p.ageGroup && AGE_GROUP_LABELS[p.ageGroup]) ?? entitlements[0] ?? p.id;
		return p.count && p.count > 1 ? `${base} × ${p.count}` : base;
	}
	if (p.fullName) return p.fullName;
	const entitlements = p.entitlements?.entitlementsGiven?.map((e) => e.entitlementType) ?? [];
	if (entitlements.length > 0) {
		const label = entitlements.join(", ");
		return p.age != null ? `${label} (${p.age} yrs)` : label;
	}
	return p.age != null ? `${p.age} yrs` : p.id;
}
