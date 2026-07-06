export function formatDuration(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	if (h === 0) return `${m} min`;
	if (m === 0) return `${h} h`;
	return `${h} h ${m} min`;
}
