import { RightArrowIcon } from "@entur/icons";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { JourneyStepper } from "../../components/layout/JourneyStepper";
import { JourneySummary } from "../../components/layout/JourneySummary";
import PageShell from "../../components/layout/PageShell";
import AssetSeatmapView from "../../components/seats/AssetSeatmapView";
import { CarriageSelector } from "../../components/seats/CarriageSelector";
import ErrorBanner from "../../components/shared/ErrorBanner";
import Button from "../../components/ui/Button";
import { useAssignAsset } from "../../hooks/use-assets";
import { getOfferReservationFlow } from "../../lib/offer-reservations";
import {
	readPackageSession,
	writePackageSession,
} from "../../lib/package-session";
import {
	readPurchaseOptionsSession,
	type PurchaseOptionsSession,
} from "../../lib/purchase-options-session";
import {
	readSearchSession,
	type SearchContext,
} from "../../lib/search-session";
import { partyLabel } from "../../lib/travel-party";
import type { AssetFeature, SelectedAssetInfo } from "../../types/assets";
import type { ConfirmedPackage } from "../../types/purchase";
import type { Offer, OfferLeg } from "../../types/search";
import { assetsCollectionQuery } from "../../server-functions/assets.queries";

export const Route = createFileRoute("/seats/$offerId")({
	loader: async () => null,
	component: SeatsPage,
});

function isAssetNotAvailable(error: unknown): boolean {
	const msg = error instanceof Error ? error.message : String(error ?? "");
	return /\(409\)/.test(msg) && /Asset Not Available/i.test(msg);
}

// Collect all unique legs from a package's offers (one per leg id).
// Package legs don't carry reservationRequirement, so eligibility is determined
// separately from the search-session offers.
function collectPackageLegs(offers: Offer[]): OfferLeg[] {
	const legs: OfferLeg[] = [];
	const seen = new Set<string>();
	for (const offer of offers) {
		for (const leg of offer.properties?.legs ?? []) {
			if (!seen.has(leg.id)) {
				legs.push(leg);
				seen.add(leg.id);
			}
		}
	}
	return legs;
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
	const [assigningLegId, setAssigningLegId] = useState<string | null>(null);
	const [assignError, setAssignError] = useState<string | null>(null);

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
		setPkg(pkgSession.package);
		setSelectedAssets(pkgSession.selectedAssetsByLegId ?? {});
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

	// All package legs are potentially eligible when the flow permits seat selection.
	// OMSA controls per-leg eligibility at the API level; legs with no assets are filtered
	// out once the queries settle.
	const allPackageLegs = useMemo(
		() => collectPackageLegs(pkg?.offers ?? []),
		[pkg],
	);

	const assetQueries = useQueries({
		queries: allPackageLegs.map((leg) =>
			assetsCollectionQuery(pkg?.id ?? "", leg.id),
		),
	});

	const featuresByLegId = useMemo(() => {
		const map = new Map<string, AssetFeature[]>();
		for (let i = 0; i < allPackageLegs.length; i++) {
			map.set(allPackageLegs[i].id, assetQueries[i]?.data?.features ?? []);
		}
		return map;
	}, [allPackageLegs, assetQueries]);

	const isLoadingByLegId = useMemo(() => {
		const map = new Map<string, boolean>();
		for (let i = 0; i < allPackageLegs.length; i++) {
			map.set(allPackageLegs[i].id, assetQueries[i]?.isPending ?? true);
		}
		return map;
	}, [allPackageLegs, assetQueries]);

	const allSettled =
		allPackageLegs.length > 0 && assetQueries.every((q) => !q.isPending);

	// Legs that actually have seat features — used for rendering once queries settle.
	const eligibleLegs = useMemo(() => {
		if (!allSettled) return allPackageLegs;
		return allPackageLegs.filter(
			(leg) => (featuresByLegId.get(leg.id)?.length ?? 0) > 0,
		);
	}, [allPackageLegs, allSettled, featuresByLegId]);

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
		if (allSettled && eligibleLegs.length === 0) {
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
		eligibleLegs.length,
		navigate,
		offerId,
	]);

	const assignAssetMutation = useAssignAsset();

	async function handleSeatClick(legId: string, feature: AssetFeature) {
		if (feature.properties.type !== "seat") return;
		if (feature.properties.availability !== "AVAILABLE") return;
		if (!pkg?.id) return;
		// Clicking already-selected seat is a no-op — OMSA has no "deselect" endpoint
		const current = selectedAssets[legId];
		if (current?.assetId === feature.id) return;

		setAssigningLegId(legId);
		setAssignError(null);
		try {
			const result = await assignAssetMutation.mutateAsync({
				inputs: {
					type: "asset",
					packageId: pkg.id,
					legId,
					assetId: feature.id,
					...(current ? { replaceAssetId: current.assetId } : {}),
				},
			});

			const assetInfo: SelectedAssetInfo = {
				assetId: feature.id,
				carriage: feature.properties.carriage,
				seatNumber: feature.properties.seatNumber,
			};

			const currentSession = readPackageSession();
			writePackageSession({
				...currentSession,
				package: result,
				selectedAssetsByLegId: {
					...currentSession.selectedAssetsByLegId,
					[legId]: assetInfo,
				},
			});
			setPkg(result);
			setSelectedAssets((prev) => ({ ...prev, [legId]: assetInfo }));
		} catch (err) {
			if (isAssetNotAvailable(err)) {
				queryClient.invalidateQueries({
					queryKey: ["assets", pkg.id, legId],
				});
				setAssignError("That seat was just taken. Please choose another.");
			} else {
				setAssignError(
					err instanceof Error ? err.message : "Could not reserve seat.",
				);
			}
		} finally {
			setAssigningLegId(null);
		}
	}

	function handleContinue() {
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
	const partyStr =
		allParties.length > 0
			? allParties.map((p) => partyLabel(p)).join(", ")
			: undefined;

	const previewTotal = pkg?.price?.amount ?? 0;
	const previewCurrency = pkg?.price?.currencyCode ?? "NOK";

	const seatSummarySlot =
		eligibleLegs.length > 0 ? (
			<div className="flex flex-col gap-1 border-t border-wayfare-line pt-3">
				<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
					Seats
				</p>
				{eligibleLegs.map((leg) => {
					const info = selectedAssets[leg.id];
					return (
						<p key={leg.id} className="text-xs text-wayfare-text-secondary">
							{info ? (
								<>
									Seat {info.seatNumber ?? info.assetId} · Carriage{" "}
									{info.carriage}
								</>
							) : (
								<span className="italic">No seat selected</span>
							)}
						</p>
					);
				})}
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
			<Button variant="primary" onClick={handleContinue}>
				Continue to checkout
				<RightArrowIcon aria-hidden="true" />
			</Button>
		</div>
	) : null;

	const legsToRender = allSettled ? eligibleLegs : allPackageLegs;

	return (
		<PageShell
			title="Choose your seats"
			subtitle="Optional — continue without selecting if you prefer"
			stepper={<JourneyStepper />}
			rightRail={rightRail}
		>
			<div className="flex flex-col gap-8">
				{legsToRender.map((leg, legIdx) => {
					const legId = leg.id;
					const features = featuresByLegId.get(legId) ?? [];
					const isLoading = isLoadingByLegId.get(legId) ?? true;

					const carriages = [
						...new Set(features.map((f) => f.properties.carriage)),
					].sort((a, b) => {
						const na = Number(a);
						const nb = Number(b);
						if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
						return a.localeCompare(b);
					});

					const selectedCarriage =
						selectedCarriageByLeg.get(legId) ?? carriages[0] ?? "";

					const carriageFeatures = features.filter(
						(f) => f.properties.carriage === selectedCarriage,
					);

					const selectedInfo = selectedAssets[legId];
					const isAssigning = assigningLegId === legId;
					const hasAvailable = carriageFeatures.some(
						(f) =>
							f.properties.type === "seat" &&
							f.properties.availability === "AVAILABLE",
					);

					const legLabel =
						leg.from && leg.to
							? `${leg.from.name ?? leg.from.placeId} → ${leg.to.name ?? leg.to.placeId}`
							: `Leg ${legIdx + 1}`;

					return (
						<div key={legId} className="flex flex-col gap-3">
							<div className="overflow-hidden rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
								{/* Leg header + carriage selector */}
								<div className="border-b border-wayfare-line px-3 py-2">
									{legsToRender.length > 1 && (
										<p className="mb-1 text-xs font-semibold text-wayfare-text-secondary">
											{legLabel}
										</p>
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
												setSelectedCarriageByLeg(
													(prev) => new Map(prev).set(legId, carriages[idx]),
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
											selectedAssetId={selectedInfo?.assetId}
											loading={isAssigning}
											onSeatClick={
												isAssigning
													? undefined
													: (f) => handleSeatClick(legId, f)
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
							{legIdx === legsToRender.length - 1 && (
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
