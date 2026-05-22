import {
	AmericanExpressIcon,
	MastercardIcon,
	VippsIcon,
	VisaIcon,
} from "@entur/icons";
import type { PaymentType } from "../../types/purchase";

interface PaymentMethodPickerProps {
	selected: PaymentType | null;
	onSelect: (method: PaymentType) => void;
}

const PAYMENT_METHODS: {
	id: PaymentType;
	label: string;
	description: string;
	Icon: React.ComponentType;
}[] = [
	{
		id: "VISA",
		label: "Visa",
		description: "Pay with Visa card",
		Icon: VisaIcon,
	},
	{
		id: "MASTERCARD",
		label: "Mastercard",
		description: "Pay with Mastercard",
		Icon: MastercardIcon,
	},
	{
		id: "AMEX",
		label: "American Express",
		description: "Pay with American Express card",
		Icon: AmericanExpressIcon,
	},
	{
		id: "VIPPS",
		label: "Vipps",
		description: "Pay with Vipps mobile payment",
		Icon: VippsIcon,
	},
];

export default function PaymentMethodPicker({
	selected,
	onSelect,
}: PaymentMethodPickerProps) {
	return (
		<div className="flex flex-col gap-3">
			<p
				className="text-xs font-semibold uppercase tracking-wide"
				style={{ color: "var(--color-wayfare-text-secondary)" }}
			>
				Payment method
			</p>
			<div className="flex flex-col gap-2">
				{PAYMENT_METHODS.map((method) => {
					const isSelected = selected === method.id;
					return (
						<label
							key={method.id}
							className="flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all"
							style={{
								borderColor: isSelected
									? "var(--color-wayfare-primary)"
									: "var(--color-wayfare-line)",
								background: isSelected
									? "var(--color-wayfare-accent-soft)"
									: "transparent",
							}}
						>
							<input
								type="radio"
								name="payment-method"
								value={method.id}
								checked={isSelected}
								onChange={() => onSelect(method.id)}
								className="sr-only"
							/>
							<div
								className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
								style={{
									borderColor: isSelected
										? "var(--color-wayfare-primary)"
										: "var(--color-wayfare-line)",
								}}
							>
								{isSelected && (
									<div
										className="h-2 w-2 rounded-full"
										style={{ background: "var(--color-wayfare-primary)" }}
									/>
								)}
							</div>
							<method.Icon aria-hidden="true" />
							<div className="min-w-0">
								<p
									className="text-sm font-semibold"
									style={{ color: "var(--color-wayfare-text)", margin: 0 }}
								>
									{method.label}
								</p>
								<p
									className="text-xs"
									style={{
										color: "var(--color-wayfare-text-secondary)",
										margin: 0,
									}}
								>
									{method.description}
								</p>
							</div>
						</label>
					);
				})}
			</div>
		</div>
	);
}
