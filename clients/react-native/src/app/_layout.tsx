import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingState } from "@/components/ui";
import { WayfareQueryProvider } from "@/query/provider";
import { SettingsProvider, useSettings } from "@/settings/context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <WayfareQueryProvider>
            <ThemedNavigation />
          </WayfareQueryProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedNavigation() {
  const { hydrated, theme } = useSettings();
  const navigationTheme = theme.mode === "dark" ? DarkTheme : DefaultTheme;
  const value = {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.line,
    },
  };
  if (!hydrated) return <LoadingState label="Loading Wayfare" />;
  return (
    <ThemeProvider value={value}>
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="journey/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
