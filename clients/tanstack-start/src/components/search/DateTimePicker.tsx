import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { TimeMode } from "../../context/search-form";

function pad(n: number): string {
	return String(n).padStart(2, "0");
}

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
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function daysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

// Returns 0 = Monday … 6 = Sunday
function firstWeekday(year: number, month: number): number {
	return (new Date(year, month, 1).getDay() + 6) % 7;
}

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const MONTH_SHORT = [
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
];

const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function formatTrigger(mode: TimeMode, value: string): string {
	if (mode === "now") return "Leave now";
	const prefix = mode === "depart" ? "Leave at" : "Arrive by";
	if (!value) return prefix;
	const [datePart, timePart = ""] = value.split("T");
	const [, m, d] = datePart.split("-").map(Number);
	return `${prefix} ${d} ${MONTH_SHORT[m - 1]} · ${timePart}`;
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
	const [openUpward, setOpenUpward] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);
	const triggerId = useId();

	const parsedDate = value ? new Date(value.replace("T", " ")) : new Date();
	const [calYear, setCalYear] = useState(parsedDate.getFullYear());
	const [calMonth, setCalMonth] = useState(parsedDate.getMonth());

	useEffect(() => {
		if (value) {
			const d = new Date(value.replace("T", " "));
			setCalYear(d.getFullYear());
			setCalMonth(d.getMonth());
		}
	}, [value]);

	useLayoutEffect(() => {
		if (!open) {
			setOpenUpward(false);
			return;
		}
		if (popupRef.current) {
			const rect = popupRef.current.getBoundingClientRect();
			if (rect.bottom > window.innerHeight - 4) {
				setOpenUpward(true);
			}
		}
	}, [open]);

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

	const dateStr = value.slice(0, 10);
	const timeStr = value.length >= 16 ? value.slice(11, 16) : "00:00";
	const [hStr, mStr] = timeStr.split(":");
	const hour = Number.parseInt(hStr || "0", 10);
	const minute = Number.parseInt(mStr || "0", 10);

	const todayStr = localIsoNow().slice(0, 10);
	const minDateStr = minDate ?? todayStr;

	function handleModeChange(mode: TimeMode) {
		if (mode !== "now" && !value) onChange(localIsoNow());
		onModeChange(mode);
		if (mode === "now") setOpen(false);
	}

	function prevMonth() {
		if (calMonth === 0) {
			setCalYear((y) => y - 1);
			setCalMonth(11);
		} else {
			setCalMonth((m) => m - 1);
		}
	}

	function nextMonth() {
		if (calMonth === 11) {
			setCalYear((y) => y + 1);
			setCalMonth(0);
		} else {
			setCalMonth((m) => m + 1);
		}
	}

	function selectDay(day: number) {
		const ds = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
		onChange(`${ds}T${timeStr}`);
	}

	function adjustHour(delta: number) {
		const h = ((hour + delta) % 24 + 24) % 24;
		onChange(`${dateStr}T${pad(h)}:${mStr}`);
	}

	function adjustMinute(delta: number) {
		const m = ((minute + delta) % 60 + 60) % 60;
		onChange(`${dateStr}T${hStr}:${pad(m)}`);
	}

	const firstDay = firstWeekday(calYear, calMonth);
	const numDays = daysInMonth(calYear, calMonth);
	const cells: (number | null)[] = [
		...Array.from({ length: firstDay }, () => null),
		...Array.from({ length: numDays }, (_, i) => i + 1),
	];

	const spinnerBtnCls =
		"flex h-5 w-5 items-center justify-center rounded text-[10px] transition-colors hover:opacity-70";

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
				className="flex w-full min-w-[13rem] items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition-shadow focus:outline-none focus:ring-2"
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
					ref={popupRef}
					className={`absolute left-0 z-50 w-72 rounded-xl border p-4 shadow-lg ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}`}
					style={{
						background: "var(--wayfare-surface-strong)",
						borderColor: "var(--wayfare-line)",
					}}
				>
					{/* Mode tabs */}
					<div
						className="mb-4 flex rounded-lg border p-0.5"
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
								className="flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-all"
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
										timeMode === m.value
											? "0 1px 3px rgba(0,0,0,0.1)"
											: "none",
								}}
							>
								{m.label}
							</button>
						))}
					</div>

					{timeMode !== "now" && (
						<>
							{/* Inline calendar */}
							<div className="mb-3">
								<div className="mb-2 flex items-center justify-between">
									<button
										type="button"
										onClick={prevMonth}
										className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors hover:opacity-70"
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Previous month"
									>
										‹
									</button>
									<span
										className="text-sm font-medium"
										style={{ color: "var(--wayfare-text)" }}
									>
										{MONTH_NAMES[calMonth]} {calYear}
									</span>
									<button
										type="button"
										onClick={nextMonth}
										className="flex h-7 w-7 items-center justify-center rounded-lg text-base transition-colors hover:opacity-70"
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Next month"
									>
										›
									</button>
								</div>

								<div className="mb-1 grid grid-cols-7">
									{DAY_HEADERS.map((d) => (
										<div
											key={d}
											className="text-center text-[10px] font-medium"
											style={{ color: "var(--wayfare-text-secondary)" }}
										>
											{d}
										</div>
									))}
								</div>

								<div className="grid grid-cols-7">
									{cells.map((day, i) => {
										if (day === null) {
											return <div key={`e-${i}`} className="h-7" />;
										}
										const cellStr = `${calYear}-${pad(calMonth + 1)}-${pad(day)}`;
										const isSelected = cellStr === dateStr;
										const isToday = cellStr === todayStr;
										const isDisabled = cellStr < minDateStr;
										return (
											<button
												key={day}
												type="button"
												disabled={isDisabled}
												onClick={() => selectDay(day)}
												className="flex h-7 w-full items-center justify-center rounded-full text-xs transition-colors"
												style={{
													background: isSelected
														? "var(--wayfare-primary)"
														: "transparent",
													color: isSelected
														? "#ffffff"
														: isDisabled
															? "var(--wayfare-text-secondary)"
															: isToday
																? "var(--wayfare-primary)"
																: "var(--wayfare-text)",
													fontWeight: isSelected || isToday ? 600 : 400,
													opacity: isDisabled ? 0.35 : 1,
													cursor: isDisabled ? "not-allowed" : "pointer",
												}}
											>
												{day}
											</button>
										);
									})}
								</div>
							</div>

							<div
								className="mb-3 border-t"
								style={{ borderColor: "var(--wayfare-line)" }}
							/>

							{/* Inline time picker */}
							<div className="flex items-center gap-2">
								{/* Hour spinner */}
								<div className="flex flex-col items-center gap-0.5">
									<button
										type="button"
										onClick={() => adjustHour(1)}
										className={spinnerBtnCls}
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Increase hour"
									>
										▲
									</button>
									<span
										className="flex h-8 w-9 items-center justify-center rounded-lg border text-sm font-medium tabular-nums"
										style={{
											borderColor: "var(--wayfare-line)",
											background: "var(--wayfare-bg)",
											color: "var(--wayfare-text)",
										}}
									>
										{hStr}
									</span>
									<button
										type="button"
										onClick={() => adjustHour(-1)}
										className={spinnerBtnCls}
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Decrease hour"
									>
										▼
									</button>
								</div>

								<span
									className="mb-px text-sm font-medium"
									style={{ color: "var(--wayfare-text)" }}
								>
									:
								</span>

								{/* Minute spinner */}
								<div className="flex flex-col items-center gap-0.5">
									<button
										type="button"
										onClick={() => adjustMinute(1)}
										className={spinnerBtnCls}
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Increase minute"
									>
										▲
									</button>
									<span
										className="flex h-8 w-9 items-center justify-center rounded-lg border text-sm font-medium tabular-nums"
										style={{
											borderColor: "var(--wayfare-line)",
											background: "var(--wayfare-bg)",
											color: "var(--wayfare-text)",
										}}
									>
										{mStr}
									</span>
									<button
										type="button"
										onClick={() => adjustMinute(-1)}
										className={spinnerBtnCls}
										style={{ color: "var(--wayfare-text-secondary)" }}
										aria-label="Decrease minute"
									>
										▼
									</button>
								</div>

								{/* Quick-set buttons */}
								<div className="ml-auto flex gap-1">
									{(
										[
											{ label: "Now", fn: () => onChange(localIsoNow()) },
											{ label: "+5", fn: () => onChange(addMinutes(value, 5)) },
											{
												label: "+10",
												fn: () => onChange(addMinutes(value, 10)),
											},
										] as const
									).map(({ label: btnLabel, fn }) => (
										<button
											key={btnLabel}
											type="button"
											onClick={fn}
											className="rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors"
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
						</>
					)}
				</div>
			)}
		</div>
	);
}
