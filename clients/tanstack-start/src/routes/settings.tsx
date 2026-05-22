import { UserIcon } from "@entur/icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import PageShell from "../components/layout/PageShell";
import PaymentMethodsTab from "../components/settings/PaymentMethodsTab";
import Illustration from "../components/shared/Illustration";
import Button from "../components/ui/Button";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useDevConfig } from "../context/dev-config";
import { useProfile } from "../context/profile";
import { useCustomerSearch } from "../hooks/use-customers";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import {
	type FavoriteRoute,
	getFavorites,
	removeFavorite,
} from "../lib/favorites-storage";
import { clearPackages, getPackages } from "../lib/ticket-storage";
import type { OmsaRuntimeMode } from "../server/runtime-config";
import { getResolvedDevConfig } from "../server-functions/dev-config";
import type { CustomerSearchParams, OmsaCustomer } from "../types/customer";

type Tab = "profile" | "payment" | "favorites" | "app" | "developer";

export const Route = createFileRoute("/settings")({
	validateSearch: (search: Record<string, unknown>) => ({
		tab: (search.tab as Tab | undefined) ?? "profile",
		pendingCardId: search.pendingCardId
			? Number(search.pendingCardId)
			: undefined,
	}),
	component: SettingsPage,
});

function customerDisplayName(c: OmsaCustomer): string {
	const parts = [c.firstName, c.lastName].filter(Boolean);
	return parts.length > 0 ? parts.join(" ") : (c.id ?? "Unknown");
}

function ProfileTab() {
	const { customer, signIn, signOut } = useProfile();
	const [searchInput, setSearchInput] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});
	const [searchParams, setSearchParams] = useState<CustomerSearchParams>({});
	const [hasSearched, setHasSearched] = useState(false);

	const { data, isFetching, error } = useCustomerSearch(
		searchParams,
		hasSearched,
	);

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		const params: CustomerSearchParams = {};
		if (searchInput.firstName.trim())
			params.firstName = searchInput.firstName.trim();
		if (searchInput.lastName.trim())
			params.lastName = searchInput.lastName.trim();
		if (searchInput.email.trim()) params.email = searchInput.email.trim();
		if (!Object.keys(params).length) return;
		setSearchParams(params);
		setHasSearched(true);
	}

	return (
		<div className="space-y-4">
			{!customer && !hasSearched && (
				<div className="flex flex-col items-center py-8 text-center">
					<Illustration
						name="ninja-turtle"
						size="lg"
						decorative
						className="mb-4"
					/>
					<p className="text-sm font-semibold text-wayfare-text">
						Not signed in
					</p>
					<p className="mt-1 max-w-xs text-xs text-wayfare-text-secondary">
						Search to pick a customer profile, or stay incognito.
					</p>
				</div>
			)}

			{customer && (
				<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
						Signed in as
					</p>
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<Illustration name="turtle-food-bowl" size="sm" decorative />
							<div>
								<p className="m-0 text-sm font-semibold text-wayfare-text">
									{customerDisplayName(customer)}
								</p>
								{customer.email && (
									<p className="m-0 text-xs text-wayfare-text-secondary">
										{customer.email}
									</p>
								)}
								{customer.id && (
									<p className="m-0 font-mono text-xs text-wayfare-text-secondary">
										{customer.id}
									</p>
								)}
							</div>
						</div>
						<Button variant="secondary" onClick={signOut}>
							Sign out
						</Button>
					</div>
				</section>
			)}

			<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
				<h2 className="mb-4 text-sm font-semibold text-wayfare-text">
					Find a customer
				</h2>
				<form onSubmit={handleSearch} className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label
								htmlFor="settings-firstName"
								className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
							>
								First name
							</label>
							<input
								id="settings-firstName"
								type="text"
								value={searchInput.firstName}
								onChange={(e) =>
									setSearchInput((s) => ({ ...s, firstName: e.target.value }))
								}
								className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
								placeholder="e.g. Ola"
							/>
						</div>
						<div>
							<label
								htmlFor="settings-lastName"
								className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
							>
								Last name
							</label>
							<input
								id="settings-lastName"
								type="text"
								value={searchInput.lastName}
								onChange={(e) =>
									setSearchInput((s) => ({ ...s, lastName: e.target.value }))
								}
								className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
								placeholder="e.g. Nordmann"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="settings-email"
							className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
						>
							Email
						</label>
						<input
							id="settings-email"
							type="email"
							value={searchInput.email}
							onChange={(e) =>
								setSearchInput((s) => ({ ...s, email: e.target.value }))
							}
							className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm text-wayfare-text"
							placeholder="e.g. ola@example.com"
						/>
					</div>
					<Button
						type="submit"
						variant="primary"
						disabled={
							isFetching ||
							(!searchInput.firstName &&
								!searchInput.lastName &&
								!searchInput.email)
						}
						loading={isFetching}
					>
						Search
					</Button>
				</form>
			</section>

			{error && (
				<p className="rounded-xl bg-wayfare-accent-soft px-4 py-3 text-sm text-wayfare-primary">
					{error instanceof Error ? error.message : "Search failed"}
				</p>
			)}

			{hasSearched && !isFetching && data && (
				<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
					<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
						{data.numberMatched ?? data.customers?.length ?? 0} result
						{(data.numberMatched ?? data.customers?.length ?? 0) !== 1
							? "s"
							: ""}
					</p>
					{!data.customers?.length ? (
						<p className="text-sm text-wayfare-text-secondary">
							No customers found.
						</p>
					) : (
						<ul className="divide-y divide-wayfare-line">
							{data.customers.map((c) => (
								<li
									key={c.id}
									className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
								>
									<div className="flex items-center gap-3">
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
												customer?.id === c.id
													? "bg-wayfare-primary text-white"
													: "bg-wayfare-accent-soft text-wayfare-primary"
											}`}
										>
											{[c.firstName?.[0], c.lastName?.[0]]
												.filter(Boolean)
												.join("") || <UserIcon aria-hidden="true" />}
										</span>
										<div>
											<p className="m-0 text-sm font-medium text-wayfare-text">
												{customerDisplayName(c)}
											</p>
											{c.email && (
												<p className="m-0 text-xs text-wayfare-text-secondary">
													{c.email}
												</p>
											)}
										</div>
									</div>
									<Button
										variant={customer?.id === c.id ? "secondary" : "primary"}
										onClick={() => signIn(c)}
										disabled={customer?.id === c.id}
									>
										{customer?.id === c.id ? "Active" : "Select"}
									</Button>
								</li>
							))}
						</ul>
					)}
				</section>
			)}
		</div>
	);
}

function AppTab() {
	const [cleared, setCleared] = useState(false);
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(getPackages().length);
	}, []);

	function handleClear() {
		if (!confirm(`Delete ${count} saved ticket${count !== 1 ? "s" : ""}?`))
			return;
		clearPackages();
		setCleared(true);
	}

	return (
		<div className="space-y-4">
			<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
				<h2 className="mb-4 text-sm font-semibold text-wayfare-text">
					Ticket wallet
				</h2>
				<div className="flex items-center justify-between">
					<div>
						<p className="m-0 text-sm text-wayfare-text">Saved tickets</p>
						<p className="m-0 text-xs text-wayfare-text-secondary">
							{cleared ? 0 : count} ticket{count !== 1 ? "s" : ""} stored
							locally
						</p>
					</div>
					<Button
						variant="secondary"
						disabled={cleared || count === 0}
						onClick={handleClear}
					>
						{cleared ? "Cleared" : "Clear history"}
					</Button>
				</div>
			</section>

			<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
				<h2 className="mb-4 text-sm font-semibold text-wayfare-text">About</h2>
				<dl className="space-y-2 text-sm">
					<div className="flex justify-between">
						<dt className="text-wayfare-text-secondary">App</dt>
						<dd className="font-semibold text-wayfare-text">Wayfare</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-wayfare-text-secondary">API</dt>
						<dd className="text-wayfare-text">OMSA v1 (OMSA_ENV_MODE)</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-wayfare-text-secondary">Stack</dt>
						<dd className="text-wayfare-text">TanStack Start + Entur DS</dd>
					</div>
				</dl>
			</section>
		</div>
	);
}

const ENV_MODE_OPTIONS = [
	{ value: "dev" as const, label: "dev" },
	{ value: "staging" as const, label: "staging" },
	{ value: "local" as const, label: "local" },
	{ value: "local-tst" as const, label: "local-tst" },
] as const;

function DeveloperTab() {
	const { overrides, setOverrides, resetOverrides } = useDevConfig();

	const { data: resolved } = useQuery({
		queryKey: ["resolved-dev-config", overrides.envMode],
		queryFn: () => getResolvedDevConfig(),
		staleTime: 30_000,
	});

	const [formMode, setFormMode] = useState<OmsaRuntimeMode>(
		() => (overrides.envMode as OmsaRuntimeMode | undefined) ?? "dev",
	);
	const [formDistributionChannel, setFormDistributionChannel] = useState(
		() => overrides.distributionChannel ?? "",
	);
	const [formClientName, setFormClientName] = useState(
		() => overrides.clientName ?? "",
	);
	const [formPos, setFormPos] = useState(() => overrides.pos ?? "");
	const [saved, setSaved] = useState(false);
	const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (savedTimerRef.current !== null) clearTimeout(savedTimerRef.current);
		};
	}, []);

	useEffect(() => {
		if (!overrides.envMode && resolved?.envDefaults.mode) {
			setFormMode(resolved.envDefaults.mode as OmsaRuntimeMode);
		}
	}, [resolved?.envDefaults.mode, overrides.envMode]);

	function handleSave() {
		const next: DevConfigOverrides = {
			envMode: formMode,
			distributionChannel: formDistributionChannel || undefined,
			clientName: formClientName || undefined,
			pos: formPos || undefined,
		};
		setOverrides(next);
		setSaved(true);
		if (savedTimerRef.current !== null) clearTimeout(savedTimerRef.current);
		savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
	}

	function handleReset() {
		resetOverrides();
		setFormMode(
			(resolved?.envDefaults.mode as OmsaRuntimeMode | undefined) ?? "dev",
		);
		setFormDistributionChannel("");
		setFormClientName("");
		setFormPos("");
	}

	return (
		<div className="space-y-4">
			<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
				<h2 className="mb-4 text-sm font-semibold text-wayfare-text">
					Environment
				</h2>
				<SegmentedControl
					legend="Environment mode"
					options={ENV_MODE_OPTIONS}
					value={formMode}
					onChange={setFormMode}
				/>
				<p className="mt-2 text-xs text-wayfare-text-secondary">
					.env default:{" "}
					<span className="font-mono">{resolved?.envDefaults.mode ?? "…"}</span>
				</p>
			</section>

			{resolved && (
				<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
					<h2 className="mb-3 text-sm font-semibold text-wayfare-text">
						Resolved endpoints
					</h2>
					<dl className="space-y-2 text-xs">
						{(
							[
								["OMSA", resolved.effectiveOmsaBaseUrl],
								["Sales", resolved.effectiveSalesBaseUrl],
								["Journey planner", resolved.effectiveJourneyPlannerUrl],
								["Geocoder", resolved.effectiveGeocoderUrl],
							] as const
						).map(([label, url]) => (
							<div key={label} className="flex justify-between gap-4">
								<dt className="text-wayfare-text-secondary">{label}</dt>
								<dd
									className="truncate font-mono text-right text-wayfare-text"
									title={url}
								>
									{url}
								</dd>
							</div>
						))}
					</dl>
				</section>
			)}

			<section className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-5">
				<h2 className="mb-4 text-sm font-semibold text-wayfare-text">
					Entur headers
				</h2>
				<div className="space-y-3">
					<div>
						<label
							htmlFor="dev-distribution-channel"
							className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
						>
							Entur-Distribution-Channel
						</label>
						<input
							id="dev-distribution-channel"
							type="text"
							value={formDistributionChannel}
							onChange={(e) => setFormDistributionChannel(e.target.value)}
							placeholder={
								resolved?.envDefaults.distributionChannel ??
								"WAY:DistributionChannel:App"
							}
							className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm font-mono text-wayfare-text"
						/>
					</div>
					<div>
						<label
							htmlFor="dev-client-name"
							className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
						>
							Entur-Client-Name
						</label>
						<input
							id="dev-client-name"
							type="text"
							value={formClientName}
							onChange={(e) => setFormClientName(e.target.value)}
							placeholder={resolved?.envDefaults.clientName ?? "Wayfare-Web"}
							className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm font-mono text-wayfare-text"
						/>
					</div>
					<div>
						<label
							htmlFor="dev-pos"
							className="mb-1 block text-xs font-medium text-wayfare-text-secondary"
						>
							Entur-POS
						</label>
						<input
							id="dev-pos"
							type="text"
							value={formPos}
							onChange={(e) => setFormPos(e.target.value)}
							placeholder={resolved?.envDefaults.pos ?? "Wayfare"}
							className="w-full rounded-lg border border-wayfare-line bg-wayfare-surface px-3 py-2 text-sm font-mono text-wayfare-text"
						/>
					</div>
				</div>
			</section>

			<div className="flex items-center justify-between">
				<Button variant="secondary" onClick={handleReset}>
					Reset to .env defaults
				</Button>
				<Button variant="primary" onClick={handleSave}>
					{saved ? "Saved" : "Save"}
				</Button>
			</div>
		</div>
	);
}

function FavoritesTab() {
	const [favorites, setFavorites] = useState<FavoriteRoute[]>(() =>
		getFavorites(),
	);

	function handleRemove(id: string) {
		removeFavorite(id);
		setFavorites(getFavorites());
	}

	if (favorites.length === 0) {
		return (
			<div className="flex flex-col items-center py-8 text-center">
				<Illustration
					name="turtle-food-bowl"
					size="lg"
					decorative
					className="mb-4"
				/>
				<p className="text-sm font-semibold text-wayfare-text">
					No saved routes
				</p>
				<p className="mt-1 max-w-xs text-xs text-wayfare-text-secondary">
					Star a route from the trips or offers page to save it here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{favorites.map((fav) => (
				<div
					key={fav.id}
					className="flex items-center justify-between gap-3 rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-4 py-3"
				>
					<div className="flex min-w-0 items-center gap-2 text-sm">
						<span className="truncate font-medium text-wayfare-text">
							{fav.from.name ?? fav.from.placeId}
						</span>
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
							className="shrink-0 text-wayfare-text-secondary"
						>
							<path
								d="M2 6h8M7 3l3 3-3 3"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span className="truncate font-medium text-wayfare-text">
							{fav.to.name ?? fav.to.placeId}
						</span>
					</div>
					<button
						type="button"
						onClick={() => handleRemove(fav.id)}
						aria-label={`Remove ${fav.from.name ?? fav.from.placeId} to ${fav.to.name ?? fav.to.placeId} from favorites`}
						className="shrink-0 rounded-lg p-1.5 text-wayfare-text-secondary transition-colors hover:opacity-70 focus:outline-none"
					>
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M1 1l10 10M11 1L1 11"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}

function SettingsPage() {
	const { tab, pendingCardId } = Route.useSearch();
	const navigate = useNavigate({ from: "/settings" });

	function setTab(t: Tab) {
		navigate({
			search: (prev) => ({ ...prev, tab: t, pendingCardId: undefined }),
		});
	}

	function clearPendingCard() {
		navigate({ search: (prev) => ({ ...prev, pendingCardId: undefined }) });
	}

	return (
		<PageShell title="Settings" contentClassName="mx-auto max-w-lg">
			<div className="mb-6">
				<SegmentedControl
					legend="Settings section"
					options={
						[
							{ value: "profile", label: "Profile" },
							{ value: "payment", label: "Payment" },
							{ value: "favorites", label: "Favorites" },
							{ value: "app", label: "App" },
							{ value: "developer", label: "Developer" },
						] as const
					}
					value={tab}
					onChange={setTab}
				/>
			</div>

			{tab === "profile" && <ProfileTab />}
			{tab === "payment" && (
				<PaymentMethodsTab
					pendingCardId={pendingCardId}
					onCardAuthorized={clearPendingCard}
				/>
			)}
			{tab === "favorites" && <FavoritesTab />}
			{tab === "app" && <AppTab />}
			{tab === "developer" && <DeveloperTab />}
		</PageShell>
	);
}
