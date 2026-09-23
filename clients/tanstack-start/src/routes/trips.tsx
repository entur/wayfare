import { BackArrowIcon, RouteIcon } from "@entur/icons";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/layout/PageShell";
import DateTimePicker from "../components/search/DateTimePicker";
import FavoriteToggle from "../components/search/FavoriteToggle";
import TravelerPicker from "../components/search/TravelerPicker";
import TripFilterPanel from "../components/search/TripFilterPanel";
import TripResults from "../components/search/TripResults";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useDevConfig } from "../context/dev-config";
import { useProfile } from "../context/profile";
import type { TimeMode, TravelerGroup } from "../context/search-form";
import { useTripPlanner } from "../hooks/use-trip-planner";
import { buildRequest } from "../lib/build-request";
import {
	buildOfferQuery,
	extractOfferPreview,
	type OfferPreview,
	offerQueryKey,
} from "../lib/offer-query";
import { getDefaultTripModes } from "../lib/preferences-storage";
import { writeSearchSession } from "../lib/search-session";
import {
	filtersFromSearch,
	isDefaultFilters,
	parseTripFilterSearch,
	searchFromFilters,
	type TransportModeGroup,
	type TripFilters,
} from "../lib/trip-filters";
import {
	readTripSearchParams,
	type TripSearchParams,
	writeTripSearchParams,
} from "../lib/trip-session";
import type { OfferCollection } from "../types/search";
import type { TripPattern } from "../types/trip-planner";

export const Route = createFileRoute("/trips")({
	validateSearch: parseTripFilterSearch,
	component: TripsPage,
});

// The stored search keeps a resolved ISO instant; the picker speaks a local
// YYYY-MM-DDTHH:mm string. Convert to local for the picker's value.
function isoToLocalInput(iso: string): string {
	const d = new Date(iso);
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d.toISOString().slice(0, 16);
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
			className={`flex h-full items-center justify-between gap-3 rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-3 py-2.5 text-sm text-wayfare-text${className ? ` ${className}` : ""}`}
		>
			<span>{children}</span>
			<Icon
				aria-hidden="true"
				// @ts-expect-error - className prop accepted at runtime
				className="shrink-0 text-wayfare-primary"
			/>
		</div>
	);
}

function TripsPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [params, setParams] = useState<TripSearchParams | null>(null);
	// Read after mount so the first client render matches SSR.
	const [defaultModes, setDefaultModes] = useState<
		TransportModeGroup[] | undefined
	>(undefined);
	const search = Route.useSearch();
	const filters = useMemo(
		() => filtersFromSearch(search, defaultModes),
		[search, defaultModes],
	);
	const tripQuery = useTripPlanner(params, filters);
	const { overrides } = useDevConfig();
	const { customer } = useProfile();

	useEffect(() => {
		setDefaultModes(getDefaultTripModes());
	}, []);

	const [selectingPatternKey, setSelectingPatternKey] = useState<string | null>(
		null,
	);
	const [offerPreviews, setOfferPreviews] = useState<
		Map<string, OfferPreview | "loading" | "empty" | "error">
	>(new Map());

	// biome-ignore lint/correctness/useExhaustiveDependencies: session state is loaded once after hydration
	useEffect(() => {
		const storedParams = readTripSearchParams();
		if (!storedParams) {
			navigate({ to: "/" });
			return;
		}
		setParams(storedParams);
	}, []);

	// Persist edited search params so a reload or back/forward keeps them.
	useEffect(() => {
		if (params) writeTripSearchParams(params);
	}, [params]);

	// Prefetch offers for all transit patterns as soon as trip results arrive,
	// and again when the traveler mix changes (offer prices depend on it).
	// biome-ignore lint/correctness/useExhaustiveDependencies: queryClient/overrides are stable for the session
	useEffect(() => {
		if (!tripQuery.patterns || !params) return;
		const transitPatterns = tripQuery.patterns.filter((p) =>
			p.legs.some((l) => l.serviceJourney != null),
		);

		for (const pattern of transitPatterns) {
			const query = buildOfferQuery(
				pattern,
				params.travelers,
				overrides.recommendationControl,
				true,
			);
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
	}, [tripQuery.patterns, params?.travelers]);

	if (!params) return null;

	function setFilters(next: TripFilters) {
		navigate({
			to: "/trips",
			search: searchFromFilters(next, defaultModes),
			replace: true,
		});
	}

	// Edits from the summary controls re-run the search: the trip query re-keys on
	// dateTime/timeMode, travelers drive offer prefetch. Functional updates so a
	// picker committing mode then value composes correctly.
	function updateParams(update: (prev: TripSearchParams) => TripSearchParams) {
		setParams((prev) => (prev ? update(prev) : prev));
	}

	function handleTravelDateChange(value: string) {
		updateParams((prev) => ({
			...prev,
			dateTime:
				prev.timeMode === "now"
					? new Date().toISOString()
					: new Date(value).toISOString(),
		}));
	}

	function handleTimeModeChange(mode: TimeMode) {
		updateParams((prev) => ({
			...prev,
			timeMode: mode,
			dateTime:
				mode === "now"
					? new Date().toISOString()
					: new Date(isoToLocalInput(prev.dateTime)).toISOString(),
		}));
	}

	function handleTravelersChange(travelers: TravelerGroup[]) {
		updateParams((prev) => ({ ...prev, travelers }));
	}

	async function handleSelectTrip(pattern: TripPattern) {
		if (!params) return;
		const query = buildOfferQuery(
			pattern,
			params.travelers,
			overrides.recommendationControl,
			false,
		);
		const key = query.queryKey.join("|");
		setSelectingPatternKey(key);

		try {
			const result = await queryClient.fetchQuery({ ...query, staleTime: 0 });
			const { profiles, travellers } = buildRequest(params.travelers);
			const legs = pattern.legs
				.filter((l) => l.serviceJourney != null)
				.map((l) => ({ from: l.fromPlace.name, to: l.toPlace.name }));
			writeSearchSession(result as OfferCollection, {
				from: params.from,
				to: params.to,
				travelDate: params.dateTime,
				profiles,
				travellers,
				legs,
				pattern,
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
		const key = offerQueryKey(
			pattern,
			params.travelers,
			overrides.recommendationControl,
		).join("|");
		return offerPreviews.get(key);
	}

	function isPatternSelecting(pattern: TripPattern): boolean {
		if (!params) return false;
		const key = offerQueryKey(
			pattern,
			params.travelers,
			overrides.recommendationControl,
		).join("|");
		return selectingPatternKey === key;
	}

	const fromName = params.from.name ?? params.from.placeId;
	const toName = params.to.name ?? params.to.placeId;

	const patterns = tripQuery.patterns ?? [];
	const hasTransitPatterns = patterns.some((p) =>
		p.legs.some((l) => l.serviceJourney != null),
	);
	const showFilteredEmptyState =
		tripQuery.isSuccess &&
		!hasTransitPatterns &&
		!isDefaultFilters(filters, defaultModes);

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
					<DateTimePicker
						label="When"
						hideLabel
						value={isoToLocalInput(params.dateTime)}
						timeMode={params.timeMode}
						onChange={handleTravelDateChange}
						onModeChange={handleTimeModeChange}
					/>
					<TravelerPicker
						travelers={params.travelers}
						onChange={handleTravelersChange}
						customer={customer}
						hideLabel
					/>
				</div>
			</div>

			<TripFilterPanel
				filters={filters}
				onChange={setFilters}
				onReset={() => navigate({ to: "/trips", search: {}, replace: true })}
				defaultModes={defaultModes}
			/>

			{tripQuery.isPending && (
				<div className="flex items-center gap-2 text-sm text-wayfare-text-secondary">
					<Spinner />
					Finding journeys…
				</div>
			)}

			{tripQuery.error && (
				<p className="rounded-lg bg-wayfare-accent-soft px-3 py-2 text-sm text-wayfare-primary">
					{tripQuery.error.message}
				</p>
			)}

			{tripQuery.isSuccess && showFilteredEmptyState && (
				<div className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-4 py-6 text-center">
					<p className="mb-3 text-sm text-wayfare-text-secondary">
						No journeys match your filters.
					</p>
					<Button
						variant="secondary"
						onClick={() =>
							navigate({ to: "/trips", search: {}, replace: true })
						}
					>
						Reset filters
					</Button>
				</div>
			)}

			{tripQuery.isSuccess && !showFilteredEmptyState && (
				<>
					<TripResults
						patterns={patterns}
						onSelect={handleSelectTrip}
						getPreview={getPatternPreview}
						isSelecting={isPatternSelecting}
						anySelecting={selectingPatternKey != null}
						travelers={params.travelers}
					/>
					{tripQuery.hasNextPage && (
						<div className="mt-4 flex justify-center">
							<Button
								variant="secondary"
								loading={tripQuery.isFetchingNextPage}
								onClick={() => tripQuery.fetchNextPage()}
							>
								Later departures
							</Button>
						</div>
					)}
				</>
			)}
		</PageShell>
	);
}
