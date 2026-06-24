export interface MultilingualString {
	value: string;
	language?: string | null;
}

export type SituationSeverity =
	| "noImpact"
	| "verySlight"
	| "slight"
	| "normal"
	| "severe"
	| "verySevere"
	| "unknown"
	| "undefined";

export interface PtSituationElement {
	id: string;
	situationNumber?: string | null;
	reportType?: string | null;
	severity?: SituationSeverity | null;
	summary: MultilingualString[];
	description: MultilingualString[];
	advice: MultilingualString[];
	validityPeriod?: {
		startTime?: string | null;
		endTime?: string | null;
	} | null;
	infoLinks?: { uri: string; label?: string | null }[] | null;
}
