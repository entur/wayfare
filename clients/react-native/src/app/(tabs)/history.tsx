import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type JourneyDetail, wayfareApi } from "@/api/client";
import {
  Banner,
  Body,
  Card,
  EmptyState,
  Heading,
  LoadingState,
  Screen,
} from "@/components/ui";
import { useSettings } from "@/settings/context";
import { effectiveBffBaseUrl } from "@/settings/storage";

export default function HistoryScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { settings, theme } = useSettings();
  const [date, setDate] = useState(today());
  const baseUrl = effectiveBffBaseUrl(settings);
  const api = useMemo(() => wayfareApi(baseUrl), [baseUrl]);
  const journeys = useQuery({
    queryKey: ["journeys", baseUrl, settings.customerNumber, date],
    queryFn: () => api.journeys(settings.customerNumber, date),
    enabled: Boolean(settings.customerNumber),
  });

  return (
    <Screen
      title="Journey history"
      subtitle="Completed trips for the selected day."
      refreshing={journeys.isRefetching}
      onRefresh={
        settings.customerNumber
          ? () => {
              void journeys.refetch();
            }
          : undefined
      }
    >
      {!settings.customerNumber ? (
        <Banner
          kind="info"
          title="Set up a test rider"
          message="Add a customer number in Settings to view journey history."
        />
      ) : (
        <>
          <View
            accessibilityRole="toolbar"
            accessibilityLabel="History date"
            style={[
              styles.datePicker,
              {
                borderColor: theme.colors.line,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            <DateButton
              label="Previous day"
              onPress={() => setDate(moveDate(date, -1))}
            >
              <ChevronLeft color={theme.colors.text} />
            </DateButton>
            <View style={styles.dateCopy}>
              <Text style={[styles.date, { color: theme.colors.text }]}>
                {formatDate(date)}
              </Text>
              {date !== today() ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Return to today"
                  onPress={() => setDate(today())}
                  style={styles.todayButton}
                >
                  <Text
                    style={[styles.todayLabel, { color: theme.colors.primary }]}
                  >
                    Today
                  </Text>
                </Pressable>
              ) : null}
            </View>
            <DateButton
              label="Next day"
              disabled={date >= today()}
              onPress={() => setDate(moveDate(date, 1))}
            >
              <ChevronRight color={theme.colors.text} />
            </DateButton>
          </View>
          {journeys.isPending ? (
            <LoadingState label="Loading journey history" />
          ) : journeys.error ? (
            <Banner
              kind="error"
              title="History unavailable"
              message={journeys.error.message}
            />
          ) : journeys.data?.length === 0 ? (
            <EmptyState
              title="No journeys"
              message="There are no completed journeys for this day."
            />
          ) : (
            journeys.data?.map((journey) => (
              <Pressable
                key={journey.id}
                accessibilityRole="button"
                accessibilityLabel={`Journey from ${formatTime(journey.startTime)} to ${formatTime(journey.endTime)}, ${journey.totalCost} ${journey.currency}`}
                accessibilityHint="Opens journey details"
                onPress={() => {
                  queryClient.setQueryData<JourneyDetail>(
                    ["journey", baseUrl, journey.id],
                    journey.detail,
                  );
                  router.push({
                    pathname: "/journey/[id]",
                    params: { id: journey.id },
                  });
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Card>
                  <View style={styles.summaryHeader}>
                    <Heading>
                      {formatTime(journey.startTime)} to{" "}
                      {formatTime(journey.endTime)}
                    </Heading>
                    {journey.simulated ? (
                      <Text
                        style={[
                          styles.badge,
                          {
                            color: theme.colors.primary,
                            backgroundColor: theme.colors.accentSoft,
                          },
                        ]}
                      >
                        SIMULATED
                      </Text>
                    ) : null}
                  </View>
                  <Body secondary>
                    {journey.modes.join(", ")} · {journey.passengerCount}{" "}
                    {journey.passengerCount === 1 ? "passenger" : "passengers"}
                  </Body>
                  <Body>
                    {journey.totalCost} {journey.currency}
                  </Body>
                </Card>
              </Pressable>
            ))
          )}
        </>
      )}
    </Screen>
  );

  function DateButton({
    label,
    disabled = false,
    onPress,
    children,
  }: {
    label: string;
    disabled?: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={[styles.dateButton, { opacity: disabled ? 0.35 : 1 }]}
      >
        {children}
      </Pressable>
    );
  }
}

function today(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function moveDate(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  datePicker: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  dateButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCopy: { alignItems: "center", gap: 1 },
  date: { fontSize: 16, fontWeight: "700" },
  todayButton: {
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  todayLabel: { fontSize: 12, fontWeight: "700" },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  badge: {
    fontSize: 10,
    lineHeight: 18,
    fontWeight: "800",
    paddingHorizontal: 8,
    borderRadius: 9,
    overflow: "hidden",
  },
});
