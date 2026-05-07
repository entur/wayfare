import type { ButtonHTMLAttributes } from "react";

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
		"inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

	let variantClass = "";
	let variantStyle: React.CSSProperties = {};

	if (variant === "primary") {
		variantClass = "text-white";
		variantStyle = {
			background: "var(--wayfare-primary)",
		};
	} else if (variant === "secondary") {
		variantClass = "border bg-transparent";
		variantStyle = {
			color: "var(--wayfare-text)",
			borderColor: "var(--wayfare-line)",
		};
	} else if (variant === "negative") {
		variantClass = "border bg-transparent";
		variantStyle = {
			color: "var(--wayfare-primary)",
			borderColor: "var(--wayfare-primary)",
		};
	}

	return (
		<button
			type="button"
			suppressHydrationWarning
			disabled={disabled || loading}
			className={[base, variantClass, fluid ? "w-full" : "", className]
				.filter(Boolean)
				.join(" ")}
			style={{ ...variantStyle, ...style }}
			{...props}
		>
			{loading && (
				<svg
					className="h-4 w-4 animate-spin"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
			)}
			{children}
		</button>
	);
}
