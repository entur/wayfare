import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import PageShell from "../components/layout/PageShell";
import DateTimePicker from "../components/search/DateTimePicker";
import PlaceSearch from "../components/search/PlaceSearch";
import TravelerPicker from "../components/search/TravelerPicker";
import Button from "../components/ui/Button";
import { useProfile } from "../context/profile";
import type { TravelerGroup, TravelerIndividual } from "../context/search-form";
import { SearchFormProvider, useSearchForm } from "../context/search-form";
import { useSearchOffers } from "../hooks/use-search-offers";
import { buildRequest } from "../lib/build-request";
import { writeSearchSession } from "../lib/search-session";
import { writeTripSearchParams } from "../lib/trip-session";
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

function SearchScreen() {
	const { state, dispatch } = useSearchForm();
	const navigate = useNavigate();
	const { mutateAsync, isPending, error } = useSearchOffers();
	const { customer } = useProfile();

	const isZoneSearch = state.from?.type === "zone" && state.to?.type === "zone";

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
		const travelDateTime =
			state.timeMode === "now"
				? new Date().toISOString()
				: new Date(state.travelDate).toISOString();

		if (!isZoneSearch) {
			writeTripSearchParams({
				from,
				to,
				dateTime: travelDateTime,
				timeMode: state.timeMode,
				travelers: state.travelers,
			});
			navigate({ to: "/trips" });
			return;
		}

		const { profiles, travellers } = buildRequest(state.travelers);
		const timeField =
			state.timeMode === "arrive"
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

		writeSearchSession(result, {
			from,
			to,
			travelDate: travelDateTime,
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
		</PageShell>
	);
}
