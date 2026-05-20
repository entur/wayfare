import { AmericanExpressIcon, MastercardIcon, VisaIcon } from "@entur/icons";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "../../context/profile";
import { useUpdateCustomer } from "../../hooks/use-customers";
import {
	useAddCard,
	useAuthorizeCard,
	useDeletePayment,
	useRecurringPayments,
	useSetPrimaryPayment,
} from "../../hooks/use-recurring-payments";
import {
	getGuestPaymentPrefs,
	setGuestPaymentPrefs,
} from "../../lib/payment-methods-storage";
import type { RecurringPayment } from "../../types/payment-methods";
import type { CardPaymentType } from "../../types/purchase";
import Button from "../ui/Button";

const CARD_META: Partial<
	Record<CardPaymentType, { label: string; Icon: React.ComponentType }>
> = {
	VISA: { label: "Visa", Icon: VisaIcon },
	MASTERCARD: { label: "Mastercard", Icon: MastercardIcon },
	AMEX: { label: "American Express", Icon: AmericanExpressIcon },
};

function cardLabel(id?: CardPaymentType) {
	return id ? (CARD_META[id]?.label ?? id) : "Card";
}

const sectionStyle = {
	background: "var(--wayfare-surface-strong)",
	border: "1px solid var(--wayfare-line)",
};
const labelStyle = { color: "var(--wayfare-text-secondary)" };
const inputStyle = {
	background: "var(--wayfare-surface)",
	borderColor: "var(--wayfare-line)",
	color: "var(--wayfare-text)",
};

// ─── Guest form ───────────────────────────────────────────────────────────────

const GUEST_CARD_OPTIONS: { value: CardPaymentType; label: string }[] = [
	{ value: "VISA", label: "Visa" },
	{ value: "MASTERCARD", label: "Mastercard" },
	{ value: "AMEX", label: "American Express" },
];

function GuestPaymentPrefsForm() {
	const prefs = getGuestPaymentPrefs();
	const [cardType, setCardType] = useState<CardPaymentType | "">(
		prefs.preferredCardType ?? "",
	);
	const [vippsPhone, setVippsPhone] = useState(prefs.vippsPhone ?? "");
	const [saved, setSaved] = useState(false);

	function handleSave() {
		setGuestPaymentPrefs({
			preferredCardType: cardType || undefined,
			vippsPhone: vippsPhone.trim() || undefined,
		});
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	}

	return (
		<div className="space-y-4">
			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Default card type
				</h2>
				<div className="flex flex-col gap-2">
					{GUEST_CARD_OPTIONS.map((opt) => {
						const selected = cardType === opt.value;
						return (
							<label
								key={opt.value}
								className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all"
								style={{
									borderColor: selected
										? "var(--wayfare-primary)"
										: "var(--wayfare-line)",
									background: selected
										? "var(--wayfare-accent-soft)"
										: "transparent",
								}}
							>
								<input
									type="radio"
									name="guest-card-type"
									value={opt.value}
									checked={selected}
									onChange={() => setCardType(opt.value)}
									className="sr-only"
								/>
								<div
									className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
									style={{
										borderColor: selected
											? "var(--wayfare-primary)"
											: "var(--wayfare-line)",
									}}
								>
									{selected && (
										<div
											className="h-2 w-2 rounded-full"
											style={{ background: "var(--wayfare-primary)" }}
										/>
									)}
								</div>
								<p
									className="text-sm font-medium"
									style={{ color: "var(--wayfare-text)", margin: 0 }}
								>
									{opt.label}
								</p>
							</label>
						);
					})}
				</div>
			</section>

			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Vipps
				</h2>
				<div>
					<label
						htmlFor="guest-vipps-phone"
						className="mb-1 block text-xs font-medium"
						style={labelStyle}
					>
						Phone number
					</label>
					<input
						id="guest-vipps-phone"
						type="tel"
						value={vippsPhone}
						onChange={(e) => setVippsPhone(e.target.value)}
						placeholder="e.g. 91234567"
						className="w-full rounded-lg border px-3 py-2 text-sm"
						style={inputStyle}
					/>
					<p className="mt-1 text-xs" style={labelStyle}>
						Stored locally and used to pre-fill Vipps at checkout.
					</p>
				</div>
			</section>

			<div className="flex justify-end">
				<Button variant="primary" onClick={handleSave}>
					{saved ? "Saved" : "Save preferences"}
				</Button>
			</div>
		</div>
	);
}

// ─── Vipps phone editor ───────────────────────────────────────────────────────

interface VippsPhoneEditorProps {
	customerId: string;
	currentPhone: string | undefined;
	onSaved: (phone: string) => void;
}

function VippsPhoneEditor({
	customerId,
	currentPhone,
	onSaved,
}: VippsPhoneEditorProps) {
	const [editing, setEditing] = useState(!currentPhone);
	const [phone, setPhone] = useState(currentPhone ?? "");
	const updateCustomer = useUpdateCustomer(customerId);

	async function handleSave() {
		const trimmed = phone.trim();
		if (!trimmed) return;
		await updateCustomer.mutateAsync({ phoneNumber: trimmed });
		onSaved(trimmed);
		setEditing(false);
	}

	if (!editing && currentPhone) {
		return (
			<div className="flex items-center justify-between">
				<div>
					<p
						className="text-sm font-medium"
						style={{ color: "var(--wayfare-text)", margin: 0 }}
					>
						{currentPhone}
					</p>
					<p className="text-xs" style={labelStyle}>
						Used to pre-fill Vipps at checkout
					</p>
				</div>
				<Button variant="secondary" onClick={() => setEditing(true)}>
					Change
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div>
				<label
					htmlFor="signed-in-vipps-phone"
					className="mb-1 block text-xs font-medium"
					style={labelStyle}
				>
					Phone number
				</label>
				<input
					id="signed-in-vipps-phone"
					type="tel"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					placeholder="e.g. 91234567"
					className="w-full rounded-lg border px-3 py-2 text-sm"
					style={inputStyle}
				/>
			</div>
			<div className="flex gap-2">
				{currentPhone && (
					<Button
						variant="secondary"
						onClick={() => {
							setPhone(currentPhone);
							setEditing(false);
						}}
					>
						Cancel
					</Button>
				)}
				<Button
					variant="primary"
					onClick={handleSave}
					disabled={!phone.trim()}
					loading={updateCustomer.isPending}
				>
					Save
				</Button>
			</div>
		</div>
	);
}

// ─── Recurring payment row ────────────────────────────────────────────────────

interface RecurringPaymentRowProps {
	payment: RecurringPayment;
	onSetPrimary: (id: number) => void;
	onDelete: (id: number) => void;
	primaryPendingId: number | null;
	deletePendingId: number | null;
}

function RecurringPaymentRow({
	payment,
	onSetPrimary,
	onDelete,
	primaryPendingId,
	deletePendingId,
}: RecurringPaymentRowProps) {
	const meta = payment.paymentType ? CARD_META[payment.paymentType] : undefined;
	const Icon = meta?.Icon;

	return (
		<li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
			<div className="flex items-center gap-3">
				{Icon && <Icon aria-hidden="true" />}
				<div>
					<p
						className="text-sm font-medium"
						style={{ color: "var(--wayfare-text)", margin: 0 }}
					>
						{payment.nickname ?? cardLabel(payment.paymentType)}
					</p>
					{payment.maskedPan && (
						<p
							className="text-xs font-mono"
							style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
						>
							•••• {payment.maskedPan}
						</p>
					)}
					<div className="flex items-center gap-2 mt-0.5">
						{payment.primary && (
							<span
								className="rounded px-1.5 py-0.5 text-xs font-semibold"
								style={{
									background: "var(--wayfare-accent-soft)",
									color: "var(--wayfare-primary)",
								}}
							>
								Default
							</span>
						)}
						{payment.recurringStatus === "CREATED" && (
							<span className="text-xs" style={labelStyle}>
								Pending activation
							</span>
						)}
					</div>
				</div>
			</div>
			<div className="flex shrink-0 gap-2">
				{!payment.primary && payment.recurringStatus === "ACTIVE" && (
					<Button
						variant="secondary"
						onClick={() => onSetPrimary(payment.recurringPaymentId)}
						loading={primaryPendingId === payment.recurringPaymentId}
					>
						Make default
					</Button>
				)}
				<Button
					variant="secondary"
					onClick={() => onDelete(payment.recurringPaymentId)}
					loading={deletePendingId === payment.recurringPaymentId}
				>
					Remove
				</Button>
			</div>
		</li>
	);
}

// ─── Signed-in section ────────────────────────────────────────────────────────

interface SignedInPaymentMethodsProps {
	pendingCardId?: number;
	onCardAuthorized: () => void;
}

function SignedInPaymentMethods({
	pendingCardId,
	onCardAuthorized,
}: SignedInPaymentMethodsProps) {
	const { customer, signIn } = useProfile();
	const customerId = customer?.id ?? "";
	const customerNumber = customer?.customerNumber ?? "";

	const {
		data: recurringPayments,
		isLoading,
		error,
	} = useRecurringPayments(customerNumber);
	const setPrimary = useSetPrimaryPayment(customerNumber);
	const deletePayment = useDeletePayment(customerNumber);
	const addCard = useAddCard(customerNumber);
	const authorizeCard = useAuthorizeCard(customerNumber);

	const [primaryPendingId, setPrimaryPendingId] = useState<number | null>(null);
	const [deletePendingId, setDeletePendingId] = useState<number | null>(null);
	const [addError, setAddError] = useState<string | null>(null);
	const [authError, setAuthError] = useState<string | null>(null);
	const [authorizingCard, setAuthorizingCard] = useState(!!pendingCardId);
	const authorizeAttempted = useRef(false);

	useEffect(() => {
		if (!pendingCardId || authorizeAttempted.current) return;
		authorizeAttempted.current = true;
		setAuthorizingCard(true);
		authorizeCard
			.mutateAsync(pendingCardId)
			.then(() => {
				setAuthorizingCard(false);
				onCardAuthorized();
			})
			.catch((err) => {
				setAuthorizingCard(false);
				setAuthError(
					err instanceof Error ? err.message : "Card activation failed",
				);
			});
	}, [pendingCardId, authorizeCard.mutateAsync, onCardAuthorized]);

	async function handleSetPrimary(id: number) {
		setPrimaryPendingId(id);
		try {
			await setPrimary.mutateAsync(id);
		} finally {
			setPrimaryPendingId(null);
		}
	}

	async function handleDelete(id: number) {
		if (!confirm("Remove this saved card?")) return;
		setDeletePendingId(id);
		try {
			await deletePayment.mutateAsync(id);
		} finally {
			setDeletePendingId(null);
		}
	}

	async function handleAddCard() {
		setAddError(null);
		try {
			const result = await addCard.mutateAsync({
				makeRedirectUrl: (id) =>
					`${window.location.origin}/settings?tab=payment&pendingCardId=${id}`,
				terminalLanguage: "en_GB",
			});
			window.location.href = result.terminalUri;
		} catch (err) {
			setAddError(
				err instanceof Error
					? err.message
					: "Could not start card registration",
			);
		}
	}

	const visibleCards =
		recurringPayments?.filter(
			(p) => p.recurringStatus === "ACTIVE" || p.recurringStatus === "CREATED",
		) ?? [];

	const phone = customer?.phoneNumber ?? customer?.vippsPhoneNumber;

	if (authorizingCard) {
		return (
			<div className="flex items-center gap-3 py-6">
				<div
					className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent shrink-0"
					style={{
						borderColor: "var(--wayfare-line)",
						borderTopColor: "var(--wayfare-primary)",
					}}
				/>
				<p className="text-sm" style={labelStyle}>
					Activating card…
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{authError && (
				<p
					className="rounded-xl px-4 py-3 text-sm"
					style={{
						background: "rgba(233,0,55,0.08)",
						color: "var(--wayfare-primary)",
					}}
				>
					{authError}
				</p>
			)}

			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-1 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Saved cards
				</h2>

				{isLoading && (
					<p className="py-3 text-sm" style={labelStyle}>
						Loading…
					</p>
				)}
				{error && !isLoading && (
					<p
						className="py-3 text-sm"
						style={{ color: "var(--wayfare-primary)" }}
					>
						{error instanceof Error
							? error.message
							: "Failed to load saved cards"}
					</p>
				)}

				{!isLoading && !error && (
					<>
						{visibleCards.length > 0 ? (
							<ul className="divide-y divide-black/8">
								{visibleCards.map((p) => (
									<RecurringPaymentRow
										key={p.recurringPaymentId}
										payment={p}
										onSetPrimary={handleSetPrimary}
										onDelete={handleDelete}
										primaryPendingId={primaryPendingId}
										deletePendingId={deletePendingId}
									/>
								))}
							</ul>
						) : (
							<p className="py-2 text-sm" style={labelStyle}>
								No saved cards yet.
							</p>
						)}

						{addError && (
							<p
								className="mt-2 text-sm"
								style={{ color: "var(--wayfare-primary)" }}
							>
								{addError}
							</p>
						)}

						<div className="mt-4">
							<Button
								variant="secondary"
								onClick={handleAddCard}
								loading={addCard.isPending}
							>
								+ Add new card
							</Button>
						</div>
					</>
				)}
			</section>

			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Vipps
				</h2>
				<VippsPhoneEditor
					customerId={customerId}
					currentPhone={phone}
					onSaved={(newPhone) => {
						if (customer) signIn({ ...customer, phoneNumber: newPhone });
					}}
				/>
			</section>
		</div>
	);
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function PaymentMethodsTab({
	pendingCardId,
	onCardAuthorized,
}: {
	pendingCardId?: number;
	onCardAuthorized: () => void;
}) {
	const { customer } = useProfile();

	if (!customer) return <GuestPaymentPrefsForm />;

	return (
		<SignedInPaymentMethods
			pendingCardId={pendingCardId}
			onCardAuthorized={onCardAuthorized}
		/>
	);
}
