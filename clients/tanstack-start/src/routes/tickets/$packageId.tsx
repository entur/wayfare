import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../../components/layout/PageShell";
import Illustration from "../../components/shared/Illustration";
import DocumentViewer from "../../components/tickets/DocumentViewer";
import Button from "../../components/ui/Button";
import {
	usePackageItem,
	useRefundOptions,
	useTravelDocuments,
} from "../../hooks/use-documents";
import { useCancelPackage, useClaimRefund } from "../../hooks/use-purchase";
import { getPackage, removePackage } from "../../lib/ticket-storage";
import type {
	StoredPackage,
	TravelDocumentProperties,
} from "../../types/documents";

export const Route = createFileRoute("/tickets/$packageId")({
	component: TicketDetailPage,
});

function isDocExpired(
	props: TravelDocumentProperties | undefined,
	now: Date,
): boolean {
	if (!props) return false;
	if (props.type === "binary_ticket" && props.status === "EXPIRED") return true;
	return new Date(props.endvalidity) < now;
}

function formatFareZone(zone: string): string {
	const suffix = zone.split(":").at(-1);
	return suffix ? `Zone ${suffix}` : zone;
}

function TicketDetailPage() {
	const { packageId } = Route.useParams();
	const navigate = useNavigate();
	const [pkg, setPkg] = useState<StoredPackage | undefined>(undefined);

	useEffect(() => {
		setPkg(getPackage(packageId));
	}, [packageId]);

	const { data: packageItem } = usePackageItem(packageId);
	const { data: docCollection, isLoading: docsLoading } =
		useTravelDocuments(packageId);
	const { data: refundCollection } = useRefundOptions(packageId);
	const cancelMutation = useCancelPackage();
	const claimRefundMutation = useClaimRefund();

	async function handleCancel() {
		if (!confirm("Are you sure you want to cancel this ticket?")) return;
		await cancelMutation.mutateAsync({
			inputs: { type: "package_input", packageId },
		});
		removePackage(packageId);
		navigate({ to: "/tickets" });
	}

	async function handleClaimRefund(optionId: string) {
		await claimRefundMutation.mutateAsync({
			inputs: { type: "claim_refund_option", optionId },
		});
	}

	if (!pkg) {
		return (
			<PageShell title="Ticket not found">
				<div className="mt-8 text-center">
					<Link
						to="/tickets"
						className="text-sm font-medium"
						style={{ color: "var(--color-wayfare-primary)" }}
					>
						← Back to tickets
					</Link>
				</div>
			</PageShell>
		);
	}

	const documents = docCollection?.travelDocuments ?? [];
	const refundOptions = refundCollection?.options ?? [];
	const now = new Date();

	const itemProps = packageItem?.properties;
	const from = itemProps?.from?.name;
	const to = itemProps?.to?.name;

	const firstDoc = documents[0]?.properties;
	const validFrom = itemProps?.startTime
		? new Date(itemProps.startTime)
		: firstDoc?.startvalidity
			? new Date(firstDoc.startvalidity)
			: null;
	const validTo = itemProps?.endTime
		? new Date(itemProps.endTime)
		: firstDoc?.endvalidity
			? new Date(firstDoc.endvalidity)
			: null;

	const allDocsExpired =
		documents.length > 0 &&
		documents.every((doc) => isDocExpired(doc.properties, now));
	const isExpired = (validTo !== null && validTo < now) || allDocsExpired;

	const packageStatus = packageItem?.status ?? itemProps?.status ?? pkg.status;
	const displayStatus =
		isExpired && packageStatus === "CONFIRMED" ? "EXPIRED" : packageStatus;

	const purchased = new Date(pkg.savedAt);

	const geoValidity =
		packageItem?.offers?.[0]?.properties?.summary?.geographicalValidity;
	const fareZones = geoValidity?.zonalValidity?.fareZones ?? [];
	const productName =
		packageItem?.offers?.[0]?.properties?.products?.[0]?.productName;

	const formatDateTime = (d: Date) =>
		d.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	const summaryCardStyle = {
		background: "var(--color-wayfare-surface-strong)",
		border: "1px solid var(--color-wayfare-line)",
		opacity: isExpired ? 0.6 : undefined,
	};

	return (
		<PageShell title="Ticket details">
			<Link
				to="/tickets"
				className="mb-6 inline-block text-sm font-medium no-underline"
				style={{ color: "var(--color-wayfare-text-secondary)" }}
			>
				← My tickets
			</Link>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
				<div className="flex flex-col gap-4">
					{isExpired && (
						<div
							className="flex flex-col items-center rounded-xl p-5 text-center"
							style={{
								background: "var(--color-wayfare-accent-soft)",
								border: "1px solid var(--color-wayfare-line)",
							}}
						>
							<Illustration
								name="crab-ticket-expired"
								size="md"
								decorative
								className="mb-3"
							/>
							<p
								className="text-sm font-semibold"
								style={{ color: "var(--color-wayfare-text)" }}
							>
								This ticket has expired
							</p>
							<p
								className="mt-1 text-xs"
								style={{ color: "var(--color-wayfare-text-secondary)" }}
							>
								It can no longer be used for travel.
							</p>
						</div>
					)}

					<div className="rounded-xl p-4" style={summaryCardStyle}>
						<div className="flex items-start justify-between gap-3">
							<div className="min-w-0 flex-1">
								{from && to ? (
									<p
										className="text-base font-bold"
										style={{ color: "var(--color-wayfare-text)", margin: 0 }}
									>
										{from} → {to}
									</p>
								) : (
									<p
										className="font-mono text-sm font-semibold"
										style={{ color: "var(--color-wayfare-text)", margin: 0 }}
									>
										{pkg.packageId}
									</p>
								)}
								{productName && (
									<p
										className="mt-0.5 text-xs"
										style={{
											color: "var(--color-wayfare-text-secondary)",
											margin: 0,
										}}
									>
										{productName}
									</p>
								)}
							</div>
							<div className="shrink-0 text-right">
								<p
									className="text-base font-bold"
									style={{ color: "var(--color-wayfare-primary)", margin: 0 }}
								>
									{pkg.price.currencyCode ?? "NOK"}{" "}
									{pkg.price.amount.toFixed(2)}
								</p>
								<span
									className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
									style={{
										background:
											displayStatus === "CONFIRMED"
												? "rgba(0,160,80,0.1)"
												: displayStatus === "EXPIRED"
													? "rgba(0,0,0,0.06)"
													: "var(--color-wayfare-accent-soft)",
										color:
											displayStatus === "CONFIRMED"
												? "#006630"
												: displayStatus === "EXPIRED"
													? "var(--color-wayfare-text-secondary)"
													: "var(--color-wayfare-primary)",
									}}
								>
									{displayStatus}
								</span>
							</div>
						</div>

						<div
							className="mt-3 grid gap-y-2 border-t pt-3 text-sm"
							style={{ borderColor: "var(--color-wayfare-line)" }}
						>
							{validFrom && (
								<div className="flex justify-between gap-4">
									<span
										style={{ color: "var(--color-wayfare-text-secondary)" }}
									>
										Valid from
									</span>
									<span style={{ color: "var(--color-wayfare-text)" }}>
										{formatDateTime(validFrom)}
									</span>
								</div>
							)}
							{validTo && (
								<div className="flex justify-between gap-4">
									<span
										style={{ color: "var(--color-wayfare-text-secondary)" }}
									>
										Valid to
									</span>
									<span style={{ color: "var(--color-wayfare-text)" }}>
										{formatDateTime(validTo)}
									</span>
								</div>
							)}
							{fareZones.length > 0 && (
								<div className="flex justify-between gap-4">
									<span
										style={{ color: "var(--color-wayfare-text-secondary)" }}
									>
										Zones
									</span>
									<span style={{ color: "var(--color-wayfare-text)" }}>
										{fareZones.map(formatFareZone).join(", ")}
									</span>
								</div>
							)}
							<div className="flex justify-between gap-4">
								<span style={{ color: "var(--color-wayfare-text-secondary)" }}>
									Purchased
								</span>
								<span style={{ color: "var(--color-wayfare-text)" }}>
									{formatDateTime(purchased)}
								</span>
							</div>
							{(!from || !to) && (
								<div className="flex justify-between gap-4">
									<span
										style={{ color: "var(--color-wayfare-text-secondary)" }}
									>
										Package ID
									</span>
									<span
										className="font-mono text-xs"
										style={{ color: "var(--color-wayfare-text)" }}
									>
										{pkg.packageId}
									</span>
								</div>
							)}
						</div>
					</div>

					{refundOptions.length > 0 && (
						<div
							className="rounded-xl p-4"
							style={{
								background: "var(--color-wayfare-surface-strong)",
								border: "1px solid var(--color-wayfare-line)",
							}}
						>
							<h2
								className="mb-3 text-sm font-semibold"
								style={{ color: "var(--color-wayfare-text)" }}
							>
								Refund options
							</h2>
							<div className="flex flex-col gap-2">
								{refundOptions.map((opt) => (
									<div
										key={
											opt.id ?? opt.properties?.refundType ?? "refund-option"
										}
										className="flex items-center justify-between"
									>
										<p
											className="text-sm"
											style={{ color: "var(--color-wayfare-text)", margin: 0 }}
										>
											{opt.properties?.refundType ?? "Refund"}
											{opt.properties?.consequences?.[0]?.amount && (
												<span
													className="ml-2 font-semibold"
													style={{ color: "var(--color-wayfare-primary)" }}
												>
													{opt.properties.consequences[0].amount.currencyCode ??
														opt.properties.consequences[0].currencyCode ??
														"NOK"}{" "}
													{opt.properties.consequences[0].amount.amount?.toFixed(
														2,
													)}
												</span>
											)}
										</p>
										<button
											type="button"
											onClick={() => opt.id && handleClaimRefund(opt.id)}
											className="rounded-lg px-3 py-1.5 text-xs font-semibold"
											style={{
												background: "var(--color-wayfare-accent-soft)",
												color: "var(--color-wayfare-primary)",
												border: "none",
												cursor: "pointer",
											}}
										>
											Claim
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					<Button
						variant="negative"
						fluid
						disabled={cancelMutation.isPending}
						loading={cancelMutation.isPending}
						onClick={handleCancel}
					>
						Cancel ticket
					</Button>
				</div>

				<div style={{ opacity: isExpired ? 0.6 : undefined }}>
					{docsLoading ? (
						<p
							className="text-sm"
							style={{ color: "var(--color-wayfare-text-secondary)" }}
						>
							Loading…
						</p>
					) : (
						<DocumentViewer documents={documents} />
					)}
				</div>
			</div>
		</PageShell>
	);
}
