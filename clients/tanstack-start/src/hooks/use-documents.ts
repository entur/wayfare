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
