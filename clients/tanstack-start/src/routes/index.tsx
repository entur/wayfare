import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import PageShell from "../components/layout/PageShell";
import DateTimePicker from "../components/search/DateTimePicker";
import PlaceSearch from "../components/search/PlaceSearch";
import QuickRouteSection, {
	type QuickRoute,
	toQuickRoute,
} from "../components/search/QuickRouteSection";
import RecentPurchasesSection from "../components/search/RecentPurchasesSection";
import TravelerPicker from "../components/search/TravelerPicker";
import Button from "../components/ui/Button";
import { useProfile } from "../context/profile";
import type {
	TimeMode,
	TravelerGroup,
	TravelerIndividual,
} from "../context/search-form";
import { SearchFormProvider, useSearchForm } from "../context/search-form";
import { useSearchOffers } from "../hooks/use-search-offers";
import { buildRequest } from "../lib/build-request";
import { getFavorites, removeFavorite } from "../lib/favorites-storage";
import {
	addRecentSearch,
	getRecentSearches,
	removeRecentSearch,
} from "../lib/recent-searches-storage";
import { writeSearchSession } from "../lib/search-session";
import { writeTripSearchParams } from "../lib/trip-session";
import type { PlaceReference } from "../types/common";
import type { OmsaCustomer } from "../types/customer";

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

interface SearchParams {
	from: PlaceReference;
	to: PlaceReference;
	timeMode: TimeMode;
	travelDate: string;
	travelers: TravelerGroup[];
}

function SearchScreen() {
	const { state, dispatch } = useSearchForm();
	const navigate = useNavigate();
	const { mutateAsync, isPending, error } = useSearchOffers();
	const { customer } = useProfile();

	const [favorites, setFavorites] = useState(() => getFavorites());
	const [recentSearches, setRecentSearches] = useState(() =>
		getRecentSearches(),
	);

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

	async function runSearch(params: SearchParams) {
		const { from, to, timeMode, travelDate, travelers } = params;
		const travelDateTime =
			timeMode === "now"
				? new Date().toISOString()
				: new Date(travelDate).toISOString();

		const isZone = from.type === "zone" && to.type === "zone";

		if (!isZone) {
			addRecentSearch({ from, to, timeMode, travelDate, travelers });
			writeTripSearchParams({
				from,
				to,
				dateTime: travelDateTime,
				timeMode,
				travelers,
			});
			navigate({ to: "/trips" });
			return;
		}

		const { profiles, travellers } = buildRequest(travelers);
		const timeField =
			timeMode === "arrive"
				? { endTime: travelDateTime }
				: { startTime: travelDateTime };

		const result = await mutateAsync({
			inputs: {
				type: "search_offer",
				...(profiles.length > 0 ? { profiles } : {}),
				...(travellers.length > 0 ? { travellers } : {}),
				specification: { from, to, ...timeField },
			},
		});

		addRecentSearch({ from, to, timeMode, travelDate, travelers });
		writeSearchSession(result, {
			from,
			to,
			travelDate: travelDateTime,
			profiles,
			travellers,
		});
		navigate({ to: "/offers" });
	}

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!state.from || !state.to || state.travelers.length === 0) return;
		await runSearch({
			from: state.from,
			to: state.to,
			timeMode: state.timeMode,
			travelDate: state.travelDate,
			travelers: state.travelers,
		});
	}

	function handleQuickSearch(params: SearchParams) {
		dispatch({ type: "SET_FROM", payload: params.from });
		dispatch({ type: "SET_TO", payload: params.to });
		dispatch({ type: "SET_TIME_MODE", payload: params.timeMode });
		dispatch({ type: "SET_TRAVEL_DATE", payload: params.travelDate });
		dispatch({ type: "SET_TRAVELERS", payload: params.travelers });
		runSearch(params);
	}

	function handleRebook(route: { from: PlaceReference; to: PlaceReference }) {
		handleQuickSearch({
			from: route.from as PlaceReference,
			to: route.to as PlaceReference,
			timeMode: "now",
			travelDate: new Date().toISOString().slice(0, 16),
			travelers: state.travelers,
		});
	}

	function handleRemoveFavorite(id: string) {
		removeFavorite(id);
		setFavorites(getFavorites());
	}

	function handleRemoveRecent(id: string) {
		removeRecentSearch(id);
		setRecentSearches(getRecentSearches());
	}

	const canSearch = useMemo(
		() => Boolean(state.from && state.to && state.travelers.length > 0),
		[state.from, state.to, state.travelers],
	);

	function handleSwap() {
		dispatch({ type: "SET_FROM", payload: state.to });
		dispatch({ type: "SET_TO", payload: state.from });
	}

	const favoriteRoutes = useMemo(
		() => favorites.map((f) => toQuickRoute(f, true, state.travelers)),
		[favorites, state.travelers],
	);

	const recentRoutes = useMemo(() => {
		const favIds = new Set(
			favorites.map((f) => `${f.from.placeId}|${f.to.placeId}`),
		);
		return recentSearches
			.filter((r) => !favIds.has(`${r.from.placeId}|${r.to.placeId}`))
			.map((r) => toQuickRoute(r, false, state.travelers));
	}, [recentSearches, favorites, state.travelers]);

	return (
		<PageShell
			title="Where are you going?"
			subtitle="Plan your next trip in Norway"
		>
			<div className="flex flex-col gap-4">
				<form
					onSubmit={handleSearch}
					className="relative z-10 rise-in rounded-lg p-6"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<div className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_10rem] lg:items-end">
							<PlaceSearch
								label="From"
								value={state.from}
								placeholder="Departure"
								onChange={(p) => dispatch({ type: "SET_FROM", payload: p })}
							/>

							{/* Swap button — desktop only. Grid items-end handles vertical alignment. */}
							<div className="hidden lg:flex lg:items-end">
								<button
									type="button"
									onClick={handleSwap}
									aria-label="Swap from and to"
									className="flex h-[42px] items-center justify-center rounded-xl border px-2 transition-colors focus:outline-none focus:ring-2"
									style={{
										borderColor: "var(--wayfare-line)",
										background: "var(--wayfare-surface-strong)",
										color: "var(--wayfare-text-secondary)",
										// @ts-expect-error - css custom prop
										"--tw-ring-color":
											"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
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

							<PlaceSearch
								label="To"
								value={state.to}
								placeholder="Destination"
								onChange={(p) => dispatch({ type: "SET_TO", payload: p })}
							/>

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
									loading={isPending}
								>
									Search
								</Button>
							</div>
						</div>

						{error && (
							<p
								className="rounded-lg px-3 py-2 text-sm"
								style={{
									background: "rgba(233,0,55,0.08)",
									color: "var(--wayfare-primary)",
								}}
							>
								{error.message}
							</p>
						)}
					</div>
				</form>

				<QuickRouteSection
					title="Favorites"
					routes={favoriteRoutes}
					showManageLink
					onSelect={(r: QuickRoute) => handleQuickSearch(r)}
					onRemove={handleRemoveFavorite}
				/>

				<QuickRouteSection
					title="Recent searches"
					routes={recentRoutes}
					onSelect={(r: QuickRoute) => handleQuickSearch(r)}
					onRemove={handleRemoveRecent}
				/>

				<RecentPurchasesSection onRebook={handleRebook} />
			</div>
		</PageShell>
	);
}
