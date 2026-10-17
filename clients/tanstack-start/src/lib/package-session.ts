import type { SelectedAssetInfo } from "../types/assets";
import type { ConfirmedPackage } from "../types/purchase";

const PACKAGE_SESSION_KEY = "selectedPackage";

export interface PackageSession {
	package: ConfirmedPackage | null;
	offerIds: string[];
	selectedAssetsByLegId?: Record<string, SelectedAssetInfo>;
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function readPackageSession(): PackageSession {
	if (!isBrowser()) return { package: null, offerIds: [] };
	try {
		const raw = window.sessionStorage.getItem(PACKAGE_SESSION_KEY);
		if (!raw) return { package: null, offerIds: [] };
		return JSON.parse(raw) as PackageSession;
	} catch {
		return { package: null, offerIds: [] };
	}
}

export function writePackageSession(session: PackageSession): void {
	if (!isBrowser()) return;
	window.sessionStorage.setItem(PACKAGE_SESSION_KEY, JSON.stringify(session));
}

export function clearPackageSession(): void {
	if (!isBrowser()) return;
	window.sessionStorage.removeItem(PACKAGE_SESSION_KEY);
}
