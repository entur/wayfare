import QRCode from "qrcode";
import { useEffect, useState } from "react";
import type { TravelDocumentItem } from "../../types/documents";

interface DocumentViewerProps {
	documents: TravelDocumentItem[];
}

function formatValidity(start: string, end: string): string {
	const fmt = (iso: string) =>
		new Date(iso).toLocaleString("en-GB", {
			month: "short",
			day: "numeric",
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
			width: 240,
		}).then(setDataUrl);
	}, [base64]);

	if (!dataUrl) return null;
	return (
		<img
			src={dataUrl}
			alt="QR code"
			className="mx-auto block"
			style={{ width: "100%", maxWidth: 240 }}
		/>
	);
}

interface TicketGroup {
	key: string;
	primary: TravelDocumentItem | null;
	animation: TravelDocumentItem | null;
}

function groupDocuments(documents: TravelDocumentItem[]): TicketGroup[] {
	const map = new Map<string, TicketGroup>();

	for (const doc of documents) {
		const id = doc.id ?? "";
		const isAnimation = id.endsWith("-animation");
		const baseKey = isAnimation ? id.slice(0, -"-animation".length) : id;

		if (!map.has(baseKey)) {
			map.set(baseKey, { key: baseKey, primary: null, animation: null });
		}
		const group = map.get(baseKey);
		if (!group) {
			continue;
		}
		if (isAnimation) {
			group.animation = doc;
		} else {
			group.primary = doc;
		}
	}

	return Array.from(map.values());
}

export default function DocumentViewer({ documents }: DocumentViewerProps) {
	if (documents.length === 0) {
		return (
			<p className="text-sm text-wayfare-text-secondary">
				No travel documents available yet.
			</p>
		);
	}

	const groups = groupDocuments(documents);

	return (
		<div className="flex flex-col gap-4">
			{groups.map((group) => {
				const doc = group.primary ?? group.animation;
				if (!doc) return null;
				const props = doc.properties;
				if (!props) return null;

				if (props.type === "binary_ticket") {
					const animProps =
						group.animation?.properties?.type === "binary_ticket"
							? group.animation.properties
							: null;
					const isImagePrimary = props.contentType.startsWith("image/");

					return (
						<div
							key={group.key}
							className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4"
						>
							<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
								Travel ticket
								{props.status && (
									<span
										className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${props.status !== "ACTIVATED" ? "bg-wayfare-accent-soft text-wayfare-primary" : ""}`}
										style={
											props.status === "ACTIVATED"
												? {
														background: "rgba(0,160,80,0.12)",
														color: "#006630",
													}
												: undefined
										}
									>
										{props.status}
									</span>
								)}
							</p>

							<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
								{/* Primary: QR code (binary) or image */}
								<div className="flex flex-col items-center gap-2 rounded-lg bg-wayfare-surface p-3 sm:flex-1">
									{isImagePrimary ? (
										<img
											src={`data:${props.contentType};base64,${props.base64}`}
											alt="Travel ticket"
											className="mx-auto block rounded-lg"
											style={{ width: "100%", maxWidth: 240 }}
										/>
									) : (
										<BinaryQrCode base64={props.base64} />
									)}
									<p className="text-center text-xs text-wayfare-text-secondary">
										Scan to validate
									</p>
								</div>

								{/* Supporting animation */}
								{animProps && (
									<div className="flex flex-col items-center gap-2 rounded-lg bg-wayfare-surface p-3 sm:flex-1">
										<img
											src={`data:${animProps.contentType};base64,${animProps.base64}`}
											alt="Ticket animation"
											className="mx-auto block"
											style={{ width: "100%", maxWidth: 240 }}
										/>
										<p className="text-center text-xs text-wayfare-text-secondary">
											Show to inspector
										</p>
									</div>
								)}
							</div>

							<p className="mt-3 text-center text-xs text-wayfare-text-secondary">
								{formatValidity(props.startvalidity, props.endvalidity)}
							</p>
						</div>
					);
				}

				return (
					<div
						key={group.key}
						className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4"
					>
						<p className="text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							External ticket
						</p>
						<p className="mt-1 text-sm text-wayfare-text">
							{"startvalidity" in props
								? formatValidity(props.startvalidity, props.endvalidity)
								: null}
						</p>
						{doc.links?.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noreferrer"
								className="mt-2 inline-block text-sm font-medium text-wayfare-primary"
							>
								{link.title ?? link.rel} →
							</a>
						))}
					</div>
				);
			})}
		</div>
	);
}
