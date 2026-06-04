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

const ENTITLEMENT_LABELS: Record<string, string> = {
	STUDENT: "Student",
	MILITARY: "Military",
};

function entitlementLabel(types: string[]): string | null {
	if (types.length === 0) return null;
	return types.map((t) => ENTITLEMENT_LABELS[t] ?? t).join(", ");
}

export function partyLabel(p: TravelParty): string {
	if (p.type === "user_profile") {
		const types =
			p.entitlements?.entitlementsGiven?.map((e) => e.entitlementType) ?? [];
		// Entitlements are more specific than ageGroup (e.g. Military > Adult)
		const base =
			entitlementLabel(types) ??
			(p.ageGroup && AGE_GROUP_LABELS[p.ageGroup]) ??
			p.id;
		return p.count && p.count > 1 ? `${base} × ${p.count}` : base;
	}

	if (p.fullName) return p.fullName;

	const types =
		p.entitlements?.entitlementsGiven?.map((e) => e.entitlementType) ?? [];
	const entLabel = entitlementLabel(types);
	if (entLabel) {
		return p.age != null ? `${entLabel} (${p.age} yrs)` : entLabel;
	}

	// No entitlements — try to infer the group from the ID prefix (e.g. "senior_0" → "Senior")
	const idPrefix = p.id.split("_")[0]?.toUpperCase();
	const groupLabel = idPrefix ? (AGE_GROUP_LABELS[idPrefix] ?? null) : null;
	if (groupLabel) {
		return p.age != null ? `${groupLabel} (${p.age} yrs)` : groupLabel;
	}

	return p.age != null ? `${p.age} yrs` : p.id;
}
