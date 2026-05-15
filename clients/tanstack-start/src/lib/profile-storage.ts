import type { OmsaCustomer } from "../types/customer";

const STORAGE_KEY = "wayfare_customer";

const isClient = typeof window !== "undefined";

export function getStoredCustomer(): OmsaCustomer | null {
	if (!isClient) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as OmsaCustomer;
	} catch {
		return null;
	}
}

export function storeCustomer(customer: OmsaCustomer): void {
	if (!isClient) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
	} catch {
		// storage may be unavailable
	}
}

export function clearStoredCustomer(): void {
	if (!isClient) return;
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
