import type { TravelerGroup, TravelerIndividual } from "../context/search-form";
import type { UserProfile } from "../types/search";

export type TravelerCategory =
	| "ADULT"
	| "CHILD"
	| "STUDENT"
	| "SENIOR"
	| "MILITARY";

export interface TravelerCategoryConfig {
	id: TravelerCategory;
	label: string;
	/** Every traveller needs an age, so each one is sent as an individual_traveller. */
	requiresAge: boolean;
	ageGroup?: UserProfile["ageGroup"];
	entitlement?: "STUDENT" | "MILITARY";
}

export const TRAVELER_CATEGORIES: TravelerCategoryConfig[] = [
	{
		id: "ADULT",
		label: "Adult",
		requiresAge: false,
		ageGroup: "ADULT",
	},
	{
		id: "CHILD",
		label: "Child",
		requiresAge: true,
		ageGroup: "CHILD",
	},
	{
		id: "STUDENT",
		label: "Student",
		requiresAge: true,
		entitlement: "STUDENT",
	},
	{
		id: "SENIOR",
		label: "Senior",
		requiresAge: false,
		ageGroup: "SENIOR",
	},
	{
		id: "MILITARY",
		label: "Military",
		requiresAge: false,
		ageGroup: "ADULT",
		entitlement: "MILITARY",
	},
];

export function travelerCategory(
	id: string,
): TravelerCategoryConfig | undefined {
	return TRAVELER_CATEGORIES.find((c) => c.id === id);
}

// OMSA can only tell an individual's category from their age, so anyone named
// needs one. The signed-in customer is exempt: we have no birth date for them.
export function needsAge(
	group: TravelerGroup,
	person: TravelerIndividual,
): boolean {
	if (person.age != null || person.customerId) return false;
	return !!travelerCategory(group.ageGroup)?.requiresAge || !!person.name;
}

export function hasMissingAges(travelers: TravelerGroup[]): boolean {
	return travelers.some(
		(t) =>
			(travelerCategory(t.ageGroup)?.requiresAge &&
				t.individuals?.length !== t.count) ||
			t.individuals?.some((i) => needsAge(t, i)),
	);
}
