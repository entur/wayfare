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

const CATEGORY_NOUNS: Record<string, [singular: string, plural: string]> = {
	ADULT: ["adult", "adults"],
	CHILD: ["child", "children"],
	YOUTH: ["youth", "youths"],
	SENIOR: ["senior", "seniors"],
	INFANT: ["infant", "infants"],
	ANYONE: ["traveller", "travellers"],
	STUDENT: ["student", "students"],
	MILITARY: ["military", "military"],
};

// Entitlements (STUDENT, MILITARY) are more specific than ageGroup, matching partyLabel's priority.
export function travelPartyCategoryKey(p: TravelParty): string | undefined {
	const entitlementType =
		p.entitlements?.entitlementsGiven?.[0]?.entitlementType;
	if (entitlementType) return entitlementType;
	return p.type === "user_profile" ? p.ageGroup : undefined;
}

// Bare singular/plural noun for a resolved category key (e.g. "ADULT" + 3 -> "adults"),
// for contexts that already show their own count and don't want partyLabel's "Adult × 3" form.
export function categoryNoun(
	categoryKey: string | undefined,
	quantity: number,
): string | undefined {
	const forms = categoryKey ? CATEGORY_NOUNS[categoryKey] : undefined;
	if (!forms) return undefined;
	return quantity === 1 ? forms[0] : forms[1];
}

function entitlementLabel(types: string[]): string | null {
	if (types.length === 0) return null;
	return types.map((t) => ENTITLEMENT_LABELS[t] ?? t).join(", ");
}

export function travelPartyCount(
	profiles?: import("../types/search").UserProfile[],
	travellers?: import("../types/search").IndividualTraveller[],
): number {
	const fromProfiles = (profiles ?? []).reduce(
		(sum, p) => sum + (p.count ?? 1),
		0,
	);
	return fromProfiles + (travellers?.length ?? 0);
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
