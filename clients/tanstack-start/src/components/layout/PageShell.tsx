import type { CSSProperties } from "react";

export interface PageBanner {
	light: string;
	dark: string;
}

interface PageShellProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	contentClassName?: string;
	/** Theme-specific colours for the corner banners. */
	banner?: PageBanner;
	stepper?: React.ReactNode;
	rightRail?: React.ReactNode;
}

function CornerBanner({ position }: { position: "start" | "end" }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 100 100"
			className={`page-banner page-banner--${position}`}
		>
			<polygon points="0,92 92,0 58,0 0,58" />
			<polygon points="0,44 44,0 30,0 0,30" opacity="0.5" />
		</svg>
	);
}

export default function PageShell({
	children,
	title,
	subtitle,
	contentClassName,
	banner,
	stepper,
	rightRail,
}: PageShellProps) {
	const header = (title || subtitle) && (
		<div className="mb-6">
			{title && (
				<h1 className="text-2xl font-bold text-wayfare-text">{title}</h1>
			)}
			{subtitle && (
				<p className="mt-1 text-sm text-wayfare-text-secondary">{subtitle}</p>
			)}
		</div>
	);

	return (
		<main className="page-wrap relative min-h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
			{banner && (
				<div
					className="page-banners"
					style={
						{
							"--page-banner-light": banner.light,
							"--page-banner-dark": banner.dark,
						} as CSSProperties
					}
				>
					<CornerBanner position="start" />
					<CornerBanner position="end" />
				</div>
			)}
			{stepper && <div className="relative mb-8">{stepper}</div>}
			{rightRail ? (
				<div className="relative lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
					<div className={contentClassName}>
						{header}
						{children}
					</div>
					<aside className="mt-8 lg:mt-0">{rightRail}</aside>
				</div>
			) : (
				<div className={`relative ${contentClassName ?? ""}`}>
					{header}
					{children}
				</div>
			)}
		</main>
	);
}
