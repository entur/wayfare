import { AdjustmentsIcon } from "@entur/icons";
import { useState } from "react";
import {
	ALL_MODE_GROUPS,
	countActiveFilters,
	isDefaultFilters,
	MODE_GROUP_LABELS,
	type TransportModeGroup,
	type TripFilters,
} from "../../lib/trip-filters";

interface TripFilterPanelProps {
	filters: TripFilters;
	onChange: (filters: TripFilters) => void;
	onReset: () => void;
}

function ModePill({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
				active
					? "border-wayfare-primary bg-wayfare-accent-soft text-wayfare-primary"
					: "border-wayfare-line bg-wayfare-surface-strong text-wayfare-text-secondary hover:text-wayfare-text"
			}`}
		>
			{label}
		</button>
	);
}

function PreferenceSwitch({
	label,
	description,
	checked,
	onChange,
}: {
	label: string;
	description: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
		>
			<span>
				<span className="block text-sm font-medium text-wayfare-text">
					{label}
				</span>
				<span className="block text-xs text-wayfare-text-secondary">
					{description}
				</span>
			</span>
			<span
				aria-hidden="true"
				className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
					checked ? "bg-wayfare-primary" : "bg-wayfare-line"
				}`}
			>
				<span
					className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
						checked ? "translate-x-[22px]" : "translate-x-0.5"
					}`}
				/>
			</span>
		</button>
	);
}

export default function TripFilterPanel({
	filters,
	onChange,
	onReset,
}: TripFilterPanelProps) {
	const [open, setOpen] = useState(false);
	const activeCount = countActiveFilters(filters);

	function toggleMode(group: TransportModeGroup) {
		const active = filters.modes.includes(group);
		if (active && filters.modes.length === 1) return;
		const modes = active
			? filters.modes.filter((g) => g !== group)
			: ALL_MODE_GROUPS.filter((g) => filters.modes.includes(g) || g === group);
		onChange({ ...filters, modes });
	}

	return (
		<div className="mb-6 rounded-xl border border-wayfare-line bg-wayfare-surface-strong">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm text-wayfare-text"
			>
				<span className="flex items-center gap-2">
					<AdjustmentsIcon
						aria-hidden="true"
						className="shrink-0 text-wayfare-primary"
					/>
					Filter journeys
					{activeCount > 0 && (
						<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-wayfare-primary px-1.5 text-xs font-semibold text-white">
							{activeCount}
						</span>
					)}
				</span>
				<span className="text-wayfare-text-secondary">
					{open ? "Hide" : "Show"}
				</span>
			</button>

			{open && (
				<div className="border-t border-wayfare-line px-4 py-4">
					<fieldset className="mb-4">
						<legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
							Transport modes
						</legend>
						<div className="flex flex-wrap gap-2">
							{ALL_MODE_GROUPS.map((group) => (
								<ModePill
									key={group}
									label={MODE_GROUP_LABELS[group]}
									active={filters.modes.includes(group)}
									onClick={() => toggleMode(group)}
								/>
							))}
						</div>
					</fieldset>

					<div className="flex flex-col gap-3">
						<PreferenceSwitch
							label="Fewer transfers"
							description="Prefer journeys with fewer changes, even if slower"
							checked={filters.fewerTransfers}
							onChange={(fewerTransfers) =>
								onChange({ ...filters, fewerTransfers })
							}
						/>
						<PreferenceSwitch
							label="Less walking"
							description="Prefer journeys with shorter walks to and from stops"
							checked={filters.lessWalking}
							onChange={(lessWalking) => onChange({ ...filters, lessWalking })}
						/>
					</div>

					{!isDefaultFilters(filters) && (
						<button
							type="button"
							onClick={onReset}
							className="mt-4 cursor-pointer text-sm font-medium text-wayfare-primary hover:underline"
						>
							Reset filters
						</button>
					)}
				</div>
			)}
		</div>
	);
}
