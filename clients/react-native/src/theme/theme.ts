import type { ColorSchemeName } from "react-native";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface WayfareTheme {
  mode: ResolvedTheme;
  colors: {
    primary: string;
    primaryPressed: string;
    text: string;
    textSecondary: string;
    surface: string;
    background: string;
    line: string;
    accentSoft: string;
    infoBackground: string;
    infoBorder: string;
    infoText: string;
    warningBackground: string;
    warningBorder: string;
    warningText: string;
    errorBackground: string;
    errorBorder: string;
    errorText: string;
  };
}

export function resolveTheme(
  mode: ThemeMode,
  systemScheme: ColorSchemeName,
): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return systemScheme === "dark" ? "dark" : "light";
}

export const themes: Record<ResolvedTheme, WayfareTheme> = {
  light: {
    mode: "light",
    colors: {
      primary: "#E90037",
      primaryPressed: "#C7002F",
      text: "#181C20",
      textSecondary: "#555E68",
      surface: "#FFFFFF",
      background: "#F5F6F7",
      line: "rgba(24, 28, 32, 0.12)",
      accentSoft: "rgba(233, 0, 55, 0.08)",
      infoBackground: "#E1EFF8",
      infoBorder: "#0082B9",
      infoText: "#004D70",
      warningBackground: "#FFF4CD",
      warningBorder: "#F0A500",
      warningText: "#6B3A00",
      errorBackground: "#FFCECE",
      errorBorder: "#D31B1B",
      errorText: "#7A0000",
    },
  },
  dark: {
    mode: "dark",
    colors: {
      primary: "#FF3355",
      primaryPressed: "#FF5577",
      text: "#E8EAED",
      textSecondary: "#9AA3AE",
      surface: "#1E2228",
      background: "#12151A",
      line: "rgba(232, 234, 237, 0.12)",
      accentSoft: "rgba(255, 51, 85, 0.10)",
      infoBackground: "rgba(0, 130, 185, 0.15)",
      infoBorder: "#64B3E7",
      infoText: "#A8D4F0",
      warningBackground: "rgba(255, 202, 40, 0.12)",
      warningBorder: "#FFCA28",
      warningText: "#FFE082",
      errorBackground: "rgba(211, 27, 27, 0.15)",
      errorBorder: "#FF9494",
      errorText: "#FFCECE",
    },
  },
};
