import type { OtpTransportMode } from "../types/trip-planner";

type Theme = "light" | "dark";

const LIGHT: Record<OtpTransportMode, string> = {
	rail: "#00367f",
	metro: "#bf5826",
	tram: "#78469a",
	bus: "#c5044e",
	coach: "#c5044e",
	ferry: "#0c6693",
	water: "#0c6693",
	air: "#800664",
	bicycle: "#0d827e",
	car: "#3d3e40",
	foot: "#8d8e9c",
};

const DARK: Record<OtpTransportMode, string> = {
	rail: "#60a2d7",
	metro: "#dd973c",
	tram: "#b898e5",
	bus: "#ef7398",
	coach: "#ef7398",
	ferry: "#8ccfe2",
	water: "#8ccfe2",
	air: "#f2b8e5",
	bicycle: "#4db2a1",
	car: "#ffe082",
	foot: "#8d8e9c",
};

export function getTransportColor(
	mode: OtpTransportMode,
	theme: Theme,
): string {
	return (theme === "dark" ? DARK : LIGHT)[mode] ?? "#4285F4";
}
