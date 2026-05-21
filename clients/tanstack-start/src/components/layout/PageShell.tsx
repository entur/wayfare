interface PageShellProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	contentClassName?: string;
}

export default function PageShell({
	children,
	title,
	subtitle,
	contentClassName,
}: PageShellProps) {
	return (
		<main className="page-wrap px-4 py-8">
			<div className={contentClassName}>
				{(title || subtitle) && (
					<div className="mb-6">
						{title && (
							<h1
								className="text-2xl font-bold"
								style={{ color: "var(--wayfare-text)" }}
							>
								{title}
							</h1>
						)}
						{subtitle && (
							<p
								className="mt-1 text-sm"
								style={{ color: "var(--wayfare-text-secondary)" }}
							>
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
