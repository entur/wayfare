import type { EstimatedCall, QuayDepartures } from "../types/departures";

interface TimedPair {
	aimedDepartureTime: string;
	expectedDepartureTime: string;
}

export function delayMinutes(call: TimedPair): number {
	const aimed = Date.parse(call.aimedDepartureTime);
	const expected = Date.parse(call.expectedDepartureTime);
	if (Number.isNaN(aimed) || Number.isNaN(expected)) return 0;
	const diffMs = expected - aimed;
	return Math.round(diffMs / 60000);
}

export function formatRelativeMinutes(
	iso: string,
	now: Date = new Date(),
): string {
	const target = Date.parse(iso);
	if (Number.isNaN(target)) return "";
	const diffMs = target - now.getTime();
	if (diffMs < -30_000) return "departed";
	if (diffMs < 60_000) return "now";
	const mins = Math.round(diffMs / 60000);
	return `in ${mins} min`;
}

export function groupByQuay(calls: EstimatedCall[]): QuayDepartures[] {
	const groups = new Map<string, QuayDepartures>();
	for (const c of calls) {
		const id = c.quay?.id ?? "unknown";
		const existing = groups.get(id);
		if (existing) {
			existing.calls.push(c);
		} else {
			groups.set(id, {
				quay: c.quay ?? { id: "unknown", publicCode: null, name: null },
				calls: [c],
			});
		}
	}
	return [...groups.values()].sort((a, b) => {
		const ea = Date.parse(a.calls[0].expectedDepartureTime);
		const eb = Date.parse(b.calls[0].expectedDepartureTime);
		return ea - eb;
	});
}
