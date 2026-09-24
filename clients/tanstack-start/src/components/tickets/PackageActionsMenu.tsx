import { VerticalDotsIcon } from "@entur/icons";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "../../lib/format-price";
import type { RefundOptionItem } from "../../types/documents";

interface PackageActionsMenuProps {
	refundOptions: RefundOptionItem[];
	onClaimRefund: (optionId: string) => void;
	claimingRefund: boolean;
	onCancel: () => void;
	cancelling: boolean;
}

export default function PackageActionsMenu({
	refundOptions,
	onClaimRefund,
	claimingRefund,
	onCancel,
	cancelling,
}: PackageActionsMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handlePointerDown(e: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, []);

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-label="Package actions"
				className="flex h-9 w-9 items-center justify-center rounded-lg text-wayfare-text-secondary transition-colors hover:bg-wayfare-bg"
			>
				<VerticalDotsIcon aria-hidden="true" />
			</button>

			{isOpen && (
				<div
					role="menu"
					className="absolute right-0 z-50 mt-1 w-64 rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-2 shadow-lg"
				>
					{refundOptions.length > 0 && (
						<div className="flex flex-col gap-1 border-b border-wayfare-line pb-2">
							<p className="px-2 pt-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
								Refund options
							</p>
							{refundOptions.map((opt) => (
								<button
									key={opt.id ?? opt.properties?.refundType ?? "refund-option"}
									type="button"
									role="menuitem"
									disabled={!opt.id || claimingRefund}
									onClick={() => {
										if (!opt.id) return;
										onClaimRefund(opt.id);
										setIsOpen(false);
									}}
									className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm text-wayfare-text transition-colors hover:bg-wayfare-bg disabled:pointer-events-none disabled:opacity-50"
								>
									<span>{opt.properties?.refundType ?? "Refund"}</span>
									{opt.properties?.consequences?.[0]?.amount && (
										<span className="shrink-0 font-semibold text-wayfare-primary">
											{formatPrice(
												opt.properties.consequences[0].amount.amount ?? 0,
												opt.properties.consequences[0].amount.currencyCode ??
													opt.properties.consequences[0].currencyCode ??
													"NOK",
											)}
										</span>
									)}
								</button>
							))}
						</div>
					)}
					<button
						type="button"
						role="menuitem"
						disabled={cancelling}
						onClick={() => {
							setIsOpen(false);
							onCancel();
						}}
						className="mt-1 flex w-full items-center rounded-lg px-2 py-2 text-left text-sm font-medium text-wayfare-primary transition-colors hover:bg-wayfare-accent-soft disabled:pointer-events-none disabled:opacity-50"
					>
						Cancel ticket
					</button>
				</div>
			)}
		</div>
	);
}
