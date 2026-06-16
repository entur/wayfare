const KEY = "wayfare:recent-stops";
const MAX_ENTRIES = 8;

export interface RecentStop {
	id: string;
	name: string;
	coordinates: [number, number];
}

function read(): RecentStop[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as RecentStop[]) : [];
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
