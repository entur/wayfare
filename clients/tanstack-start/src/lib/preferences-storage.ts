import { findOperator } from "./operators";

const KEY = "wayfare:preferences";

export interface Preferences {
	/** Preferred operator codespace. */
	preferredOperator?: string;
}

function read(): Preferences {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const { preferredOperator } = parsed as Record<string, unknown>;
		if (
			typeof preferredOperator !== "string" ||
			!findOperator(preferredOperator)
		)
			return {};
		return { preferredOperator };
	} catch {
		return {};
	}
}

function write(preferences: Preferences): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY, JSON.stringify(preferences));
	} catch {
		// localStorage may be unavailable.
	}
}

export function getPreferences(): Preferences {
	return read();
}

export function getPreferredOperator(): string | undefined {
	return read().preferredOperator;
}

export function setPreferredOperator(code: string | null): void {
	const existing = read();
	if (code === null || !findOperator(code)) {
		delete existing.preferredOperator;
		write(existing);
		return;
	}
	write({ ...existing, preferredOperator: code });
}
