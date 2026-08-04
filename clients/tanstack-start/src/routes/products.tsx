import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import Illustration from "../components/shared/Illustration";
import OperatorIcon from "../components/shared/OperatorIcon";
import Button from "../components/ui/Button";
import type { TravelerGroup } from "../context/search-form";
import { formatPrice } from "../lib/format-price";
import { buildAuthorityOfferQuery } from "../lib/offer-query";
import { findOperator, type Operator } from "../lib/operators";
import { getPreferredOperator } from "../lib/preferences-storage";
import { writeSearchSession } from "../lib/search-session";
import type { Offer } from "../types/search";

export const Route = createFileRoute("/products")({ component: ProductsPage });

const DEFAULT_TRAVELERS: TravelerGroup[] = [
	{ id: "adult", ageGroup: "ADULT", count: 1, minAge: 18 },
];

function offerName(offer: Offer): string {
	const name =
		offer.properties?.summary?.name?.trim() ||
		offer.properties?.products?.[0]?.productName?.trim();
	return name || "Product";
}

function ProductsPage() {
	const [operatorCode, setOperatorCode] = useState<string | undefined>();
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setOperatorCode(getPreferredOperator());
		setHydrated(true);
	}, []);

	const operator = findOperator(operatorCode);

	if (!hydrated) {
		return (
			<PageShell title="Products">
				<div className="flex justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
				</div>
			</PageShell>
		);
	}

	if (!operator?.authorityRef) {
		return <NoOperator operator={operator} />;
	}

	return <ProductList operator={operator} />;
}

function NoOperator({ operator }: { operator?: Operator }) {
	return (
		<PageShell title="Products" contentClassName="mx-auto max-w-xl">
			<div className="flex flex-col items-center py-12 text-center">
				<Illustration
					name="turtle-magnifying-glass"
					size="lg"
					decorative
					className="mb-6"
				/>
				<p className="text-sm font-semibold text-wayfare-text">
					{operator
						? `${operator.name} has no products to browse`
						: "Pick a preferred operator first"}
				</p>
				<p className="mt-1 max-w-xs text-xs text-wayfare-text-secondary">
					{operator
						? "Products sold without zone validity, like city bike passes, come from the operator directly. This one offers none."
						: "Products like city bike passes are sold per operator, so we need to know which one to ask."}
				</p>
				<Link
					to="/settings"
					search={{ tab: "app", pendingCardId: undefined }}
					className="mt-6 inline-block rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white no-underline"
				>
					{operator ? "Change operator" : "Choose operator"}
				</Link>
			</div>
		</PageShell>
	);
}

function ProductList({ operator }: { operator: Operator }) {
	const navigate = useNavigate();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const authorityRef = operator.authorityRef as string;
	const { data, isPending, error } = useQuery(
		buildAuthorityOfferQuery(authorityRef, operator.name, DEFAULT_TRAVELERS),
	);

	const offers = (data?.offers ?? []).filter((offer) => offer.id);

	function handleContinue() {
		if (!selectedId || !data) return;
		// Checkout reads the collection from the search session.
		writeSearchSession(data, {
			authority: operator.code,
			travelDate: new Date().toISOString(),
		});
		navigate({
			to: "/checkout/$offerId",
			params: { offerId: selectedId },
			search: { pendingCardId: undefined },
		});
	}

	return (
		<PageShell
			title="Products"
			subtitle={`Sold directly by ${operator.name}`}
			contentClassName="mx-auto max-w-xl"
		>
			<div className="mb-5 flex items-center gap-3 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4">
				<OperatorIcon operator={operator} />
				<span className="min-w-0 flex-1 truncate text-sm font-semibold text-wayfare-text">
					{operator.name}
				</span>
				<Link
					to="/settings"
					search={{ tab: "app", pendingCardId: undefined }}
					className="shrink-0 text-xs text-wayfare-primary"
				>
					Change
				</Link>
			</div>

			{isPending && (
				<div className="flex justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
				</div>
			)}

			{error && (
				<p className="rounded-lg bg-wayfare-accent-soft px-3 py-2 text-sm text-wayfare-primary">
					{error.message}
				</p>
			)}

			{!isPending && !error && offers.length === 0 && (
				<div className="flex flex-col items-center py-12 text-center">
					<Illustration
						name="turtle-magnifying-glass"
						size="lg"
						decorative
						className="mb-6"
					/>
					<p className="text-sm font-semibold text-wayfare-text">
						No products available
					</p>
					<p className="mt-1 max-w-xs text-xs text-wayfare-text-secondary">
						{operator.name} sells nothing that works without a route right now.
					</p>
				</div>
			)}

			{offers.length > 0 && (
				<>
					<div className="flex flex-col gap-2">
						{offers.map((offer) => {
							const id = offer.id as string;
							const selected = selectedId === id;
							const price = offer.properties?.price;
							const description = offer.properties?.summary?.description;

							return (
								<label
									key={id}
									className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${selected ? "border-wayfare-primary bg-wayfare-accent-soft" : "border-wayfare-line bg-wayfare-surface-strong"}`}
								>
									<input
										type="radio"
										name="product"
										checked={selected}
										onChange={() => setSelectedId(id)}
										className="sr-only"
									/>
									<span
										className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${selected ? "border-wayfare-primary" : "border-wayfare-text-secondary"}`}
									>
										{selected && (
											<span className="h-2 w-2 rounded-full bg-wayfare-primary" />
										)}
									</span>
									<span className="min-w-0 flex-1">
										<span className="flex items-start justify-between gap-3">
											<span className="text-sm font-semibold text-wayfare-text">
												{offerName(offer)}
											</span>
											{price && (
												<span className="shrink-0 text-sm font-bold text-wayfare-primary">
													{formatPrice(
														price.amount,
														price.currencyCode ?? "NOK",
													)}
												</span>
											)}
										</span>
										{description && (
											<span className="mt-1 block text-xs text-wayfare-text-secondary">
												{description}
											</span>
										)}
									</span>
								</label>
							);
						})}
					</div>

					<div className="mt-5">
						<Button
							variant="primary"
							fluid
							disabled={!selectedId}
							onClick={handleContinue}
						>
							Continue to checkout
						</Button>
					</div>
				</>
			)}
		</PageShell>
	);
}
