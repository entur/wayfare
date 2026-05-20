import type { StoredPackage, StoredPackageContact } from "../types/documents";
import { getDevConfigOverrides } from "./dev-config-storage";

const isClient = typeof window !== "undefined";

function storageKey(): string {
	const { envMode } = getDevConfigOverrides();
	return envMode ? `wayfare_tickets_${envMode}` : "wayfare_tickets";
}

export function savePackage(pkg: StoredPackage): void {
	if (!isClient) return;
	const existing = getPackages();
	const updated = [
		pkg,
		...existing.filter((p) => p.packageId !== pkg.packageId),
	];
	try {
		localStorage.setItem(storageKey(), JSON.stringify(updated));
	} catch {
		// storage may be full or unavailable
	}
}

export function getPackages(): StoredPackage[] {
	if (!isClient) return [];
	try {
		const raw = localStorage.getItem(storageKey());
		if (!raw) return [];
		return JSON.parse(raw) as StoredPackage[];
	} catch {
		return [];
	}
}

export function getPackage(id: string): StoredPackage | undefined {
	return getPackages().find((p) => p.packageId === id);
}

export function removePackage(id: string): void {
	if (!isClient) return;
	const updated = getPackages().filter((p) => p.packageId !== id);
	try {
		localStorage.setItem(storageKey(), JSON.stringify(updated));
	} catch {
		// ignore
	}
}

export function clearPackages(): void {
	if (!isClient) return;
	try {
		localStorage.removeItem(storageKey());
	} catch {
		// ignore
	}
}

export function setPendingGuestContact(
	packageId: string,
	contact: StoredPackageContact,
): void {
	if (!isClient) return;
	try {
		localStorage.setItem(
			`wayfare_guest_contact_${packageId}`,
			JSON.stringify(contact),
		);
	} catch {
		// ignore
	}
}

export function popPendingGuestContact(
	packageId: string,
): StoredPackageContact | undefined {
	if (!isClient) return undefined;
	try {
		const raw = localStorage.getItem(`wayfare_guest_contact_${packageId}`);
		localStorage.removeItem(`wayfare_guest_contact_${packageId}`);
		if (!raw) return undefined;
		return JSON.parse(raw) as StoredPackageContact;
	} catch {
		return undefined;
	}
}
