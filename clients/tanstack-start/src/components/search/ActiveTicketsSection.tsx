import { QRIcon } from "@entur/icons";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDevConfig } from "../../context/dev-config";
import { useProfile } from "../../context/profile";
import { useCustomerPackages } from "../../hooks/use-documents";
import { isPackageNotFound } from "../../lib/omsa-error";
import { getPackages } from "../../lib/ticket-storage";
import {
	formatZoneList,
	getEffectiveZones,
	sortFareZones,
} from "../../lib/zone-utils";
import {
	getPackageItem,
	getTravelDocuments,
} from "../../server-functions/documents";
import type { StoredPackage } from "../../types/documents";
import {
	groupProperties,
	groupTravelDocuments,
} from "../tickets/DocumentViewer";

function remainingValidity(end: number, now: number): string {
	const minutes = Math.ceil((end - now) / 60_000);
	if (minutes < 60)
		return `Valid for ${minutes} more ${minutes === 1 ? "minute" : "minutes"}`;
	const hours = Math.ceil(minutes / 60);
	if (hours < 24)
		return `Valid for ${hours} more ${hours === 1 ? "hour" : "hours"}`;
	const days = Math.ceil(hours / 24);
	return `Valid for ${days} more ${days === 1 ? "day" : "days"}`;
}

export default function ActiveTicketsSection() {
	const { clientFingerprint } = useDevConfig();
	const { customer } = useProfile();
	const customerId = customer?.id ?? null;
	const customerKey = customerId ?? customer?.customerNumber ?? null;
	const [stored, setStored] = useState<StoredPackage[]>([]);
	const customerPackages = useCustomerPackages(customerId);

	// Local tickets belong to the active client and customer storage bucket.
	// biome-ignore lint/correctness/useExhaustiveDependencies: customerKey changes the storage key used by getPackages()
	useEffect(() => {
		if (clientFingerprint !== undefined) setStored(getPackages());
	}, [clientFingerprint, customerKey]);

	const storedById = new Map(stored.map((pkg) => [pkg.packageId, pkg]));
	const serverPackages = customerPackages.data?.packages ?? [];
	const packages: StoredPackage[] = customerId
		? serverPackages
				.filter((item) => item.id)
				.map((item) => {
					const local = storedById.get(item.id ?? "");
					return {
						packageId: item.id ?? "",
						savedAt: local?.savedAt ?? item.properties?.purchaseDate ?? "",
						status: item.status ?? item.properties?.status ?? "",
						price: {
							amount: item.price?.amount ?? local?.price.amount ?? 0,
							currencyCode:
								item.price?.currencyCode ?? local?.price.currencyCode,
						},
						...(local?.route ? { route: local.route } : {}),
					};
				})
		: clientFingerprint === undefined
			? []
			: stored;

	const serverItemById = new Map(serverPackages.map((item) => [item.id, item]));
	const itemQueries = useQueries({
		queries: packages.map((pkg) => ({
			queryKey: ["package-item", pkg.packageId],
			queryFn: () => getPackageItem({ data: pkg.packageId }),
			initialData: serverItemById.get(pkg.packageId),
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

	const now = Date.now();
	const active = packages
		.flatMap((pkg, i) => {
			const item = itemQueries[i];
			const documents = docQueries[i];
			if (!item?.data || !documents?.data) return [];
			const props = item.data.properties;
			if ((item.data.status ?? props?.status ?? pkg.status) !== "CONFIRMED")
				return [];
			const docs = documents.data.travelDocuments ?? [];
			const validDocuments = groupTravelDocuments(docs).flatMap((group) => {
				const validity = groupProperties(group);
				if (
					!validity ||
					(validity.type === "binary_ticket" && validity.status === "EXPIRED")
				)
					return [];
				const start = Date.parse(validity.startvalidity);
				const end = Date.parse(validity.endvalidity);
				return Number.isFinite(start) &&
					Number.isFinite(end) &&
					start <= now &&
					now < end
					? [{ key: group.key, end }]
					: [];
			});
			if (validDocuments.length === 0) return [];
			const offer = item.data.offers?.[0]?.properties;
			const zones = sortFareZones(
				getEffectiveZones(offer?.summary?.geographicalValidity),
			);
			const from = props?.from?.name ?? pkg.route?.from.name;
			const to = props?.to?.name ?? pkg.route?.to.name;
			const title =
				offer?.products?.[0]?.productName ??
				(from && to
					? `${from} → ${to}`
					: zones.length
						? formatZoneList(zones)
						: pkg.packageId);
			const subtitle = zones.length
				? formatZoneList(zones)
				: from && to
					? `${from} → ${to}`
					: null;
			return [
				{
					pkg,
					title,
					subtitle: subtitle === title ? null : subtitle,
					end: Math.max(...validDocuments.map((doc) => doc.end)),
					control: validDocuments[0].key,
				},
			];
		})
		.slice(0, 3);

	if (active.length === 0) return null;

	return (
		<section>
			<h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
				Active tickets
			</h2>
			<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
				{active.map(({ pkg, title, subtitle, end, control }) => (
					<div
						key={pkg.packageId}
						className="relative flex items-center gap-3 rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4 transition-opacity hover:opacity-80"
					>
						<Link
							to="/tickets/$packageId"
							params={{ packageId: pkg.packageId }}
							search={{}}
							aria-label={`View details for ${title}`}
							className="absolute inset-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-wayfare-primary/30"
						/>
						<div className="min-w-0 flex-1">
							<p className="m-0 truncate text-sm font-semibold text-wayfare-text">
								{title}
							</p>
							{subtitle && (
								<p className="m-0 mt-0.5 truncate text-xs text-wayfare-text-secondary">
									{subtitle}
								</p>
							)}
							<p className="m-0 mt-1 text-xs font-medium text-wayfare-primary">
								{remainingValidity(end, now)}
							</p>
						</div>
						<Link
							to="/tickets/$packageId"
							params={{ packageId: pkg.packageId }}
							search={{ control }}
							aria-label={`Show ${title} for inspection`}
							className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-wayfare-primary text-white no-underline focus:outline-none focus:ring-2 focus:ring-wayfare-primary/30"
						>
							<QRIcon size="24" aria-hidden="true" />
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
