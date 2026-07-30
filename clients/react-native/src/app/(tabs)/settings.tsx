import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Banner,
  Button,
  Card,
  FormField,
  Heading,
  Screen,
} from "@/components/ui";
import { useSettings } from "@/settings/context";
import type { ThemeMode } from "@/theme/theme";

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export default function SettingsScreen() {
  const { settings, updateSettings, theme } = useSettings();
  const [customerNumber, setCustomerNumber] = useState(settings.customerNumber);
  const [bffBaseUrl, setBffBaseUrl] = useState(settings.bffBaseUrl);
  const [themeMode, setThemeMode] = useState(settings.themeMode);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  const hasChanges =
    customerNumber !== settings.customerNumber ||
    bffBaseUrl !== settings.bffBaseUrl ||
    themeMode !== settings.themeMode;

  async function save() {
    const trimmedCustomer = customerNumber.trim();
    const trimmedUrl = bffBaseUrl.trim();
    if (trimmedCustomer && !/^\d{1,15}$/.test(trimmedCustomer)) {
      setError("Customer number must contain 1 to 15 digits.");
      return;
    }
    if (trimmedUrl && !/^https?:\/\/[^/]/.test(trimmedUrl)) {
      setError("BFF URL must start with http:// or https://.");
      return;
    }
    setError(undefined);
    await updateSettings({
      customerNumber: trimmedCustomer,
      bffBaseUrl: trimmedUrl,
      themeMode,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2_000);
  }

  return (
    <Screen
      title="Settings"
      subtitle="Configure the test rider and this development build."
    >
      {error ? (
        <Banner kind="error" title="Check your settings" message={error} />
      ) : null}
      {saved ? (
        <Banner
          kind="info"
          title="Settings saved"
          message="Your test rider and app preferences are ready."
        />
      ) : null}
      <Card>
        <Heading>Test rider</Heading>
        <FormField
          label="Customer number"
          value={customerNumber}
          onChangeText={setCustomerNumber}
          keyboardType="number-pad"
          autoComplete="off"
          hint="Digits only. Active journeys are stored separately for each customer."
          placeholder="123456"
        />
      </Card>
      <Card>
        <Heading>Appearance</Heading>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Theme"
          style={[
            styles.segment,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.line,
            },
          ]}
        >
          {themeOptions.map((option) => {
            const selected = themeMode === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityLabel={`${option.label} theme`}
                accessibilityState={{ selected, checked: selected }}
                onPress={() => setThemeMode(option.value)}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor: selected
                      ? theme.colors.surface
                      : "transparent",
                    borderColor: selected ? theme.colors.line : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    {
                      color: selected
                        ? theme.colors.primary
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Card>
        <Heading>Developer</Heading>
        <FormField
          label="BFF URL override"
          value={bffBaseUrl}
          onChangeText={setBffBaseUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          hint="Leave blank to use EXPO_PUBLIC_BFF_BASE_URL. Android Emulator uses 10.0.2.2 for the host machine."
          placeholder="http://10.0.2.2:3001"
        />
      </Card>
      <Button
        label="Save settings"
        onPress={() => void save()}
        disabled={!hasChanges}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 3,
    flexDirection: "row",
  },
  segmentButton: {
    minHeight: 44,
    flex: 1,
    borderWidth: 1,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentLabel: { fontSize: 14, fontWeight: "700" },
});
