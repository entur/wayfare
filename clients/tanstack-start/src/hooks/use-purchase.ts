import { useMutation } from "@tanstack/react-query";
import {
	assignAncillary,
	cancelPackage,
	claimRefund,
	confirmPackage,
	listAncillaries,
	purchaseOffers,
	purchasePackage,
	selectOffers,
} from "../server-functions/purchase";
import type {
	AncillaryCollection,
	AssignAncillaryRequest,
	CancelPackageRequest,
	ClaimRefundRequest,
	ConfirmedPackage,
	ConfirmPackageRequest,
	ListAncillariesRequest,
	PurchaseOffersRequest,
	PurchasePackageRequest,
	SelectOffersRequest,
} from "../types/purchase";

export function useSelectOffers() {
	return useMutation<ConfirmedPackage, Error, SelectOffersRequest>({
		mutationFn: (req) =>
			selectOffers({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function usePurchaseOffers() {
	return useMutation<ConfirmedPackage, Error, PurchaseOffersRequest>({
		mutationFn: (req) =>
			purchaseOffers({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function usePurchasePackage() {
	return useMutation<ConfirmedPackage, Error, PurchasePackageRequest>({
		mutationFn: (req) =>
			purchasePackage({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function useConfirmPackage() {
	return useMutation<ConfirmedPackage, Error, ConfirmPackageRequest>({
		mutationFn: (req) =>
			confirmPackage({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function useListAncillaries() {
	return useMutation<AncillaryCollection, Error, ListAncillariesRequest>({
		mutationFn: (req) =>
			listAncillaries({ data: req }) as Promise<AncillaryCollection>,
	});
}

export function useAssignAncillary() {
	return useMutation<ConfirmedPackage, Error, AssignAncillaryRequest>({
		mutationFn: (req) =>
			assignAncillary({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function useCancelPackage() {
	return useMutation<ConfirmedPackage, Error, CancelPackageRequest>({
		mutationFn: (req) =>
			cancelPackage({ data: req }) as Promise<ConfirmedPackage>,
	});
}

export function useClaimRefund() {
	return useMutation<Record<string, unknown>, Error, ClaimRefundRequest>({
		mutationFn: (req) =>
			claimRefund({ data: req }) as Promise<Record<string, unknown>>,
	});
}
