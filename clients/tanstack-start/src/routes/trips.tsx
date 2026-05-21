import { BackArrowIcon, DateIcon, RouteIcon, UsersIcon } from "@entur/icons";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import FavoriteToggle from "../components/search/FavoriteToggle";
import TripResults from "../components/search/TripResults";
import Button from "../components/ui/Button";
import type { TimeMode, TravelerGroup } from "../context/search-form";
import { useTripPlanner } from "../hooks/use-trip-planner";
import { buildRequest } from "../lib/build-request";
import {
	buildOfferQuery,
	extractOfferPreview,
	type OfferPreview,
	offerQueryKey,
} from "../lib/offer-query";
import { writeSearchSession } from "../lib/search-session";
import { readTripSearchParams } from "../lib/trip-session";
import type { OfferCollection } from "../types/search";
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
	className,
}: {
	icon: React.ComponentType;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex h-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm${className ? ` ${className}` : ""}`}
			style={{
				background: "var(--wayfare-surface-strong)",
				borderColor: "var(--wayfare-line)",
				color: "var(--wayfare-text)",
			}}
		>
			<span>{children}</span>
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
	const queryClient = useQueryClient();
	const params = readTripSearchParams();
	const planTrip = useTripPlanner();

	const [selectingPatternKey, setSelectingPatternKey] = useState<string | null>(
		null,
	);
	const [offerPreviews, setOfferPreviews] = useState<
		Map<string, OfferPreview | "loading" | "empty" | "error">
	>(new Map());

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

	// Prefetch offers for all transit patterns as soon as trip results arrive
	// biome-ignore lint/correctness/useExhaustiveDependencies: params and queryClient are stable for the session
	useEffect(() => {
		if (!planTrip.data || !params) return;
		const transitPatterns = planTrip.data.filter((p) =>
			p.legs.some((l) => l.serviceJourney != null),
		);

		for (const pattern of transitPatterns) {
			const query = buildOfferQuery(pattern, params.travelers);
			const key = query.queryKey.join("|");

			setOfferPreviews((prev) => {
				if (prev.has(key)) return prev;
				const next = new Map(prev);
				next.set(key, "loading");
				return next;
			});

			queryClient
				.fetchQuery(query)
				.then((collection) => {
					const preview = extractOfferPreview(collection, query._legCount);
					setOfferPreviews((prev) => {
						const next = new Map(prev);
						next.set(key, preview ?? "empty");
						return next;
					});
				})
				.catch(() => {
					setOfferPreviews((prev) => {
						const next = new Map(prev);
						next.set(key, "error");
						return next;
					});
				});
		}
	}, [planTrip.data]);

	if (!params) return null;

	async function handleSelectTrip(pattern: TripPattern) {
		if (!params) return;
		const query = buildOfferQuery(pattern, params.travelers);
		const key = query.queryKey.join("|");
		setSelectingPatternKey(key);

		try {
			const result = await queryClient.fetchQuery(query);
			const { profiles, travellers } = buildRequest(params.travelers);
			writeSearchSession(result as OfferCollection, {
				from: params.from,
				to: params.to,
				travelDate: params.dateTime,
				profiles,
				travellers,
			});
			navigate({ to: "/offers" });
		} finally {
			setSelectingPatternKey(null);
		}
	}

	function getPatternPreview(
		pattern: TripPattern,
	): OfferPreview | "loading" | "empty" | "error" | undefined {
		if (!params) return undefined;
		const key = offerQueryKey(pattern, params.travelers).join("|");
		return offerPreviews.get(key);
	}

	function isPatternSelecting(pattern: TripPattern): boolean {
		if (!params) return false;
		const key = offerQueryKey(pattern, params.travelers).join("|");
		return selectingPatternKey === key;
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

			<div className="mb-6">
				<div className="mb-1.5 flex justify-end">
					<FavoriteToggle from={params.from} to={params.to} variant="text" />
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<SummaryChip icon={RouteIcon} className="min-w-0">
						{fromName} → {toName}
					</SummaryChip>
					<SummaryChip icon={DateIcon}>
						{formatDateTime(params.dateTime, params.timeMode)}
					</SummaryChip>
					<SummaryChip icon={UsersIcon}>
						{formatTravelers(params.travelers)}
					</SummaryChip>
				</div>
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

			{planTrip.error && (
				<p
					className="rounded-lg px-3 py-2 text-sm"
					style={{
						background: "rgba(233,0,55,0.08)",
						color: "var(--wayfare-primary)",
					}}
				>
					{planTrip.error.message}
				</p>
			)}

			{planTrip.data != null && (
				<TripResults
					patterns={planTrip.data}
					onSelect={handleSelectTrip}
					getPreview={getPatternPreview}
					isSelecting={isPatternSelecting}
					anySelecting={selectingPatternKey != null}
					travelers={params.travelers}
				/>
			)}
		</PageShell>
	);
}
