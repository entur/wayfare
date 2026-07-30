import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/theme/theme";

const SETTINGS_KEY = "@wayfare/settings/v1";

export interface AppSettings {
  customerNumber: string;
  bffBaseUrl: string;
  themeMode: ThemeMode;
}

export const defaultSettings: AppSettings = {
  customerNumber: "",
  bffBaseUrl: "",
  themeMode: "system",
};

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export async function loadSettings(): Promise<AppSettings> {
  const stored = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;
  try {
    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    return {
      customerNumber:
        typeof parsed.customerNumber === "string" ? parsed.customerNumber : "",
      bffBaseUrl:
        typeof parsed.bffBaseUrl === "string" ? parsed.bffBaseUrl : "",
      themeMode: isThemeMode(parsed.themeMode) ? parsed.themeMode : "system",
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function effectiveBffBaseUrl(settings: AppSettings): string {
  return (
    settings.bffBaseUrl.trim() ||
    process.env.EXPO_PUBLIC_BFF_BASE_URL ||
    "http://localhost:3001"
  ).replace(/\/+$/, "");
}
