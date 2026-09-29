import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	assignAncillary,
	cancelPackage,
	claimRefund,
	confirmPackage,
	confirmRefund,
	listAncillaries,
	purchaseOffers,
	purchasePackage,
	selectOffers,
	updateTravelDocumentValidity,
} from "../server-functions/purchase";
import type {
	AncillaryCollection,
	AssignAncillaryRequest,
	CancelPackageRequest,
	ConfirmedPackage,
	ConfirmPackageRequest,
	ListAncillariesRequest,
	PurchaseOffersRequest,
	PurchasePackageRequest,
	SelectOffersRequest,
	UpdatedValidity,
	UpdateValidityRequest,
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

export function useRefundOption() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, string>({
		// Claiming is what refunds; confirming is a courtesy OMSA asks for so it
		// can add validation there later. A failed confirm must not read as a
		// failed refund, so it is deliberately not awaited into the error path.
		mutationFn: async (optionId) => {
			await claimRefund({
				data: { inputs: { type: "claim_refund_option", optionId } },
			});
			try {
				await confirmRefund({
					data: { inputs: { type: "confirm_refund_option", optionId } },
				});
			} catch (error) {
				console.warn("confirm-refund-option failed after a claim", error);
			}
		},
		// A claimed option is gone from the list and the package total changes.
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["refund-options"] });
			queryClient.invalidateQueries({ queryKey: ["change-options"] });
			queryClient.invalidateQueries({ queryKey: ["travel-documents"] });
			queryClient.invalidateQueries({ queryKey: ["package-item"] });
		},
	});
}

export function useUpdateTravelDocumentValidity() {
	const queryClient = useQueryClient();
	return useMutation<UpdatedValidity, Error, UpdateValidityRequest>({
		mutationFn: (req) =>
			updateTravelDocumentValidity({ data: req }) as Promise<UpdatedValidity>,
		// The old document is replaced by one with a new id, and moving the start
		// changes what can still be changed or refunded.
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["travel-documents"] });
			queryClient.invalidateQueries({ queryKey: ["change-options"] });
			queryClient.invalidateQueries({ queryKey: ["refund-options"] });
			queryClient.invalidateQueries({ queryKey: ["package-item"] });
		},
	});
}
