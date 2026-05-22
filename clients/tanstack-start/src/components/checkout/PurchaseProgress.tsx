import type { PurchaseFlowState } from "../../context/purchase-flow";

const STEPS: { state: PurchaseFlowState; label: string }[] = [
	{ state: "selected", label: "Offer selected" },
	{ state: "purchasing", label: "Creating reservation" },
	{ state: "paying", label: "Payment" },
	{ state: "capturing", label: "Capturing" },
	{ state: "confirming", label: "Confirming" },
	{ state: "success", label: "Complete" },
];

const ORDER: PurchaseFlowState[] = [
	"idle",
	"offers_loaded",
	"selected",
	"purchasing",
	"paying",
	"capturing",
	"confirming",
	"success",
];

interface PurchaseProgressProps {
	flowState: PurchaseFlowState;
}

export default function PurchaseProgress({ flowState }: PurchaseProgressProps) {
	const currentIndex = ORDER.indexOf(flowState);

	return (
		<div className="flex items-center gap-1">
			{STEPS.map((step, i) => {
				const stepIndex = ORDER.indexOf(step.state);
				const isDone = currentIndex > stepIndex;
				const isActive = currentIndex === stepIndex;

				return (
					<div key={step.state} className="flex items-center gap-1">
						{i > 0 && (
							<div
								className="h-px w-6"
								style={{
									background: isDone
										? "var(--color-wayfare-primary)"
										: "var(--color-wayfare-line)",
								}}
							/>
						)}
						<div className="flex flex-col items-center gap-1">
							<div
								className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
								style={{
									background:
										isDone || isActive
											? "var(--color-wayfare-primary)"
											: "var(--color-wayfare-line)",
									color:
										isDone || isActive
											? "#fff"
											: "var(--color-wayfare-text-secondary)",
								}}
							>
								{isDone ? "✓" : i + 1}
							</div>
							<span
								className="hidden text-xs sm:block"
								style={{
									color: isActive
										? "var(--color-wayfare-primary)"
										: "var(--color-wayfare-text-secondary)",
								}}
							>
								{step.label}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
