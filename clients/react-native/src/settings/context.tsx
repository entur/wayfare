import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { resolveTheme, themes, type WayfareTheme } from "@/theme/theme";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type AppSettings,
} from "./storage";

interface SettingsContextValue {
  hydrated: boolean;
  settings: AppSettings;
  theme: WayfareTheme;
  updateSettings: (next: AppSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadSettings()
      .then(setSettings)
      .finally(() => setHydrated(true));
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      hydrated,
      settings,
      theme: themes[resolveTheme(settings.themeMode, systemScheme)],
      updateSettings: async (next) => {
        setSettings(next);
        await saveSettings(next);
      },
    }),
    [hydrated, settings, systemScheme],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value)
    throw new Error("useSettings must be used inside SettingsProvider");
  return value;
}
