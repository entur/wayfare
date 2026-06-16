import { delayMinutes, formatRelativeMinutes } from "../../lib/departure-time";
import type { EstimatedCall } from "../../types/departures";
import DelayChip from "./DelayChip";

interface Props {
	call: EstimatedCall;
	now?: Date;
}

function formatClock(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normaliseColour(raw?: string | null): string | undefined {
	if (!raw) return undefined;
	return raw.startsWith("#") ? raw : `#${raw}`;
}

export default function DepartureRow({ call, now }: Props) {
	const line = call.serviceJourney?.line;
	const delay = delayMinutes(call);
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
			<div className="flex flex-col items-end leading-tight">
				<span className="font-mono text-sm tabular-nums text-wayfare-text">
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
			<DelayChip
				delayMinutes={delay}
				cancelled={call.cancellation}
				realtime={call.realtime}
			/>
		</li>
	);
}
