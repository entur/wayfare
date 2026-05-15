import { UserIcon } from "@entur/icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";
import SegmentedControl from "../components/ui/SegmentedControl";
import { useDevConfig } from "../context/dev-config";
import { useProfile } from "../context/profile";
import { useCustomerSearch } from "../hooks/use-customers";
import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { clearPackages, getPackages } from "../lib/ticket-storage";
import { getResolvedDevConfig } from "../server-functions/dev-config";
import type { CustomerSearchParams, OmsaCustomer } from "../types/customer";
import type { OmsaRuntimeMode } from "../server/runtime-config";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type Tab = "profile" | "app" | "developer";

function customerDisplayName(c: OmsaCustomer): string {
	const parts = [c.firstName, c.lastName].filter(Boolean);
	return parts.length > 0 ? parts.join(" ") : (c.id ?? "Unknown");
}

function customerInitials(c: OmsaCustomer): string {
	return (
		[c.firstName?.[0], c.lastName?.[0]].filter(Boolean).join("") || "?"
	);
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
			{customer && (
				<section
					className="rounded-xl p-5"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<p
						className="mb-3 text-xs font-semibold uppercase tracking-wide"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						Signed in as
					</p>
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<span
								className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
								style={{ background: "var(--wayfare-primary)", color: "#fff" }}
							>
								{customerInitials(customer)}
							</span>
							<div>
								<p
									className="text-sm font-semibold"
									style={{ color: "var(--wayfare-text)", margin: 0 }}
								>
									{customerDisplayName(customer)}
								</p>
								{customer.email && (
									<p
										className="text-xs"
										style={{
											color: "var(--wayfare-text-secondary)",
											margin: 0,
										}}
									>
										{customer.email}
									</p>
								)}
								{customer.id && (
									<p
										className="font-mono text-xs"
										style={{
											color: "var(--wayfare-text-secondary)",
											margin: 0,
										}}
									>
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

			<section
				className="rounded-xl p-5"
				style={{
					background: "var(--wayfare-surface-strong)",
					border: "1px solid var(--wayfare-line)",
				}}
			>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Find a customer
				</h2>
				<form onSubmit={handleSearch} className="space-y-3">
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label
								htmlFor="settings-firstName"
								className="mb-1 block text-xs font-medium"
								style={{ color: "var(--wayfare-text-secondary)" }}
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
								className="w-full rounded-lg border px-3 py-2 text-sm"
								style={{
									background: "var(--wayfare-surface)",
									borderColor: "var(--wayfare-line)",
									color: "var(--wayfare-text)",
								}}
								placeholder="e.g. Ola"
							/>
						</div>
						<div>
							<label
								htmlFor="settings-lastName"
								className="mb-1 block text-xs font-medium"
								style={{ color: "var(--wayfare-text-secondary)" }}
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
								className="w-full rounded-lg border px-3 py-2 text-sm"
								style={{
									background: "var(--wayfare-surface)",
									borderColor: "var(--wayfare-line)",
									color: "var(--wayfare-text)",
								}}
								placeholder="e.g. Nordmann"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="settings-email"
							className="mb-1 block text-xs font-medium"
							style={{ color: "var(--wayfare-text-secondary)" }}
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
							className="w-full rounded-lg border px-3 py-2 text-sm"
							style={{
								background: "var(--wayfare-surface)",
								borderColor: "var(--wayfare-line)",
								color: "var(--wayfare-text)",
							}}
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
				<p
					className="rounded-xl px-4 py-3 text-sm"
					style={{
						background: "rgba(233,0,55,0.08)",
						color: "var(--wayfare-primary)",
					}}
				>
					{error instanceof Error ? error.message : "Search failed"}
				</p>
			)}

			{hasSearched && !isFetching && data && (
				<section
					className="rounded-xl p-5"
					style={{
						background: "var(--wayfare-surface-strong)",
						border: "1px solid var(--wayfare-line)",
					}}
				>
					<p
						className="mb-3 text-xs font-semibold uppercase tracking-wide"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						{data.numberMatched ?? data.customers?.length ?? 0} result
						{(data.numberMatched ?? data.customers?.length ?? 0) !== 1
							? "s"
							: ""}
					</p>
					{!data.customers?.length ? (
						<p
							className="text-sm"
							style={{ color: "var(--wayfare-text-secondary)" }}
						>
							No customers found.
						</p>
					) : (
						<ul
							className="divide-y"
							style={{ borderColor: "var(--wayfare-line)" }}
						>
							{data.customers.map((c) => (
								<li
									key={c.id}
									className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
								>
									<div className="flex items-center gap-3">
										<span
											className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
											style={{
												background:
													customer?.id === c.id
														? "var(--wayfare-primary)"
														: "var(--wayfare-accent-soft)",
												color:
													customer?.id === c.id
														? "#fff"
														: "var(--wayfare-primary)",
											}}
										>
											{[c.firstName?.[0], c.lastName?.[0]]
												.filter(Boolean)
												.join("") || <UserIcon aria-hidden="true" />}
										</span>
										<div>
											<p
												className="text-sm font-medium"
												style={{ color: "var(--wayfare-text)", margin: 0 }}
											>
												{customerDisplayName(c)}
											</p>
											{c.email && (
												<p
													className="text-xs"
													style={{
														color: "var(--wayfare-text-secondary)",
														margin: 0,
													}}
												>
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
			<section
				className="rounded-xl p-5"
				style={{
					background: "var(--wayfare-surface-strong)",
					border: "1px solid var(--wayfare-line)",
				}}
			>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Ticket wallet
				</h2>
				<div className="flex items-center justify-between">
					<div>
						<p
							className="text-sm"
							style={{ color: "var(--wayfare-text)", margin: 0 }}
						>
							Saved tickets
						</p>
						<p
							className="text-xs"
							style={{ color: "var(--wayfare-text-secondary)", margin: 0 }}
						>
							{cleared ? 0 : count} ticket{count !== 1 ? "s" : ""} stored locally
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

			<section
				className="rounded-xl p-5"
				style={{
					background: "var(--wayfare-surface-strong)",
					border: "1px solid var(--wayfare-line)",
				}}
			>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					About
				</h2>
				<dl className="space-y-2 text-sm">
					<div className="flex justify-between">
						<dt style={{ color: "var(--wayfare-text-secondary)" }}>App</dt>
						<dd style={{ color: "var(--wayfare-text)", fontWeight: 600 }}>
							Wayfare
						</dd>
					</div>
					<div className="flex justify-between">
						<dt style={{ color: "var(--wayfare-text-secondary)" }}>API</dt>
						<dd style={{ color: "var(--wayfare-text)" }}>
							OMSA v1 (OMSA_ENV_MODE)
						</dd>
					</div>
					<div className="flex justify-between">
						<dt style={{ color: "var(--wayfare-text-secondary)" }}>Stack</dt>
						<dd style={{ color: "var(--wayfare-text)" }}>
							TanStack Start + Entur DS
						</dd>
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
		setTimeout(() => setSaved(false), 2000);
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

	const sectionStyle = {
		background: "var(--wayfare-surface-strong)",
		border: "1px solid var(--wayfare-line)",
	};

	const inputStyle = {
		background: "var(--wayfare-surface)",
		borderColor: "var(--wayfare-line)",
		color: "var(--wayfare-text)",
	};

	const labelStyle = {
		color: "var(--wayfare-text-secondary)",
	};

	return (
		<div className="space-y-4">
			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Environment
				</h2>
				<SegmentedControl
					legend="Environment mode"
					options={ENV_MODE_OPTIONS}
					value={formMode}
					onChange={setFormMode}
				/>
				<p className="mt-2 text-xs" style={labelStyle}>
					.env default:{" "}
					<span className="font-mono">
						{resolved?.envDefaults.mode ?? "…"}
					</span>
				</p>
			</section>

			{resolved && (
				<section className="rounded-xl p-5" style={sectionStyle}>
					<h2
						className="mb-3 text-sm font-semibold"
						style={{ color: "var(--wayfare-text)" }}
					>
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
								<dt style={labelStyle}>{label}</dt>
								<dd
									className="truncate font-mono text-right"
									style={{ color: "var(--wayfare-text)" }}
									title={url}
								>
									{url}
								</dd>
							</div>
						))}
					</dl>
				</section>
			)}

			<section className="rounded-xl p-5" style={sectionStyle}>
				<h2
					className="mb-4 text-sm font-semibold"
					style={{ color: "var(--wayfare-text)" }}
				>
					Entur headers
				</h2>
				<div className="space-y-3">
					<div>
						<label
							htmlFor="dev-distribution-channel"
							className="mb-1 block text-xs font-medium"
							style={labelStyle}
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
							className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
							style={inputStyle}
						/>
					</div>
					<div>
						<label
							htmlFor="dev-client-name"
							className="mb-1 block text-xs font-medium"
							style={labelStyle}
						>
							ET-Client-Name
						</label>
						<input
							id="dev-client-name"
							type="text"
							value={formClientName}
							onChange={(e) => setFormClientName(e.target.value)}
							placeholder={resolved?.envDefaults.clientName ?? "Wayfare-Web"}
							className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
							style={inputStyle}
						/>
					</div>
					<div>
						<label
							htmlFor="dev-pos"
							className="mb-1 block text-xs font-medium"
							style={labelStyle}
						>
							Entur-POS
						</label>
						<input
							id="dev-pos"
							type="text"
							value={formPos}
							onChange={(e) => setFormPos(e.target.value)}
							placeholder={resolved?.envDefaults.pos ?? "Wayfare"}
							className="w-full rounded-lg border px-3 py-2 text-sm font-mono"
							style={inputStyle}
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

function SettingsPage() {
	const [tab, setTab] = useState<Tab>("profile");

	return (
		<PageShell title="Settings">
			<div className="mx-auto max-w-lg">
				<div className="mb-6">
					<SegmentedControl
						legend="Settings section"
						options={[
							{ value: "profile", label: "Profile" },
							{ value: "app", label: "App" },
							{ value: "developer", label: "Developer" },
						] as const}
						value={tab}
						onChange={setTab}
					/>
				</div>

				{tab === "profile" && <ProfileTab />}
				{tab === "app" && <AppTab />}
				{tab === "developer" && <DeveloperTab />}
			</div>
		</PageShell>
	);
}
