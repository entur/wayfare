import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import PageShell from "../components/layout/PageShell";
import DateTimePicker from "../components/search/DateTimePicker";
import LocationSearch from "../components/search/LocationSearch";
import TravelerPicker from "../components/search/TravelerPicker";
import TripResults from "../components/search/TripResults";
import ZoneSearch from "../components/search/ZoneSearch";
import Button from "../components/ui/Button";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useProfile } from "../context/profile";
import type { TravelerGroup, TravelerIndividual } from "../context/search-form";
import { SearchFormProvider, useSearchForm } from "../context/search-form";
import { useSearchOffers } from "../hooks/use-search-offers";
import { useTripPlanner } from "../hooks/use-trip-planner";
import { writeSearchSession } from "../lib/search-session";
import type { OmsaCustomer } from "../types/customer";
import type {
	IndividualTraveller,
	TripPatternLeg,
	UserProfile,
} from "../types/search";
import type { TripPattern } from "../types/trip-planner";

function syncCustomerIntoTravelers(
	travelers: TravelerGroup[],
	customer: OmsaCustomer,
): TravelerGroup[] {
	const name =
		[customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
		undefined;
	const customerInd: TravelerIndividual = { name, customerId: customer.id };
	const adultGroup = travelers.find((t) => t.ageGroup === "ADULT");
	if (adultGroup) {
		const others = (adultGroup.individuals ?? []).filter((i) => !i.customerId);
		return travelers.map((t) =>
			t.ageGroup === "ADULT"
				? { ...t, individuals: [customerInd, ...others] }
				: t,
		);
	}
	return [
		...travelers,
		{
			id: "adult",
			ageGroup: "ADULT" as const,
			count: 1,
			minAge: 18,
			individuals: [customerInd],
		},
	];
}

function removeCustomerFromTravelers(
	travelers: TravelerGroup[],
): TravelerGroup[] {
	return travelers.flatMap((t) => {
		if (!t.individuals?.some((i) => i.customerId)) return [t];
		const without = t.individuals.filter((i) => !i.customerId);
		const newCount = Math.max(1, t.count - 1);
		return [
			{
				...t,
				count: newCount,
				individuals: without.length ? without : undefined,
			},
		];
	});
}

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
			? {
					entitlements: {
						entitlementsGiven: [
							{ type: "entitlement" as const, entitlementType },
						],
					},
				}
			: {};
		// STUDENT and MILITARY don't map to a UserProfile ageGroup
		const profileAgeGroup =
			t.ageGroup !== "STUDENT" && t.ageGroup !== "MILITARY"
				? t.ageGroup
				: undefined;

		const named =
			t.individuals?.filter((i) => i.name || i.age != null || i.customerId) ??
			[];

		if (named.length > 0) {
			named.forEach((person, j) => {
				travellers.push({
					id: `${t.id}_${j}`,
					type: "individual_traveller",
					...(person.age != null
						? { age: person.age }
						: t.minAge != null
							? { age: t.minAge }
							: {}),
					...(person.name ? { fullName: person.name } : {}),
					...(person.customerId
						? { customerReference: person.customerId }
						: {}),
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
	const { customer } = useProfile();

	// biome-ignore lint/correctness/useExhaustiveDependencies: state.travelers intentionally omitted — including it causes dispatch→state→effect infinite loop
	useEffect(() => {
		const hasCustomer = state.travelers.some((t) =>
			t.individuals?.some((i) => i.customerId),
		);
		if (customer) {
			if (!hasCustomer) {
				dispatch({
					type: "SET_TRAVELERS",
					payload: syncCustomerIntoTravelers(state.travelers, customer),
				});
			}
		} else {
			if (hasCustomer) {
				dispatch({
					type: "SET_TRAVELERS",
					payload: removeCustomerFromTravelers(state.travelers),
				});
			}
		}
	}, [customer, dispatch]);

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!state.from || !state.to || state.travelers.length === 0) return;
		const from = state.from;
		const to = state.to;
		const searchType = state.searchType;
		const travelDateTime =
			state.timeMode === "now"
				? new Date().toISOString()
				: new Date(state.travelDate).toISOString();

		if (searchType === "trip") {
			planTrip.mutate({
				from,
				to,
				dateTime: travelDateTime,
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
					startTime: travelDateTime,
				},
			},
		});

		writeSearchSession(result, {
			from,
			to,
			travelDate: travelDateTime,
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

	function handleSwap() {
		dispatch({ type: "SET_FROM", payload: state.to });
		dispatch({ type: "SET_TO", payload: state.from });
	}

	return (
		<PageShell
			title="Where are you going?"
			subtitle="Plan your next trip in Norway"
		>
			<form
				onSubmit={handleSearch}
				className="rise-in rounded-lg p-6"
				style={{
					background: "var(--wayfare-surface-strong)",
					border: "1px solid var(--wayfare-line)",
				}}
			>
				<div className="flex flex-col gap-4">
					<div className="max-w-sm">
						<SegmentedControl
							legend="Search type"
							options={
								[
									{ value: "zone", label: "Zone to Zone" },
									{ value: "stop", label: "Stop to Stop" },
									{ value: "trip", label: "Trip Planner" },
								] as const
							}
							value={state.searchType}
							onChange={(v) =>
								dispatch({ type: "SET_SEARCH_TYPE", payload: v })
							}
						/>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_10rem] lg:items-end">
						{state.searchType === "zone" ? (
							<ZoneSearch
								label="From"
								value={state.from}
								placeholder="Search departure zone…"
								onChange={(z) => dispatch({ type: "SET_FROM", payload: z })}
							/>
						) : (
							<LocationSearch
								label="From"
								value={state.from}
								placeholder="Search departure stop…"
								onChange={(p) => dispatch({ type: "SET_FROM", payload: p })}
							/>
						)}

						{/* Swap button — desktop only. Phantom label spacer keeps the button
						    flush with the input row rather than the top of the cell. */}
						<div className="hidden lg:flex lg:flex-col">
							<span className="mb-1.5 block text-sm" aria-hidden="true">
								&nbsp;
							</span>
							<button
								type="button"
								onClick={handleSwap}
								aria-label="Swap from and to"
								className="flex items-center justify-center rounded-xl border px-2 py-2.5 transition-colors"
								style={{
									borderColor: "var(--wayfare-line)",
									background: "var(--wayfare-surface-strong)",
									color: "var(--wayfare-text-secondary)",
								}}
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M1 4h12M10 1l3 3-3 3"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M13 10H1M4 7l-3 3 3 3"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
						</div>

						{state.searchType === "zone" ? (
							<ZoneSearch
								label="To"
								value={state.to}
								placeholder="Search destination zone…"
								onChange={(z) => dispatch({ type: "SET_TO", payload: z })}
							/>
						) : (
							<LocationSearch
								label="To"
								value={state.to}
								placeholder="Search destination stop…"
								onChange={(p) => dispatch({ type: "SET_TO", payload: p })}
							/>
						)}

						<div className="lg:col-span-1">
							<DateTimePicker
								label="When"
								value={state.travelDate}
								timeMode={state.timeMode}
								onChange={(v) =>
									dispatch({ type: "SET_TRAVEL_DATE", payload: v })
								}
								onModeChange={(m) =>
									dispatch({ type: "SET_TIME_MODE", payload: m })
								}
							/>
						</div>

						<div className="lg:col-span-1">
							<TravelerPicker
								travelers={state.travelers}
								onChange={(t) =>
									dispatch({ type: "SET_TRAVELERS", payload: t })
								}
								customer={customer}
							/>
						</div>

						<div className="sm:col-span-2 lg:col-span-1">
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
					</div>

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
				</div>
			</form>

			{state.searchType === "trip" && planTrip.data != null && (
				<div className="mt-4">
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
