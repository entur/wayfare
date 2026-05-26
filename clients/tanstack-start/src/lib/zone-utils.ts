export const OPERATOR_NAMES: Record<string, string> = {
	AKT: "Agder",
	ATB: "AtB (Trondheim)",
	BRA: "Brakar",
	FIN: "Finnmark",
	INN: "Innlandstrafikk",
	KOL: "Kolumbus",
	MOR: "More og Romsdal",
	NOR: "Nordland",
	OST: "Ostfold",
	RUT: "Ruter",
	SKY: "Skyss",
	TEL: "Telemark",
	TRO: "Troms",
	VKT: "Vestfold Telemark",
};

export function formatZoneName(name: string, operatorName: string): string {
	const isCode = name.length <= 4 && /^[A-Za-z0-9]+$/.test(name);
	return isCode
		? `Zone ${name} (${operatorName})`
		: `${name} (${operatorName})`;
}
