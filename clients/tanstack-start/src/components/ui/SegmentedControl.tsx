import type { ReactNode } from "react";

interface SegmentOption<T extends string> {
	value: T;
	label: ReactNode;
}

interface SegmentedControlProps<T extends string> {
	options: readonly SegmentOption<T>[];
	value: T;
	onChange: (value: T) => void;
	legend?: string;
}

export default function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	legend,
}: SegmentedControlProps<T>) {
	return (
		<fieldset className="-mx-4 flex w-auto min-w-0 gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:w-full sm:gap-0 sm:overflow-visible sm:rounded-xl sm:border sm:border-wayfare-line sm:bg-wayfare-bg sm:p-1">
			{legend && <legend className="sr-only">{legend}</legend>}
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						aria-pressed={active}
						className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors sm:flex-1 sm:shrink sm:rounded-lg sm:border-transparent ${
							active
								? "border-wayfare-primary bg-wayfare-accent-soft text-wayfare-primary sm:bg-wayfare-surface-strong sm:text-wayfare-text sm:shadow-sm"
								: "border-wayfare-line bg-wayfare-surface-strong text-wayfare-text-secondary hover:text-wayfare-text sm:bg-transparent sm:shadow-none"
						}`}
					>
						{opt.label}
					</button>
				);
			})}
		</fieldset>
	);
}
