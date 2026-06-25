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

function shortHash(input: string): string {
	let hash = 5381;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 33) ^ input.charCodeAt(i);
	}
	return (hash >>> 0).toString(36);
}

/**
 * Storage-key segment for the signed-in customer, or undefined when anonymous.
 * Used to scope per-customer client-side data (tickets) so a signed-in profile
 * doesn't see anonymous purchases and vice versa. Hashed so the key carries no
 * customer details.
 */
export function getCustomerStorageSegment(): string | undefined {
	const customer = getStoredCustomer();
	const id = customer?.id ?? customer?.customerNumber;
	return id ? `c${shortHash(id)}` : undefined;
}
