import type { ChangeOptionItem, TravelDocumentItem } from "../types/documents";
import {
	groupProperties,
	groupTravelDocuments,
	hasStarted,
} from "./travel-documents";

/** A travel document whose validity has not started and can still be moved. */
export interface MovableDocument {
	documentId: string;
	label: string;
	start: Date;
}

export interface TicketActions {
	movableDocuments: MovableDocument[];
	canCancel: boolean;
}

/**
 * Change options name the change type but not the document it applies to, so
 * UPDATE_VALIDITY only means something paired with the documents that have not
 * started yet. The menu and the flow screens both read availability from here
 * so they can't disagree about what is on offer.
 */
export function getTicketActions(
	changeOptions: ChangeOptionItem[],
	documents: TravelDocumentItem[],
	now: Date,
): TicketActions {
	const hasChange = (changeType: string) =>
		changeOptions.some(
			(option) => option.properties?.changeType === changeType,
		);

	if (!hasChange("UPDATE_VALIDITY")) {
		return { movableDocuments: [], canCancel: hasChange("CANCEL_PACKAGE") };
	}

	const groups = groupTravelDocuments(documents);
	const movableDocuments = groups.flatMap((group, index) => {
		const props = groupProperties(group);
		const documentId = group.primary?.id ?? group.animation?.id;
		if (!props || !documentId || hasStarted(props, now.getTime())) return [];
		const start = new Date(props.startvalidity);
		if (Number.isNaN(start.getTime())) return [];
		// Travel documents carry no traveller or offer reference, so they can only
		// be numbered by position. Don't label them as travellers.
		const name = props.travelDocumentType ?? "Travel ticket";
		return [
			{
				documentId,
				label: groups.length > 1 ? `${name} ${index + 1}` : name,
				start,
			},
		];
	});

	return { movableDocuments, canCancel: hasChange("CANCEL_PACKAGE") };
}
