import type {
	TravelDocumentItem,
	TravelDocumentProperties,
} from "../types/documents";

export interface TicketDocumentGroup {
	key: string;
	primary: TravelDocumentItem | null;
	animation: TravelDocumentItem | null;
}

export function groupTravelDocuments(
	documents: TravelDocumentItem[],
): TicketDocumentGroup[] {
	const groups = new Map<string, TicketDocumentGroup>();
	for (const [index, doc] of documents.entries()) {
		const id = doc.id ?? `document-${index}`;
		const isAnimation = id.endsWith("-animation");
		const key = isAnimation ? id.slice(0, -"-animation".length) : id;
		const group = groups.get(key) ?? { key, primary: null, animation: null };
		if (isAnimation) group.animation = doc;
		else group.primary = doc;
		groups.set(key, group);
	}
	return Array.from(groups.values());
}

export function groupProperties(group: TicketDocumentGroup) {
	return (group.primary ?? group.animation)?.properties;
}

/**
 * Whether the group carries something an inspector can actually be shown.
 * Gate on content, not on type or status: a pending_ticket is ACTIVE and has a
 * validity window but no barcode, and unknown future types would otherwise
 * open an empty control view.
 */
export function isGroupInspectable(group: TicketDocumentGroup): boolean {
	const doc = group.primary ?? group.animation;
	const props = doc?.properties;
	if (!props) return false;
	if (props.type === "binary_ticket") return props.base64.length > 0;
	if (props.type === "externalTicket") return (doc?.links?.length ?? 0) > 0;
	return false;
}

/**
 * A pending ticket gets its barcode when validity starts, not from a job that
 * is about to finish — so before that point say when, and don't imply waiting.
 */
export function hasStarted(
	props: TravelDocumentProperties,
	now: number,
): boolean {
	const start = Date.parse(props.startvalidity);
	return !Number.isFinite(start) || now >= start;
}

export function formatValidity(start: string, end: string): string {
	const fmt = (iso: string) =>
		new Date(iso).toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	return `${fmt(start)} – ${fmt(end)}`;
}
