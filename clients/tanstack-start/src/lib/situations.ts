import type {
	MultilingualString,
	PtSituationElement,
	SituationSeverity,
} from "../types/situations";

const SEVERITY_ORDER: Record<
	SituationSeverity | "undefined" | "unknown",
	number
> = {
	noImpact: 0,
	verySlight: 1,
	slight: 2,
	normal: 3,
	severe: 4,
	verySevere: 5,
	unknown: 1,
	undefined: 0,
};

/**
 * Returns the best-fit text for the given language preference.
 * Falls back to "nb" then "en" then the first non-empty value.
 */
export function pickText(
	strings: MultilingualString[],
	lang = "no",
): string | undefined {
	if (!strings || strings.length === 0) return undefined;

	const preferred = lang === "no" ? ["no", "nb"] : [lang];
	for (const l of preferred) {
		const match = strings.find((s) => s.language === l && s.value);
		if (match) return match.value;
	}

	// Fallback chain: "nb" -> "no" -> "en" -> first non-empty
	for (const l of ["nb", "no", "en"]) {
		if (preferred.includes(l)) continue;
		const match = strings.find((s) => s.language === l && s.value);
		if (match) return match.value;
	}

	return strings.find((s) => s.value)?.value;
}

/**
 * Returns a numeric rank for a severity value (higher = more severe).
 */
export function severityRank(
	severity: SituationSeverity | null | undefined,
): number {
	if (!severity) return 0;
	return SEVERITY_ORDER[severity] ?? 0;
}

/**
 * Merges multiple situation arrays and de-duplicates by id,
 * returning items sorted highest-severity first.
 */
export function dedupeSituations(
	...lists: (PtSituationElement[] | null | undefined)[]
): PtSituationElement[] {
	const seen = new Map<string, PtSituationElement>();
	for (const list of lists) {
		if (!list) continue;
		for (const s of list) {
			if (!seen.has(s.id)) {
				seen.set(s.id, s);
			}
		}
	}
	return Array.from(seen.values()).sort(
		(a, b) => severityRank(b.severity) - severityRank(a.severity),
	);
}
