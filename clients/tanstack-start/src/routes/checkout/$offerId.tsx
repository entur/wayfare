import { CardIcon, LeftArrowIcon } from "@entur/icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PurchaseProgress from "../../components/checkout/PurchaseProgress";
import PurchaseSuccess from "../../components/checkout/PurchaseSuccess";
import SavedPaymentPicker from "../../components/checkout/SavedPaymentPicker";
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
import { usePurchaseOffers } from "../../hooks/use-purchase";
import { useAuthorizeCard } from "../../hooks/use-recurring-payments";
import { formatPrice } from "../../lib/format-price";
import { readSearchSession } from "../../lib/search-session";
import { setPendingGuestContact } from "../../lib/ticket-storage";
import type { OmsaCustomer } from "../../types/customer";
import type { PaymentSelection } from "../../types/payment-methods";
import type {
	CardPaymentTransaction,
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
	const [guestCustomer, setGuestCustomer] = useState<{
		firstName: string;
		lastName: string;
		email: string;
	}>({ firstName: "", lastName: "", email: "" });

	const purchaseMutation = usePurchaseOffers();
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
		setOfferCollection(session.collection);
		setHydrated(true);
	}, []);

	// OMSA requires customer.id to be non-null, so only attach a customer when signed in
	const activeCustomer: OmsaCustomer | undefined = profileCustomer?.id
		? profileCustomer
		: undefined;

	const guestCustomerComplete = true;

	const paymentMethodComplete =
		paymentMethod !== null &&
		(paymentMethod.kind !== "vipps" || paymentMethod.phone.trim().length > 0);

	const selectedOffers: Offer[] =
		offerCollection?.offers?.filter((o) => o.id && offerIds.includes(o.id)) ??
		[];

	const previewTotal = selectedOffers.reduce(
		(sum, o) => sum + (o.properties?.price?.amount ?? 0),
		0,
	);
	const currency = selectedOffers[0]?.properties?.price?.currencyCode ?? "NOK";

	async function handlePurchase() {
		if (!paymentMethod || !paymentMethodComplete || !guestCustomerComplete)
			return;
		dispatch({ type: "START_PURCHASE" });
		try {
			// Step 1: OMSA purchase-offers
			const purchased = await purchaseMutation.mutateAsync({
				inputs: {
					type: "purchase_offers",
					offerIds,
					...(activeCustomer ? { customer: activeCustomer } : {}),
				},
			});
			const packageId = purchased.id ?? "";
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

	if (!hydrated) {
		return (
			<PageShell title="Checkout" subtitle="Review your order and pay">
				<p style={{ color: "var(--wayfare-text-secondary)" }}>Loading…</p>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="Checkout"
			subtitle="Review your order and pay"
			contentClassName="mx-auto max-w-xl"
		>
			<div>
				{isProcessing && (
					<div className="mb-6">
						<PurchaseProgress flowState={state.flowState} />
					</div>
				)}

				<div
					className="mb-4 rounded-lg p-4"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<p
						className="text-xs font-semibold uppercase tracking-wide mb-3"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						{selectedOffers.length === 1
							? "Your offer"
							: `Your offers (${selectedOffers.length})`}
					</p>
					<div className="flex flex-col gap-2">
						{selectedOffers.map((offer) => {
							const product = offer.properties?.products?.[0];
							const price = offer.properties?.price;
							const legs = offer.properties?.legs ?? [];
							const travellerCount = new Set(
								legs.map((l) => l.traveller).filter(Boolean),
							).size;
							return (
								<div
									key={offer.id}
									className="flex items-center justify-between gap-2"
								>
									<div>
										<p
											className="text-sm font-medium"
											style={{ color: "var(--wayfare-text)", margin: 0 }}
										>
											{offer.properties?.summary?.name ??
												product?.productName ??
												"Travel Offer"}
										</p>
										{travellerCount > 0 && (
											<p
												className="text-xs"
												style={{
													color: "var(--wayfare-text-secondary)",
													margin: 0,
												}}
											>
												{travellerCount} traveller
												{travellerCount !== 1 ? "s" : ""}
											</p>
										)}
									</div>
									{price && (
										<p
											className="text-sm font-semibold shrink-0"
											style={{ color: "var(--wayfare-primary)", margin: 0 }}
										>
											{formatPrice(price.amount, price.currencyCode ?? "NOK")}
										</p>
									)}
								</div>
							);
						})}
					</div>
					{selectedOffers.length > 1 && (
						<div
							className="mt-3 pt-3 flex items-center justify-between"
							style={{ borderTop: "1px solid var(--wayfare-line)" }}
						>
							<p
								className="text-sm font-semibold"
								style={{ color: "var(--wayfare-text)", margin: 0 }}
							>
								Total
							</p>
							<p
								className="text-base font-bold"
								style={{ color: "var(--wayfare-primary)", margin: 0 }}
							>
								{formatPrice(previewTotal, currency)}
							</p>
						</div>
					)}
				</div>

				<div
					className="mb-4 rounded-lg p-4"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<p
						className="text-xs font-semibold uppercase tracking-wide mb-3"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						Customer
					</p>
					{profileCustomer ? (
						<div className="flex items-center justify-between gap-2">
							<div>
								<p
									className="text-sm font-medium"
									style={{ color: "var(--wayfare-text)", margin: 0 }}
								>
									{[profileCustomer.firstName, profileCustomer.lastName]
										.filter(Boolean)
										.join(" ") || profileCustomer.id}
								</p>
								{profileCustomer.email && (
									<p
										className="text-xs"
										style={{
											color: "var(--wayfare-text-secondary)",
											margin: 0,
										}}
									>
										{profileCustomer.email}
									</p>
								)}
							</div>
							<Link
								to="/settings"
								search={{ tab: "profile", pendingCardId: undefined }}
								className="text-xs no-underline"
								style={{ color: "var(--wayfare-primary)" }}
							>
								Change
							</Link>
						</div>
					) : (
						<div className="space-y-3">
							<p
								className="text-xs"
								style={{ color: "var(--wayfare-text-secondary)" }}
							>
								No profile selected.{" "}
								<Link
									to="/settings"
									search={{ tab: "profile", pendingCardId: undefined }}
									className="no-underline"
									style={{ color: "var(--wayfare-primary)" }}
								>
									Sign in
								</Link>{" "}
								or enter your details below.
							</p>
							<div className="grid grid-cols-2 gap-2">
								<div>
									<label
										htmlFor="checkout-firstName"
										className="mb-1 block text-xs font-medium"
										style={{ color: "var(--wayfare-text-secondary)" }}
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
										className="w-full rounded-lg border px-3 py-2 text-sm"
										style={{
											background: "var(--wayfare-surface)",
											borderColor: "var(--wayfare-line)",
											color: "var(--wayfare-text)",
										}}
										placeholder="First name"
									/>
								</div>
								<div>
									<label
										htmlFor="checkout-lastName"
										className="mb-1 block text-xs font-medium"
										style={{ color: "var(--wayfare-text-secondary)" }}
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
										className="w-full rounded-lg border px-3 py-2 text-sm"
										style={{
											background: "var(--wayfare-surface)",
											borderColor: "var(--wayfare-line)",
											color: "var(--wayfare-text)",
										}}
										placeholder="Last name"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="checkout-email"
									className="mb-1 block text-xs font-medium"
									style={{ color: "var(--wayfare-text-secondary)" }}
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
									className="w-full rounded-lg border px-3 py-2 text-sm"
									style={{
										background: "var(--wayfare-surface)",
										borderColor: "var(--wayfare-line)",
										color: "var(--wayfare-text)",
									}}
									placeholder="email@example.com"
								/>
							</div>
						</div>
					)}
				</div>

				<div
					className="mb-6 rounded-lg p-4"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<SavedPaymentPicker
						onSelect={setPaymentMethod}
						offerId={offerId}
						autoSelectRecurringPaymentId={authorizedCardId}
					/>
				</div>

				{state.error && (
					<p
						className="mb-4 rounded-lg px-3 py-2 text-sm"
						style={{
							background: "rgba(233,0,55,0.08)",
							color: "var(--wayfare-primary)",
						}}
					>
						{state.error}
					</p>
				)}

				<div className="flex gap-3">
					<Link
						to="/offers"
						className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold no-underline transition-colors"
						style={{
							borderColor: "var(--wayfare-line)",
							color: "var(--wayfare-text)",
						}}
					>
						<LeftArrowIcon aria-hidden="true" />
						Back
					</Link>
					<Button
						variant="primary"
						className="flex-1"
						disabled={
							!paymentMethodComplete || !guestCustomerComplete || isProcessing
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
