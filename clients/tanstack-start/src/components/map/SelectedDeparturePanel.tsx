import { useMemo } from "react";
import { useServiceJourneyRoute } from "../../hooks/use-service-journey-route";
import { useVehiclePosition } from "../../hooks/use-vehicle-position";
import { formatClock } from "../../lib/departure-time";
import { getTransportColor } from "../../lib/transport-colors";
import type { PtSituationElement } from "../../types/situations";
import type { OtpTransportMode } from "../../types/trip-planner";
import type { ServiceJourneyStop } from "../../types/vehicles";
import SituationBanner from "../situations/SituationBanner";
import { useResolvedTheme } from "./theme";

interface Props {
	serviceJourneyId: string;
	mode: OtpTransportMode;
	lineName?: string;
	destination?: string;
	situations?: PtSituationElement[];
	onBack: () => void;
}

interface StopTime {
	primary: string;
	aimed: string | null; // non-null when realtime-delayed; render struck-through
	delayClass: string | null; // Tailwind color class for the primary time when delayed
}

function delayColorClass(delayMins: number): string {
	if (delayMins <= 2) return "text-yellow-500 dark:text-yellow-400";
	if (delayMins <= 5) return "text-orange-500 dark:text-orange-400";
	return "text-red-500 dark:text-red-400";
}

function getStopTime(stop: ServiceJourneyStop, now: number): StopTime | null {
	const expectedIso = stop.expectedDepartureTime ?? stop.expectedArrivalTime;
	const aimedIso = stop.aimedDepartureTime ?? stop.aimedArrivalTime;
	const displayIso = expectedIso ?? aimedIso;
	if (!displayIso) return null;

	const expectedMs = expectedIso ? Date.parse(expectedIso) : null;
	const aimedMs = aimedIso ? Date.parse(aimedIso) : null;

	const delayMins =
		expectedMs !== null && aimedMs !== null
			? Math.round((expectedMs - aimedMs) / 60_000)
			: 0;
	const isDelayed = stop.realtime === true && delayMins >= 1;

	let primary: string;
	if (expectedMs !== null) {
		const diffMs = expectedMs - now;
		if (diffMs >= 0 && diffMs < 60_000) {
			primary = "Now";
		} else if (diffMs >= 60_000 && diffMs <= 15 * 60_000) {
			primary = `${Math.round(diffMs / 60_000)} min`;
		} else {
			primary = formatClock(displayIso);
		}
	} else {
		primary = formatClock(displayIso);
	}

	const aimed = isDelayed && aimedIso ? formatClock(aimedIso) : null;
	const delayClass = isDelayed ? delayColorClass(delayMins) : null;
	return { primary, aimed, delayClass };
}

function isPassed(stop: ServiceJourneyStop, now: number): boolean {
	if (stop.actualDepartureTime) return true;
	const expected =
		stop.expectedDepartureTime ??
		stop.expectedArrivalTime ??
		stop.aimedDepartureTime ??
		stop.aimedArrivalTime;
	if (!expected) return false;
	return Date.parse(expected) < now;
}

export default function SelectedDeparturePanel({
	serviceJourneyId,
	mode,
	lineName,
	destination,
	situations,
	onBack,
}: Props) {
	const theme = useResolvedTheme();
	const color = getTransportColor(mode, theme);
	const route = useServiceJourneyRoute(serviceJourneyId);
	const position = useVehiclePosition(serviceJourneyId);

	const now = Date.now();

	const stops = route.data?.stops ?? [];

	// Index of the first stop that has not yet been passed — the "current" stop
	const currentIndex = useMemo(() => {
		if (!stops.length) return null;
		const firstUpcoming = stops.findIndex((s) => !isPassed(s, now));
		return firstUpcoming === -1 ? null : firstUpcoming;
	}, [stops, now]);

	return (
		<div className="flex flex-col gap-3">
			{/* Header */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onBack}
					aria-label="Back to departures"
					className="shrink-0 rounded-md p-1 text-wayfare-text-secondary hover:bg-wayfare-bg"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M12 15L7 10L12 5"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
				{lineName && (
					<span
						className="inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-sm font-semibold"
						style={{ backgroundColor: color, color: "#fff" }}
					>
						{lineName}
					</span>
				)}
				<span className="flex-1 truncate text-sm font-medium text-wayfare-text">
					{destination ?? ""}
				</span>
			</div>

			{/* Always-visible situations */}
			{situations && situations.length > 0 && (
				<SituationBanner situations={situations} />
			)}

			{/* Route timeline */}
			{route.isLoading && (
				<p className="text-center text-sm text-wayfare-text-secondary">
					Loading route…
				</p>
			)}

			{route.isError && (
				<p className="text-center text-sm text-red-600">Could not load route</p>
			)}

			{!route.isLoading && stops.length > 0 && (
				<div className="relative">
					{/* Vertical rail */}
					<div
						className="absolute left-[9px] top-3 bottom-3 w-0.5"
						style={{ backgroundColor: color, opacity: 0.25 }}
					/>
					<ul className="flex flex-col">
						{stops.map((stop, i) => {
							const passed = isPassed(stop, now);
							const isCurrent = currentIndex === i;
							const stopTime = getStopTime(stop, now);

							return (
								<li
									key={stop.quayId ?? `${stop.name}-${i}`}
									className="flex items-center gap-3 py-1.5"
								>
									{/* Dot */}
									<span className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center">
										{isCurrent ? (
											<span
												className="flex h-5 w-5 items-center justify-center rounded-full"
												style={{ backgroundColor: color }}
											>
												<span className="h-2 w-2 rounded-full bg-white" />
											</span>
										) : (
											<span
												className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
													passed
														? "bg-wayfare-bg border-wayfare-line"
														: "bg-wayfare-surface"
												}`}
												style={passed ? undefined : { borderColor: color }}
											/>
										)}
									</span>

									{/* Label */}
									<span
										className={`flex-1 text-sm ${
											isCurrent
												? "font-semibold"
												: passed
													? "opacity-40 text-wayfare-text-secondary"
													: "text-wayfare-text"
										}`}
										style={isCurrent ? { color } : undefined}
									>
										{stop.name}
									</span>

									{/* Time */}
									{stopTime && (
										<span className="shrink-0 text-right font-mono text-xs tabular-nums">
											{stopTime.aimed && (
												<span className="block opacity-40 line-through text-wayfare-text-secondary">
													{stopTime.aimed}
												</span>
											)}
											<span
												className={
													passed
														? "opacity-40 text-wayfare-text-secondary"
														: isCurrent
															? `font-semibold ${stopTime.delayClass ?? ""}`
															: (stopTime.delayClass ??
																"text-wayfare-text-secondary")
												}
												style={
													isCurrent && !stopTime.delayClass
														? { color }
														: undefined
												}
											>
												{stopTime.primary}
											</span>
										</span>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			)}

			{!route.isLoading && !route.isError && stops.length === 0 && (
				<p className="text-center text-sm text-wayfare-text-secondary">
					No stop information available
				</p>
			)}

			{/* Live position note */}
			{position.data && (
				<p className="text-right text-[10px] text-wayfare-text-secondary">
					Live position · updates every 10 s
				</p>
			)}
		</div>
	);
}
