import type { CSSProperties } from "react";

interface PageShellProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	contentClassName?: string;
	/**
	 * Colour for the ambient page washes, top-left and bottom-right. Pass an rgba
	 * with low alpha; the gradients spread wide, so a value that looks right as a
	 * solid will be far too strong here.
	 */
	wash?: string;
}

export default function PageShell({
	children,
	title,
	subtitle,
	contentClassName,
	wash,
}: PageShellProps) {
	return (
		<main className="page-wrap relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
			{/* First in DOM order and positioned, so the content below paints over
			    it without needing z-index. See .page-wash in styles.css. */}
			{wash && (
				<div
					aria-hidden="true"
					className="page-wash"
					style={{ "--page-wash-color": wash } as CSSProperties}
				/>
			)}
			<div className={`relative ${contentClassName ?? ""}`}>
				{(title || subtitle) && (
					<div className="mb-6">
						{title && (
							<h1 className="text-2xl font-bold text-wayfare-text">{title}</h1>
						)}
						{subtitle && (
							<p className="mt-1 text-sm text-wayfare-text-secondary">
								{subtitle}
							</p>
						)}
					</div>
				)}
				{children}
			</div>
		</main>
	);
}
