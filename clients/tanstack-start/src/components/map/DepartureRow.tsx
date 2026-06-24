import {
	ValidationErrorIcon,
	ValidationInfoIcon,
	WarningIcon,
} from "@entur/icons";
import { delayMinutes, formatRelativeMinutes } from "../../lib/departure-time";
import { pickText, severityRank } from "../../lib/situations";
import type { EstimatedCall } from "../../types/departures";
import type { PtSituationElement } from "../../types/situations";
import DepartureStatusDot, {
	resolveStatus,
	type Status,
} from "./DepartureStatusDot";

interface Props {
	call: EstimatedCall;
	now?: Date;
}

function topSituation(
	situations: PtSituationElement[] | null | undefined,
): PtSituationElement | null {
	if (!situations || situations.length === 0) return null;
	return (
		[...situations].sort(
			(a, b) => severityRank(b.severity) - severityRank(a.severity),
		)[0] ?? null
	);
}

function SituationDot({
	situations,
}: {
	situations: PtSituationElement[] | null | undefined;
}) {
	const top = topSituation(situations);
	if (!top) return null;

	const rank = severityRank(top.severity);
	const label = pickText(top.summary);
	if (!label) return null;

	let Icon = ValidationInfoIcon;
	let colorClass = "text-blue-500";
	if (rank >= 4) {
		Icon = ValidationErrorIcon;
		colorClass = "text-red-500";
	} else if (rank >= 3) {
		Icon = WarningIcon;
		colorClass = "text-yellow-600 dark:text-yellow-400";
	}

	return (
		<span
			role="img"
			title={label}
			aria-label={label}
			className={`shrink-0 ${colorClass}`}
		>
			<Icon aria-hidden className="h-4 w-4" />
		</span>
	);
}

function formatClock(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normaliseColour(raw?: string | null): string | undefined {
	if (!raw) return undefined;
	return raw.startsWith("#") ? raw : `#${raw}`;
}

const STATUS_TEXT_CLASS: Record<Status, string> = {
	scheduled: "text-wayfare-text",
	"on-time": "text-wayfare-text",
	"delayed-low": "text-yellow-600 dark:text-yellow-400",
	"delayed-mid": "text-orange-600 dark:text-orange-400",
	"delayed-high": "text-red-600 dark:text-red-400",
	cancelled: "text-red-600 dark:text-red-400",
};

export default function DepartureRow({ call, now }: Props) {
	const line = call.serviceJourney?.line;
	const delay = delayMinutes(call);
	const status = resolveStatus(delay, call.cancellation, call.realtime);
	const timeColour = STATUS_TEXT_CLASS[status];
	const isDelayed = delay !== 0;
	const destination = call.destinationDisplay?.frontText ?? "";
	const bullet = line?.publicCode ?? "•";
	const bg = normaliseColour(line?.presentation?.colour) ?? "#374151";
	const fg = normaliseColour(line?.presentation?.textColour) ?? "#ffffff";

	return (
		<li
			className={`flex items-center gap-3 py-2 ${
				call.cancellation ? "line-through opacity-60" : ""
			}`}
		>
			<span
				className="inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums"
				style={{ backgroundColor: bg, color: fg }}
			>
				{bullet}
			</span>
			<span className="flex-1 truncate text-sm text-wayfare-text">
				{destination}
			</span>
			<SituationDot situations={call.situations} />
			<div className="flex flex-col items-end leading-tight">
				<span className={`font-mono text-sm tabular-nums ${timeColour}`}>
					{formatClock(call.expectedDepartureTime)}
				</span>
				{isDelayed && !call.cancellation && (
					<span className="font-mono text-[10px] tabular-nums text-wayfare-text-secondary line-through">
						{formatClock(call.aimedDepartureTime)}
					</span>
				)}
				<span className="text-[10px] text-wayfare-text-secondary">
					{formatRelativeMinutes(call.expectedDepartureTime, now)}
				</span>
			</div>
			<DepartureStatusDot
				delayMinutes={delay}
				cancelled={call.cancellation}
				realtime={call.realtime}
			/>
		</li>
	);
}
