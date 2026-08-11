import { RightArrowIcon } from "@entur/icons";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { JourneyStepper } from "../../components/layout/JourneyStepper";
import { JourneySummary } from "../../components/layout/JourneySummary";
import PageShell from "../../components/layout/PageShell";
import AssetSeatmapView from "../../components/seats/AssetSeatmapView";
import { CarriageSelector } from "../../components/seats/CarriageSelector";
import ErrorBanner from "../../components/shared/ErrorBanner";
import Button from "../../components/ui/Button";
import { useAssignAsset } from "../../hooks/use-assets";
import {
	assetAvailability,
	assetSeatNumber,
	isSeatFeature,
} from "../../lib/asset-features";
import {
	confirmedAssetIdsByLeg,
	retainConfirmedAssetInfo,
} from "../../lib/confirmed-assets";
import { getOfferReservationFlow } from "../../lib/offer-reservations";
import {
	readPackageSession,
	writePackageSession,
} from "../../lib/package-session";
import {
	type PurchaseOptionsSession,
	readPurchaseOptionsSession,
} from "../../lib/purchase-options-session";
import {
	readSearchSession,
	type SearchContext,
} from "../../lib/search-session";
import { manualSelectionServiceJourneyGroups } from "../../lib/service-journey-groups";
import { partyLabel } from "../../lib/travel-party";
import { assetsCollectionQuery } from "../../server-functions/assets.queries";
import type { AssetFeature, SelectedAssetInfo } from "../../types/assets";
import type { ConfirmedPackage } from "../../types/purchase";
import type { Offer } from "../../types/search";

export const Route = createFileRoute("/seats/$offerId")({
	loader: async () => null,
	component: SeatsPage,
});

interface PendingAssignment {
	assetId: string;
	previous?: SelectedAssetInfo;
}

function isAssetNotAvailable(error: unknown): boolean {
	const msg = error instanceof Error ? error.message : String(error ?? "");
	return /\(409\)/.test(msg) && /Asset Not Available/i.test(msg);
}

function SeatsPage() {
	const { offerId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [pkg, setPkg] = useState<ConfirmedPackage | null>(null);
	const [searchOffers, setSearchOffers] = useState<Offer[]>([]);
	const [purchaseOptions, setPurchaseOptions] =
		useState<PurchaseOptionsSession>({ ancillaries: [] });
	const [sessionContext, setSessionContext] = useState<SearchContext | null>(
		null,
	);
	const [selectedAssets, setSelectedAssets] = useState<
		Record<string, SelectedAssetInfo>
	>({});
	const [selectedCarriageByLeg, setSelectedCarriageByLeg] = useState<
		Map<string, string>
	>(new Map());
	const [activeLegByServiceJourney, setActiveLegByServiceJourney] = useState<
		Map<string, string>
	>(new Map());
	const [pendingAssignments, setPendingAssignments] = useState<
		Record<string, PendingAssignment>
	>({});
	const [assignError, setAssignError] = useState<string | null>(null);
	const confirmedAssetIdsRef = useRef<Record<string, string>>({});
	const assigningLegsRef = useRef(new Set<string>());

	useEffect(() => {
		const pkgSession = readPackageSession();
		const session = readSearchSession();
		if (!pkgSession.package?.id) {
			navigate({
				to: "/checkout/$offerId",
				params: { offerId },
				search: { pendingCardId: undefined },
			});
			return;
		}
		const confirmedAssetIds = confirmedAssetIdsByLeg(pkgSession.package);
		confirmedAssetIdsRef.current = confirmedAssetIds;
		setPkg(pkgSession.package);
		setSelectedAssets(
			retainConfirmedAssetInfo(
				pkgSession.selectedAssetsByLegId ?? {},
				confirmedAssetIds,
			),
		);
		setPurchaseOptions(readPurchaseOptionsSession());
		setSessionContext(session.context);

		// Use the search-session offer collection (pre-selection) to detect seat eligibility.
		// Package legs are stripped of reservationRequirement after select-offers, so we must
		// check eligibility here against the original catalog offers.
		const originalOfferIds = new Set(pkgSession.offerIds);
		const catalogOffers =
			session.collection?.offers?.filter(
				(o) => o.id && originalOfferIds.has(o.id),
			) ?? [];
		setSearchOffers(catalogOffers);
	}, [offerId, navigate]);

	const selectedAncillaryIds = useMemo(
		() => new Set(purchaseOptions.ancillaries.map((a) => a.ancillaryId)),
		[purchaseOptions],
	);

	// Reservation flow detection uses the search-session offers, not the stripped package offers.
	const reservationFlow = useMemo(
		() => getOfferReservationFlow(searchOffers, selectedAncillaryIds),
		[searchOffers, selectedAncillaryIds],
	);

	const serviceJourneyGroups = useMemo(
		() => manualSelectionServiceJourneyGroups(pkg?.offers ?? [], searchOffers),
		[pkg, searchOffers],
	);

	const assetQueries = useQueries({
		queries: serviceJourneyGroups.map((group) =>
			assetsCollectionQuery(pkg?.id ?? "", group.serviceJourney),
		),
	});

	const featuresByServiceJourney = useMemo(() => {
		const map = new Map<string, AssetFeature[]>();
		for (let i = 0; i < serviceJourneyGroups.length; i++) {
			map.set(
				serviceJourneyGroups[i].serviceJourney,
				assetQueries[i]?.data?.features ?? [],
			);
		}
		return map;
	}, [serviceJourneyGroups, assetQueries]);

	// A compulsory seat may already be assigned to a leg (auto-assigned during
	// select-offers) before the user has picked anything in this browser session,
	// so the local session has no carriage/seat-number for it yet. Once the seatmap
	// features load, backfill that info by matching the leg's confirmed asset id
	// against the loaded features.
	useEffect(() => {
		if (!pkg) return;
		setSelectedAssets((previous) => {
			let changed = false;
			const next = { ...previous };
			for (const [legId, assetId] of Object.entries(
				confirmedAssetIdsRef.current,
			)) {
				if (next[legId]?.assetId === assetId) continue;
				const group = serviceJourneyGroups.find((candidate) =>
					candidate.legs.some((leg) => leg.id === legId),
				);
				if (!group) continue;
				const feature = (
					featuresByServiceJourney.get(group.serviceJourney) ?? []
				).find((candidate) => candidate.id === assetId);
				if (!feature || !isSeatFeature(feature)) continue;
				next[legId] = {
					assetId,
					carriage: feature.properties.carriage,
					seatNumber: assetSeatNumber(feature),
				};
				changed = true;
			}
			return changed ? next : previous;
		});
	}, [pkg, serviceJourneyGroups, featuresByServiceJourney]);

	const isLoadingByServiceJourney = useMemo(() => {
		const map = new Map<string, boolean>();
		for (let i = 0; i < serviceJourneyGroups.length; i++) {
			map.set(
				serviceJourneyGroups[i].serviceJourney,
				assetQueries[i]?.isPending ?? true,
			);
		}
		return map;
	}, [serviceJourneyGroups, assetQueries]);

	const allSettled =
		serviceJourneyGroups.length > 0 && assetQueries.every((q) => !q.isPending);

	const eligibleGroups = useMemo(() => {
		if (!allSettled) return serviceJourneyGroups;
		return serviceJourneyGroups.filter(
			(group, index) =>
				!assetQueries[index]?.isError &&
				(featuresByServiceJourney.get(group.serviceJourney)?.length ?? 0) > 0,
		);
	}, [
		serviceJourneyGroups,
		allSettled,
		assetQueries,
		featuresByServiceJourney,
	]);

	// Redirect if seat selection is not applicable for this package.
	useEffect(() => {
		if (!pkg) return;
		if (searchOffers.length === 0) return; // still loading search offers
		if (!reservationFlow.canOpenSeatmap) {
			navigate({
				to: "/checkout/$offerId",
				params: { offerId },
				search: { pendingCardId: undefined },
			});
			return;
		}
		if (
			allSettled &&
			eligibleGroups.length === 0 &&
			assetQueries.every((query) => !query.isError)
		) {
			navigate({
				to: "/checkout/$offerId",
				params: { offerId },
				search: { pendingCardId: undefined },
			});
		}
	}, [
		pkg,
		searchOffers.length,
		reservationFlow.canOpenSeatmap,
		allSettled,
		eligibleGroups.length,
		assetQueries,
		navigate,
		offerId,
	]);

	const assignAssetMutation = useAssignAsset();

	async function handleSeatClick(legId: string, feature: AssetFeature) {
		if (!isSeatFeature(feature)) return;
		if (assetAvailability(feature) !== "AVAILABLE") return;
		if (!pkg?.id) return;
		if (assigningLegsRef.current.has(legId)) return;
		// Clicking already-selected seat is a no-op — OMSA has no "deselect" endpoint
		const previousInfo = selectedAssets[legId];
		const confirmedAssetId = confirmedAssetIdsRef.current[legId];
		if (confirmedAssetId === feature.id) return;
		if (
			Object.entries(selectedAssets).some(
				([selectedLegId, asset]) =>
					selectedLegId !== legId && asset.assetId === feature.id,
			)
		) {
			setAssignError("That seat is already selected for another traveller.");
			return;
		}
		assigningLegsRef.current.add(legId);

		const assetInfo: SelectedAssetInfo = {
			assetId: feature.id,
			carriage: feature.properties.carriage,
			seatNumber: assetSeatNumber(feature),
		};
		const group = serviceJourneyGroups.find((candidate) =>
			candidate.legs.some((leg) => leg.id === legId),
		);
		const nextLeg = group?.legs.find(
			(leg) => leg.id !== legId && !selectedAssets[leg.id],
		);

		setSelectedAssets((previous) => ({ ...previous, [legId]: assetInfo }));
		setPendingAssignments((previous) => ({
			...previous,
			[legId]: { assetId: feature.id, previous: previousInfo },
		}));
		if (group && nextLeg) {
			setActiveLegByServiceJourney((previous) =>
				new Map(previous).set(group.serviceJourney, nextLeg.id),
			);
		}
		setAssignError(null);
		try {
			const result = await assignAssetMutation.mutateAsync({
				inputs: {
					type: "asset",
					packageId: pkg.id,
					legId,
					assetId: feature.id,
					...(confirmedAssetId ? { replaceAssetId: confirmedAssetId } : {}),
				},
			});

			const resultConfirmedAssetIds = confirmedAssetIdsByLeg(result);
			confirmedAssetIdsRef.current = resultConfirmedAssetIds;
			const confirmedResult = resultConfirmedAssetIds[legId] === feature.id;
			const currentSession = readPackageSession();
			const nextSelectedAssets = confirmedResult
				? {
						...retainConfirmedAssetInfo(
							currentSession.selectedAssetsByLegId ?? {},
							resultConfirmedAssetIds,
						),
						[legId]: assetInfo,
					}
				: retainConfirmedAssetInfo(
						currentSession.selectedAssetsByLegId ?? {},
						resultConfirmedAssetIds,
					);
			writePackageSession({
				...currentSession,
				package: result,
				selectedAssetsByLegId: nextSelectedAssets,
			});
			setPkg(result);
			setSelectedAssets(nextSelectedAssets);
			if (!confirmedResult) {
				setAssignError("The seat could not be confirmed. Please choose again.");
			}
			if (group) {
				queryClient.invalidateQueries({
					queryKey: ["assets", pkg.id, group.serviceJourney],
				});
			}
		} catch (err) {
			setSelectedAssets((previous) => {
				if (previous[legId]?.assetId !== feature.id) return previous;
				const next = { ...previous };
				if (previousInfo) next[legId] = previousInfo;
				else delete next[legId];
				return next;
			});
			if (group) {
				setActiveLegByServiceJourney((previous) =>
					new Map(previous).set(group.serviceJourney, legId),
				);
			}
			if (isAssetNotAvailable(err)) {
				const serviceJourney = serviceJourneyGroups.find((group) =>
					group.legs.some((leg) => leg.id === legId),
				)?.serviceJourney;
				if (serviceJourney) {
					queryClient.invalidateQueries({
						queryKey: ["assets", pkg.id, serviceJourney],
					});
				}
				setAssignError("That seat was just taken. Please choose another.");
			} else {
				setAssignError(
					err instanceof Error ? err.message : "Could not reserve seat.",
				);
			}
		} finally {
			assigningLegsRef.current.delete(legId);
			setPendingAssignments((previous) => {
				if (previous[legId]?.assetId !== feature.id) return previous;
				const next = { ...previous };
				delete next[legId];
				return next;
			});
		}
	}

	function handleContinue() {
		if (Object.keys(pendingAssignments).length > 0) return;
		navigate({
			to: "/checkout/$offerId",
			params: { offerId },
			search: { pendingCardId: undefined },
		});
	}

	function handleChangeJourney() {
		navigate({ to: "/offers" });
	}

	const allParties = [
		...(sessionContext?.profiles ?? []),
		...(sessionContext?.travellers ?? []),
	];
	const expandedPartyLabels = allParties.flatMap((party) => {
		const label = partyLabel(party).replace(/ × \d+$/, "");
		const count = party.type === "user_profile" ? (party.count ?? 1) : 1;
		return Array.from({ length: count }, (_, index) =>
			count > 1 ? `${label} ${index + 1}` : label,
		);
	});
	const travellerLabel = (
		groupLegs: (typeof serviceJourneyGroups)[number]["legs"],
		legId: string,
	) => {
		const index = groupLegs.findIndex((leg) => leg.id === legId);
		return expandedPartyLabels[index] ?? `Traveller ${index + 1}`;
	};
	const partyStr =
		allParties.length > 0
			? allParties.map((p) => partyLabel(p)).join(", ")
			: undefined;

	const previewTotal = pkg?.price?.amount ?? 0;
	const previewCurrency = pkg?.price?.currencyCode ?? "NOK";
	const hasPendingAssignments = Object.keys(pendingAssignments).length > 0;

	const seatSummarySlot =
		eligibleGroups.length > 0 ? (
			<div className="flex flex-col gap-1 border-t border-wayfare-line pt-3">
				<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					Seats
				</p>
				{eligibleGroups.flatMap((group) =>
					group.legs.map((leg) => {
						const info = selectedAssets[leg.id];
						return (
							<p key={leg.id} className="text-xs text-wayfare-text-secondary">
								{travellerLabel(group.legs, leg.id)}:{" "}
								{info
									? `Seat ${info.seatNumber ?? info.assetId} · Carriage ${info.carriage}`
									: "No seat selected"}
							</p>
						);
					}),
				)}
			</div>
		) : null;

	if (!pkg) {
		return (
			<PageShell title="Seat selection">
				<div className="flex flex-col items-center py-12 text-center">
					<div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
					<p className="text-sm text-wayfare-text-secondary">Loading…</p>
				</div>
			</PageShell>
		);
	}

	const rightRail = sessionContext ? (
		<div className="flex flex-col gap-3">
			<JourneySummary
				variant="rail"
				from={sessionContext.from.name ?? sessionContext.from.placeId}
				to={sessionContext.to.name ?? sessionContext.to.placeId}
				startTime={
					sessionContext.pattern?.expectedStartTime ?? sessionContext.travelDate
				}
				endTime={sessionContext.pattern?.expectedEndTime}
				durationSeconds={sessionContext.pattern?.duration}
				partyLabel={partyStr}
				total={
					previewTotal > 0
						? { amount: previewTotal, currencyCode: previewCurrency }
						: undefined
				}
				detailsSlot={seatSummarySlot}
				onChangeJourney={handleChangeJourney}
			/>
			{assignError && (
				<ErrorBanner
					message={assignError}
					onDismiss={() => setAssignError(null)}
				/>
			)}
			<Button
				variant="primary"
				onClick={handleContinue}
				disabled={hasPendingAssignments}
			>
				Continue to checkout
				<RightArrowIcon aria-hidden="true" />
			</Button>
		</div>
	) : null;

	const groupsToRender = allSettled ? eligibleGroups : serviceJourneyGroups;
	const assetLoadError = assetQueries.find((query) => query.isError)?.error;

	return (
		<PageShell
			title="Choose your seats"
			subtitle="Optional — continue without selecting if you prefer"
			stepper={<JourneyStepper />}
			rightRail={rightRail}
		>
			<div className="flex flex-col gap-8">
				{assetLoadError && (
					<ErrorBanner
						message={
							assetLoadError instanceof Error
								? assetLoadError.message
								: "Could not load the seatmap."
						}
					/>
				)}
				{groupsToRender.map((group, groupIdx) => {
					const { serviceJourney, legs } = group;
					const activeLegId =
						activeLegByServiceJourney.get(serviceJourney) ??
						legs.find((leg) => !selectedAssets[leg.id])?.id ??
						legs[0]?.id;
					const features = featuresByServiceJourney.get(serviceJourney) ?? [];
					const isLoading =
						isLoadingByServiceJourney.get(serviceJourney) ?? true;

					const carriages = [
						...new Set(features.map((f) => f.properties.carriage)),
					].sort((a, b) => {
						const na = Number(a);
						const nb = Number(b);
						if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
						return a.localeCompare(b);
					});

					const selectedCarriage =
						selectedCarriageByLeg.get(serviceJourney) ?? carriages[0] ?? "";

					const carriageFeatures = features.filter(
						(f) => f.properties.carriage === selectedCarriage,
					);

					const selectedInfo = activeLegId
						? selectedAssets[activeLegId]
						: undefined;
					const selectedAssetIds = legs.flatMap((leg) =>
						selectedAssets[leg.id]?.assetId
							? [selectedAssets[leg.id].assetId]
							: [],
					);
					const isAssigning =
						!!activeLegId && !!pendingAssignments[activeLegId];
					const hasAvailable = carriageFeatures.some(
						(f) => isSeatFeature(f) && assetAvailability(f) === "AVAILABLE",
					);

					const representativeLeg = legs[0];
					const legLabel =
						representativeLeg?.from && representativeLeg.to
							? `${representativeLeg.from.name ?? representativeLeg.from.placeId} → ${representativeLeg.to.name ?? representativeLeg.to.placeId}`
							: `Departure ${groupIdx + 1}`;

					return (
						<div key={serviceJourney} className="flex flex-col gap-3">
							<div className="overflow-hidden rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
								{/* Leg header + carriage selector */}
								<div className="border-b border-wayfare-line px-3 py-2">
									{groupsToRender.length > 1 && (
										<p className="mb-1 text-xs font-semibold text-wayfare-text-secondary">
											{legLabel}
										</p>
									)}
									{legs.length > 1 && (
										<div className="mb-2 flex flex-wrap gap-2">
											{legs.map((leg) => (
												<Button
													key={leg.id}
													variant={
														leg.id === activeLegId ? "primary" : "secondary"
													}
													onClick={() =>
														setActiveLegByServiceJourney((previous) =>
															new Map(previous).set(serviceJourney, leg.id),
														)
													}
												>
													{travellerLabel(legs, leg.id)}
													{pendingAssignments[leg.id]
														? " …"
														: selectedAssets[leg.id]
															? " ✓"
															: ""}
												</Button>
											))}
										</div>
									)}
									{carriages.length > 1 && (
										<CarriageSelector
											elements={carriages.map((c) => ({
												carriageId: c,
												carriageIdentifier: c,
												carriageNumber: null,
											}))}
											selectedIdx={carriages.indexOf(selectedCarriage)}
											travelDirection={null}
											onSelect={(idx) =>
												setSelectedCarriageByLeg((prev) =>
													new Map(prev).set(serviceJourney, carriages[idx]),
												)
											}
										/>
									)}
								</div>

								{/* Status bar */}
								<div className="flex items-center justify-between border-b border-wayfare-line px-3 py-2">
									<span
										className={`text-sm ${selectedInfo ? "font-semibold text-wayfare-primary" : "text-wayfare-text-secondary"}`}
									>
										{isLoading
											? "Loading seats…"
											: isAssigning
												? "Reserving seat…"
												: selectedInfo
													? `Seat ${selectedInfo.seatNumber ?? selectedInfo.assetId} · Carriage ${selectedInfo.carriage}`
													: !hasAvailable
														? "No available seats in this carriage."
														: "Click an available seat to select it."}
									</span>
									{selectedInfo && !isAssigning && (
										<span className="text-xs italic text-wayfare-text-secondary">
											Held — change by clicking another
										</span>
									)}
								</div>

								{/* Seatmap */}
								<div className="py-2 px-2">
									{isLoading ? (
										<div className="flex h-40 items-center justify-center py-2">
											<div className="h-5 w-5 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
										</div>
									) : carriageFeatures.length > 0 ? (
										<AssetSeatmapView
											features={carriageFeatures}
											selectedAssetIds={selectedAssetIds}
											onSeatClick={
												activeLegId && !pendingAssignments[activeLegId]
													? (f) => handleSeatClick(activeLegId, f)
													: undefined
											}
										/>
									) : (
										<div className="flex h-40 items-center justify-center text-sm text-wayfare-text-secondary">
											No layout available
										</div>
									)}
								</div>
							</div>

							{/* Mobile continue button — only on last leg */}
							{groupIdx === groupsToRender.length - 1 && (
								<div className="lg:hidden">
									{assignError && (
										<ErrorBanner
											message={assignError}
											onDismiss={() => setAssignError(null)}
										/>
									)}
									<Button
										variant="primary"
										fluid
										onClick={handleContinue}
										disabled={hasPendingAssignments}
									>
										Continue to checkout
										<RightArrowIcon aria-hidden="true" />
									</Button>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</PageShell>
	);
}
