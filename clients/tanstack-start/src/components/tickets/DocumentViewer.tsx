import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import {
	formatValidity,
	groupProperties,
	hasStarted,
	isGroupInspectable,
	type TicketDocumentGroup,
} from "../../lib/travel-documents";

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
	const started = hasStarted(props, Date.now());
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
				{!isGroupInspectable(group) ? (
					<div className="flex flex-col items-center gap-2 rounded-xl bg-wayfare-surface px-4 py-8 text-center">
						<p className="m-0 text-sm font-medium text-wayfare-text">
							{started ? "This ticket can't be shown" : "Not active yet"}
						</p>
						<p className="m-0 max-w-sm text-sm text-wayfare-text-secondary">
							{started
								? "The ticket is valid, but no QR code was issued for it. Contact support if an inspector asks to see it."
								: "The QR code is issued when the ticket becomes valid."}
						</p>
					</div>
				) : props.type === "binary_ticket" ? (
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
