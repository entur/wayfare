import { useQuery } from "@tanstack/react-query";
import {
	getChangeOptions,
	getPackageItem,
	getRefundOptions,
	getTravelDocuments,
	listCustomerPackages,
} from "../server-functions/documents";
import type {
	ChangeOptionCollection,
	PackageCollection,
	PackageItem,
	RefundOptionCollection,
	TravelDocumentCollection,
} from "../types/documents";

/**
 * A pending_ticket gets its barcode when validity starts, so wait for that
 * moment instead of polling the whole way there, then check briefly for lag.
 */
export function pendingDocumentPollMs(
	data: TravelDocumentCollection | undefined,
): number | false {
	const starts = (data?.travelDocuments ?? [])
		.filter((doc) => doc.properties?.type === "pending_ticket")
		.map((doc) => Date.parse(doc.properties?.startvalidity ?? ""))
		.filter((start) => Number.isFinite(start));
	if (starts.length === 0) return false;
	const untilStart = Math.min(...starts) - Date.now();
	return untilStart > 0 ? Math.min(untilStart + 2_000, 300_000) : 15_000;
}

export function useCustomerPackages(customerId: string | null) {
	return useQuery<PackageCollection>({
		queryKey: ["customer-packages", customerId],
		queryFn: () => listCustomerPackages({ data: customerId ?? "" }),
		enabled: !!customerId,
		staleTime: 60_000,
	});
}

export function usePackageItem(packageId: string | null) {
	return useQuery<PackageItem>({
		queryKey: ["package-item", packageId],
		queryFn: () => getPackageItem({ data: packageId ?? "" }),
		enabled: !!packageId,
		staleTime: 60_000,
	});
}

export function useTravelDocuments(packageId: string | null) {
	return useQuery<TravelDocumentCollection>({
		queryKey: ["travel-documents", packageId],
		queryFn: () => getTravelDocuments({ data: packageId ?? "" }),
		enabled: !!packageId,
		staleTime: 60_000,
		refetchInterval: (query) => pendingDocumentPollMs(query.state.data),
	});
}

export function useRefundOptions(packageId: string | null) {
	return useQuery<RefundOptionCollection>({
		queryKey: ["refund-options", packageId],
		queryFn: () => getRefundOptions({ data: packageId ?? "" }),
		enabled: !!packageId,
		staleTime: 30_000,
	});
}

export function useChangeOptions(packageId: string | null) {
	return useQuery<ChangeOptionCollection>({
		queryKey: ["change-options", packageId],
		queryFn: () => getChangeOptions({ data: packageId ?? "" }),
		enabled: !!packageId,
		staleTime: 30_000,
	});
}
