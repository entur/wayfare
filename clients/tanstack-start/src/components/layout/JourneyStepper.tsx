import { useRouterState } from "@tanstack/react-router";

const STEPS = [
	{ label: "Trip", test: (p: string) => p.startsWith("/trips") },
	{ label: "Offers", test: (p: string) => p.startsWith("/offers") },
	{ label: "Seats", test: (p: string) => p.startsWith("/seats") },
	{ label: "Checkout", test: (p: string) => p.startsWith("/checkout") },
	{ label: "Done", test: (p: string) => p.startsWith("/tickets") },
] as const;

export function JourneyStepper() {
	const { location } = useRouterState();
	const activeIdx = STEPS.findIndex(({ test }) => test(location.pathname));

	return (
		<nav aria-label="Checkout progress">
			<div className="relative flex justify-between">
				<div className="absolute top-3 left-3 right-3 h-px bg-wayfare-line" />
				{activeIdx > 0 && (
					<div
						className="absolute top-3 left-3 h-px bg-wayfare-primary transition-all"
						style={{
							width: `calc(${(activeIdx / (STEPS.length - 1)) * 100}% - 1.5rem)`,
						}}
					/>
				)}
				{STEPS.map(({ label }, idx) => {
					const isDone = activeIdx > idx;
					const isActive = activeIdx === idx;
					return (
						<div key={label} className="relative flex flex-col items-center gap-1.5">
							<div
								className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
									isDone || isActive
										? "bg-wayfare-primary text-white"
										: "border border-wayfare-line bg-wayfare-bg text-wayfare-text-secondary"
								}`}
							>
								{isDone ? "✓" : idx + 1}
							</div>
							<span
								className={`hidden text-[11px] whitespace-nowrap sm:block ${
									isActive
										? "font-semibold text-wayfare-text"
										: "text-wayfare-text-secondary"
								}`}
							>
								{label}
							</span>
						</div>
					);
				})}
			</div>
		</nav>
	);
}
