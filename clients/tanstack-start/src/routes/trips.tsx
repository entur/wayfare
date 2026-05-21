import { BackArrowIcon, DateIcon, RouteIcon, UsersIcon } from "@entur/icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import PageShell from "../components/layout/PageShell";
import TripResults from "../components/search/TripResults";
import Button from "../components/ui/Button";
import type { TimeMode, TravelerGroup } from "../context/search-form";
import { useSearchOffers } from "../hooks/use-search-offers";
import { useTripPlanner } from "../hooks/use-trip-planner";
import { buildRequest } from "../lib/build-request";
import { writeSearchSession } from "../lib/search-session";
import { readTripSearchParams } from "../lib/trip-session";
import type { TripPatternLeg } from "../types/search";
import type { TripPattern } from "../types/trip-planner";

export const Route = createFileRoute("/trips")({ component: TripsPage });

const AGE_GROUP_LABELS: Record<TravelerGroup["ageGroup"], [string, string]> = {
	ADULT: ["adult", "adults"],
	CHILD: ["child", "children"],
	YOUTH: ["youth", "youths"],
	SENIOR: ["senior", "seniors"],
	INFANT: ["infant", "infants"],
	STUDENT: ["student", "students"],
	MILITARY: ["military", "military"],
};

function formatTravelers(travelers: TravelerGroup[]): string {
	const parts = travelers
		.filter((t) => t.count > 0)
		.map((t) => {
			const [singular, plural] = AGE_GROUP_LABELS[t.ageGroup];
			return `${t.count} ${t.count === 1 ? singular : plural}`;
		});
	return parts.join(", ") || "1 adult";
}

function formatDateTime(dateTime: string, timeMode: TimeMode): string {
	if (timeMode === "now") return "Now";
	const date = new Date(dateTime);
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const time = date.toLocaleTimeString("no-NO", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	if (date.toDateString() === today.toDateString()) return `Today ${time}`;
	if (date.toDateString() === tomorrow.toDateString())
		return `Tomorrow ${time}`;
	return (
		date.toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
		}) +
		" " +
		time
	);
}

function SummaryChip({
	icon: Icon,
	children,
}: {
	icon: React.ComponentType;
	children: React.ReactNode;
}) {
	return (
		<div
			className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
			style={{
				background: "var(--wayfare-surface-strong)",
				borderColor: "var(--wayfare-line)",
				color: "var(--wayfare-text)",
			}}
		>
			<span className="truncate">{children}</span>
			<Icon
				aria-hidden="true"
				// @ts-expect-error - style prop accepted at runtime
				style={{ color: "var(--wayfare-primary)", flexShrink: 0 }}
			/>
		</div>
	);
}

function TripsPage() {
	const navigate = useNavigate();
	const params = readTripSearchParams();
	const planTrip = useTripPlanner();
	const { mutateAsync, isPending, error: offerError } = useSearchOffers();

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount with session params
	useEffect(() => {
		if (!params) {
			navigate({ to: "/" });
			return;
		}
		planTrip.mutate({
			from: params.from,
			to: params.to,
			dateTime: params.dateTime,
		});
	}, []);

	if (!params) return null;

	async function handleSelectTrip(pattern: TripPattern) {
		if (!params) return;
		const { profiles, travellers } = buildRequest(params.travelers);

		const omsaPattern: TripPatternLeg[] = pattern.legs.flatMap((leg) => {
			if (!leg.serviceJourney) return [];
			const entry: TripPatternLeg = {
				serviceJourney: leg.serviceJourney.id,
				date: leg.expectedStartTime.slice(0, 10),
			};
			const fromStopId = leg.fromPlace.quay?.stopPlace?.id;
			const toStopId = leg.toPlace.quay?.stopPlace?.id;
			if (fromStopId)
				entry.from = { placeId: fromStopId, name: leg.fromPlace.name };
			if (toStopId) entry.to = { placeId: toStopId, name: leg.toPlace.name };
			return [entry];
		});

		if (omsaPattern.length === 0) return;

		const result = await mutateAsync({
			inputs: {
				type: "search_offer",
				...(profiles.length > 0 ? { profiles } : {}),
				...(travellers.length > 0 ? { travellers } : {}),
				pattern: omsaPattern,
			},
		});

		writeSearchSession(result, {
			from: params.from,
			to: params.to,
			travelDate: params.dateTime,
			profiles,
			travellers,
		});
		navigate({ to: "/offers" });
	}

	const fromName = params.from.name ?? params.from.placeId;
	const toName = params.to.name ?? params.to.placeId;

	return (
		<PageShell>
			<Button
				variant="secondary"
				className="mb-6"
				onClick={() => navigate({ to: "/" })}
			>
				<BackArrowIcon aria-hidden="true" />
				Back
			</Button>

			<div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<SummaryChip icon={RouteIcon}>
					{fromName} → {toName}
				</SummaryChip>
				<SummaryChip icon={DateIcon}>
					{formatDateTime(params.dateTime, params.timeMode)}
				</SummaryChip>
				<SummaryChip icon={UsersIcon}>
					{formatTravelers(params.travelers)}
				</SummaryChip>
			</div>

			{planTrip.isPending && (
				<div
					className="flex items-center gap-2 text-sm"
					style={{ color: "var(--wayfare-text-secondary)" }}
				>
					<svg
						className="h-4 w-4 animate-spin"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					Finding journeys…
				</div>
			)}

			{(planTrip.error || offerError) && (
				<p
					className="rounded-lg px-3 py-2 text-sm"
					style={{
						background: "rgba(233,0,55,0.08)",
						color: "var(--wayfare-primary)",
					}}
				>
					{(planTrip.error ?? offerError)?.message}
				</p>
			)}

			{planTrip.data != null && (
				<TripResults
					patterns={planTrip.data}
					onSelect={handleSelectTrip}
					isPending={isPending}
				/>
			)}
		</PageShell>
	);
}
