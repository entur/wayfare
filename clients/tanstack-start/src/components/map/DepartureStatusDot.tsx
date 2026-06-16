interface Props {
	delayMinutes: number;
	cancelled: boolean;
	realtime: boolean;
}

type Status =
	| "scheduled"
	| "on-time"
	| "delayed-low"
	| "delayed-mid"
	| "delayed-high"
	| "cancelled";

function resolveStatus(
	delayMinutes: number,
	cancelled: boolean,
	realtime: boolean,
): Status {
	if (cancelled) return "cancelled";
	if (!realtime) return "scheduled";
	if (delayMinutes >= 10) return "delayed-high";
	if (delayMinutes >= 5) return "delayed-mid";
	if (delayMinutes >= 1) return "delayed-low";
	return "on-time";
}

function statusLabel(status: Status, delayMinutes: number): string {
	switch (status) {
		case "cancelled":
			return "Cancelled";
		case "scheduled":
			return "Scheduled";
		case "on-time":
			return "On time";
		default:
			return `${delayMinutes} min late`;
	}
}

const DOT_COLOUR: Record<Status, string> = {
	scheduled: "bg-gray-400",
	"on-time": "bg-emerald-500",
	"delayed-low": "bg-yellow-400",
	"delayed-mid": "bg-orange-500",
	"delayed-high": "bg-red-500",
	cancelled: "bg-red-500",
};

const RING_COLOUR: Record<Status, string> = {
	scheduled: "bg-gray-400",
	"on-time": "bg-emerald-500",
	"delayed-low": "bg-yellow-400",
	"delayed-mid": "bg-orange-500",
	"delayed-high": "bg-red-500",
	cancelled: "bg-red-500",
};

export default function DepartureStatusDot({
	delayMinutes,
	cancelled,
	realtime,
}: Props) {
	const status = resolveStatus(delayMinutes, cancelled, realtime);
	const animate = status !== "scheduled";
	return (
		<span
			role="status"
			data-status={status}
			aria-label={statusLabel(status, delayMinutes)}
			className="relative inline-flex h-2 w-2 shrink-0"
		>
			{animate && (
				<span
					className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${RING_COLOUR[status]}`}
				/>
			)}
			<span
				className={`relative inline-flex h-2 w-2 rounded-full ${DOT_COLOUR[status]}`}
			/>
		</span>
	);
}
