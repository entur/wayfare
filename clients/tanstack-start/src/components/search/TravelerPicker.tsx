import { DownArrowIcon, UsersIcon } from "@entur/icons";
import { useEffect, useRef, useState } from "react";
import type {
	Entitlement,
	TravelerGroup,
	TravelerIndividual,
} from "../../context/search-form";

const GROUPS: {
	id: TravelerGroup["ageGroup"];
	label: string;
	minAge?: number;
	maxAge?: number;
}[] = [
	{ id: "ADULT", label: "Adult", minAge: 18 },
	{ id: "YOUTH", label: "Youth", minAge: 16, maxAge: 17 },
	{ id: "CHILD", label: "Child", minAge: 6, maxAge: 15 },
	{ id: "SENIOR", label: "Senior", minAge: 67 },
];

const ENTITLEMENT_OPTIONS: { value: Entitlement; label: string }[] = [
	{ value: "STUDENT", label: "Student" },
	{ value: "MILITARY", label: "Military" },
];

const ENTITLEMENT_GROUPS: TravelerGroup["ageGroup"][] = [
	"ADULT",
	"YOUTH",
	"SENIOR",
];

interface TravelerPickerProps {
	travelers: TravelerGroup[];
	onChange: (travelers: TravelerGroup[]) => void;
}

export default function TravelerPicker({
	travelers,
	onChange,
}: TravelerPickerProps) {
	const [open, setOpen] = useState(false);
	const [expandedId, setExpandedId] = useState<
		TravelerGroup["ageGroup"] | null
	>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const total = travelers.reduce((sum, t) => sum + t.count, 0);
	const summary =
		total === 0
			? "Add travelers"
			: `${total} traveler${total !== 1 ? "s" : ""}`;

	useEffect(() => {
		function handlePointerDown(e: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, []);

	function getGroup(
		ageGroup: TravelerGroup["ageGroup"],
	): TravelerGroup | undefined {
		return travelers.find((t) => t.ageGroup === ageGroup);
	}

	function getCount(ageGroup: TravelerGroup["ageGroup"]): number {
		return getGroup(ageGroup)?.count ?? 0;
	}

	function updateGroup(
		ageGroup: TravelerGroup["ageGroup"],
		updates: Partial<TravelerGroup>,
	) {
		onChange(
			travelers.map((t) =>
				t.ageGroup === ageGroup ? { ...t, ...updates } : t,
			),
		);
	}

	function setCount(ageGroup: TravelerGroup["ageGroup"], count: number) {
		if (count < 0) return;
		const existing = travelers.filter((t) => t.ageGroup !== ageGroup);
		const meta = GROUPS.find((g) => g.id === ageGroup) ?? GROUPS[0];
		if (count === 0) {
			if (expandedId === ageGroup) setExpandedId(null);
			onChange(existing);
			return;
		}
		const current = getGroup(ageGroup);
		let individuals = current?.individuals;
		if (individuals !== undefined) {
			if (count > individuals.length) {
				individuals = [
					...individuals,
					...Array<TravelerIndividual>(count - individuals.length).fill({}),
				];
			} else {
				individuals = individuals.slice(0, count);
			}
		}
		onChange([
			...existing,
			{
				id: ageGroup.toLowerCase(),
				ageGroup,
				count,
				minAge: meta.minAge,
				maxAge: meta.maxAge,
				...(current?.entitlement != null
					? { entitlement: current.entitlement }
					: {}),
				...(current?.profileAge != null
					? { profileAge: current.profileAge }
					: {}),
				...(individuals !== undefined ? { individuals } : {}),
			},
		]);
	}

	function setEntitlement(
		ageGroup: TravelerGroup["ageGroup"],
		value: Entitlement | "",
	) {
		const updates: Partial<TravelerGroup> =
			value === "" ? { entitlement: undefined } : { entitlement: value };
		// Clear profileAge when switching away from entitlements that need it
		if (
			value !== "STUDENT" &&
			ageGroup !== "SENIOR" &&
			getGroup(ageGroup)?.profileAge != null
		) {
			updates.profileAge = undefined;
		}
		updateGroup(ageGroup, updates);
	}

	function setProfileAge(
		ageGroup: TravelerGroup["ageGroup"],
		raw: string,
	) {
		const age = raw === "" ? undefined : Number(raw);
		updateGroup(ageGroup, { profileAge: age });
	}

	function toggleNamedMode(ageGroup: TravelerGroup["ageGroup"]) {
		const group = getGroup(ageGroup);
		if (!group) return;
		if (group.individuals !== undefined) {
			updateGroup(ageGroup, { individuals: undefined });
		} else {
			updateGroup(ageGroup, {
				individuals: Array<TravelerIndividual>(group.count).fill({}),
			});
		}
	}

	function updateIndividual(
		ageGroup: TravelerGroup["ageGroup"],
		index: number,
		patch: Partial<TravelerIndividual>,
	) {
		const group = getGroup(ageGroup);
		if (!group?.individuals) return;
		const individuals = group.individuals.map((ind, i) =>
			i === index ? { ...ind, ...patch } : ind,
		);
		updateGroup(ageGroup, { individuals });
	}

	const inputStyle = {
		borderColor: "var(--wayfare-line)",
		background: "var(--wayfare-bg)",
		color: "var(--wayfare-text)",
	};

	return (
		<div ref={containerRef} className="relative w-full">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition-shadow focus:outline-none focus:ring-2"
				style={{
					borderColor: "var(--wayfare-line)",
					background: "var(--wayfare-surface-strong)",
					color:
						total === 0
							? "var(--wayfare-text-secondary)"
							: "var(--wayfare-text)",
					// @ts-expect-error - css custom prop
					"--tw-ring-color":
						"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
				}}
				aria-haspopup="dialog"
				aria-expanded={open}
			>
				<span className="flex items-center gap-2">
					<UsersIcon
						aria-hidden="true"
						style={{ color: "var(--wayfare-text-secondary)" }}
					/>
					{summary}
				</span>
				<DownArrowIcon
					aria-hidden="true"
					className={`transition-transform ${open ? "rotate-180" : ""}`}
					style={{ color: "var(--wayfare-text-secondary)" }}
				/>
			</button>

			{open && (
				<div
					className="absolute z-50 mt-1 w-full min-w-[300px] rounded-xl border p-4 shadow-lg"
					style={{
						borderColor: "var(--wayfare-line)",
						background: "var(--wayfare-surface-strong)",
					}}
					role="dialog"
					aria-label="Select travelers"
				>
					{GROUPS.map((group) => {
						const count = getCount(group.id);
						const current = getGroup(group.id);
						const isExpanded = expandedId === group.id;
						const showEntitlementRow = ENTITLEMENT_GROUPS.includes(group.id);
						const shouldShowAgeRow =
							current?.entitlement === "STUDENT" || group.id === "SENIOR";

						return (
							<div
								key={group.id}
								style={{
									borderBottom: "1px solid var(--wayfare-line)",
								}}
							>
								{/* Main row */}
								<div className="flex items-center justify-between py-2.5">
									<div>
										<span
											className="text-sm font-medium"
											style={{ color: "var(--wayfare-text)" }}
										>
											{group.label}
										</span>
										{(group.minAge !== undefined ||
											group.maxAge !== undefined) && (
											<span
												className="ml-2 text-xs"
												style={{ color: "var(--wayfare-text-secondary)" }}
											>
												{group.minAge && group.maxAge
													? `${group.minAge}–${group.maxAge} yrs`
													: group.minAge
														? `${group.minAge}+ yrs`
														: ""}
											</span>
										)}
									</div>
									<div className="flex items-center gap-2">
										<div className="flex items-center gap-2">
											<button
												type="button"
												onClick={() => setCount(group.id, count - 1)}
												disabled={count === 0}
												aria-label={`Remove ${group.label}`}
												className="flex h-7 w-7 items-center justify-center rounded-lg border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
												style={{
													borderColor: "var(--wayfare-line)",
													color: "var(--wayfare-text)",
													background: "transparent",
												}}
											>
												−
											</button>
											<span
												className="w-4 text-center text-sm font-semibold tabular-nums"
												style={{ color: "var(--wayfare-text)" }}
											>
												{count}
											</span>
											<button
												type="button"
												onClick={() => setCount(group.id, count + 1)}
												aria-label={`Add ${group.label}`}
												className="flex h-7 w-7 items-center justify-center rounded-lg border text-sm font-semibold transition-colors"
												style={{
													borderColor: "var(--wayfare-line)",
													color: "var(--wayfare-text)",
													background: "transparent",
												}}
											>
												+
											</button>
										</div>
										{count > 0 && (
											<button
												type="button"
												onClick={() =>
													setExpandedId(isExpanded ? null : group.id)
												}
												aria-label={
													isExpanded
														? `Collapse ${group.label} options`
														: `Expand ${group.label} options`
												}
												className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition-colors"
												style={{
													borderColor: isExpanded
														? "var(--wayfare-primary)"
														: "var(--wayfare-line)",
													color: isExpanded
														? "var(--wayfare-primary)"
														: "var(--wayfare-text-secondary)",
													background: "transparent",
												}}
											>
												{isExpanded ? "▴" : "▾"}
											</button>
										)}
									</div>
								</div>

								{/* Expanded panel */}
								{isExpanded && count > 0 && (
									<div className="mb-3 flex flex-col gap-3 pl-1">
										{/* Entitlement selector */}
										{showEntitlementRow && (
											<div className="flex items-center gap-3">
												<span
													className="w-24 shrink-0 text-xs"
													style={{ color: "var(--wayfare-text-secondary)" }}
												>
													Entitlement
												</span>
												<select
													value={current?.entitlement ?? ""}
													onChange={(e) =>
														setEntitlement(
															group.id,
															e.target.value as Entitlement | "",
														)
													}
													className="flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-1"
													style={{
														...inputStyle,
														// @ts-expect-error css custom prop
														"--tw-ring-color":
															"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
													}}
												>
													<option value="">None</option>
													{ENTITLEMENT_OPTIONS.map((opt) => (
														<option key={opt.value} value={opt.value}>
															{opt.label}
														</option>
													))}
												</select>
											</div>
										)}

										{/* Age input (STUDENT or SENIOR anonymous profile) */}
										{shouldShowAgeRow && (
											<div className="flex items-center gap-3">
												<span
													className="w-24 shrink-0 text-xs"
													style={{ color: "var(--wayfare-text-secondary)" }}
												>
													Age
													<span
														className="ml-1"
														style={{ color: "var(--wayfare-text-secondary)", opacity: 0.6 }}
													>
														(optional)
													</span>
												</span>
												<input
													type="number"
													min={1}
													max={130}
													placeholder="e.g. 25"
													value={current?.profileAge ?? ""}
													onChange={(e) =>
														setProfileAge(group.id, e.target.value)
													}
													className="w-24 rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-1"
													style={{
														...inputStyle,
														// @ts-expect-error css custom prop
														"--tw-ring-color":
															"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
													}}
												/>
											</div>
										)}

										{/* Named mode toggle */}
										<div className="flex items-center gap-3">
											<span
												className="w-24 shrink-0 text-xs"
												style={{ color: "var(--wayfare-text-secondary)" }}
											>
												Names
											</span>
											<button
												type="button"
												onClick={() => toggleNamedMode(group.id)}
												className="rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors"
												style={{
													borderColor:
														current?.individuals !== undefined
															? "var(--wayfare-primary)"
															: "var(--wayfare-line)",
													color:
														current?.individuals !== undefined
															? "var(--wayfare-primary)"
															: "var(--wayfare-text-secondary)",
													background: "transparent",
												}}
											>
												{current?.individuals !== undefined
													? "Remove names"
													: "Add names"}
											</button>
										</div>

										{/* Individual rows */}
										{current?.individuals !== undefined && (
											<div className="flex flex-col gap-2 pl-1">
												{current.individuals.map((person, i) => (
													<div
														key={i}
														className="flex items-center gap-2"
													>
														<span
															className="w-16 shrink-0 text-xs"
															style={{ color: "var(--wayfare-text-secondary)" }}
														>
															Person {i + 1}
														</span>
														<input
															type="text"
															placeholder="Name"
															value={person.name ?? ""}
															onChange={(e) =>
																updateIndividual(group.id, i, {
																	name: e.target.value || undefined,
																})
															}
															className="min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-1"
															style={{
																...inputStyle,
																// @ts-expect-error css custom prop
																"--tw-ring-color":
																	"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
															}}
														/>
														<input
															type="number"
															placeholder="Age"
															min={1}
															max={130}
															value={person.age ?? ""}
															onChange={(e) =>
																updateIndividual(group.id, i, {
																	age:
																		e.target.value === ""
																			? undefined
																			: Number(e.target.value),
																})
															}
															className="w-16 shrink-0 rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-1"
															style={{
																...inputStyle,
																// @ts-expect-error css custom prop
																"--tw-ring-color":
																	"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
															}}
														/>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}

					<button
						type="button"
						onClick={() => setOpen(false)}
						className="mt-3 w-full rounded-xl border py-2 text-sm font-medium transition-colors"
						style={{
							borderColor: "var(--wayfare-line)",
							color: "var(--wayfare-text)",
							background: "transparent",
						}}
					>
						Done
					</button>
				</div>
			)}
		</div>
	);
}
