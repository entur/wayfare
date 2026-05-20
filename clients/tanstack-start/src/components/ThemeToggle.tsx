import { LaptopIcon, NightIcon, SunIcon } from "@entur/icons";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") {
		return "auto";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto") {
		return stored;
	}

	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.setAttribute("data-color-mode", resolved);
	document.documentElement.style.colorScheme = resolved;
}

const modeConfig: Record<ThemeMode, { icon: React.ReactNode; label: string }> =
	{
		light: { icon: <SunIcon size={16} aria-hidden="true" />, label: "Light" },
		dark: { icon: <NightIcon size={16} aria-hidden="true" />, label: "Dark" },
		auto: { icon: <LaptopIcon size={16} aria-hidden="true" />, label: "Auto" },
	};

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	useEffect(() => {
		if (mode !== "auto") {
			return;
		}

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");

		media.addEventListener("change", onChange);
		return () => {
			media.removeEventListener("change", onChange);
		};
	}, [mode]);

	function toggleMode() {
		const nextMode: ThemeMode =
			mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
		setMode(nextMode);
		applyThemeMode(nextMode);
		window.localStorage.setItem("theme", nextMode);
	}

	const { icon, label } = modeConfig[mode];
	const ariaLabel = `Theme: ${label}. Click to cycle theme.`;

	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={ariaLabel}
			title={ariaLabel}
			className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-[var(--wayfare-text-secondary)] transition-colors hover:bg-[var(--wayfare-bg)]"
		>
			{icon}
		</button>
	);
}
