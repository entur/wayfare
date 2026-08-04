export const OPERATOR_ACCENTS: Record<string, string> = {
	AKT: "#009F6F",
	ATB: "#37424A",
	BRA: "#FCDE3D",
	FIN: "#FAD213",
	INN: "#025750",
	KOL: "#3EC652",
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

function channels(hex: string): [number, number, number] {
	const raw = hex.replace("#", "");
	const full =
		raw.length === 3
			? raw
					.split("")
					.map((c) => c + c)
					.join("")
			: raw;
	return [
		Number.parseInt(full.slice(0, 2), 16),
		Number.parseInt(full.slice(2, 4), 16),
		Number.parseInt(full.slice(4, 6), 16),
	];
}

function relativeLuminance(hex: string): number {
	const linear = channels(hex).map((value) => {
		const c = value / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

const DARK_LUMINANCE = 0.15;

// Dark accents use less alpha to avoid muddy washes.
export function accentTint(hex: string, alpha: number): string {
	const [r, g, b] = channels(hex);
	const effective =
		relativeLuminance(hex) < DARK_LUMINANCE ? alpha * 0.5 : alpha;
	return `rgba(${r}, ${g}, ${b}, ${effective})`;
}
