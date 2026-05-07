import { LeftArrowIcon, RightArrowIcon } from "@entur/icons";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import BundleCard, {
	buildBundles,
	type OfferBundle,
} from "../components/checkout/BundleCard";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";
import { PurchaseFlowProvider } from "../context/purchase-flow";
import { readSearchSession, type SearchContext } from "../lib/search-session";
import type { IndividualTraveller, OfferCollection } from "../types/search";

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
		<p
			className="text-xs font-semibold uppercase tracking-wide"
			style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
		>
			{children}
		</p>
	);
}

function Divider({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-3 my-1">
			<div style={{ flex: 1, height: 1, background: "var(--wayfare-line)" }} />
			<span
				className="shrink-0 text-xs"
				style={{ color: "var(--wayfare-text-secondary)" }}
			>
				{label}
			</span>
			<div style={{ flex: 1, height: 1, background: "var(--wayfare-line)" }} />
		</div>
	);
}

function OffersScreen() {
	const navigate = useNavigate();
	const [selectedFullKey, setSelectedFullKey] = useState<
		string | number | null
	>(null);
	const [selectedLegKeys, setSelectedLegKeys] = useState<
		Partial<Record<number, string | number>>
	>({});
	const [hydrated, setHydrated] = useState(false);
	const [collection, setCollection] = useState<OfferCollection | null>(null);
	const [context, setContext] = useState<SearchContext | null>(null);

	useEffect(() => {
		const session = readSearchSession();
		setCollection(session.collection);
		setContext(session.context);
		setHydrated(true);
	}, []);

	const travellers: IndividualTraveller[] = context?.travellers ?? [];
	const bundles: OfferBundle[] = buildBundles(collection?.offers ?? []);

	// Detect multi-leg journeys and split bundles into tiers
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

	// Mix-and-match is only possible when every sequence has its own partial bundles
	const canMixAndMatch =
		isMultiLeg && allSequences.every((s) => perSeqMap.has(s));
	const showSections = isMultiLeg && perSeqMap.size > 0;

	const allLegsSelected =
		canMixAndMatch && allSequences.every((s) => selectedLegKeys[s] != null);
	const canContinue = selectedFullKey !== null || allLegsSelected;

	const formattedDate = context?.travelDate
		? new Date(context.travelDate).toLocaleString("no-NO", {
				weekday: "short",
				day: "numeric",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			})
		: null;

	function handleSelectFull(key: string | number) {
		setSelectedFullKey(key);
		setSelectedLegKeys({});
	}

	function handleSelectLeg(seq: number, key: string | number) {
		setSelectedFullKey(null);
		setSelectedLegKeys((prev) => ({ ...prev, [seq]: key }));
	}

	function handleContinue() {
		let offerIds: string[] = [];
		if (selectedFullKey !== null) {
			const bundle = fullBundles.find((b) => b.groupKey === selectedFullKey);
			offerIds = bundle?.offers.map((o) => o.id!).filter(Boolean) ?? [];
		} else {
			for (const seq of allSequences) {
				const key = selectedLegKeys[seq];
				if (key != null) {
					const bundle = (perSeqMap.get(seq) ?? []).find(
						(b) => b.groupKey === key,
					);
					if (bundle)
						offerIds.push(...bundle.offers.map((o) => o.id!).filter(Boolean));
				}
			}
		}
		if (offerIds.length === 0) return;
		navigate({
			to: "/checkout/$offerId",
			params: { offerId: offerIds.join(",") },
		});
	}

	if (!hydrated) {
		return (
			<PageShell title="Loading offers">
				<p style={{ color: "var(--wayfare-text-secondary)" }}>Loading…</p>
			</PageShell>
		);
	}

	if (bundles.length === 0) {
		return (
			<PageShell title="No offers found">
				<div className="mt-8 text-center">
					<p style={{ color: "var(--wayfare-text-secondary)" }}>
						No travel offers were found for your search.
					</p>
					<Link
						to="/"
						className="mt-4 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
						style={{ background: "var(--wayfare-primary)", color: "#fff" }}
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
		>
			<div className="mx-auto max-w-xl">
				{context && (
					<div
						className="mb-5 rounded-lg p-4"
						style={{
							background: "var(--wayfare-surface-strong)",
							border: "1px solid var(--wayfare-line)",
						}}
					>
						<div className="flex items-center gap-2">
							<span
								className="text-sm font-semibold"
								style={{ color: "var(--wayfare-text)" }}
							>
								{context.from.name ?? context.from.placeId}
							</span>
							<RightArrowIcon
								aria-hidden="true"
								style={{
									color: "var(--wayfare-text-secondary)",
									flexShrink: 0,
								}}
							/>
							<span
								className="text-sm font-semibold"
								style={{ color: "var(--wayfare-text)" }}
							>
								{context.to.name ?? context.to.placeId}
							</span>
						</div>
						{formattedDate && (
							<p
								className="mt-1 text-xs"
								style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
							>
								{formattedDate}
							</p>
						)}
						{travellers.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1.5">
								{travellers.map((t) => (
									<span
										key={t.id}
										className="inline-flex items-center rounded-full px-2 py-0.5 text-xs"
										style={{
											background: "var(--wayfare-bg)",
											color: "var(--wayfare-text-secondary)",
											border: "1px solid var(--wayfare-line)",
										}}
									>
										{t.age != null ? `${t.age} yrs` : t.id}
									</span>
								))}
							</div>
						)}
					</div>
				)}

				<div className="flex flex-col gap-3">
					{/* Full journey section — labelled only when there are also per-leg sections */}
					{showSections && fullBundles.length > 0 && (
						<SectionLabel>Full journey</SectionLabel>
					)}
					{fullBundles.map((bundle) => (
						<BundleCard
							key={String(bundle.groupKey)}
							bundle={bundle}
							travellers={travellers}
							selected={selectedFullKey === bundle.groupKey}
							onSelect={() => handleSelectFull(bundle.groupKey)}
						/>
					))}

					{/* Per-leg sections — shown when some bundles don't cover all sequences */}
					{showSections && (
						<>
							<Divider
								label={canMixAndMatch ? "or choose by leg" : "partial journey"}
							/>
							{allSequences.map((seq) => {
								const legBundles = perSeqMap.get(seq);
								if (!legBundles?.length) return null;
								return (
									<div key={seq} className="flex flex-col gap-3">
										<SectionLabel>Leg {seq}</SectionLabel>
										{legBundles.map((bundle) => (
											<BundleCard
												key={String(bundle.groupKey)}
												bundle={bundle}
												travellers={travellers}
												selected={
													canMixAndMatch
														? selectedLegKeys[seq] === bundle.groupKey
														: selectedFullKey === bundle.groupKey
												}
												onSelect={
													canMixAndMatch
														? () => handleSelectLeg(seq, bundle.groupKey)
														: () => handleSelectFull(bundle.groupKey)
												}
											/>
										))}
									</div>
								);
							})}
						</>
					)}
				</div>

				<div className="mt-6 flex gap-3">
					<Link
						to="/"
						className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold no-underline transition-colors"
						style={{
							borderColor: "var(--wayfare-line)",
							color: "var(--wayfare-text)",
						}}
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
		</PageShell>
	);
}
