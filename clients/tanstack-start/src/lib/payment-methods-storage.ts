import type { GuestPaymentPrefs } from "../types/payment-methods";

const STORAGE_KEY = "wayfare_payment_prefs";

const isClient = typeof window !== "undefined";

export function getGuestPaymentPrefs(): GuestPaymentPrefs {
	if (!isClient) return {};
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		return JSON.parse(raw) as GuestPaymentPrefs;
	} catch {
		return {};
	}
}

export function setGuestPaymentPrefs(prefs: GuestPaymentPrefs): void {
	if (!isClient) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
	} catch {
		// storage may be full or unavailable
	}
}

export function clearGuestPaymentPrefs(): void {
	if (!isClient) return;
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
