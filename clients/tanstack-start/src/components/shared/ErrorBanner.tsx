interface ErrorBannerProps {
	message: string;
	onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
	return (
		<div
			className="flex items-start justify-between gap-3 rounded-lg border border-wayfare-primary/20 bg-wayfare-accent-soft px-4 py-3"
			role="alert"
		>
			<p className="m-0 text-sm text-wayfare-primary">{message}</p>
			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-wayfare-line bg-transparent text-sm font-semibold text-wayfare-text-secondary transition-colors"
				>
					×
				</button>
			)}
		</div>
	);
}
