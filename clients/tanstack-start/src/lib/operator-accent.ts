export const OPERATOR_ACCENTS: Record<string, string> = {
	AKT: "#009F6F",
	ATB: "#37424A",
	BRA: "#FCDE3D",
	FIN: "#FAD213",
	INN: "#025750",
	KOL: "#333F48",
	MOR: "#007AB5",
	NOR: "#0384A6",
	OST: "#ED1C24",
	RUT: "#E60000",
	SKY: "#C74021",
	TEL: "#FFD520",
	TRO: "#E95E1B",
	VKT: "#003F24",
	VYG: "#00453E",
	SJV: "#2E364A",
	GOA: "#2E364A",
};

export function accentFor(code: string | null | undefined): string | undefined {
	if (!code) return undefined;
	return OPERATOR_ACCENTS[code];
}

export function accentTint(hex: string, alpha: number): string {
	const raw = hex.replace("#", "");
	const full =
		raw.length === 3
			? raw
					.split("")
					.map((c) => c + c)
					.join("")
			: raw;
	const r = Number.parseInt(full.slice(0, 2), 16);
	const g = Number.parseInt(full.slice(2, 4), 16);
	const b = Number.parseInt(full.slice(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
