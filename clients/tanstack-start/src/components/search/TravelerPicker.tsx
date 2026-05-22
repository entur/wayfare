import { DownArrowIcon, UsersIcon } from "@entur/icons";
import { useEffect, useRef, useState } from "react";
import type {
	TravelerGroup,
	TravelerIndividual,
} from "../../context/search-form";
import type { OmsaCustomer } from "../../types/customer";

const GROUPS: {
	id: TravelerGroup["ageGroup"];
	label: string;
	subtitle?: string;
	perPerson?: boolean;
}[] = [
	{ id: "ADULT", label: "Adult", subtitle: "18+ yrs" },
	{ id: "YOUTH", label: "Youth", subtitle: "16–17 yrs" },
	{ id: "CHILD", label: "Child", subtitle: "6–15 yrs" },
	{ id: "SENIOR", label: "Senior", subtitle: "67+ yrs", perPerson: true },
	{ id: "STUDENT", label: "Student", perPerson: true },
	{ id: "MILITARY", label: "Military" },
];

const inputCls =
	"rounded-lg border border-wayfare-line bg-wayfare-bg px-2 py-1.5 text-xs text-wayfare-text outline-none focus:ring-1 focus:ring-wayfare-primary/30";

interface TravelerPickerProps {
	travelers: TravelerGroup[];
	onChange: (travelers: TravelerGroup[]) => void;
	customer?: OmsaCustomer | null;
}

export default function TravelerPicker({
	travelers,
	onChange,
	customer,
}: TravelerPickerProps) {
	const [open, setOpen] = useState(false);
	const [expandedId, setExpandedId] = useState<
		TravelerGroup["ageGroup"] | null
	>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const customerIncluded =
		!!customer?.id &&
		travelers.some((t) =>
			t.individuals?.some((i) => i.customerId === customer.id),
		);

	const total = travelers.reduce((sum, t) => sum + t.count, 0);

	const customerFirstName = customer?.firstName ?? customer?.id ?? "You";

	let summary: string;
	if (total === 0) {
		summary = "Add travelers";
	} else if (customerIncluded) {
		const others = total - 1;
		summary =
			others > 0
				? `${customerFirstName} + ${others} other${others !== 1 ? "s" : ""}`
				: customerFirstName;
	} else {
		summary = `${total} traveler${total !== 1 ? "s" : ""}`;
	}

	useEffect(() => {
		function onPointerDown(e: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, []);

	function getGroup(ag: TravelerGroup["ageGroup"]) {
		return travelers.find((t) => t.ageGroup === ag);
	}

	function getCount(ag: TravelerGroup["ageGroup"]) {
		return getGroup(ag)?.count ?? 0;
	}

	function updateGroup(
		ag: TravelerGroup["ageGroup"],
		updates: Partial<TravelerGroup>,
	) {
		onChange(
			travelers.map((t) => (t.ageGroup === ag ? { ...t, ...updates } : t)),
		);
	}

	function syncIndividuals(
		existing: TravelerIndividual[] | undefined,
		count: number,
		perPerson: boolean,
	): TravelerIndividual[] | undefined {
		if (!perPerson && existing === undefined) return undefined;
		const base = (existing ?? []).map((individual) =>
			individual.id ? individual : { ...individual, id: crypto.randomUUID() },
		);
		if (count > base.length) {
			return [
				...base,
				...Array.from(
					{ length: count - base.length },
					(): TravelerIndividual => ({
						id: crypto.randomUUID(),
					}),
				),
			];
		}
		return base.slice(0, count);
	}

	function setCount(ag: TravelerGroup["ageGroup"], count: number) {
		if (count < 0) return;
		const existing = travelers.filter((t) => t.ageGroup !== ag);
		if (count === 0) {
			if (expandedId === ag) setExpandedId(null);
			onChange(existing);
			return;
		}
		const meta = GROUPS.find((g) => g.id === ag);
		if (!meta) return;
		const current = getGroup(ag);
		onChange([
			...existing,
			{
				id: ag.toLowerCase(),
				ageGroup: ag,
				count,
				...(ag === "ADULT" ? { minAge: 18 } : {}),
				...(ag === "YOUTH" ? { minAge: 16, maxAge: 17 } : {}),
				...(ag === "CHILD" ? { minAge: 6, maxAge: 15 } : {}),
				...(ag === "SENIOR" ? { minAge: 67 } : {}),
				individuals: syncIndividuals(
					current?.individuals,
					count,
					!!meta.perPerson,
				),
			},
		]);
	}

	function toggleCustomer() {
		if (!customer) return;
		if (customerIncluded) {
			const adultGroup = getGroup("ADULT");
			if (!adultGroup) return;
			const newCount = adultGroup.count - 1;
			const without =
				adultGroup.individuals?.filter((i) => !i.customerId) ?? [];
			if (newCount <= 0) {
				onChange(travelers.filter((t) => t.ageGroup !== "ADULT"));
			} else {
				onChange(
					travelers.map((t) =>
						t.ageGroup === "ADULT"
							? {
									...t,
									count: newCount,
									individuals: without.length ? without : undefined,
								}
							: t,
					),
				);
			}
		} else {
			const name =
				[customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
				undefined;
			const customerInd: TravelerIndividual = { name, customerId: customer.id };
			const adultGroup = getGroup("ADULT");
			if (adultGroup) {
				const others = (adultGroup.individuals ?? []).filter(
					(i) => !i.customerId,
				);
				onChange(
					travelers.map((t) =>
						t.ageGroup === "ADULT"
							? {
									...t,
									count: t.count + 1,
									individuals: [customerInd, ...others],
								}
							: t,
					),
				);
			} else {
				onChange([
					...travelers,
					{
						id: "adult",
						ageGroup: "ADULT" as const,
						count: 1,
						minAge: 18,
						individuals: [customerInd],
					},
				]);
			}
		}
	}

	function toggleNamedMode(ag: TravelerGroup["ageGroup"]) {
		const group = getGroup(ag);
		if (!group) return;
		updateGroup(
			ag,
			group.individuals !== undefined
				? { individuals: undefined }
				: {
						individuals: Array.from(
							{ length: group.count },
							(): TravelerIndividual => ({ id: crypto.randomUUID() }),
						),
					},
		);
	}

	function updateIndividual(
		ag: TravelerGroup["ageGroup"],
		index: number,
		patch: Partial<TravelerIndividual>,
	) {
		const group = getGroup(ag);
		if (!group?.individuals) return;
		updateGroup(ag, {
			individuals: group.individuals.map((ind, i) =>
				i === index ? { ...ind, ...patch } : ind,
			),
		});
	}

	function renderIndividualRows(
		ag: TravelerGroup["ageGroup"],
		showAge: boolean,
	) {
		const group = getGroup(ag);
		if (!group?.individuals) return null;
		return (
			<div className="flex flex-col gap-2 pb-3 pl-1">
				{group.individuals.map((person, i) => (
					<div
						key={
							person.id ??
							`${ag}-${person.name ?? "traveler"}-${person.age ?? "unknown"}`
						}
						className="flex items-center gap-2"
					>
						<span className="w-16 shrink-0 text-xs text-wayfare-text-secondary">
							{group.count === 1 ? "" : `Person ${i + 1}`}
						</span>
						{showAge && (
							<input
								type="number"
								placeholder="Age"
								min={1}
								max={130}
								value={person.age ?? ""}
								onChange={(e) =>
									updateIndividual(ag, i, {
										age:
											e.target.value === ""
												? undefined
												: Number(e.target.value),
									})
								}
								className={`w-20 shrink-0 ${inputCls}`}
							/>
						)}
						<input
							type="text"
							placeholder="Name (optional)"
							value={person.name ?? ""}
							onChange={(e) =>
								updateIndividual(ag, i, { name: e.target.value || undefined })
							}
							className={`min-w-0 flex-1 ${inputCls}`}
						/>
					</div>
				))}
			</div>
		);
	}

	const customerInitials = customer
		? [customer.firstName?.[0], customer.lastName?.[0]]
				.filter(Boolean)
				.join("") || "?"
		: null;

	return (
		<div ref={containerRef} className="relative w-full">
			<p className="mb-1.5 text-sm font-medium text-wayfare-text">Who</p>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className={`flex w-full items-center justify-between rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-3 py-2.5 text-sm font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-wayfare-primary/30 ${total === 0 ? "text-wayfare-text-secondary" : "text-wayfare-text"}`}
				aria-haspopup="dialog"
				aria-expanded={open}
			>
				<span className="flex items-center gap-2">
					{customerIncluded && customerInitials ? (
						<span className="flex h-5 w-5 items-center justify-center rounded-full bg-wayfare-primary text-xs font-bold text-white">
							{customerInitials}
						</span>
					) : (
						<UsersIcon
							aria-hidden="true"
							className="text-wayfare-text-secondary"
						/>
					)}
					{summary}
				</span>
				<DownArrowIcon
					aria-hidden="true"
					className={`text-wayfare-text-secondary transition-transform ${open ? "rotate-180" : ""}`}
				/>
			</button>

			{open && (
				<div
					className="absolute z-50 mt-1 w-full min-w-[300px] rounded-xl border border-wayfare-line bg-wayfare-surface-strong p-4 shadow-lg"
					role="dialog"
					aria-label="Select travelers"
				>
					{/* Signed-in customer row */}
					{customer && (
						<div className="mb-1 flex items-center justify-between border-b border-wayfare-line py-2.5">
							<div className="flex items-center gap-2.5">
								<span
									className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${customerIncluded ? "bg-wayfare-primary text-white" : "bg-wayfare-accent-soft text-wayfare-primary"}`}
								>
									{customerInitials}
								</span>
								<div>
									<span className="text-sm font-medium text-wayfare-text">
										{[customer.firstName, customer.lastName]
											.filter(Boolean)
											.join(" ") || customer.id}
									</span>
									<span className="ml-1.5 text-xs text-wayfare-text-secondary">
										you
									</span>
								</div>
							</div>
							<button
								type="button"
								onClick={toggleCustomer}
								className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors bg-transparent ${customerIncluded ? "border-wayfare-primary text-wayfare-primary" : "border-wayfare-line text-wayfare-text-secondary"}`}
							>
								{customerIncluded ? "Remove" : "Add"}
							</button>
						</div>
					)}

					{GROUPS.map((group) => {
						const count = getCount(group.id);
						const current = getGroup(group.id);
						const isExpanded = expandedId === group.id;

						return (
							<div key={group.id} className="border-b border-wayfare-line">
								{/* Count row */}
								<div className="flex items-center justify-between py-2.5">
									<div>
										<span className="text-sm font-medium text-wayfare-text">
											{group.label}
										</span>
										{group.subtitle && (
											<span className="ml-2 text-xs text-wayfare-text-secondary">
												{group.subtitle}
											</span>
										)}
									</div>
									<div className="flex items-center gap-2">
										<button
											type="button"
											onClick={() => setCount(group.id, count - 1)}
											disabled={count === 0}
											aria-label={`Remove ${group.label}`}
											className="flex h-7 w-7 items-center justify-center rounded-lg border border-wayfare-line bg-transparent text-sm font-semibold text-wayfare-text transition-colors disabled:cursor-not-allowed disabled:opacity-40"
										>
											−
										</button>
										<span className="w-4 text-center text-sm font-semibold tabular-nums text-wayfare-text">
											{count}
										</span>
										<button
											type="button"
											onClick={() => setCount(group.id, count + 1)}
											aria-label={`Add ${group.label}`}
											className="flex h-7 w-7 items-center justify-center rounded-lg border border-wayfare-line bg-transparent text-sm font-semibold text-wayfare-text transition-colors"
										>
											+
										</button>
										{/* Expand toggle — only for non-perPerson groups */}
										{!group.perPerson && count > 0 && (
											<button
												type="button"
												onClick={() =>
													setExpandedId(isExpanded ? null : group.id)
												}
												aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.label} options`}
												className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-transparent text-xs transition-colors ${isExpanded ? "border-wayfare-primary text-wayfare-primary" : "border-wayfare-line text-wayfare-text-secondary"}`}
											>
												{isExpanded ? "▴" : "▾"}
											</button>
										)}
									</div>
								</div>

								{/* perPerson groups: always-visible individual rows */}
								{group.perPerson &&
									count > 0 &&
									renderIndividualRows(group.id, true)}

								{/* Non-perPerson groups: collapsible names panel */}
								{!group.perPerson && isExpanded && count > 0 && (
									<div className="mb-3 flex flex-col gap-3 pl-1">
										<div className="flex items-center gap-3">
											<span className="w-16 shrink-0 text-xs text-wayfare-text-secondary">
												Names
											</span>
											<button
												type="button"
												onClick={() => toggleNamedMode(group.id)}
												className={`rounded-lg border bg-transparent px-2.5 py-1 text-xs font-medium transition-colors ${current?.individuals !== undefined ? "border-wayfare-primary text-wayfare-primary" : "border-wayfare-line text-wayfare-text-secondary"}`}
											>
												{current?.individuals !== undefined
													? "Remove names"
													: "Add names"}
											</button>
										</div>
										{current?.individuals !== undefined &&
											renderIndividualRows(group.id, false)}
									</div>
								)}
							</div>
						);
					})}

					<button
						type="button"
						onClick={() => setOpen(false)}
						className="mt-3 w-full rounded-xl border border-wayfare-line bg-transparent py-2 text-sm font-medium text-wayfare-text transition-colors"
					>
						Done
					</button>
				</div>
			)}
		</div>
	);
}
