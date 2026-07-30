import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { JourneyDetail } from "@/api/client";
import {
  Banner,
  Body,
  Card,
  Divider,
  EmptyState,
  Heading,
  Screen,
} from "@/components/ui";
import { useSettings } from "@/settings/context";
import { effectiveBffBaseUrl } from "@/settings/storage";

export default function JourneyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { settings, theme } = useSettings();
  const journey = queryClient.getQueryData<JourneyDetail>([
    "journey",
    effectiveBffBaseUrl(settings),
    id,
  ]);

  return (
    <Screen title="Journey details">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to journey history"
        onPress={() => router.back()}
        style={styles.back}
      >
        <ArrowLeft color={theme.colors.primary} size={20} />
        <Text style={[styles.backLabel, { color: theme.colors.primary }]}>
          History
        </Text>
      </Pressable>
      {!journey ? (
        <EmptyState
          title="Journey details expired"
          message="Return to history and open the journey again."
        />
      ) : (
        <>
          {journey.simulated ? (
            <Banner
              kind="info"
              title="Simulated journey"
              message="This trip was completed with the development checkout simulator."
            />
          ) : null}
          <Card>
            <Heading>
              {formatDateTime(journey.startTime)} to{" "}
              {formatDateTime(journey.endTime)}
            </Heading>
            <Body>
              {journey.totalCost} {journey.currency}
            </Body>
            <Body secondary>
              {journey.passengers.map((item) => item.label).join(", ")}
            </Body>
            {journey.confidence !== undefined ? (
              <Body secondary>
                Confidence {Math.round(journey.confidence * 100)}%
              </Body>
            ) : null}
          </Card>
          <Heading>Route</Heading>
          {journey.legs.map((leg, index) => (
            <Card key={`${leg.startTime}-${index}`}>
              <View style={styles.legHeader}>
                <Text
                  style={[
                    styles.mode,
                    {
                      color: theme.colors.primary,
                      backgroundColor: theme.colors.accentSoft,
                    },
                  ]}
                >
                  {leg.mode}
                </Text>
                <Body secondary>
                  {formatTime(leg.startTime)} to {formatTime(leg.endTime)}
                </Body>
              </View>
              <Divider />
              <Body>
                {leg.from} to {leg.to}
              </Body>
              <Body secondary>
                {leg.zones.length > 0
                  ? `Zones ${leg.zones.join(", ")}`
                  : "No zone information"}
              </Body>
            </Card>
          ))}
        </>
      )}
    </Screen>
  );
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  back: {
    minHeight: 44,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backLabel: { fontSize: 15, fontWeight: "700" },
  legHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  mode: {
    fontSize: 12,
    lineHeight: 22,
    fontWeight: "800",
    paddingHorizontal: 9,
    borderRadius: 11,
    overflow: "hidden",
  },
});
