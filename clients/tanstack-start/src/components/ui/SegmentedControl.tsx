interface SegmentOption<T extends string> {
	value: T;
	label: string;
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
		<fieldset
			className="inline-flex w-full rounded-xl border p-1"
			style={{
				borderColor: "var(--wayfare-line)",
				background: "var(--wayfare-bg)",
			}}
		>
			{legend && <legend className="sr-only">{legend}</legend>}
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className="flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
						style={{
							background: active
								? "var(--wayfare-surface-strong)"
								: "transparent",
							color: active
								? "var(--wayfare-text)"
								: "var(--wayfare-text-secondary)",
							boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
							border: "none",
							cursor: "pointer",
						}}
					>
						{opt.label}
					</button>
				);
			})}
		</fieldset>
	);
}
