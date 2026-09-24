import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import type { TravelDocumentItem } from "../../types/documents";

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

function BinaryQrCode({ base64 }: { base64: string }) {
	const [dataUrl, setDataUrl] = useState<string | null>(null);
	useEffect(() => {
		const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
		QRCode.toDataURL([{ data: bytes, mode: "byte" }], {
			errorCorrectionLevel: "M",
			margin: 0,
			width: 280,
		}).then(setDataUrl);
	}, [base64]);
	return dataUrl ? (
		<img
			src={dataUrl}
			alt="QR code"
			className="mx-auto block w-full max-w-70"
		/>
	) : null;
}

interface TicketControlProps {
	group: TicketDocumentGroup;
	title: string;
	onClose: () => void;
}

export function TicketControl({ group, title, onClose }: TicketControlProps) {
	const props = groupProperties(group);
	const doc = group.primary ?? group.animation;
	const dialogRef = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		const dialog = dialogRef.current;
		dialog?.showModal();
		return () => dialog?.close();
	}, []);
	if (!props) return null;
	const animation = group.animation?.properties;
	return (
		<dialog
			ref={dialogRef}
			onCancel={onClose}
			aria-label="Show ticket for inspection"
			className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-2xl overflow-y-auto rounded-2xl border-0 bg-wayfare-surface-strong p-5 text-wayfare-text shadow-xl backdrop:bg-black/60 sm:p-6"
		>
			<div className="w-full">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div>
						<p className="m-0 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							Ticket control
						</p>
						<h2 className="m-0 mt-1 text-lg font-semibold text-wayfare-text">
							{title}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close ticket control"
						className="rounded-lg px-3 py-1 text-2xl text-wayfare-text-secondary hover:bg-wayfare-bg"
					>
						×
					</button>
				</div>
				<p className="mb-4 text-sm text-wayfare-text-secondary">
					Valid {formatValidity(props.startvalidity, props.endvalidity)}
				</p>
				{props.type === "binary_ticket" ? (
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
						<div className="flex w-full flex-1 flex-col items-center gap-2 rounded-xl bg-wayfare-surface p-4">
							{props.contentType.startsWith("image/") ? (
								<img
									src={`data:${props.contentType};base64,${props.base64}`}
									alt="Travel ticket"
									className="mx-auto block w-full max-w-70 rounded-lg"
								/>
							) : (
								<BinaryQrCode base64={props.base64} />
							)}
						</div>
						{animation?.type === "binary_ticket" && (
							<div className="flex w-full flex-1 flex-col items-center gap-2 rounded-xl bg-wayfare-surface p-4">
								<img
									src={`data:${animation.contentType};base64,${animation.base64}`}
									alt="Ticket animation"
									className="mx-auto block w-full max-w-70"
								/>
							</div>
						)}
					</div>
				) : (
					<div className="flex flex-col gap-2">
						{doc?.links?.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="text-sm font-medium text-wayfare-primary"
							>
								{link.title ?? link.rel} →
							</a>
						))}
					</div>
				)}
			</div>
		</dialog>
	);
}
