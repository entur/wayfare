export type OmsaRuntimeMode = "dev" | "staging" | "local-dev" | "local-staging";

export type RecommendationType =
	| "FLEXIBLE"
	| "SEMI_FLEXIBLE"
	| "NON_FLEXIBLE"
	| "CHEAPEST";

export interface RecommendationControlOverride {
	enabled: boolean;
	types?: RecommendationType[];
	stripDuplicates?: boolean;
}

export interface DevConfigOverrides {
	envMode?: OmsaRuntimeMode;
	distributionChannel?: string;
	clientName?: string;
	pos?: string;
	recommendationControl?: RecommendationControlOverride;
}

const STORAGE_KEY = "wayfare_dev_config";
export const DEV_CONFIG_COOKIE_NAME = "wayfare_dev_config";

const ALLOWED_ENV_MODES: OmsaRuntimeMode[] = [
	"dev",
	"staging",
	"local-dev",
	"local-staging",
];
const ALLOWED_RECOMMENDATION_TYPES: RecommendationType[] = [
	"FLEXIBLE",
	"SEMI_FLEXIBLE",
	"NON_FLEXIBLE",
	"CHEAPEST",
];
// Entur channel/client-name/POS identifiers look like "WAY:DistributionChannel:App".
// Bounding to this charset keeps them from becoming a place to smuggle
// arbitrary values into headers sent to real Entur upstreams.
const SAFE_TOKEN_PATTERN = /^[A-Za-z0-9:_. -]{1,128}$/;

function sanitizeToken(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	if (!trimmed || !SAFE_TOKEN_PATTERN.test(trimmed)) return undefined;
	return trimmed;
}

/**
 * Validates and narrows an arbitrary value (parsed from localStorage or a
 * client-supplied cookie) down to a well-formed DevConfigOverrides. Anything
 * that doesn't match the expected shape is dropped rather than passed
 * through, since this is the boundary between untrusted client input and
 * values that get forwarded as HTTP headers / OMSA request fields.
 */
export function sanitizeDevConfigOverrides(raw: unknown): DevConfigOverrides {
	if (typeof raw !== "object" || raw === null) return {};
	const input = raw as Record<string, unknown>;
	const cleaned: DevConfigOverrides = {};

	if (
		typeof input.envMode === "string" &&
		(ALLOWED_ENV_MODES as string[]).includes(input.envMode)
	) {
		cleaned.envMode = input.envMode as OmsaRuntimeMode;
	}

	const distributionChannel = sanitizeToken(input.distributionChannel);
	if (distributionChannel) cleaned.distributionChannel = distributionChannel;

	const clientName = sanitizeToken(input.clientName);
	if (clientName) cleaned.clientName = clientName;

	const pos = sanitizeToken(input.pos);
	if (pos) cleaned.pos = pos;

	if (
		typeof input.recommendationControl === "object" &&
		input.recommendationControl !== null
	) {
		const rc = input.recommendationControl as Record<string, unknown>;
		if (typeof rc.enabled === "boolean") {
			const recommendationControl: RecommendationControlOverride = {
				enabled: rc.enabled,
			};
			if (Array.isArray(rc.types)) {
				const types = rc.types.filter(
					(type): type is RecommendationType =>
						typeof type === "string" &&
						(ALLOWED_RECOMMENDATION_TYPES as string[]).includes(type),
				);
				if (types.length) recommendationControl.types = types;
			}
			if (typeof rc.stripDuplicates === "boolean") {
				recommendationControl.stripDuplicates = rc.stripDuplicates;
			}
			cleaned.recommendationControl = recommendationControl;
		}
	}

	return cleaned;
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function getDevConfigOverrides(): DevConfigOverrides {
	if (!isBrowser()) return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return sanitizeDevConfigOverrides(JSON.parse(raw));
	} catch {
		return {};
	}
}

export function setDevConfigOverrides(
	overrides: DevConfigOverrides,
): DevConfigOverrides {
	const cleaned = sanitizeDevConfigOverrides(overrides);

	if (isBrowser()) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
		syncCookie(cleaned);
	}
	return cleaned;
}

export function clearDevConfigOverrides(): void {
	if (!isBrowser()) return;
	localStorage.removeItem(STORAGE_KEY);
	syncCookie({});
}

/**
 * Cached fingerprint of the active OAuth client, scoped by envMode. This is
 * server-derived data (fetched via getResolvedDevConfig), kept in its own
 * localStorage key so the synchronous ticket storage helpers can read it. It is
 * deliberately NOT part of DevConfigOverrides / the cookie.
 */
export function clientFingerprintKey(envMode?: string): string {
	return envMode ? `wayfare_client_fp_${envMode}` : "wayfare_client_fp";
}

export function getClientFingerprint(envMode?: string): string | undefined {
	if (!isBrowser()) return undefined;
	try {
		return localStorage.getItem(clientFingerprintKey(envMode)) ?? undefined;
	} catch {
		return undefined;
	}
}

export function setClientFingerprint(
	envMode: string | undefined,
	fingerprint: string,
): void {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(clientFingerprintKey(envMode), fingerprint);
	} catch {
		// storage may be unavailable
	}
}

function syncCookie(overrides: DevConfigOverrides): void {
	const value = encodeURIComponent(JSON.stringify(overrides));
	const oneYear = 365 * 24 * 60 * 60;
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is async and has limited browser support; synchronous write is required here
	document.cookie = `${DEV_CONFIG_COOKIE_NAME}=${value}; path=/; max-age=${oneYear}; SameSite=Strict`;
}
