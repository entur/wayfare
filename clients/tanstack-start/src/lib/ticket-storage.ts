import type { StoredPackage, StoredPackageContact } from "../types/documents";
import {
	getClientFingerprint,
	getDevConfigOverrides,
} from "./dev-config-storage";
import { getCustomerStorageSegment } from "./profile-storage";

const isClient = typeof window !== "undefined";

function storageKey(): string {
	const { envMode } = getDevConfigOverrides();
	const base = envMode ? `wayfare_tickets_${envMode}` : "wayfare_tickets";
	const fp = getClientFingerprint(envMode);
	const withFp = fp ? `${base}_${fp}` : base;
	// Anonymous keeps the un-segmented key; a signed-in customer gets its own
	// bucket so each profile only sees its own tickets.
	const customer = getCustomerStorageSegment();
	return customer ? `${withFp}_${customer}` : withFp;
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

function guestContactKey(packageId: string): string {
	const { envMode } = getDevConfigOverrides();
	const base = envMode
		? `wayfare_guest_contact_${envMode}`
		: "wayfare_guest_contact";
	const fp = getClientFingerprint(envMode);
	return fp ? `${base}_${fp}_${packageId}` : `${base}_${packageId}`;
}

export function setPendingGuestContact(
	packageId: string,
	contact: StoredPackageContact,
): void {
	if (!isClient) return;
	try {
		localStorage.setItem(guestContactKey(packageId), JSON.stringify(contact));
	} catch {
		// ignore
	}
}

export function popPendingGuestContact(
	packageId: string,
): StoredPackageContact | undefined {
	if (!isClient) return undefined;
	try {
		const key = guestContactKey(packageId);
		const raw = localStorage.getItem(key);
		localStorage.removeItem(key);
		if (!raw) return undefined;
		return JSON.parse(raw) as StoredPackageContact;
	} catch {
		return undefined;
	}
}
