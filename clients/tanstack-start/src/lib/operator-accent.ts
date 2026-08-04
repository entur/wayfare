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

interface Hsl {
	h: number;
	s: number;
	l: number;
}

function hexToHsl(hex: string): Hsl {
	const [r255, g255, b255] = channels(hex);
	const r = r255 / 255;
	const g = g255 / 255;
	const b = b255 / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;
	const l = (max + min) / 2;

	if (delta === 0) return { h: 0, s: 0, l };

	const s = delta / (1 - Math.abs(2 * l - 1));
	let h: number;
	if (max === r) h = ((g - b) / delta) % 6;
	else if (max === g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;

	return { h: (((h * 60) % 360) + 360) % 360, s, l };
}

function hslToHex({ h, s, l }: Hsl): string {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hp = h / 60;
	const x = c * (1 - Math.abs((hp % 2) - 1));
	const [r1, g1, b1] =
		hp < 1
			? [c, x, 0]
			: hp < 2
				? [x, c, 0]
				: hp < 3
					? [0, c, x]
					: hp < 4
						? [0, x, c]
						: hp < 5
							? [x, 0, c]
							: [c, 0, x];
	const m = l - c / 2;
	const toHex = (value: number) =>
		Math.round(Math.min(1, Math.max(0, value + m)) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`.toUpperCase();
}

function contrastBetween(a: string, b: string): number {
	const la = relativeLuminance(a);
	const lb = relativeLuminance(b);
	const [hi, lo] = la > lb ? [la, lb] : [lb, la];
	return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA for normal-weight body text. */
const TEXT_CONTRAST_TARGET = 4.5;

export const BUTTON_LIGHT_INK = "#FFFFFF";
export const BUTTON_DARK_INK = "#262729";

export interface BrandButton {
	background: string;
	hover: string;
	ink: string;
}

/**
 * Saturation is pushed to full as lightness drops, so a darkened colour stays
 * as vivid as its hue allows instead of drifting toward grey.
 *
 * This helps most hues a lot and yellow barely at all: #FCDE3D already sits at
 * ~97% saturation, and every yellow dark enough to hold white text reads as gold
 * or olive regardless of saturation. That is a property of the hue, not a bug
 * here — see the note on brandButtonColors.
 */
function deepen(hsl: Hsl, l: number): string {
	return hslToHex({ h: hsl.h, s: Math.min(1, Math.max(hsl.s, 0.85)), l });
}

function withHover(background: string, ink: string): BrandButton {
	const hsl = hexToHsl(background);

	// Move away from the ink, never toward it. Moving away from the midpoint
	// instead looked reasonable but dropped hover below AA for mid-tones —
	// lightening #007AB5 under white ink fell to 3.4:1. Going away from the ink
	// can only raise contrast, so the hover state is readable by construction.
	const towardDark = relativeLuminance(ink) > 0.5;
	const hoverL = towardDark
		? Math.max(0.06, hsl.l - 0.07)
		: Math.min(0.94, hsl.l + 0.07);

	return { background, hover: hslToHex({ ...hsl, l: hoverL }), ink };
}

function shiftUntilReadable(accent: string, ink: string, step: number): string {
	const hsl = hexToHsl(accent);
	let { l } = hsl;
	let candidate = accent;
	while (
		contrastBetween(candidate, ink) < TEXT_CONTRAST_TARGET &&
		l > 0.06 &&
		l < 0.96
	) {
		l = Math.min(0.96, Math.max(0.06, l + step));
		candidate = deepen(hsl, l);
	}
	return candidate;
}

/**
 * A solid brand fill for a button, with a label colour that suits it and a hover
 * shade.
 *
 * The ink adapts so the brand colour doesn't have to. Forcing white text is what
 * ruins light brand colours: Brakar's #FCDE3D has to darken to about #806A00 to
 * hold white, which is olive rather than yellow, and no amount of saturation
 * rescues it — yellow carries its chroma at high lightness, and every yellow dark
 * enough for white text reads gold then brown. With dark ink that same yellow
 * clears roughly 11:1 completely untouched, and stays as intense as the brand
 * intends.
 *
 * So the fill is left alone whenever either ink clears AA. Only a mid-tone that
 * fails both — AKT's #009F6F manages 3.4:1 with white and 4.4:1 with dark — gets
 * moved, in whichever direction needs the smaller shift, with saturation pushed
 * up so it deepens instead of greying.
 */
export function brandButtonColors(accent: string): BrandButton {
	if (contrastBetween(accent, BUTTON_LIGHT_INK) >= TEXT_CONTRAST_TARGET) {
		return withHover(accent, BUTTON_LIGHT_INK);
	}
	if (contrastBetween(accent, BUTTON_DARK_INK) >= TEXT_CONTRAST_TARGET) {
		return withHover(accent, BUTTON_DARK_INK);
	}

	const darkened = shiftUntilReadable(accent, BUTTON_LIGHT_INK, -0.02);
	const lightened = shiftUntilReadable(accent, BUTTON_DARK_INK, 0.02);

	const start = hexToHsl(accent).l;
	const darkDelta = Math.abs(hexToHsl(darkened).l - start);
	const lightDelta = Math.abs(hexToHsl(lightened).l - start);

	return lightDelta <= darkDelta
		? withHover(lightened, BUTTON_DARK_INK)
		: withHover(darkened, BUTTON_LIGHT_INK);
}
