export interface DevConfigOverrides {
	envMode?: string;
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

export function setDevConfigOverrides(overrides: DevConfigOverrides): void {
	if (!isBrowser()) return;
	const cleaned: DevConfigOverrides = {};
	if (overrides.envMode?.trim()) cleaned.envMode = overrides.envMode.trim();
	if (overrides.distributionChannel?.trim())
		cleaned.distributionChannel = overrides.distributionChannel.trim();
	if (overrides.clientName?.trim())
		cleaned.clientName = overrides.clientName.trim();
	if (overrides.pos?.trim()) cleaned.pos = overrides.pos.trim();

	localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
	syncCookie(cleaned);
}

export function clearDevConfigOverrides(): void {
	if (!isBrowser()) return;
	localStorage.removeItem(STORAGE_KEY);
	syncCookie({});
}

function syncCookie(overrides: DevConfigOverrides): void {
	const value = encodeURIComponent(JSON.stringify(overrides));
	const oneYear = 365 * 24 * 60 * 60;
	document.cookie = `${DEV_CONFIG_COOKIE_NAME}=${value}; path=/; max-age=${oneYear}; SameSite=Strict`;
}
