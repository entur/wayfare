interface Props {
	delayMinutes: number;
	cancelled: boolean;
	realtime: boolean;
}

export default function DelayChip({
	delayMinutes,
	cancelled,
	realtime,
}: Props) {
	if (cancelled) {
		return (
			<span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
				Cancelled
			</span>
		);
	}

	if (!realtime) {
		return (
			<span className="inline-flex items-center rounded-full bg-wayfare-bg px-2 py-0.5 text-xs font-medium text-wayfare-text-secondary">
				Scheduled
			</span>
		);
	}

	if (delayMinutes === 0) {
		return (
			<span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
				On time
			</span>
		);
	}

	const sign = delayMinutes > 0 ? "+" : "";
	const positive = delayMinutes > 0;
	const colour = positive
		? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
		: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300";
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colour}`}
		>
			{sign}
			{delayMinutes} min
		</span>
	);
}
