import {
	cancelTransaction,
	getTransaction,
} from "../server-functions/payments";
import { releasePackage } from "../server-functions/purchase";

// A package OMSA created for checkout that has not been paid for yet, plus the
// payment attempt against it. Kept in sessionStorage so it survives the
// redirect to the payment terminal and back, but stays scoped to the tab that
// started the purchase.
export interface PendingCheckout {
	packageId: string;
	offerId: string;
	amount: string;
	currency: string;
	orderVersion: number;
	expiryTime?: string;
	paymentId?: string;
	transactionId?: string;
}

// What we need to abandon a package: the package itself and any open payment
// transaction against it.
export type AbandonTarget = Pick<
	PendingCheckout,
	"packageId" | "expiryTime" | "paymentId" | "transactionId"
>;

const PENDING_CHECKOUT_KEY = "wayfare:pendingCheckout";

const isClient = typeof window !== "undefined";

export function getPendingCheckout(): PendingCheckout | null {
	if (!isClient) return null;
	try {
		const raw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<PendingCheckout>;
		if (
			!parsed.packageId ||
			!parsed.offerId ||
			!parsed.amount ||
			!parsed.currency ||
			typeof parsed.orderVersion !== "number"
		)
			return null;
		return parsed as PendingCheckout;
	} catch {
		return null;
	}
}

export function setPendingCheckout(pending: PendingCheckout): void {
	if (!isClient) return;
	try {
		sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending));
	} catch {
		// storage may be unavailable; the package still expires server-side
	}
}

export function clearPendingCheckout(): void {
	if (!isClient) return;
	try {
		sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
	} catch {
		// ignore
	}
}

export function isPackageExpired(
	target: Pick<PendingCheckout, "expiryTime">,
	now = Date.now(),
): boolean {
	if (!target.expiryTime) return false;
	const expiry = Date.parse(target.expiryTime);
	return !Number.isNaN(expiry) && now >= expiry;
}

export type OpenTransactionOutcome =
	| "none" // no transaction, or it was already cancelled/rejected
	| "cancelled"
	| "captured" // the customer paid: confirm the package, never release it
	| "unknown"; // could not tell, so leave everything alone

// Makes sure the transaction can no longer take money. Must succeed before a
// package is released or a new transaction is added, otherwise a late Vipps
// approval could charge the customer for a package that no longer exists.
export async function cancelOpenTransaction(
	target: Pick<PendingCheckout, "paymentId" | "transactionId">,
): Promise<OpenTransactionOutcome> {
	const { paymentId, transactionId } = target;
	if (!paymentId || !transactionId) return "none";
	try {
		const tx = await getTransaction({ data: { paymentId, transactionId } });
		if (tx.status === "CAPTURED") return "captured";
		if (tx.status === "CANCELLED" || tx.status === "REJECTED") return "none";
		if (!tx.status) return "unknown";
		await cancelTransaction({ data: { paymentId, transactionId } });
		return "cancelled";
	} catch {
		return "unknown";
	}
}

// Cancels the open transaction and releases the package's holds. Only releases
// once the transaction is known not to be captured.
export async function abandonPackage(target: AbandonTarget): Promise<void> {
	const outcome = await cancelOpenTransaction(target);
	if (outcome === "captured" || outcome === "unknown") return;
	// OMSA already dropped it
	if (isPackageExpired(target)) return;
	try {
		await releasePackage({
			data: { inputs: { type: "package", packageId: target.packageId } },
		});
	} catch {
		// already released or unreachable -- expiryTime covers it
	}
}

// Fire-and-forget: the user has already moved on, so this must never block the
// UI. OMSA drops the package at its expiryTime if anything here fails.
export function abandonPendingCheckout(): void {
	const pending = getPendingCheckout();
	if (!pending) return;
	clearPendingCheckout();
	void abandonPackage(pending);
}
