import type { CSSProperties } from "react";
import type { Operator } from "../../lib/operators";

interface OperatorIconProps {
	operator: Operator;
	className?: string;
}

// CSS selects the theme variant without introducing a hydration mismatch.
export default function OperatorIcon({
	operator,
	className = "",
}: OperatorIconProps) {
	if (!operator.logo) {
		return (
			<span
				className={`flex h-6 w-6 shrink-0 items-center justify-center rounded bg-wayfare-bg text-[10px] font-bold text-wayfare-text-secondary ${className}`}
			>
				{operator.code}
			</span>
		);
	}

	return (
		<span
			aria-hidden="true"
			className={`operator-logo h-6 w-6 shrink-0 ${className}`}
			style={
				{
					"--operator-logo-light": `url(/logos/${operator.logo}_simple.svg)`,
					"--operator-logo-dark": `url(/logos/${operator.logo}_simple_dark.svg)`,
				} as CSSProperties
			}
		/>
	);
}
