import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import ErrorBanner from "../../../components/shared/ErrorBanner";
import TicketFlowShell, {
	ticketContext,
} from "../../../components/tickets/TicketFlowShell";
import Button from "../../../components/ui/Button";
import SegmentedControl from "../../../components/ui/SegmentedControl";
import {
	useChangeOptions,
	usePackageItem,
	useTravelDocuments,
} from "../../../hooks/use-documents";
import { useUpdateTravelDocumentValidity } from "../../../hooks/use-purchase";
import { getTicketActions } from "../../../lib/ticket-actions";

export const Route = createFileRoute("/tickets/$packageId/start-time")({
	component: StartTimePage,
	validateSearch: (search: Record<string, unknown>): { document?: string } =>
		typeof search.document === "string" ? { document: search.document } : {},
});

function formatDateTime(date: Date): string {
	return date.toLocaleString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// datetime-local works in local time with no zone, so build its value by hand
// rather than slicing an ISO string (which would shift by the UTC offset).
function toInputValue(date: Date): string {
	const pad = (value: number) => String(value).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function StartTimePage() {
	const { packageId } = Route.useParams();
	const { document: documentId } = Route.useSearch();
	const navigate = useNavigate();
	const [mode, setMode] = useState<"now" | "time">("now");
	const [pickedTime, setPickedTime] = useState("");
	const [done, setDone] = useState<string | null>(null);

	const { data: packageItem } = usePackageItem(packageId);
	const { data: docCollection, isLoading: docsLoading } =
		useTravelDocuments(packageId);
	const { data: changeCollection, isLoading: optionsLoading } =
		useChangeOptions(packageId);
	const updateValidity = useUpdateTravelDocumentValidity();

	const { movableDocuments } = getTicketActions(
		changeCollection?.options ?? [],
		docCollection?.travelDocuments ?? [],
		new Date(),
	);
	// One movable ticket needs no picking, so skip straight to the time.
	const selected =
		movableDocuments.find((doc) => doc.documentId === documentId) ??
		(movableDocuments.length === 1 ? movableDocuments[0] : undefined);

	async function handleSubmit() {
		if (!selected) return;
		const newStartTime =
			mode === "now" ? "NOW" : new Date(pickedTime).toISOString();
		await updateValidity.mutateAsync({
			inputs: {
				type: "update_travel_document_validity",
				packageId,
				travelDocumentId: selected.documentId,
				newStartTime,
			},
		});
		setDone(
			mode === "now"
				? "The ticket is valid from now."
				: `The ticket is valid from ${formatDateTime(new Date(pickedTime))}.`,
		);
	}

	const shell = (children: ReactNode) => (
		<TicketFlowShell
			packageId={packageId}
			title="Change start time"
			context={ticketContext(packageItem)}
		>
			{children}
		</TicketFlowShell>
	);

	if (done) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-semibold text-wayfare-text">
					Start time changed
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">{done}</p>
				<Link
					to="/tickets/$packageId"
					params={{ packageId }}
					className="mt-4 inline-block text-sm font-medium text-wayfare-primary"
				>
					Back to ticket
				</Link>
			</div>,
		);
	}

	if (docsLoading || optionsLoading) {
		return shell(
			<p className="m-0 text-sm text-wayfare-text-secondary">Loading…</p>,
		);
	}

	if (movableDocuments.length === 0) {
		return shell(
			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					No start time to change
				</p>
				<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
					Every ticket in this order has already started.
				</p>
			</div>,
		);
	}

	if (!selected) {
		return shell(
			<>
				<p className="m-0 text-sm text-wayfare-text-secondary">
					Pick the ticket you want to move. Each one is changed on its own.
				</p>
				{movableDocuments.map((doc) => (
					<Link
						key={doc.documentId}
						to="/tickets/$packageId/start-time"
						params={{ packageId }}
						search={{ document: doc.documentId }}
						className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4 no-underline transition-colors hover:bg-wayfare-bg"
					>
						<span className="block text-sm font-medium text-wayfare-text">
							{doc.label}
						</span>
						<span className="mt-0.5 block text-xs text-wayfare-text-secondary">
							Starts {formatDateTime(doc.start)}
						</span>
					</Link>
				))}
			</>,
		);
	}

	const submitLabel =
		mode === "now"
			? "Start ticket now"
			: pickedTime
				? `Move start to ${formatDateTime(new Date(pickedTime))}`
				: "Move start";

	return shell(
		<>
			<p className="m-0 text-sm text-wayfare-text-secondary">
				The QR code is issued when the ticket starts. Until then you can move
				the start.
			</p>

			<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4">
				<p className="m-0 text-sm font-medium text-wayfare-text">
					{selected.label}
				</p>
				<p className="m-0 mt-0.5 text-xs text-wayfare-text-secondary">
					Starts {formatDateTime(selected.start)}
				</p>
			</div>

			<SegmentedControl
				legend="When the ticket should start"
				value={mode}
				onChange={setMode}
				options={[
					{ value: "now", label: "Start now" },
					{ value: "time", label: "Pick a time" },
				]}
			/>

			{mode === "time" && (
				<input
					type="datetime-local"
					value={pickedTime}
					min={toInputValue(new Date())}
					aria-label="New start time"
					onChange={(event) => setPickedTime(event.target.value)}
					className="w-full rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-3 py-2.5 text-sm text-wayfare-text"
				/>
			)}

			{updateValidity.error && (
				<ErrorBanner message={updateValidity.error.message} />
			)}

			<Button
				fluid
				loading={updateValidity.isPending}
				disabled={mode === "time" && !pickedTime}
				onClick={handleSubmit}
			>
				{submitLabel}
			</Button>
			{movableDocuments.length > 1 && (
				<button
					type="button"
					onClick={() =>
						navigate({
							to: "/tickets/$packageId/start-time",
							params: { packageId },
							search: {},
						})
					}
					className="self-center text-sm font-medium text-wayfare-text-secondary"
				>
					Pick another ticket
				</button>
			)}
		</>,
	);
}
