const KEY = "wayfare:recent-stops";
const MAX_ENTRIES = 8;

export interface RecentStop {
	id: string;
	name: string;
	coordinates: [number, number];
}

function isRecentStop(value: unknown): value is RecentStop {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.id === "string" &&
		typeof v.name === "string" &&
		Array.isArray(v.coordinates) &&
		v.coordinates.length === 2 &&
		typeof v.coordinates[0] === "number" &&
		typeof v.coordinates[1] === "number"
	);
}

function read(): RecentStop[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isRecentStop);
	} catch {
		return [];
	}
}

function write(list: RecentStop[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(KEY, JSON.stringify(list));
	} catch {
		// quota or disabled — ignore
	}
}

export function getRecentStops(): RecentStop[] {
	return read();
}

export function addRecentStop(stop: RecentStop): void {
	const existing = read().filter((s) => s.id !== stop.id);
	const next = [stop, ...existing].slice(0, MAX_ENTRIES);
	write(next);
}
