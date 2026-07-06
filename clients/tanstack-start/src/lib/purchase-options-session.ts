import type { ReservationAncillaryOption } from "./offer-reservations";

const PURCHASE_OPTIONS_SESSION_KEY = "purchaseOptions";

export interface PurchaseOptionsSession {
	ancillaries: ReservationAncillaryOption[];
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export function readPurchaseOptionsSession(): PurchaseOptionsSession {
	if (!isBrowser()) return { ancillaries: [] };
	try {
		const raw = window.sessionStorage.getItem(PURCHASE_OPTIONS_SESSION_KEY);
		if (!raw) return { ancillaries: [] };
		return JSON.parse(raw) as PurchaseOptionsSession;
	} catch {
		return { ancillaries: [] };
	}
}

export function writePurchaseOptionsSession(
	session: PurchaseOptionsSession,
): void {
	if (!isBrowser()) return;
	window.sessionStorage.setItem(
		PURCHASE_OPTIONS_SESSION_KEY,
		JSON.stringify(session),
	);
}

export function clearPurchaseOptionsSession(): void {
	if (!isBrowser()) return;
	window.sessionStorage.removeItem(PURCHASE_OPTIONS_SESSION_KEY);
}
