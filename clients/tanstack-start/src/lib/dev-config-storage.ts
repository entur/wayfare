export type OmsaRuntimeMode = "dev" | "staging" | "local-dev" | "local-staging";

export interface DevConfigOverrides {
	envMode?: OmsaRuntimeMode;
	distributionChannel?: string;
	clientName?: string;
	pos?: string;
}

const STORAGE_KEY = "wayfare_dev_config";
export const DEV_CONFIG_COOKIE_NAME = "wayfare_dev_config";

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function getDevConfigOverrides(): DevConfigOverrides {
	if (!isBrowser()) return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return JSON.parse(raw) as DevConfigOverrides;
	} catch {
		return {};
	}
}

export function setDevConfigOverrides(
	overrides: DevConfigOverrides,
): DevConfigOverrides {
	const cleaned: DevConfigOverrides = {};
	if (overrides.envMode) cleaned.envMode = overrides.envMode;
	if (overrides.distributionChannel?.trim())
		cleaned.distributionChannel = overrides.distributionChannel.trim();
	if (overrides.clientName?.trim())
		cleaned.clientName = overrides.clientName.trim();
	if (overrides.pos?.trim()) cleaned.pos = overrides.pos.trim();

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

function syncCookie(overrides: DevConfigOverrides): void {
	const value = encodeURIComponent(JSON.stringify(overrides));
	const oneYear = 365 * 24 * 60 * 60;
	// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is async and has limited browser support; synchronous write is required here
	document.cookie = `${DEV_CONFIG_COOKIE_NAME}=${value}; path=/; max-age=${oneYear}; SameSite=Strict`;
}
