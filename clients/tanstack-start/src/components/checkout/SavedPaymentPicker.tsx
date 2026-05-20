import {
	AmericanExpressIcon,
	MastercardIcon,
	VippsIcon,
	VisaIcon,
} from "@entur/icons";
import { useEffect, useState } from "react";
import { useProfile } from "../../context/profile";
import {
	useAddCard,
	useRecurringPayments,
} from "../../hooks/use-recurring-payments";
import { getGuestPaymentPrefs, setGuestPaymentPrefs } from "../../lib/payment-methods-storage";
import type { PaymentSelection, RecurringPayment } from "../../types/payment-methods";
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

const CARD_TYPES: CardPaymentType[] = ["VISA", "MASTERCARD", "AMEX"];

interface RadioRowProps {
	name: string;
	value: string;
	checked: boolean;
	onChange: () => void;
	icon?: React.ReactNode;
	label: string;
	description?: string;
	badge?: string;
	children?: React.ReactNode;
}

function RadioRow({
	name,
	value,
	checked,
	onChange,
	icon,
	label,
	description,
	badge,
	children,
}: RadioRowProps) {
	return (
		<div>
			<label
				className="flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all"
				style={{
					borderColor: checked
						? "var(--wayfare-primary)"
						: "var(--wayfare-line)",
					background: checked ? "var(--wayfare-accent-soft)" : "transparent",
				}}
			>
				<input
					type="radio"
					name={name}
					value={value}
					checked={checked}
					onChange={onChange}
					className="sr-only"
				/>
				<div
					className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
					style={{
						borderColor: checked
							? "var(--wayfare-primary)"
							: "var(--wayfare-line)",
					}}
				>
					{checked && (
						<div
							className="h-2 w-2 rounded-full"
							style={{ background: "var(--wayfare-primary)" }}
						/>
					)}
				</div>
				{icon}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<p
							className="text-sm font-semibold"
							style={{ color: "var(--wayfare-text)", margin: 0 }}
						>
							{label}
						</p>
						{badge && (
							<span
								className="rounded px-1.5 py-0.5 text-xs font-semibold"
								style={{
									background: "var(--wayfare-accent-soft)",
									color: "var(--wayfare-primary)",
									border: "1px solid var(--wayfare-primary)",
								}}
							>
								{badge}
							</span>
						)}
					</div>
					{description && (
						<p
							className="text-xs"
							style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
						>
							{description}
						</p>
					)}
				</div>
			</label>
			{checked && children && (
				<div
					className="mx-3 rounded-b-xl border-x border-b px-4 pb-4 pt-3"
					style={{ borderColor: "var(--wayfare-primary)" }}
				>
					{children}
				</div>
			)}
		</div>
	);
}

// ─── Signed-in picker ─────────────────────────────────────────────────────────

type RadioValue = `recurring-${number}` | "vipps" | "new-card";

interface SignedInPickerProps {
	onSelect: (s: PaymentSelection | null) => void;
	autoSelectId?: number;
	offerId: string;
}

function SignedInPicker({
	onSelect,
	autoSelectId,
	offerId,
}: SignedInPickerProps) {
	const { customer } = useProfile();
	const customerId = customer?.id ?? "";

	const { data: recurringPayments = [], isLoading } =
		useRecurringPayments(customerId);
	const addCard = useAddCard(customerId);

	const activeCards = recurringPayments.filter((p) => p.recurringStatus === "ACTIVE");
	const primaryCard = activeCards.find((p) => p.primary) ?? activeCards[0];

	const defaultRadio: RadioValue = autoSelectId
		? `recurring-${autoSelectId}`
		: primaryCard
			? `recurring-${primaryCard.recurringPaymentId}`
			: "new-card";

	const [radio, setRadio] = useState<RadioValue>(defaultRadio);
	const [vippsPhone, setVippsPhone] = useState(
		customer?.phoneNumber ?? customer?.vippsPhoneNumber ?? "",
	);
	const [cardType, setCardType] = useState<CardPaymentType | null>(null);
	const [addError, setAddError] = useState<string | null>(null);

	// sync autoSelectId when it arrives (post-authorize-card return)
	useEffect(() => {
		if (!autoSelectId) return;
		const v: RadioValue = `recurring-${autoSelectId}`;
		setRadio(v);
	}, [autoSelectId]);

	// emit selection whenever relevant state changes
	useEffect(() => {
		if (radio === "vipps") {
			onSelect(vippsPhone.trim() ? { kind: "vipps", phone: vippsPhone.trim() } : null);
		} else if (radio === "new-card") {
			onSelect(cardType ? { kind: "card", paymentType: cardType } : null);
		} else {
			const idStr = radio.replace("recurring-", "");
			const id = Number(idStr);
			const match = activeCards.find((p) => p.recurringPaymentId === id);
			if (match) {
				onSelect({
					kind: "recurring",
					recurringPaymentId: match.recurringPaymentId,
					paymentType: match.paymentType,
				});
			} else {
				onSelect(null);
			}
		}
	}, [radio, vippsPhone, cardType, activeCards, onSelect]);

	function selectRecurring(p: RecurringPayment) {
		setRadio(`recurring-${p.recurringPaymentId}`);
	}

	async function handleAddCard() {
		setAddError(null);
		try {
			const result = await addCard.mutateAsync({
				makeRedirectUrl: (id) =>
					`${window.location.origin}/checkout/${offerId}?pendingCardId=${id}`,
				terminalLanguage: "en_GB",
			});
			window.location.href = result.terminalUri;
		} catch (err) {
			setAddError(
				err instanceof Error ? err.message : "Could not start card registration",
			);
		}
	}

	if (isLoading) {
		return (
			<p
				className="py-3 text-sm"
				style={{ color: "var(--wayfare-text-secondary)" }}
			>
				Loading payment methods…
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p
				className="text-xs font-semibold uppercase tracking-wide"
				style={{ color: "var(--wayfare-text-secondary)" }}
			>
				Payment method
			</p>

			{activeCards.map((p) => {
				const meta = p.paymentType ? CARD_META[p.paymentType] : undefined;
				const Icon = meta?.Icon;
				return (
					<RadioRow
						key={p.recurringPaymentId}
						name="payment-method"
						value={`recurring-${p.recurringPaymentId}`}
						checked={radio === `recurring-${p.recurringPaymentId}`}
						onChange={() => selectRecurring(p)}
						icon={Icon ? <Icon aria-hidden="true" /> : undefined}
						label={p.nickname ?? cardLabel(p.paymentType)}
						badge={p.primary ? "Default" : undefined}
					/>
				);
			})}

			<RadioRow
				name="payment-method"
				value="vipps"
				checked={radio === "vipps"}
				onChange={() => setRadio("vipps")}
				icon={<VippsIcon aria-hidden="true" />}
				label="Vipps"
				description={
					vippsPhone
						? `Using number: ${vippsPhone}`
						: "Pay with Vipps mobile payment"
				}
			>
				<div>
					<label
						htmlFor="checkout-vipps-phone"
						className="mb-1 block text-xs font-medium"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						Phone number
					</label>
					<input
						id="checkout-vipps-phone"
						type="tel"
						value={vippsPhone}
						onChange={(e) => setVippsPhone(e.target.value)}
						placeholder="e.g. 91234567"
						className="w-full rounded-lg border px-3 py-2 text-sm"
						style={{
							background: "var(--wayfare-surface)",
							borderColor: "var(--wayfare-line)",
							color: "var(--wayfare-text)",
						}}
					/>
				</div>
			</RadioRow>

			<RadioRow
				name="payment-method"
				value="new-card"
				checked={radio === "new-card"}
				onChange={() => setRadio("new-card")}
				label="Pay with card (one-time)"
				description="Enter card details at the next step"
			>
				<div className="flex gap-2 flex-wrap">
					{CARD_TYPES.map((t) => {
						const meta = CARD_META[t];
						if (!meta) return null;
						const { label, Icon } = meta;
						const selected = cardType === t;
						return (
							<button
								key={t}
								type="button"
								onClick={() => setCardType(t)}
								className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
								style={{
									borderColor: selected
										? "var(--wayfare-primary)"
										: "var(--wayfare-line)",
									background: selected
										? "var(--wayfare-accent-soft)"
										: "var(--wayfare-surface)",
									color: "var(--wayfare-text)",
								}}
							>
								<Icon aria-hidden="true" />
								{label}
							</button>
						);
					})}
				</div>
			</RadioRow>

			<div
				className="mt-1 rounded-xl border border-dashed p-3"
				style={{ borderColor: "var(--wayfare-line)" }}
			>
				<p
					className="mb-2 text-xs"
					style={{ color: "var(--wayfare-text-secondary)" }}
				>
					Save a card for faster checkout next time
				</p>
				{addError && (
					<p
						className="mb-2 text-xs"
						style={{ color: "var(--wayfare-primary)" }}
					>
						{addError}
					</p>
				)}
				<Button
					variant="secondary"
					onClick={handleAddCard}
					loading={addCard.isPending}
				>
					+ Add new card
				</Button>
			</div>
		</div>
	);
}

// ─── Guest picker ─────────────────────────────────────────────────────────────

interface GuestPickerProps {
	onSelect: (s: PaymentSelection | null) => void;
}

function GuestPicker({ onSelect }: GuestPickerProps) {
	const prefs = getGuestPaymentPrefs();
	const [radio, setRadio] = useState<"vipps" | CardPaymentType | null>(
		prefs.preferredCardType ?? null,
	);
	const [vippsPhone, setVippsPhone] = useState(prefs.vippsPhone ?? "");

	useEffect(() => {
		if (radio === "vipps") {
			const phone = vippsPhone.trim();
			onSelect(phone ? { kind: "vipps", phone } : null);
			if (phone) setGuestPaymentPrefs({ ...prefs, vippsPhone: phone });
		} else if (radio) {
			onSelect({ kind: "card", paymentType: radio as CardPaymentType });
		} else {
			onSelect(null);
		}
	}, [radio, vippsPhone, onSelect, prefs]);

	const METHODS: {
		id: "vipps" | CardPaymentType;
		label: string;
		description: string;
		Icon: React.ComponentType;
	}[] = [
		{ id: "VISA", label: "Visa", description: "Pay with Visa card", Icon: VisaIcon },
		{ id: "MASTERCARD", label: "Mastercard", description: "Pay with Mastercard", Icon: MastercardIcon },
		{ id: "AMEX", label: "American Express", description: "Pay with American Express", Icon: AmericanExpressIcon },
		{
			id: "vipps",
			label: "Vipps",
			description: vippsPhone ? `Using number: ${vippsPhone}` : "Pay with Vipps mobile payment",
			Icon: VippsIcon,
		},
	];

	return (
		<div className="flex flex-col gap-3">
			<p
				className="text-xs font-semibold uppercase tracking-wide"
				style={{ color: "var(--wayfare-text-secondary)" }}
			>
				Payment method
			</p>
			<div className="flex flex-col gap-2">
				{METHODS.map((m) => (
					<RadioRow
						key={m.id}
						name="payment-method"
						value={m.id}
						checked={radio === m.id}
						onChange={() => setRadio(m.id)}
						icon={<m.Icon aria-hidden="true" />}
						label={m.label}
						description={m.description}
					>
						{m.id === "vipps" && (
							<div>
								<label
									htmlFor="checkout-guest-vipps-phone"
									className="mb-1 block text-xs font-medium"
									style={{ color: "var(--wayfare-text-secondary)" }}
								>
									Phone number
								</label>
								<input
									id="checkout-guest-vipps-phone"
									type="tel"
									value={vippsPhone}
									onChange={(e) => setVippsPhone(e.target.value)}
									placeholder="e.g. 91234567"
									className="w-full rounded-lg border px-3 py-2 text-sm"
									style={{
										background: "var(--wayfare-surface)",
										borderColor: "var(--wayfare-line)",
										color: "var(--wayfare-text)",
									}}
								/>
							</div>
						)}
					</RadioRow>
				))}
			</div>
		</div>
	);
}

// ─── Public component ─────────────────────────────────────────────────────────

interface SavedPaymentPickerProps {
	onSelect: (s: PaymentSelection | null) => void;
	offerId: string;
	autoSelectRecurringPaymentId?: number;
}

export default function SavedPaymentPicker({
	onSelect,
	offerId,
	autoSelectRecurringPaymentId,
}: SavedPaymentPickerProps) {
	const { customer } = useProfile();

	if (customer) {
		return (
			<SignedInPicker
				onSelect={onSelect}
				offerId={offerId}
				autoSelectId={autoSelectRecurringPaymentId}
			/>
		);
	}

	return <GuestPicker onSelect={onSelect} />;
}
