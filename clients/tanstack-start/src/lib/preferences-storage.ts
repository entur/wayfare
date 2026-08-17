import { findOperator } from "./operators";
import {
	ALL_MODE_GROUPS,
	isModeGroup,
	type TransportModeGroup,
} from "./trip-filters";

const KEY = "wayfare:preferences";

export interface Preferences {
	/** Preferred operator codespace. */
	preferredOperator?: string;
	/** Transport modes enabled by default for new trip searches. */
	defaultTripModes?: TransportModeGroup[];
}

function read(): Preferences {
	if (typeof window === "undefined") return {};
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const { preferredOperator, defaultTripModes } = parsed as Record<
			string,
			unknown
		>;
		const preferences: Preferences = {};
		if (
			typeof preferredOperator === "string" &&
			findOperator(preferredOperator)
		) {
			preferences.preferredOperator = preferredOperator;
		}
		if (Array.isArray(defaultTripModes)) {
			const modes = defaultTripModes.filter(isModeGroup);
			if (modes.length > 0) preferences.defaultTripModes = modes;
		}
		return preferences;
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

export function getDefaultTripModes(): TransportModeGroup[] | undefined {
	return read().defaultTripModes;
}

export function setDefaultTripModes(modes: TransportModeGroup[] | null): void {
	const existing = read();
	if (modes === null || modes.length === 0) {
		delete existing.defaultTripModes;
		write(existing);
		return;
	}
	write({
		...existing,
		defaultTripModes: ALL_MODE_GROUPS.filter((group) => modes.includes(group)),
	});
}
