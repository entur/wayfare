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
		<fieldset className="inline-flex w-full rounded-xl border border-wayfare-line bg-wayfare-bg p-1">
			{legend && <legend className="sr-only">{legend}</legend>}
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={`flex-1 cursor-pointer rounded-lg border-0 px-3 py-1.5 text-sm font-medium transition-all ${
							active
								? "bg-wayfare-surface-strong text-wayfare-text shadow-sm"
								: "bg-transparent text-wayfare-text-secondary shadow-none"
						}`}
					>
						{opt.label}
					</button>
				);
			})}
		</fieldset>
	);
}
