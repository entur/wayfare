import { UserIcon } from "@entur/icons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import Button from "../components/ui/Button";
import { useProfile } from "../context/profile";
import { useCustomerSearch } from "../hooks/use-customers";
import type { CustomerSearchParams, OmsaCustomer } from "../types/customer";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function customerDisplayName(c: OmsaCustomer): string {
	const parts = [c.firstName, c.lastName].filter(Boolean);
	return parts.length > 0 ? parts.join(" ") : (c.id ?? "Unknown");
}

function ProfilePage() {
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
		if (searchInput.email.trim())
			params.email = searchInput.email.trim();
		setSearchParams(params);
		setHasSearched(true);
	}

	return (
		<PageShell title="Profile" subtitle="Sign in as an OMSA customer">
			<div className="mx-auto max-w-lg space-y-4">
				{customer && (
					<section
						className="rounded-lg p-5"
						style={{
							background: "var(--wayfare-surface-strong)",
							border: "1px solid var(--wayfare-line)",
						}}
					>
						<p
							className="mb-1 text-xs font-semibold uppercase tracking-wide"
							style={{ color: "var(--wayfare-text-secondary)" }}
						>
							Signed in as
						</p>
						<div className="flex items-center justify-between gap-4">
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
										className="text-xs font-mono"
										style={{
											color: "var(--wayfare-text-secondary)",
											margin: 0,
										}}
									>
										{customer.id}
									</p>
								)}
							</div>
							<Button variant="secondary" onClick={signOut}>
								Sign out
							</Button>
						</div>
					</section>
				)}

				<section
					className="rounded-lg p-5"
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
									htmlFor="profile-firstName"
									className="mb-1 block text-xs font-medium"
									style={{ color: "var(--wayfare-text-secondary)" }}
								>
									First name
								</label>
								<input
									id="profile-firstName"
									type="text"
									value={searchInput.firstName}
									onChange={(e) =>
										setSearchInput((s) => ({
											...s,
											firstName: e.target.value,
										}))
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
									htmlFor="profile-lastName"
									className="mb-1 block text-xs font-medium"
									style={{ color: "var(--wayfare-text-secondary)" }}
								>
									Last name
								</label>
								<input
									id="profile-lastName"
									type="text"
									value={searchInput.lastName}
									onChange={(e) =>
										setSearchInput((s) => ({
											...s,
											lastName: e.target.value,
										}))
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
								htmlFor="profile-email"
								className="mb-1 block text-xs font-medium"
								style={{ color: "var(--wayfare-text-secondary)" }}
							>
								Email
							</label>
							<input
								id="profile-email"
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
						className="rounded-lg px-3 py-2 text-sm"
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
						className="rounded-lg p-5"
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
												className="flex h-8 w-8 items-center justify-center rounded-full"
												style={{ background: "var(--wayfare-accent-soft)" }}
											>
												<UserIcon
													aria-hidden="true"
													style={{ color: "var(--wayfare-primary)" }}
												/>
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
		</PageShell>
	);
}
