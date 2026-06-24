export const SITUATION_FRAGMENT = `
	id
	situationNumber
	reportType
	severity
	summary { value language }
	description { value language }
	advice { value language }
	validityPeriod { startTime endTime }
	infoLinks { uri label }
`;
