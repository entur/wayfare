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

function displayTime(stop: ServiceJourneyStop): string | null {
	const iso =
		stop.expectedDepartureTime ??
		stop.aimedDepartureTime ??
		stop.expectedArrivalTime ??
		stop.aimedArrivalTime;
	return iso ? formatClock(iso) : null;
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
							const time = displayTime(stop);

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
												? "font-semibold text-wayfare-text"
												: passed
													? "opacity-40 text-wayfare-text-secondary"
													: "text-wayfare-text"
										}`}
									>
										{stop.name}
									</span>

									{/* Time */}
									{time && (
										<span
											className={`shrink-0 font-mono text-xs tabular-nums ${
												isCurrent
													? "font-semibold text-wayfare-text"
													: passed
														? "opacity-40 text-wayfare-text-secondary"
														: "text-wayfare-text-secondary"
											}`}
										>
											{time}
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
