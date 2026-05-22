import type { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "negative";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	loading?: boolean;
	fluid?: boolean;
}

export default function Button({
	variant = "primary",
	loading = false,
	fluid = false,
	disabled,
	children,
	className = "",
	style,
	...props
}: ButtonProps) {
	const base =
		"inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-wayfare-primary/30 disabled:pointer-events-none disabled:opacity-50";

	const variantClass =
		variant === "primary"
			? "text-white bg-wayfare-primary hover:bg-wayfare-primary-hover"
			: variant === "secondary"
				? "border border-wayfare-line bg-transparent text-wayfare-text"
				: "border border-wayfare-primary bg-transparent text-wayfare-primary";

	return (
		<button
			type="button"
			suppressHydrationWarning
			disabled={disabled || loading}
			className={[base, variantClass, fluid ? "w-full" : "", className]
				.filter(Boolean)
				.join(" ")}
			style={style}
			{...props}
		>
			{loading && <Spinner />}
			{children}
		</button>
	);
}
