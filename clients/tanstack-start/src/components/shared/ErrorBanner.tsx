interface ErrorBannerProps {
	message: string;
	onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
	return (
		<div
			className="flex items-start justify-between gap-3 rounded-lg px-4 py-3"
			role="alert"
			style={{
				background: "rgba(233,0,55,0.08)",
				border: "1px solid rgba(233,0,55,0.2)",
			}}
		>
			<p
				className="text-sm"
				style={{ color: "var(--color-wayfare-primary)", margin: 0 }}
			>
				{message}
			</p>
			{onDismiss && (
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors"
					style={{
						borderColor: "var(--color-wayfare-line)",
						color: "var(--color-wayfare-text-secondary)",
						background: "transparent",
					}}
				>
					×
				</button>
			)}
		</div>
	);
}
