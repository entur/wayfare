interface ModePillProps {
	label: string;
	active: boolean;
	onClick: () => void;
}

/** Toggle chip for a single transport mode — used in the trip filter panel
 * and the default-modes setting. */
export default function ModePill({ label, active, onClick }: ModePillProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
				active
					? "border-wayfare-primary bg-wayfare-accent-soft text-wayfare-primary"
					: "border-wayfare-line bg-wayfare-surface-strong text-wayfare-text-secondary hover:text-wayfare-text"
			}`}
		>
			{label}
		</button>
	);
}
