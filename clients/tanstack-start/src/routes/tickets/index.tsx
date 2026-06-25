import { ValidTicketIcon } from "@entur/icons";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../../components/layout/PageShell";
import TicketCard from "../../components/tickets/TicketCard";
import { useDevConfig } from "../../context/dev-config";
import { isPackageNotFound } from "../../lib/omsa-error";
import { getPackages, removePackage } from "../../lib/ticket-storage";
import {
	getPackageItem,
	getTravelDocuments,
} from "../../server-functions/documents";
import type {
	StoredPackage,
	TravelDocumentProperties,
} from "../../types/documents";

export const Route = createFileRoute("/tickets/")({ component: TicketsPage });

function isDocExpired(
	props: TravelDocumentProperties | undefined,
	now: Date,
): boolean {
	if (!props) return false;
	if (props.type === "binary_ticket" && props.status === "EXPIRED") return true;
	return new Date(props.endvalidity) < now;
}

function TicketsPage() {
	const { clientFingerprint } = useDevConfig();
	const [packages, setPackages] = useState<StoredPackage[]>([]);

	// Gate the localStorage read until the active client's fingerprint is known,
	// so we read from the correct (credential-scoped) key and re-read when the
	// active client changes.
	useEffect(() => {
		if (clientFingerprint === undefined) return;
		setPackages(getPackages());
	}, [clientFingerprint]);

	const itemQueries = useQueries({
		queries: packages.map((pkg) => ({
			queryKey: ["package-item", pkg.packageId],
			queryFn: () => getPackageItem({ data: pkg.packageId }),
			staleTime: 60_000,
			retry: (count: number, error: Error) =>
				!isPackageNotFound(error) && count < 3,
		})),
	});

	const docQueries = useQueries({
		queries: packages.map((pkg) => ({
			queryKey: ["travel-documents", pkg.packageId],
			queryFn: () => getTravelDocuments({ data: pkg.packageId }),
			staleTime: 60_000,
			retry: (count: number, error: Error) =>
				!isPackageNotFound(error) && count < 3,
		})),
	});

	// Auto-prune packages the current OAuth client can no longer see (404
	// PACKAGE_NOT_FOUND), e.g. stale tickets purchased under other credentials.
	const notFoundKey = packages
		.filter((_, i) => isPackageNotFound(itemQueries[i]?.error))
		.map((pkg) => pkg.packageId)
		.join(",");

	useEffect(() => {
		if (!notFoundKey) return;
		for (const id of notFoundKey.split(",")) {
			removePackage(id);
		}
		setPackages(getPackages());
	}, [notFoundKey]);

	const now = new Date();
	const active: StoredPackage[] = [];
	const past: StoredPackage[] = [];

	packages.forEach((pkg, i) => {
		const props = itemQueries[i]?.data?.properties;
		const travelDocs = docQueries[i]?.data?.travelDocuments ?? [];

		const endTime = props?.endTime ? new Date(props.endTime) : null;
		const liveStatus = itemQueries[i]?.data?.status ?? props?.status;
		const packageNotConfirmed =
			liveStatus !== undefined && liveStatus !== "CONFIRMED";
		const packageEndTimePast = endTime !== null && endTime < now;
		const allDocsExpired =
			travelDocs.length > 0 &&
			travelDocs.every((doc) => isDocExpired(doc.properties, now));

		(packageNotConfirmed || packageEndTimePast || allDocsExpired
			? past
			: active
		).push(pkg);
	});

	if (packages.length === 0) {
		return (
			<PageShell title="My tickets" subtitle="Your purchased travel tickets">
				<div className="mt-12 flex flex-col items-center text-center">
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wayfare-accent-soft">
						<ValidTicketIcon
							size="32"
							aria-hidden="true"
							className="text-wayfare-primary"
						/>
					</div>
					<p className="text-sm font-medium text-wayfare-text">
						No tickets yet
					</p>
					<p className="mt-1 text-xs text-wayfare-text-secondary">
						Your purchased tickets will appear here.
					</p>
					<Link
						to="/"
						className="mt-4 inline-flex items-center rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white no-underline"
					>
						Search for tickets
					</Link>
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="My tickets"
			subtitle={`${packages.length} ticket${packages.length !== 1 ? "s" : ""}`}
		>
			<div className="flex flex-col gap-8">
				{active.length > 0 && (
					<section className="flex flex-col gap-3">
						{past.length > 0 && (
							<h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-wayfare-text-secondary">
								Active
							</h2>
						)}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{active.map((pkg) => (
								<TicketCard key={pkg.packageId} pkg={pkg} />
							))}
						</div>
					</section>
				)}
				{past.length > 0 && (
					<section className="flex flex-col gap-3">
						<h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-wayfare-text-secondary">
							Past
						</h2>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							{past.map((pkg) => (
								<TicketCard key={pkg.packageId} pkg={pkg} />
							))}
						</div>
					</section>
				)}
			</div>
		</PageShell>
	);
}
