// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { releasePackageMock, getTransactionMock, cancelTransactionMock } =
	vi.hoisted(() => ({
		releasePackageMock: vi.fn(),
		getTransactionMock: vi.fn(),
		cancelTransactionMock: vi.fn(),
	}));

vi.mock("../server-functions/purchase", () => ({
	releasePackage: releasePackageMock,
}));

vi.mock("../server-functions/payments", () => ({
	getTransaction: getTransactionMock,
	cancelTransaction: cancelTransactionMock,
}));

import {
	abandonPackage,
	abandonPendingCheckout,
	cancelOpenTransaction,
	clearPendingCheckout,
	getPendingCheckout,
	isPackageExpired,
	type PendingCheckout,
	setPendingCheckout,
} from "./pending-checkout";

const PENDING: PendingCheckout = {
	packageId: "pkg-1",
	offerId: "offer-1",
	amount: "354.00",
	currency: "NOK",
	orderVersion: 1,
};

const WITH_PAYMENT: PendingCheckout = {
	...PENDING,
	paymentId: "10",
	transactionId: "20",
};

const RELEASE_BODY = {
	data: { inputs: { type: "package", packageId: "pkg-1" } },
};

beforeEach(() => {
	window.sessionStorage.clear();
	releasePackageMock.mockResolvedValue({});
	cancelTransactionMock.mockResolvedValue({});
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("pending checkout storage", () => {
	it("returns null when nothing is stored", () => {
		expect(getPendingCheckout()).toBeNull();
	});

	it("stores and clears the pending checkout", () => {
		setPendingCheckout(WITH_PAYMENT);
		expect(getPendingCheckout()).toEqual(WITH_PAYMENT);
		clearPendingCheckout();
		expect(getPendingCheckout()).toBeNull();
	});

	it("ignores corrupt or incomplete storage", () => {
		window.sessionStorage.setItem("wayfare:pendingCheckout", "{not json");
		expect(getPendingCheckout()).toBeNull();
		window.sessionStorage.setItem(
			"wayfare:pendingCheckout",
			JSON.stringify({ packageId: "pkg-1", offerId: "offer-1" }),
		);
		expect(getPendingCheckout()).toBeNull();
	});
});

describe("isPackageExpired", () => {
	const now = Date.parse("2026-09-27T12:00:00Z");

	it("treats a package without expiryTime as live", () => {
		expect(isPackageExpired({}, now)).toBe(false);
	});

	it("compares expiryTime with now", () => {
		expect(isPackageExpired({ expiryTime: "2026-09-27T12:10:00Z" }, now)).toBe(
			false,
		);
		expect(isPackageExpired({ expiryTime: "2026-09-27T11:50:00Z" }, now)).toBe(
			true,
		);
	});
});

describe("cancelOpenTransaction", () => {
	it("does nothing without a transaction", async () => {
		expect(await cancelOpenTransaction(PENDING)).toBe("none");
		expect(getTransactionMock).not.toHaveBeenCalled();
	});

	it("cancels an open transaction", async () => {
		getTransactionMock.mockResolvedValue({ status: "INITIATED" });
		expect(await cancelOpenTransaction(WITH_PAYMENT)).toBe("cancelled");
		expect(cancelTransactionMock).toHaveBeenCalledWith({
			data: { paymentId: "10", transactionId: "20" },
		});
	});

	it("skips transactions that already failed", async () => {
		getTransactionMock.mockResolvedValue({ status: "REJECTED" });
		expect(await cancelOpenTransaction(WITH_PAYMENT)).toBe("none");
		expect(cancelTransactionMock).not.toHaveBeenCalled();
	});

	it("reports a captured transaction without cancelling it", async () => {
		getTransactionMock.mockResolvedValue({ status: "CAPTURED" });
		expect(await cancelOpenTransaction(WITH_PAYMENT)).toBe("captured");
		expect(cancelTransactionMock).not.toHaveBeenCalled();
	});

	it("reports unknown when the cancel fails", async () => {
		getTransactionMock.mockResolvedValue({ status: "INITIATED" });
		cancelTransactionMock.mockRejectedValue(new Error("409"));
		expect(await cancelOpenTransaction(WITH_PAYMENT)).toBe("unknown");
	});
});

describe("abandonPackage", () => {
	it("cancels the transaction, then releases the package", async () => {
		getTransactionMock.mockResolvedValue({ status: "INITIATED" });
		await abandonPackage(WITH_PAYMENT);
		expect(cancelTransactionMock).toHaveBeenCalled();
		expect(releasePackageMock).toHaveBeenCalledWith(RELEASE_BODY);
	});

	it("releases a package that never got a payment", async () => {
		await abandonPackage(PENDING);
		expect(releasePackageMock).toHaveBeenCalledWith(RELEASE_BODY);
	});

	it("never releases a paid package", async () => {
		getTransactionMock.mockResolvedValue({ status: "CAPTURED" });
		await abandonPackage(WITH_PAYMENT);
		expect(releasePackageMock).not.toHaveBeenCalled();
	});

	it("leaves the package alone when the transaction state is unknown", async () => {
		getTransactionMock.mockRejectedValue(new Error("timeout"));
		await abandonPackage(WITH_PAYMENT);
		expect(releasePackageMock).not.toHaveBeenCalled();
	});

	it("skips the release call for an expired package", async () => {
		await abandonPackage({ ...PENDING, expiryTime: "2000-01-01T00:00:00Z" });
		expect(releasePackageMock).not.toHaveBeenCalled();
	});

	it("swallows release failures", async () => {
		releasePackageMock.mockRejectedValue(new Error("OMSA 409"));
		await expect(abandonPackage(PENDING)).resolves.toBeUndefined();
	});
});

describe("abandonPendingCheckout", () => {
	it("clears storage right away and abandons in the background", async () => {
		setPendingCheckout(PENDING);
		abandonPendingCheckout();
		expect(getPendingCheckout()).toBeNull();
		await vi.waitFor(() =>
			expect(releasePackageMock).toHaveBeenCalledWith(RELEASE_BODY),
		);
	});

	it("does nothing when there is no pending checkout", () => {
		abandonPendingCheckout();
		expect(releasePackageMock).not.toHaveBeenCalled();
	});
});
