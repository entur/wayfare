import { CardIcon, LeftArrowIcon } from "@entur/icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PurchaseProgress from "../../components/checkout/PurchaseProgress";
import PurchaseSuccess from "../../components/checkout/PurchaseSuccess";
import SavedPaymentPicker from "../../components/checkout/SavedPaymentPicker";
import { JourneyStepper } from "../../components/layout/JourneyStepper";
import { JourneySummary } from "../../components/layout/JourneySummary";
import PageShell from "../../components/layout/PageShell";
import Button from "../../components/ui/Button";
import { useProfile } from "../../context/profile";
import {
	PurchaseFlowProvider,
	usePurchaseFlow,
} from "../../context/purchase-flow";
import {
	useCreatePayment,
	useStartAppClaim,
	useStartTerminalSession,
} from "../../hooks/use-payments";
import {
	useAssignAncillary,
	useListAncillaries,
	usePurchasePackage,
} from "../../hooks/use-purchase";
import { useAuthorizeCard } from "../../hooks/use-recurring-payments";
import { formatPrice } from "../../lib/format-price";
import { getOfferReservationFlow } from "../../lib/offer-reservations";
import {
	clearPackageSession,
	readPackageSession,
	writePackageSession,
} from "../../lib/package-session";
import {
	clearPurchaseOptionsSession,
	type PurchaseOptionsSession,
	readPurchaseOptionsSession,
	writePurchaseOptionsSession,
} from "../../lib/purchase-options-session";
import {
	readSearchSession,
	type SearchContext,
} from "../../lib/search-session";
import { setPendingGuestContact } from "../../lib/ticket-storage";
import { partyLabel } from "../../lib/travel-party";
import type { PaymentSelection } from "../../types/payment-methods";
import type {
	AncillaryCollection,
	AncillaryReference,
	CardPaymentTransaction,
	ConfirmedPackage,
	RecurringPaymentTransaction,
} from "../../types/purchase";
import type { Offer, OfferCollection } from "../../types/search";

export const Route = createFileRoute("/checkout/$offerId")({
	validateSearch: (search: Record<string, unknown>) => ({
		pendingCardId: search.pendingCardId
			? Number(search.pendingCardId)
			: undefined,
	}),
	component: CheckoutPage,
});

function CheckoutPage() {
	return (
		<PurchaseFlowProvider>
			<CheckoutScreen />
		</PurchaseFlowProvider>
	);
}

// Resolves a search-time ancillaryId (e.g. "PiDs4l") to the package/leg-scoped
// AncillaryReference OMSA expects in assign-ancillary requests (e.g. { ancillaryId: "wcoryo" }).
function resolveAncillaryReference(
	collection: AncillaryCollection,
	selectedAncillaryId: string,
): AncillaryReference {
	const matching = collection.ancillaries?.find(
		(item) =>
			item.id === selectedAncillaryId ||
			item.properties?.ancillaryId === selectedAncillaryId,
	);
	return {
		ancillaryId:
			matching?.properties?.ancillaryId ?? matching?.id ?? selectedAncillaryId,
		name: matching?.properties?.name,
	};
}

interface PendingAncillaryAssignment {
	packageId: string;
	legId: string;
	offerId?: string;
	// Search-time ancillaryId — resolved to an AncillaryReference via resolveAncillaryReference
	// before being sent, since OMSA's assign-ancillary endpoint needs the leg-scoped one.
	ancillaryId: string;
}

function buildAncillaryAssignments(
	pkg: ConfirmedPackage,
	options: PurchaseOptionsSession,
): PendingAncillaryAssignment[] {
	if (!pkg.id || options.ancillaries.length === 0) return [];

	// option.offerIds/legIds come from the pre-select-offers catalog (searchOffers).
	// select-offers mints its own offer/leg ids for the package, so those catalog ids
	// never match pkg.offers[].id — matching must rely on pkg-native leg fields only.
	const assignments = new Map<string, PendingAncillaryAssignment>();
	for (const option of options.ancillaries) {
		for (const offer of pkg.offers ?? []) {
			for (const leg of offer.properties?.legs ?? []) {
				const legMatches =
					(leg.ancillaries ?? []).includes(option.ancillaryId) ||
					(leg.reservationRequirement?.fulfilledByAncillaries ?? []).some(
						(ancillary) => ancillary.ancillaryId === option.ancillaryId,
					);
				if (!legMatches) continue;

				const key = `${pkg.id}:${offer.id ?? ""}:${leg.id}:${option.ancillaryId}`;
				assignments.set(key, {
					packageId: pkg.id,
					legId: leg.id,
					...(offer.id ? { offerId: offer.id } : {}),
					ancillaryId: option.ancillaryId,
				});
			}
		}
	}

	return [...assignments.values()];
}

function CheckoutScreen() {
	const { offerId } = Route.useParams();
	const { pendingCardId } = Route.useSearch();
	const offerIds = offerId.split(",");
	const { state, dispatch } = usePurchaseFlow();
	const { customer: profileCustomer } = useProfile();
	const navigate = useNavigate({ from: "/checkout/$offerId" });

	const [paymentMethod, setPaymentMethod] = useState<PaymentSelection | null>(
		null,
	);
	const [authorizedCardId, setAuthorizedCardId] = useState<
		number | undefined
	>();
	const [hydrated, setHydrated] = useState(false);
	const [offerCollection, setOfferCollection] =
		useState<OfferCollection | null>(null);
	const [checkoutContext, setCheckoutContext] = useState<SearchContext | null>(
		null,
	);
	const [purchaseOptions, setPurchaseOptions] =
		useState<PurchaseOptionsSession>({ ancillaries: [] });
	const [selectedPackage, setSelectedPackage] =
		useState<ConfirmedPackage | null>(null);
	const [ancillaryError, setAncillaryError] = useState<string | null>(null);
	const [guestCustomer, setGuestCustomer] = useState<{
		firstName: string;
		lastName: string;
		email: string;
	}>({ firstName: "", lastName: "", email: "" });

	const listAncillariesMutation = useListAncillaries();
	const assignAncillaryMutation = useAssignAncillary();
	const purchasePackageMutation = usePurchasePackage();
	const createPaymentMutation = useCreatePayment();
	const startTerminalMutation = useStartTerminalSession();
	const startAppClaimMutation = useStartAppClaim();
	const authorizeCard = useAuthorizeCard(profileCustomer?.id ?? "");

	// Handle return from add-card terminal
	useEffect(() => {
		if (!pendingCardId || !profileCustomer?.id) return;
		authorizeCard
			.mutateAsync(pendingCardId)
			.then((authorized) => {
				setAuthorizedCardId(authorized.recurringPaymentId);
				setPaymentMethod({
					kind: "recurring",
					recurringPaymentId: authorized.recurringPaymentId,
					paymentType: authorized.paymentType,
				});
				navigate({ search: { pendingCardId: undefined } });
			})
			.catch(() => {
				navigate({ search: { pendingCardId: undefined } });
			});
	}, [pendingCardId, profileCustomer?.id, authorizeCard.mutateAsync, navigate]);

	useEffect(() => {
		const session = readSearchSession();
		const packageSession = readPackageSession();
		setOfferCollection(session.collection);
		setCheckoutContext(session.context);
		setSelectedPackage(packageSession.package);
		setPurchaseOptions(readPurchaseOptionsSession());
		setHydrated(true);
	}, []);

	const guestCustomerComplete = true;

	const paymentMethodComplete =
		paymentMethod !== null &&
		(paymentMethod.kind !== "vipps" || paymentMethod.phone.trim().length > 0);

	// Package legs after select-offers are stripped of reservationRequirement.
	// Use the search-session collection offers for reservation flow detection.
	const searchOffers: Offer[] =
		offerCollection?.offers?.filter((o) => o.id && offerIds.includes(o.id)) ??
		[];
	const selectedOffers: Offer[] = selectedPackage?.offers ?? searchOffers;
	const assignedAncillaryIds = new Set(
		purchaseOptions.ancillaries.map((ancillary) => ancillary.ancillaryId),
	);
	const reservationFlow = getOfferReservationFlow(
		searchOffers,
		assignedAncillaryIds,
	);

	const previewTotal =
		selectedPackage?.price?.amount ??
		selectedOffers.reduce(
			(sum, o) => sum + (o.properties?.price?.amount ?? 0),
			0,
		);
	const currency =
		selectedPackage?.price?.currencyCode ??
		selectedOffers[0]?.properties?.price?.currencyCode ??
		"NOK";

	const allParties = [
		...(checkoutContext?.profiles ?? []),
		...(checkoutContext?.travellers ?? []),
	];
	const checkoutPartyStr =
		allParties.length > 0
			? allParties.map((p) => partyLabel(p)).join(", ")
			: undefined;

	// OMSA folds an assigned ancillary's price into the offer it's attached to, so the
	// offer price alone can't be shown as the "ticket" line without double-counting the
	// add-on total shown separately below. Re-derive per-offer ancillary charges from the
	// same offer/leg matching assign-ancillary uses, and subtract them back out.
	const ancillaryAssignments = selectedPackage
		? buildAncillaryAssignments(selectedPackage, purchaseOptions)
		: [];
	const ancillaryChargeByOfferId = new Map<string, number>();
	const ancillaryQuantityById = new Map<string, number>();
	for (const ancillary of purchaseOptions.ancillaries) {
		const matches = ancillaryAssignments.filter(
			(assignment) => assignment.ancillaryId === ancillary.ancillaryId,
		);
		const quantity = matches.length || 1;
		ancillaryQuantityById.set(ancillary.ancillaryId, quantity);
		const unitAmount = ancillary.price?.amount ?? 0;
		for (const match of matches) {
			if (!match.offerId) continue;
			ancillaryChargeByOfferId.set(
				match.offerId,
				(ancillaryChargeByOfferId.get(match.offerId) ?? 0) + unitAmount,
			);
		}
	}

	const addOnRows = purchaseOptions.ancillaries.map((ancillary) => {
		const quantity = ancillaryQuantityById.get(ancillary.ancillaryId) ?? 1;
		return {
			name: ancillary.name,
			quantity,
			price: {
				amount: (ancillary.price?.amount ?? 0) * quantity,
				currencyCode: ancillary.price?.currencyCode,
			},
		};
	});

	const ticketRows = selectedOffers.map((offer) => {
		const product = offer.properties?.products?.[0];
		const price = offer.properties?.price;
		const legs = offer.properties?.legs ?? [];
		const travellerCount = new Set(legs.map((l) => l.traveller).filter(Boolean))
			.size;
		const ancillaryCharge = offer.id
			? (ancillaryChargeByOfferId.get(offer.id) ?? 0)
			: 0;
		return {
			name:
				offer.properties?.summary?.name ??
				product?.productName ??
				"Travel Offer",
			quantity: travellerCount || 1,
			price: {
				amount: (price?.amount ?? 0) - ancillaryCharge,
				currencyCode: price?.currencyCode,
			},
		};
	});

	async function handleAssignAncillary(ancillaryId: string) {
		const option = reservationFlow.ancillaryOptions.find(
			(candidate) => candidate.ancillaryId === ancillaryId,
		);
		if (!option || !selectedPackage?.id) return;

		setAncillaryError(null);
		try {
			let updatedPackage = selectedPackage;
			const nextOptions: PurchaseOptionsSession = {
				ancillaries: [
					...purchaseOptions.ancillaries.filter(
						(ancillary) => ancillary.ancillaryId !== option.ancillaryId,
					),
					option,
				],
			};

			const assignments = buildAncillaryAssignments(
				updatedPackage,
				nextOptions,
			).filter((assignment) => assignment.ancillaryId === option.ancillaryId);
			if (assignments.length === 0) {
				throw new Error(
					"Could not find a leg on this package to assign the seat reservation to.",
				);
			}
			for (const assignment of assignments) {
				const collection = await listAncillariesMutation.mutateAsync({
					packageId: assignment.packageId,
					legId: assignment.legId,
				});
				const ancillaryReference = resolveAncillaryReference(
					collection,
					assignment.ancillaryId,
				);
				updatedPackage = await assignAncillaryMutation.mutateAsync({
					inputs: {
						type: "ancillary",
						packageId: assignment.packageId,
						legId: assignment.legId,
						...(assignment.offerId ? { offerId: assignment.offerId } : {}),
						ancillaryId: ancillaryReference,
					},
				});
			}

			setSelectedPackage(updatedPackage);
			setPurchaseOptions(nextOptions);
			writePurchaseOptionsSession(nextOptions);
			writePackageSession({ package: updatedPackage, offerIds });
		} catch (error) {
			setAncillaryError(
				error instanceof Error
					? error.message
					: "Could not add seat reservation.",
			);
		}
	}

	async function handlePurchase() {
		if (!paymentMethod || !paymentMethodComplete || !guestCustomerComplete)
			return;
		dispatch({ type: "START_PURCHASE" });
		try {
			const packageId = selectedPackage?.id ?? "";
			if (!selectedPackage || !packageId) {
				throw new Error("No package selected for checkout");
			}
			const purchased = await purchasePackageMutation.mutateAsync({
				inputs: { type: "package", packageId },
			});
			if (purchased.id !== packageId) {
				throw new Error(
					`Purchased package ID ${purchased.id ?? "<missing>"} does not match selected package ${packageId}`,
				);
			}
			const packageSession = readPackageSession();
			writePackageSession({
				...packageSession,
				package: purchased,
			});
			setSelectedPackage(purchased);
			dispatch({ type: "PURCHASE_DONE", packageId });

			// Stash any guest contact details so payment-return can attach them to the saved package
			if (!profileCustomer && packageId) {
				const contact = {
					firstName: guestCustomer.firstName || undefined,
					lastName: guestCustomer.lastName || undefined,
					email: guestCustomer.email || undefined,
				};
				if (contact.firstName || contact.lastName || contact.email) {
					setPendingGuestContact(packageId, contact);
				}
			}

			// Step 2: Build transaction based on payment selection
			const amount = purchased.price?.amount?.toFixed(2) ?? "0.00";
			const purchasedCurrency = purchased.price?.currencyCode ?? "NOK";

			let transaction: CardPaymentTransaction | RecurringPaymentTransaction;
			if (paymentMethod.kind === "recurring") {
				const t: RecurringPaymentTransaction = {
					amount,
					currency: purchasedCurrency,
					recurringPaymentId: paymentMethod.recurringPaymentId,
				};
				transaction = t;
			} else if (paymentMethod.kind === "vipps") {
				const t: CardPaymentTransaction = {
					amount,
					currency: purchasedCurrency,
					paymentType: "VIPPS",
					isImport: false,
					paymentTypeGroup: "MOBILE",
				};
				transaction = t;
			} else {
				const t: CardPaymentTransaction = {
					amount,
					currency: purchasedCurrency,
					paymentType: paymentMethod.paymentType,
					isImport: false,
					paymentTypeGroup: "PAYMENTCARD",
				};
				transaction = t;
			}

			const payment = await createPaymentMutation.mutateAsync({
				orderId: packageId,
				orderVersion: purchased.orderVersion ?? 1,
				totalAmount: amount,
				transaction,
			});
			const paymentId = String(payment.paymentId ?? "");
			const transactionId = String(
				payment.transactionHistory?.[0]?.transactionId ?? "",
			);

			// Step 3: Initiate payment via terminal (card) or app-claim (Vipps)
			if (paymentMethod.kind === "vipps") {
				const returnUrl = `${window.location.origin}/payment-return?packageId=${packageId}&enturPaymentId=${paymentId}&enturTransactionId=${transactionId}&paymentType=VIPPS`;
				const description =
					selectedOffers[0]?.properties?.products?.[0]?.productName ??
					"Entur ticket";
				const appClaim = await startAppClaimMutation.mutateAsync({
					paymentId,
					transactionId,
					description,
					phoneNumber: paymentMethod.phone,
					redirectUrl: returnUrl,
				});
				window.location.href = appClaim.appClaimUrl ?? "";
			} else {
				const returnUrl = `${window.location.origin}/payment-return?packageId=${packageId}&enturPaymentId=${paymentId}&enturTransactionId=${transactionId}`;
				const terminal = await startTerminalMutation.mutateAsync({
					paymentId,
					transactionId,
					redirectUrl: returnUrl,
					terminalLanguage: "en_GB",
				});
				window.location.href = terminal.terminalUri ?? "";
			}
		} catch (err) {
			dispatch({
				type: "FAILED",
				error: err instanceof Error ? err.message : "Purchase failed",
			});
		}
	}

	if (state.flowState === "success" && state.packageId) {
		return (
			<PageShell>
				<PurchaseSuccess packageId={state.packageId} />
			</PageShell>
		);
	}

	const isProcessing = [
		"purchasing",
		"paying",
		"capturing",
		"confirming",
	].includes(state.flowState);
	const assigningAncillary =
		listAncillariesMutation.isPending || assignAncillaryMutation.isPending;

	const selectedAssetsByLegId = selectedPackage
		? (readPackageSession().selectedAssetsByLegId ?? {})
		: {};
	const selectedAssetEntries = Object.entries(selectedAssetsByLegId);
	const seatDetailsSlot =
		selectedAssetEntries.length > 0 ? (
			<div className="flex flex-col gap-1 border-t border-wayfare-line pt-3">
				<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					Seats
				</p>
				{selectedAssetEntries.map(([legId, info]) => (
					<p key={legId} className="text-xs text-wayfare-text-secondary">
						Seat {info.seatNumber ?? info.assetId} · Carriage {info.carriage}
					</p>
				))}
				<p className="text-xs italic text-wayfare-text-secondary">
					Seat held — completes when you confirm your purchase
				</p>
			</div>
		) : null;
	const rightRail = checkoutContext ? (
		<JourneySummary
			variant="rail"
			from={checkoutContext.from.name ?? checkoutContext.from.placeId}
			to={checkoutContext.to.name ?? checkoutContext.to.placeId}
			startTime={
				checkoutContext.pattern?.expectedStartTime ?? checkoutContext.travelDate
			}
			endTime={checkoutContext.pattern?.expectedEndTime}
			durationSeconds={checkoutContext.pattern?.duration}
			partyLabel={checkoutPartyStr}
			ticketRows={ticketRows.length > 0 ? ticketRows : undefined}
			addOnRows={addOnRows.length > 0 ? addOnRows : undefined}
			total={
				previewTotal > 0
					? { amount: previewTotal, currencyCode: currency }
					: undefined
			}
			detailsSlot={seatDetailsSlot}
			onChangeJourney={() => {
				clearPackageSession();
				clearPurchaseOptionsSession();
				navigate({ to: "/offers" });
			}}
		/>
	) : null;

	if (!hydrated) {
		return (
			<PageShell title="Checkout" subtitle="Review your order and pay">
				<p className="text-wayfare-text-secondary">Loading…</p>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="Checkout"
			subtitle="Review your order and pay"
			stepper={<JourneyStepper />}
			rightRail={rightRail}
		>
			<div>
				{isProcessing && (
					<div className="mb-6">
						<PurchaseProgress flowState={state.flowState} />
					</div>
				)}

				<div className="mb-4 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
						Customer
					</p>
					{profileCustomer ? (
						<div className="flex items-center justify-between gap-2">
							<div>
								<p className="m-0 text-sm font-medium text-wayfare-text">
									{[profileCustomer.firstName, profileCustomer.lastName]
										.filter(Boolean)
										.join(" ") || profileCustomer.id}
								</p>
								{profileCustomer.email && (
									<p className="m-0 text-xs text-wayfare-text-secondary">
										{profileCustomer.email}
									</p>
								)}
							</div>
							<Link
								to="/settings"
								search={{ tab: "profile", pendingCardId: undefined }}
								className="text-xs text-wayfare-primary no-underline"
							>
								Change
							</Link>
						</div>
					) : (
						<div className="space-y-3">
							<p className="text-xs text-wayfare-text-secondary">
								No profile selected.{" "}
								<Link
									to="/settings"
									search={{ tab: "profile", pendingCardId: undefined }}
									className="text-wayfare-primary no-underline"
								>
									Sign in
								</Link>{" "}
								or enter your details below.
							</p>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label
										htmlFor="checkout-firstName"
										className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
									>
										First name
									</label>
									<input
										id="checkout-firstName"
										type="text"
										value={guestCustomer.firstName}
										onChange={(e) =>
											setGuestCustomer((g) => ({
												...g,
												firstName: e.target.value,
											}))
										}
										className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
										placeholder="First name"
									/>
								</div>
								<div>
									<label
										htmlFor="checkout-lastName"
										className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
									>
										Last name
									</label>
									<input
										id="checkout-lastName"
										type="text"
										value={guestCustomer.lastName}
										onChange={(e) =>
											setGuestCustomer((g) => ({
												...g,
												lastName: e.target.value,
											}))
										}
										className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
										placeholder="Last name"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="checkout-email"
									className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
								>
									Email
								</label>
								<input
									id="checkout-email"
									type="email"
									value={guestCustomer.email}
									onChange={(e) =>
										setGuestCustomer((g) => ({
											...g,
											email: e.target.value,
										}))
									}
									className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
									placeholder="email@example.com"
								/>
							</div>
						</div>
					)}
				</div>

				{(reservationFlow.ancillaryOptions.length > 0 ||
					reservationFlow.canOpenSeatmap) && (
					<div className="mb-4 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4">
						<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							Seats
						</p>
						{reservationFlow.ancillaryOptions.length > 0 && (
							<div className="mb-3 flex flex-col gap-2">
								{reservationFlow.ancillaryOptions.map((option) => {
									const assigned = assignedAncillaryIds.has(option.ancillaryId);
									return (
										<div
											key={option.ancillaryId}
											className="flex items-center justify-between gap-3 rounded-lg border border-wayfare-line bg-wayfare-bg px-3 py-2"
										>
											<div className="min-w-0">
												<p className="m-0 text-sm font-medium text-wayfare-text">
													{option.name}
												</p>
												{option.price && (
													<p className="m-0 text-xs text-wayfare-text-secondary">
														{formatPrice(
															option.price.amount,
															option.price.currencyCode ?? "NOK",
														)}
													</p>
												)}
											</div>
											<Button
												variant="secondary"
												disabled={assigned || assigningAncillary}
												loading={assigningAncillary && !assigned}
												onClick={() =>
													handleAssignAncillary(option.ancillaryId)
												}
											>
												{assigned ? "Added" : "Add"}
											</Button>
										</div>
									);
								})}
							</div>
						)}
						{ancillaryError && (
							<p className="mb-3 rounded-lg bg-wayfare-accent-soft px-3 py-2 text-sm text-wayfare-primary">
								{ancillaryError}
							</p>
						)}
						<Button
							variant="secondary"
							disabled={!reservationFlow.canOpenSeatmap || assigningAncillary}
							onClick={() =>
								navigate({
									to: "/seats/$offerId",
									params: { offerId },
								})
							}
						>
							Choose seats
						</Button>
					</div>
				)}

				<div className="mb-6 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4">
					<SavedPaymentPicker
						onSelect={setPaymentMethod}
						offerId={offerId}
						autoSelectRecurringPaymentId={authorizedCardId}
					/>
				</div>

				{state.error && (
					<p className="mb-4 rounded-lg bg-wayfare-accent-soft px-3 py-2 text-sm text-wayfare-primary">
						{state.error}
					</p>
				)}

				<div className="flex gap-3">
					<Link
						to="/offers"
						className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-wayfare-line px-5 py-2.5 text-sm font-semibold text-wayfare-text no-underline transition-colors"
					>
						<LeftArrowIcon aria-hidden="true" />
						Back
					</Link>
					<Button
						variant="primary"
						className="flex-1"
						disabled={
							!selectedPackage?.id ||
							!paymentMethodComplete ||
							!guestCustomerComplete ||
							isProcessing
						}
						loading={isProcessing}
						onClick={handlePurchase}
					>
						Confirm & pay
						<CardIcon aria-hidden="true" />
					</Button>
				</div>
			</div>
		</PageShell>
	);
}
