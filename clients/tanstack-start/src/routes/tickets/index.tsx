import { ValidTicketIcon } from "@entur/icons";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../../components/layout/PageShell";
import TicketCard from "../../components/tickets/TicketCard";
import { useDevConfig } from "../../context/dev-config";
import { useProfile } from "../../context/profile";
import { useCustomerPackages } from "../../hooks/use-documents";
import { isPackageNotFound } from "../../lib/omsa-error";
import { getPackages, removePackage } from "../../lib/ticket-storage";
import {
	getPackageItem,
	getTravelDocuments,
} from "../../server-functions/documents";
import type {
	PackageItem,
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

// Builds the display package from a server package item, enriched with any
// locally stored metadata (journey map / route) for the same packageId.
function fromServerPackage(
	item: PackageItem,
	stored: StoredPackage | undefined,
): StoredPackage {
	return {
		packageId: item.id ?? "",
		savedAt: stored?.savedAt ?? item.properties?.purchaseDate ?? "",
		status: item.status ?? item.properties?.status ?? stored?.status ?? "",
		price: {
			amount: item.price?.amount ?? stored?.price.amount ?? 0,
			currencyCode: item.price?.currencyCode ?? stored?.price.currencyCode,
		},
		...(stored?.offerIds ? { offerIds: stored.offerIds } : {}),
		...(stored?.route ? { route: stored.route } : {}),
		...(stored?.pattern ? { pattern: stored.pattern } : {}),
	};
}

function TicketsPage() {
	const { clientFingerprint } = useDevConfig();
	const { customer } = useProfile();
	const customerId = customer?.id ?? null;
	const customerKey = customerId ?? customer?.customerNumber ?? null;
	const [stored, setStored] = useState<StoredPackage[]>([]);

	// Gate the localStorage read until the active client's fingerprint is known,
	// so we read from the correct (credential- and customer-scoped) key and
	// re-read when the active client or signed-in profile changes. customerKey
	// feeds the storage key inside getPackages(), so it must stay a dependency.
	// biome-ignore lint/correctness/useExhaustiveDependencies: customerKey scopes getPackages() via storage key
	useEffect(() => {
		if (clientFingerprint === undefined) return;
		setStored(getPackages());
	}, [clientFingerprint, customerKey]);

	// Signed in: the server is the source of truth for which packages are the
	// customer's. Anonymous: fall back to the locally stored packageId list.
	const isSignedIn = !!customerId;
	const customerPackagesQuery = useCustomerPackages(customerId);
	const serverPackages = customerPackagesQuery.data?.packages ?? [];

	const storedById = new Map(stored.map((p) => [p.packageId, p]));
	const packages: StoredPackage[] = isSignedIn
		? serverPackages
				.filter((item) => !!item.id)
				.map((item) => fromServerPackage(item, storedById.get(item.id ?? "")))
		: stored;

	// Seed the per-package item cache with the server list so TicketCard and the
	// classification below read it without an extra fetch per package.
	const serverItemById = new Map(serverPackages.map((p) => [p.id, p]));

	const itemQueries = useQueries({
		queries: packages.map((pkg) => ({
			queryKey: ["package-item", pkg.packageId],
			queryFn: () => getPackageItem({ data: pkg.packageId }),
			staleTime: 60_000,
			initialData: serverItemById.get(pkg.packageId),
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

	// Auto-prune locally stored packages the current OAuth client can no longer
	// see (404 PACKAGE_NOT_FOUND), e.g. stale tickets under other credentials.
	// Only the anonymous list lives in localStorage; the server list never 404s.
	const notFoundKey = packages
		.filter((_, i) => isPackageNotFound(itemQueries[i]?.error))
		.map((pkg) => pkg.packageId)
		.join(",");

	useEffect(() => {
		if (!notFoundKey) return;
		for (const id of notFoundKey.split(",")) {
			removePackage(id);
		}
		setStored(getPackages());
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

	if (isSignedIn && customerPackagesQuery.isLoading) {
		return (
			<PageShell title="My tickets" subtitle="Your purchased travel tickets">
				<p className="mt-8 text-sm text-wayfare-text-secondary">Loading…</p>
			</PageShell>
		);
	}

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
