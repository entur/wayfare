import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import PageShell from "../components/layout/PageShell";
import LocationSearch from "../components/search/LocationSearch";
import TravelerPicker from "../components/search/TravelerPicker";
import TripResults from "../components/search/TripResults";
import ZoneSearch from "../components/search/ZoneSearch";
import Button from "../components/ui/Button";
import type { TravelerGroup } from "../context/search-form";
import { SearchFormProvider, useSearchForm } from "../context/search-form";
import { useSearchOffers } from "../hooks/use-search-offers";
import { useTripPlanner } from "../hooks/use-trip-planner";
import { writeSearchSession } from "../lib/search-session";
import type { IndividualTraveller, TripPatternLeg, UserProfile } from "../types/search";
import type { TripPattern } from "../types/trip-planner";

export const Route = createFileRoute("/")({ component: SearchPage });

function SearchPage() {
	return (
		<SearchFormProvider>
			<SearchScreen />
		</SearchFormProvider>
	);
}

function buildRequest(travelers: TravelerGroup[]): {
	profiles: UserProfile[];
	travellers: IndividualTraveller[];
} {
	const profiles: UserProfile[] = [];
	const travellers: IndividualTraveller[] = [];

	for (const t of travelers) {
		const entitlementType =
			t.ageGroup === "STUDENT"
				? "STUDENT"
				: t.ageGroup === "MILITARY"
					? "MILITARY"
					: undefined;
		const entitlements = entitlementType
			? { entitlements: { entitlementsGiven: [{ entitlementType }] } }
			: {};
		// STUDENT and MILITARY don't map to a UserProfile ageGroup
		const profileAgeGroup =
			t.ageGroup !== "STUDENT" && t.ageGroup !== "MILITARY"
				? t.ageGroup
				: undefined;

		const named = t.individuals?.filter((i) => i.name || i.age != null) ?? [];

		if (named.length > 0) {
			named.forEach((person, j) => {
				travellers.push({
					id: `${t.id}_${j}`,
					type: "individual_traveller",
					...(person.age != null ? { age: person.age } : {}),
					...(person.name ? { fullName: person.name } : {}),
					...entitlements,
				});
			});
			const unnamedCount = t.count - named.length;
			if (unnamedCount > 0) {
				profiles.push({
					id: `${t.id}_anon`,
					type: "user_profile",
					count: unnamedCount,
					...(profileAgeGroup != null ? { ageGroup: profileAgeGroup } : {}),
					...(t.minAge != null ? { minimumAge: t.minAge } : {}),
					...(t.maxAge != null ? { maximumAge: t.maxAge } : {}),
					...entitlements,
				});
			}
		} else {
			profiles.push({
				id: t.id,
				type: "user_profile",
				count: t.count,
				...(profileAgeGroup != null ? { ageGroup: profileAgeGroup } : {}),
				...(t.minAge != null ? { minimumAge: t.minAge } : {}),
				...(t.maxAge != null ? { maximumAge: t.maxAge } : {}),
				...entitlements,
			});
		}
	}

	return { profiles, travellers };
}

function SearchScreen() {
	const { state, dispatch } = useSearchForm();
	const navigate = useNavigate();
	const { mutateAsync, isPending, error } = useSearchOffers();
	const planTrip = useTripPlanner();

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!state.from || !state.to || state.travelers.length === 0) return;
		const from = state.from;
		const to = state.to;
		const travelDate = state.travelDate;
		const searchType = state.searchType;

		if (searchType === "trip") {
			planTrip.mutate({
				from,
				to,
				dateTime: new Date(travelDate).toISOString(),
			});
			return;
		}

		const { profiles, travellers } = buildRequest(state.travelers);

		const result = await mutateAsync({
			inputs: {
				type: "search_offer",
				...(profiles.length > 0 ? { profiles } : {}),
				...(travellers.length > 0 ? { travellers } : {}),
				specification: {
					from,
					to,
					startTime: new Date(travelDate).toISOString(),
				},
			},
		});

		writeSearchSession(result, {
			from,
			to,
			travelDate,
			searchType,
			profiles,
			travellers,
		});
		navigate({ to: "/offers" });
	}

	async function handleSelectTrip(pattern: TripPattern) {
		if (!state.from || !state.to || state.travelers.length === 0) return;
		const from = state.from;
		const to = state.to;
		const travelDate = state.travelDate;
		const searchType = state.searchType;
		const { profiles, travellers } = buildRequest(state.travelers);

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
			from,
			to,
			travelDate,
			searchType,
			profiles,
			travellers,
		});
		navigate({ to: "/offers" });
	}

	const canSearch = useMemo(
		() => Boolean(state.from && state.to && state.travelers.length > 0),
		[state.from, state.to, state.travelers],
	);

	const dateValue = state.travelDate.slice(0, 10);
	const timeValue =
		state.travelDate.length >= 16 ? state.travelDate.slice(11, 16) : "00:00";
	// Compute minDate client-side only — new Date() during SSR causes hydration mismatch if server/client dates differ
	const minDate = dateValue || undefined;

	function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch({
			type: "SET_TRAVEL_DATE",
			payload: `${e.target.value}T${timeValue}`,
		});
	}

	function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
		dispatch({
			type: "SET_TRAVEL_DATE",
			payload: `${dateValue}T${e.target.value}`,
		});
	}

	return (
		<PageShell
			title="Where are you going?"
			subtitle="Plan your next trip in Norway"
		>
			<form
				onSubmit={handleSearch}
				className="rise-in mx-auto max-w-xl rounded-lg p-6"
				style={{
					background: "var(--wayfare-surface-strong)",
					border: "1px solid var(--wayfare-line)",
				}}
			>
				<div className="flex flex-col gap-4">
					{/* Search type toggle */}
					<fieldset
						className="inline-flex w-full rounded-xl border p-1"
						style={{
							borderColor: "var(--wayfare-line)",
							background: "var(--wayfare-bg)",
						}}
					>
						<legend className="sr-only">Search type</legend>
						{(
							[
								{ value: "zone", label: "Zone to Zone" },
								{ value: "stop", label: "Stop to Stop" },
								{ value: "trip", label: "Trip Planner" },
							] as const
						).map(({ value, label }) => {
							const active = state.searchType === value;
							return (
								<button
									key={value}
									type="button"
									onClick={() =>
										dispatch({ type: "SET_SEARCH_TYPE", payload: value })
									}
									className="flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
									style={{
										background: active
											? "var(--wayfare-surface-strong)"
											: "transparent",
										color: active
											? "var(--wayfare-text)"
											: "var(--wayfare-text-secondary)",
										boxShadow: active ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
									}}
								>
									{label}
								</button>
							);
						})}
					</fieldset>

					{/* Location inputs */}
					<div className="grid gap-3 sm:grid-cols-2">
						{state.searchType === "zone" ? (
							<>
								<ZoneSearch
									label="From"
									value={state.from}
									placeholder="Search departure zone…"
									onChange={(z) => dispatch({ type: "SET_FROM", payload: z })}
								/>
								<ZoneSearch
									label="To"
									value={state.to}
									placeholder="Search destination zone…"
									onChange={(z) => dispatch({ type: "SET_TO", payload: z })}
								/>
							</>
						) : (
							<>
								<LocationSearch
									label="From"
									value={state.from}
									placeholder={
										state.searchType === "trip"
											? "Search departure stop…"
											: "Search departure stop…"
									}
									onChange={(p) => dispatch({ type: "SET_FROM", payload: p })}
								/>
								<LocationSearch
									label="To"
									value={state.to}
									placeholder={
										state.searchType === "trip"
											? "Search destination stop…"
											: "Search destination stop…"
									}
									onChange={(p) => dispatch({ type: "SET_TO", payload: p })}
								/>
							</>
						)}
					</div>

					{/* Date / Time pickers */}
					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label
								htmlFor="departure-date"
								className="mb-1.5 block text-sm font-medium"
								style={{ color: "var(--wayfare-text)" }}
							>
								Departure date
							</label>
							<input
								id="departure-date"
								type="date"
								value={dateValue}
								min={minDate}
								onChange={handleDateChange}
								className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2"
								style={{
									borderColor: "var(--wayfare-line)",
									background: "var(--wayfare-surface-strong)",
									color: "var(--wayfare-text)",
								}}
							/>
						</div>
						<div>
							<label
								htmlFor="departure-time"
								className="mb-1.5 block text-sm font-medium"
								style={{ color: "var(--wayfare-text)" }}
							>
								Departure time
							</label>
							<input
								id="departure-time"
								type="time"
								value={timeValue}
								onChange={handleTimeChange}
								className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-shadow focus:ring-2"
								style={{
									borderColor: "var(--wayfare-line)",
									background: "var(--wayfare-surface-strong)",
									color: "var(--wayfare-text)",
								}}
							/>
						</div>
					</div>

					{/* Traveler picker */}
					<TravelerPicker
						travelers={state.travelers}
						onChange={(t) => dispatch({ type: "SET_TRAVELERS", payload: t })}
					/>

					{/* Error message */}
					{(error || planTrip.error) && (
						<p
							className="rounded-lg px-3 py-2 text-sm"
							style={{
								background: "rgba(233,0,55,0.08)",
								color: "var(--wayfare-primary)",
							}}
						>
							{(error ?? planTrip.error)?.message}
						</p>
					)}

					{/* Submit */}
					<Button
						type="submit"
						variant="primary"
						fluid
						disabled={!canSearch}
						loading={
							state.searchType === "trip" ? planTrip.isPending : isPending
						}
					>
						{state.searchType === "trip" ? "Plan trip" : "Search offers"}
					</Button>
				</div>
			</form>

			{/* Trip planner results */}
			{state.searchType === "trip" && planTrip.data != null && (
				<div className="mx-auto mt-4 max-w-xl">
					<TripResults
						patterns={planTrip.data}
						onSelect={handleSelectTrip}
						isPending={isPending}
					/>
				</div>
			)}
		</PageShell>
	);
}
