export interface Operator {
	code: string;
	name: string;
	authorityRef?: string;
	hasFareZones?: boolean;
	logo?: string;
}

export const OPERATORS: Operator[] = [
	{
		code: "AKT",
		name: "Agder kollektivtrafikk",
		authorityRef: "AKT:Authority:AKT_ID",
		hasFareZones: true,
		logo: "AKT",
	},
	{
		code: "ATB",
		name: "AtB (Trøndelag)",
		authorityRef: "ATB:Authority:2",
		hasFareZones: true,
		logo: "AtB",
	},
	{
		code: "BRA",
		name: "Brakar (Buskerud)",
		authorityRef: "BRA:Authority:4",
		hasFareZones: true,
		logo: "Brakar",
	},
	{
		code: "FIN",
		name: "Snelandia (Finnmark)",
		authorityRef: "FIN:Authority:FIN_ID",
		hasFareZones: true,
		logo: "Snelandia",
	},
	{
		code: "INN",
		name: "Innlandstrafikk",
		authorityRef: "INN:Authority:INN_ID",
		hasFareZones: true,
		logo: "Innlandstrafikk",
	},
	{
		code: "KOL",
		name: "Kolumbus (Rogaland)",
		authorityRef: "KOL:Authority:8",
		hasFareZones: true,
		logo: "Kolumbus",
	},
	{
		code: "MOR",
		name: "Fram (Møre og Romsdal)",
		authorityRef: "MOR:Authority:MOR",
		hasFareZones: true,
		logo: "Fram",
	},
	{
		code: "NOR",
		name: "Reis (Nordland)",
		authorityRef: "NOR:Authority:12",
		hasFareZones: true,
		logo: "Nordland",
	},
	{
		code: "OST",
		name: "Østfold kollektivtrafikk",
		authorityRef: "OST:Authority:1",
		hasFareZones: true,
		logo: "Ostfold",
	},
	{
		code: "RUT",
		name: "Ruter (Oslo og Akershus)",
		authorityRef: "RUT:Authority:RUT",
		hasFareZones: true,
		logo: "Ruter",
	},
	{
		code: "SKY",
		name: "Skyss (Vestland)",
		authorityRef: "SKY:Authority:SKY",
		hasFareZones: true,
		logo: "Skyss",
	},
	{
		code: "TEL",
		name: "Farte (Telemark)",
		authorityRef: "TEL:Authority:TFK_ID",
		hasFareZones: true,
		logo: "Farte",
	},
	{
		code: "TRO",
		name: "Svipper (Troms)",
		authorityRef: "TRO:Authority:1",
		hasFareZones: true,
		logo: "Svipper",
	},
	{
		code: "VKT",
		name: "Vestfold kollektivtrafikk",
		authorityRef: "VKT:Authority:VKT_ID",
		hasFareZones: true,
		logo: "VKT",
	},
	{ code: "VYG", name: "Vy", authorityRef: "VYG:Authority:VY", logo: "Vy" },
	{ code: "SJV", name: "SJ", authorityRef: "SJV:Authority:SJV", logo: "SJ" },
	{
		code: "GOA",
		name: "Go-Ahead",
		authorityRef: "GOA:Authority:GOA",
		logo: "GOA",
	},
];

const BY_CODE = new Map(OPERATORS.map((operator) => [operator.code, operator]));

export function findOperator(
	code: string | null | undefined,
): Operator | undefined {
	if (!code) return undefined;
	return BY_CODE.get(code);
}

export function operatorsWithProducts(): Operator[] {
	return OPERATORS.filter((operator) => operator.authorityRef !== undefined);
}

export function authorityRefFor(
	code: string | null | undefined,
): string | undefined {
	return findOperator(code)?.authorityRef;
}
