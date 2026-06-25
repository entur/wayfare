import {
	ValidationErrorIcon,
	ValidationInfoIcon,
	WarningIcon,
} from "@entur/icons";
import {
	delayMinutes,
	formatClock,
	formatRelativeMinutes,
} from "../../lib/departure-time";
import { pickText, severityRank } from "../../lib/situations";
import { getTransportColor } from "../../lib/transport-colors";
import type { EstimatedCall } from "../../types/departures";
import type { PtSituationElement } from "../../types/situations";
import type { OtpTransportMode } from "../../types/trip-planner";
import DepartureStatusDot, {
	resolveStatus,
	type Status,
} from "./DepartureStatusDot";
import { useResolvedTheme } from "./theme";

interface Props {
	call: EstimatedCall;
	now?: Date;
	selectedJourneyId?: string | null;
	onSelectDeparture?: (call: EstimatedCall) => void;
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

type SituationTier = "info" | "warning" | "error";

function situationTier(top: PtSituationElement): SituationTier {
	const rank = severityRank(top.severity);
	if (rank >= 4) return "error";
	if (rank >= 3) return "warning";
	return "info";
}

const TIER_ICON = {
	info: ValidationInfoIcon,
	warning: WarningIcon,
	error: ValidationErrorIcon,
} as const;

const TIER_COLOR = {
	info: "text-wayfare-alert-info-border",
	warning: "text-wayfare-alert-warning-border",
	error: "text-wayfare-alert-error-border",
} as const;

const TIER_BG = {
	info: "border-l-4 border-l-wayfare-alert-info-border bg-wayfare-alert-info-bg text-wayfare-alert-info-text",
	warning:
		"border-l-4 border-l-wayfare-alert-warning-border bg-wayfare-alert-warning-bg text-wayfare-alert-warning-text",
	error:
		"border-l-4 border-l-wayfare-alert-error-border bg-wayfare-alert-error-bg text-wayfare-alert-error-text",
} as const;

const STATUS_TEXT_CLASS: Record<Status, string> = {
	scheduled: "text-wayfare-text",
	"on-time": "text-wayfare-text",
	"delayed-low": "text-yellow-600 dark:text-yellow-400",
	"delayed-mid": "text-orange-600 dark:text-orange-400",
	"delayed-high": "text-red-600 dark:text-red-400",
	cancelled: "text-red-600 dark:text-red-400",
};

export default function DepartureRow({
	call,
	now,
	selectedJourneyId,
	onSelectDeparture,
}: Props) {
	const theme = useResolvedTheme();
	const line = call.serviceJourney?.line;
	const serviceJourneyId = call.serviceJourney?.id;
	const isSelected = !!(
		serviceJourneyId && serviceJourneyId === selectedJourneyId
	);
	const delay = delayMinutes(call);
	const status = resolveStatus(delay, call.cancellation, call.realtime);
	const timeColour = STATUS_TEXT_CLASS[status];
	const isDelayed = delay !== 0;
	const destination = call.destinationDisplay?.frontText ?? "";
	const bullet = line?.publicCode ?? "•";
	const mode = (line?.transportMode?.toLowerCase() ??
		"bus") as OtpTransportMode;
	const bg = getTransportColor(mode, theme);
	const fg = "#ffffff";

	const top = topSituation(call.situations);
	const tier = top ? situationTier(top) : null;
	const SituationIcon = tier ? TIER_ICON[tier] : null;
	const summary = top ? pickText(top.summary) : null;
	const description = top ? pickText(top.description) : null;
	const advice = top ? pickText(top.advice) : null;

	const hasSituation = !!(top && tier && summary);
	const canSelect = !!(serviceJourneyId && onSelectDeparture);

	const handleRowClick = () => {
		if (canSelect) onSelectDeparture(call);
	};

	return (
		<li className={call.cancellation ? "opacity-60" : ""}>
			<div
				className={`flex items-center gap-1 py-2 transition-colors ${
					isSelected ? "rounded-md bg-wayfare-bg" : ""
				}`}
			>
				<button
					type="button"
					disabled={!canSelect}
					onClick={canSelect ? handleRowClick : undefined}
					aria-pressed={canSelect ? isSelected : undefined}
					className={`flex flex-1 items-center gap-3 text-left disabled:opacity-100 ${
						call.cancellation ? "line-through" : ""
					} ${canSelect ? "cursor-pointer" : "cursor-default"}`}
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
				</button>
				{hasSituation && SituationIcon && tier && (
					<span aria-hidden className={`shrink-0 px-1 ${TIER_COLOR[tier]}`}>
						<SituationIcon className="h-4 w-4" />
					</span>
				)}
			</div>
			{hasSituation && top && tier && summary && (
				<div className={`mb-2 rounded-md px-3 py-2 text-xs ${TIER_BG[tier]}`}>
					<p className="font-medium">{summary}</p>
					{description && description !== summary && (
						<p className="mt-1 opacity-90">{description}</p>
					)}
					{advice && <p className="mt-1 italic opacity-90">{advice}</p>}
					{top.infoLinks?.map((link) => (
						<a
							key={link.uri}
							href={link.uri}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-1 block underline underline-offset-2"
						>
							{link.label ?? link.uri}
						</a>
					))}
				</div>
			)}
		</li>
	);
}
