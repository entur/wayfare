import { useEffect, useId, useRef, useState } from "react";
import type { TimeMode } from "../../context/search-form";

function localIsoNow(): string {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now.toISOString().slice(0, 16);
}

function addMinutes(localStr: string, minutes: number): string {
	const [datePart, timePart = "00:00"] = localStr.split("T");
	const [y, m, d] = datePart.split("-").map(Number);
	const [h, min] = timePart.split(":").map(Number);
	const date = new Date(y, m - 1, d, h, min + minutes);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

function formatTrigger(mode: TimeMode, value: string): string {
	if (mode === "now") return "Leave now";
	const prefix = mode === "depart" ? "Leave at" : "Arrive by";
	if (!value) return prefix;
	const [datePart, timePart = ""] = value.split("T");
	const [, m, d] = datePart.split("-").map(Number);
	return `${prefix} ${d} ${MONTHS[m - 1]} · ${timePart}`;
}

const MODES: { value: TimeMode; label: string }[] = [
	{ value: "now", label: "Leave now" },
	{ value: "depart", label: "Leave at" },
	{ value: "arrive", label: "Arrive by" },
];

interface DateTimePickerProps {
	label: string;
	value: string;
	timeMode: TimeMode;
	minDate?: string;
	onChange: (value: string) => void;
	onModeChange: (mode: TimeMode) => void;
}

export default function DateTimePicker({
	label,
	value,
	timeMode,
	minDate,
	onChange,
	onModeChange,
}: DateTimePickerProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerId = useId();

	useEffect(() => {
		if (!open) return;
		function onMouseDown(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", onMouseDown);
		return () => document.removeEventListener("mousedown", onMouseDown);
	}, [open]);

	const dateValue = value.slice(0, 10);
	const timeValue = value.length >= 16 ? value.slice(11, 16) : "00:00";

	function handleModeChange(mode: TimeMode) {
		if (mode !== "now" && !value) onChange(localIsoNow());
		onModeChange(mode);
		if (mode === "now") setOpen(false);
	}

	const inputCls =
		"w-full rounded-lg border px-3 py-2 text-sm outline-none transition-shadow focus:ring-2";
	const inputStyle = {
		borderColor: "var(--wayfare-line)",
		background: "var(--wayfare-bg)",
		color: "var(--wayfare-text)",
	};

	return (
		<div ref={containerRef} className="relative w-full">
			<label
				htmlFor={triggerId}
				className="mb-1.5 block text-sm font-medium"
				style={{ color: "var(--wayfare-text)" }}
			>
				{label}
			</label>
			<button
				id={triggerId}
				type="button"
				onClick={() => setOpen((v) => !v)}
				className="flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-shadow focus:outline-none focus:ring-2"
				style={{
					borderColor: "var(--wayfare-line)",
					background: "var(--wayfare-surface-strong)",
					color: "var(--wayfare-text)",
				}}
			>
				<span className="truncate">{formatTrigger(timeMode, value)}</span>
				<svg
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					aria-hidden="true"
					className={`ml-2 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
				>
					<path
						d="M2 4l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			{open && (
				<div
					className="absolute left-0 top-full z-50 mt-1 min-w-[260px] rounded-xl border p-4 shadow-lg"
					style={{
						background: "var(--wayfare-surface-strong)",
						borderColor: "var(--wayfare-line)",
					}}
				>
					{/* Mode selector */}
					<div
						className="mb-3 flex rounded-lg border p-0.5"
						style={{
							borderColor: "var(--wayfare-line)",
							background: "var(--wayfare-bg)",
						}}
					>
						{MODES.map((m) => (
							<button
								key={m.value}
								type="button"
								onClick={() => handleModeChange(m.value)}
								className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all"
								style={{
									background:
										timeMode === m.value
											? "var(--wayfare-surface-strong)"
											: "transparent",
									color:
										timeMode === m.value
											? "var(--wayfare-text)"
											: "var(--wayfare-text-secondary)",
									boxShadow:
										timeMode === m.value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
								}}
							>
								{m.label}
							</button>
						))}
					</div>

					{/* Date + time inputs — only when a specific time is needed */}
					{timeMode !== "now" && (
						<div className="flex flex-col gap-2">
							<input
								type="date"
								value={dateValue}
								min={minDate}
								onChange={(e) => onChange(`${e.target.value}T${timeValue}`)}
								className={inputCls}
								style={inputStyle}
							/>
							<div className="flex gap-2">
								<input
									type="time"
									value={timeValue}
									onChange={(e) => onChange(`${dateValue}T${e.target.value}`)}
									className={`${inputCls} min-w-0 flex-1`}
									style={inputStyle}
								/>
								<div className="flex gap-1">
									{(
										[
											{ label: "Now", getVal: () => localIsoNow() },
											{ label: "+5", getVal: () => addMinutes(value, 5) },
											{ label: "+10", getVal: () => addMinutes(value, 10) },
										] as const
									).map(({ label: btnLabel, getVal }) => (
										<button
											key={btnLabel}
											type="button"
											onClick={() => onChange(getVal())}
											className="rounded-lg border px-2 py-2 text-xs font-medium transition-colors"
											style={{
												borderColor: "var(--wayfare-line)",
												color: "var(--wayfare-text-secondary)",
												background: "var(--wayfare-bg)",
											}}
										>
											{btnLabel}
										</button>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
