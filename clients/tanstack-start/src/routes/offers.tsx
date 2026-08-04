import { LeftArrowIcon, RightArrowIcon } from "@entur/icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import BundleCard, {
	buildBundles,
	type OfferBundle,
} from "../components/checkout/BundleCard";
import PageShell from "../components/layout/PageShell";
import FavoriteToggle from "../components/search/FavoriteToggle";
import Illustration from "../components/shared/Illustration";
import Button from "../components/ui/Button";
import { PurchaseFlowProvider } from "../context/purchase-flow";
import {
	type LegInfo,
	readSearchSession,
	type SearchContext,
} from "../lib/search-session";
import { partyLabel, type TravelParty } from "../lib/travel-party";
import type { OfferCollection } from "../types/search";

export type { TravelParty };

export const Route = createFileRoute("/offers")({ component: OffersPage });

function OffersPage() {
	return (
		<PurchaseFlowProvider>
			<OffersScreen />
		</PurchaseFlowProvider>
	);
}

function SectionLabel({ children }: { children: ReactNode }) {
	return (
		<p className="m-0 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
			{children}
		</p>
	);
}

function LegLabel({ leg, seq }: { leg?: LegInfo; seq: number }) {
	if (!leg) {
		return <SectionLabel>Leg {seq}</SectionLabel>;
	}
	return (
		<div className="flex items-center gap-1.5 text-xs">
			<span className="font-semibold text-wayfare-text">{leg.from}</span>
			<RightArrowIcon
				aria-hidden="true"
				className="shrink-0 text-wayfare-text-secondary"
			/>
			<span className="font-semibold text-wayfare-text">{leg.to}</span>
		</div>
	);
}

function Divider({ label }: { label: string }) {
	return (
		<div className="my-1 flex items-center gap-3">
			<div className="h-px flex-1 bg-wayfare-line" />
			<span className="shrink-0 text-xs text-wayfare-text-secondary">
				{label}
			</span>
			<div className="h-px flex-1 bg-wayfare-line" />
		</div>
	);
}

function getConflictingKeys(
	bundle: OfferBundle,
	keys: Set<string | number>,
	allBundles: OfferBundle[],
): (string | number)[] {
	const pairs = new Set<string>();
	for (const offer of bundle.offers) {
		for (const leg of offer.properties?.legs ?? []) {
			if (leg.traveller && leg.sequenceNumber != null) {
				pairs.add(`${leg.traveller}:${leg.sequenceNumber}`);
			}
		}
	}
	return allBundles
		.filter((b) => keys.has(b.groupKey) && b.groupKey !== bundle.groupKey)
		.filter((b) =>
			b.offers.some((o) =>
				(o.properties?.legs ?? []).some(
					(l) =>
						l.traveller &&
						l.sequenceNumber != null &&
						pairs.has(`${l.traveller}:${l.sequenceNumber}`),
				),
			),
		)
		.map((b) => b.groupKey);
}

function computeCoverage(
	keys: Set<string | number>,
	allBundles: OfferBundle[],
): Map<string, Set<number>> {
	const coverage = new Map<string, Set<number>>();
	for (const bundle of allBundles) {
		if (!keys.has(bundle.groupKey)) continue;
		for (const offer of bundle.offers) {
			for (const leg of offer.properties?.legs ?? []) {
				if (!leg.traveller || leg.sequenceNumber == null) continue;
				if (!coverage.has(leg.traveller))
					coverage.set(leg.traveller, new Set());
				coverage.get(leg.traveller)?.add(leg.sequenceNumber);
			}
		}
	}
	return coverage;
}

function OffersScreen() {
	const navigate = useNavigate();
	const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
		new Set(),
	);
	const [hydrated, setHydrated] = useState(false);
	const [collection, setCollection] = useState<OfferCollection | null>(null);
	const [context, setContext] = useState<SearchContext | null>(null);

	useEffect(() => {
		const session = readSearchSession();
		setCollection(session.collection);
		setContext(session.context);
		setHydrated(true);
	}, []);

	const allParties: TravelParty[] = [
		...(context?.profiles ?? []),
		...(context?.travellers ?? []),
	];
	const bundles: OfferBundle[] = buildBundles(collection?.offers ?? []);

	const allSequences = [...new Set(bundles.flatMap((b) => b.sequences))].sort(
		(a, b) => a - b,
	);
	const isMultiLeg = allSequences.length > 1;

	const fullBundles = isMultiLeg
		? bundles.filter((b) => allSequences.every((s) => b.sequences.includes(s)))
		: bundles;

	const perSeqMap = new Map<number, OfferBundle[]>();
	if (isMultiLeg) {
		const partial = bundles.filter((b) => !fullBundles.includes(b));
		for (const seq of allSequences) {
			const seqBundles = partial.filter((b) => b.sequences.includes(seq));
			if (seqBundles.length > 0) perSeqMap.set(seq, seqBundles);
		}
	}

	const showSections = isMultiLeg && perSeqMap.size > 0;

	// Use the offer collection as the source of truth for coverage.
	const allTravellerIds = [
		...new Set(
			(collection?.offers ?? []).flatMap(
				(o) =>
					(o.properties?.legs ?? [])
						.map((l) => l.traveller)
						.filter(Boolean) as string[],
			),
		),
	];

	const coverage = computeCoverage(selectedKeys, bundles);
	const canContinue =
		allTravellerIds.length > 0 &&
		allTravellerIds.every((t) =>
			allSequences.every((s) => coverage.get(t)?.has(s)),
		);

	const uncoveredParties = allParties.filter((p) => {
		const partySeqs = coverage.get(p.id);
		return allSequences.some((s) => !partySeqs?.has(s));
	});

	function handleToggle(bundle: OfferBundle) {
		setSelectedKeys((prev) => {
			const next = new Set(prev);
			if (next.has(bundle.groupKey)) {
				next.delete(bundle.groupKey);
			} else {
				for (const key of getConflictingKeys(bundle, prev, bundles)) {
					next.delete(key);
				}
				next.add(bundle.groupKey);
			}
			return next;
		});
	}

	function handleContinue() {
		const offerIds = bundles
			.filter((b) => selectedKeys.has(b.groupKey))
			.flatMap((b) =>
				b.offers.map((o) => o.id).filter((id): id is string => Boolean(id)),
			);
		if (offerIds.length === 0) return;
		navigate({
			to: "/checkout/$offerId",
			params: { offerId: offerIds.join(",") },
			search: { pendingCardId: undefined },
		});
	}

	const formattedDate = context?.travelDate
		? new Date(context.travelDate).toLocaleString("no-NO", {
				weekday: "short",
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			})
		: null;

	if (!hydrated) {
		return (
			<PageShell title="Loading offers">
				<div className="flex flex-col items-center py-12 text-center">
					<Illustration
						name="crocodile-on-bus"
						size="lg"
						decorative
						className="mb-6"
					/>
					<div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
					<p className="text-sm text-wayfare-text-secondary">
						Finding the best routes…
					</p>
				</div>
			</PageShell>
		);
	}

	if (bundles.length === 0) {
		return (
			<PageShell title="No offers found">
				<div className="flex flex-col items-center py-12 text-center">
					<Illustration
						name="turtle-magnifying-glass"
						size="lg"
						decorative
						className="mb-6"
					/>
					<p className="text-sm font-semibold text-wayfare-text">
						No offers found
					</p>
					<p className="mt-1 max-w-xs text-xs text-wayfare-text-secondary">
						No travel offers were found for your search.
					</p>
					<Link
						to="/"
						className="mt-6 inline-block rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white no-underline"
					>
						Back to search
					</Link>
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="Available offers"
			subtitle={`${bundles.length} option${bundles.length !== 1 ? "s" : ""} found`}
			contentClassName="mx-auto max-w-xl"
		>
			<div>
				{context?.from && context.to && (
					<div className="mb-5 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4">
						<div className="flex items-center justify-between gap-2">
							<div className="flex min-w-0 items-center gap-2">
								<span className="truncate text-sm font-semibold text-wayfare-text">
									{context.from.name ?? context.from.placeId}
								</span>
								<RightArrowIcon
									aria-hidden="true"
									className="shrink-0 text-wayfare-text-secondary"
								/>
								<span className="truncate text-sm font-semibold text-wayfare-text">
									{context.to.name ?? context.to.placeId}
								</span>
							</div>
							<FavoriteToggle from={context.from} to={context.to} />
						</div>
						{formattedDate && (
							<p className="m-0 mt-1 text-xs text-wayfare-text-secondary">
								{formattedDate}
							</p>
						)}
						{allParties.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1.5">
								{allParties.map((p) => (
									<span
										key={p.id}
										className="inline-flex items-center rounded-full border border-wayfare-line bg-wayfare-bg px-2 py-0.5 text-xs text-wayfare-text-secondary"
									>
										{partyLabel(p)}
									</span>
								))}
							</div>
						)}
					</div>
				)}

				<div className="flex flex-col gap-3">
					{showSections && fullBundles.length > 0 && (
						<SectionLabel>Full journey</SectionLabel>
					)}
					{fullBundles.map((bundle) => (
						<BundleCard
							key={String(bundle.groupKey)}
							bundle={bundle}
							parties={allParties}
							selected={selectedKeys.has(bundle.groupKey)}
							onSelect={() => handleToggle(bundle)}
						/>
					))}

					{showSections && (
						<>
							<Divider label="or choose by leg" />
							{allSequences.map((seq) => {
								const legBundles = perSeqMap.get(seq);
								if (!legBundles?.length) return null;
								return (
									<div key={seq} className="flex flex-col gap-3">
										<LegLabel seq={seq} leg={context?.legs?.[seq - 1]} />
										{legBundles.map((bundle) => (
											<BundleCard
												key={String(bundle.groupKey)}
												bundle={bundle}
												parties={allParties}
												selected={selectedKeys.has(bundle.groupKey)}
												onSelect={() => handleToggle(bundle)}
											/>
										))}
									</div>
								);
							})}
						</>
					)}
				</div>

				<div className="mt-6 flex flex-col gap-2">
					{selectedKeys.size > 0 &&
						!canContinue &&
						uncoveredParties.length > 0 && (
							<p className="text-center text-xs text-wayfare-text-secondary">
								Still needed: {uncoveredParties.map(partyLabel).join(", ")}
							</p>
						)}
					<div className="flex gap-3">
						<Link
							to="/"
							className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-wayfare-line px-5 py-2.5 text-sm font-semibold text-wayfare-text no-underline transition-colors"
						>
							<LeftArrowIcon aria-hidden="true" />
							Back
						</Link>
						<Button
							variant="primary"
							className="flex-1"
							disabled={!canContinue}
							onClick={handleContinue}
						>
							Continue to checkout
							<RightArrowIcon aria-hidden="true" />
						</Button>
					</div>
				</div>
			</div>
		</PageShell>
	);
}
