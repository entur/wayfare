import { useNetInfo } from "@react-native-community/netinfo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  type JourneyDetail,
  type PaymentRetryResult,
  wayfareApi,
} from "@/api/client";
import {
  Banner,
  Body,
  Button,
  Card,
  ConfirmationSheet,
  Divider,
  EmptyState,
  Heading,
  LoadingState,
  Screen,
} from "@/components/ui";
import {
  clearActiveJourney,
  type ActiveJourney,
  loadActiveJourney,
  saveActiveJourney,
} from "@/journeys/storage";
import { useSettings } from "@/settings/context";
import { effectiveBffBaseUrl } from "@/settings/storage";

const FARE_FRAME_ID = "KOL:FareFrame:FareData";

export default function TravelScreen() {
  const { settings, theme } = useSettings();
  const customerNumber = settings.customerNumber;
  const baseUrl = effectiveBffBaseUrl(settings);
  const api = useMemo(() => wayfareApi(baseUrl), [baseUrl]);
  const queryClient = useQueryClient();
  const netInfo = useNetInfo();
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedLuggage, setSelectedLuggage] = useState<string[]>();
  const [receipt, setReceipt] = useState<JourneyDetail>();
  const [confirmCheckout, setConfirmCheckout] = useState(false);
  const [confirmRetry, setConfirmRetry] = useState(false);
  const [retryResult, setRetryResult] = useState<PaymentRetryResult>();

  const activeJourney = useQuery({
    queryKey: ["active-journey", customerNumber],
    queryFn: async () => (await loadActiveJourney(customerNumber)) ?? null,
    enabled: Boolean(customerNumber),
  });
  const active = activeJourney.data;

  const options = useQuery({
    queryKey: ["travel-options", baseUrl, FARE_FRAME_ID],
    queryFn: () => api.travelOptions(FARE_FRAME_ID),
    enabled: Boolean(customerNumber && !active),
  });
  const payment = useQuery({
    queryKey: ["payment-status", baseUrl, customerNumber],
    queryFn: () => api.paymentStatus(customerNumber),
    enabled: Boolean(customerNumber),
  });

  const effectiveProfiles =
    selectedProfiles.length > 0
      ? selectedProfiles
      : (options.data?.passengerProfiles
          .filter((option) => option.required)
          .map((option) => option.id) ?? []);
  const effectiveLuggage =
    selectedLuggage ??
    options.data?.luggage
      .filter((option) => option.required)
      .map((option) => option.id) ??
    [];

  const checkIn = useMutation({
    mutationFn: () =>
      api.checkIn({
        customerNumber,
        userProfileIds: effectiveProfiles,
        luggageIds: effectiveLuggage,
      }),
    onSuccess: async (journey) => {
      await saveActiveJourney(customerNumber, journey);
      queryClient.setQueryData(["active-journey", customerNumber], journey);
    },
  });
  const checkOut = useMutation({
    mutationFn: () => {
      if (!active) throw new Error("No active journey");
      return api.checkOut(active.journeyId, {
        customerNumber,
        startTime: active.startTime,
      });
    },
    onSuccess: async (journey) => {
      setReceipt(journey);
      setConfirmCheckout(false);
      await clearActiveJourney(customerNumber);
      queryClient.setQueryData(["active-journey", customerNumber], null);
      await queryClient.invalidateQueries({
        queryKey: ["journeys", baseUrl, customerNumber],
      });
      for (const delay of [1_000, 3_000]) {
        setTimeout(() => {
          void queryClient.invalidateQueries({
            queryKey: ["journeys", baseUrl, customerNumber],
          });
        }, delay);
      }
    },
  });
  const retryPayments = useMutation({
    mutationFn: () => api.retryPayments(customerNumber),
    onMutate: () => setRetryResult(undefined),
    onSuccess: async (result) => {
      setRetryResult(result);
      setConfirmRetry(false);
      await queryClient.invalidateQueries({
        queryKey: ["payment-status", baseUrl, customerNumber],
      });
    },
  });

  const isOffline = netInfo.isConnected === false;
  const canCheckIn =
    !checkIn.isPending && !isOffline && Boolean(customerNumber);

  return (
    <Screen
      title="Travel"
      subtitle="Check in before boarding and check out when you arrive."
      footer={
        customerNumber &&
        !active &&
        !activeJourney.isPending &&
        options.data &&
        options.data.passengerProfiles.length > 0 ? (
          <Button
            label="Check in"
            onPress={() => checkIn.mutate()}
            disabled={!canCheckIn}
            pending={checkIn.isPending}
          />
        ) : undefined
      }
    >
      {!customerNumber ? (
        <Banner
          kind="info"
          title="Set up a test rider"
          message="Add a test customer number in Settings before using travel actions."
        />
      ) : null}
      {isOffline ? (
        <Banner
          kind="warning"
          title="You are offline"
          message="Travel actions need a connection. Your active trip remains saved on this device."
        />
      ) : null}
      {payment.data?.hasFailedTransactions ? (
        <Banner
          kind="warning"
          title="Payment needs attention"
          message={
            payment.data.overdueAmount && payment.data.currency
              ? `${payment.data.overdueAmount} ${payment.data.currency} could not be charged.`
              : "One or more journeys could not be charged."
          }
          action={
            <Button
              label="Retry payment"
              onPress={() => setConfirmRetry(true)}
              variant="secondary"
            />
          }
        />
      ) : null}
      {payment.error ? (
        <Banner
          kind="error"
          title="Payment status unavailable"
          message={payment.error.message}
        />
      ) : null}
      {retryResult ? (
        <Banner
          kind={retryResult.failed > 0 ? "warning" : "info"}
          title="Payment retry finished"
          message={`${retryResult.paid} paid, ${retryResult.failed} failed, from ${retryResult.total} transactions.`}
        />
      ) : null}
      {retryPayments.error ? (
        <Banner
          kind="error"
          title="Payment retry failed"
          message={retryPayments.error.message}
        />
      ) : null}
      {checkOut.error ? (
        <Banner
          kind="error"
          title={
            "unknownResult" in checkOut.error && checkOut.error.unknownResult
              ? "Checkout result unknown"
              : "Checkout failed"
          }
          message={checkOut.error.message}
        />
      ) : null}
      {receipt ? <ReceiptCard journey={receipt} /> : null}
      {customerNumber && activeJourney.isPending ? (
        <LoadingState label="Restoring your trip" />
      ) : active ? (
        <ActiveTripCard
          journey={active}
          disabled={isOffline}
          pending={checkOut.isPending}
          onCheckout={() => setConfirmCheckout(true)}
        />
      ) : customerNumber ? (
        <>
          {options.isPending ? (
            <LoadingState label="Loading travel options" />
          ) : options.error ? (
            <Banner
              kind="error"
              title="Travel options unavailable"
              message={options.error.message}
              action={
                <Button
                  label="Try again"
                  onPress={() => void options.refetch()}
                  variant="secondary"
                />
              }
            />
          ) : options.data && options.data.passengerProfiles.length === 0 ? (
            <EmptyState
              title="No passenger profiles"
              message="No rider options are available for this fare frame."
            />
          ) : options.data ? (
            <Card>
              <Heading>Who is travelling?</Heading>
              <Body secondary>
                You are included. Add anyone travelling with you.
              </Body>
              <View style={styles.choices}>
                {options.data.passengerProfiles.map((option) => (
                  <OptionChip
                    key={option.id}
                    label={option.label}
                    description={option.description}
                    selected={effectiveProfiles.includes(option.id)}
                    onPress={() =>
                      setSelectedProfiles(
                        toggle(effectiveProfiles, option.id, option.required),
                      )
                    }
                  />
                ))}
              </View>
              {options.data.luggage.length > 0 ? (
                <>
                  <Divider />
                  <Heading>Luggage</Heading>
                  <View style={styles.choices}>
                    {options.data.luggage.map((option) => (
                      <OptionChip
                        key={option.id}
                        label={option.label}
                        description={option.description}
                        selected={effectiveLuggage.includes(option.id)}
                        onPress={() =>
                          setSelectedLuggage(
                            toggle(
                              effectiveLuggage,
                              option.id,
                              option.required,
                            ),
                          )
                        }
                      />
                    ))}
                  </View>
                </>
              ) : null}
              {checkIn.error ? (
                <Banner
                  kind="error"
                  title={
                    "code" in checkIn.error &&
                    checkIn.error.code === "JOURNEY_CONFLICT"
                      ? "A trip is already active"
                      : "Could not check in"
                  }
                  message={checkIn.error.message}
                />
              ) : null}
            </Card>
          ) : null}
        </>
      ) : null}
      <ConfirmationSheet
        visible={confirmCheckout}
        title="Check out now?"
        message="Use checkout only after leaving the vehicle. The prototype will create a simulated completed bus journey."
        confirmLabel="Check out"
        pending={checkOut.isPending}
        onCancel={() => setConfirmCheckout(false)}
        onConfirm={() => checkOut.mutate()}
      />
      <ConfirmationSheet
        visible={confirmRetry}
        title="Retry failed payments?"
        message="Wayfare will ask reisefrihet to retry every failed transaction for this test customer."
        confirmLabel="Retry payments"
        pending={retryPayments.isPending}
        onCancel={() => setConfirmRetry(false)}
        onConfirm={() => retryPayments.mutate()}
      />
    </Screen>
  );

  function OptionChip({
    label,
    description,
    selected,
    onPress,
  }: {
    label: string;
    description?: string | undefined;
    selected: boolean;
    onPress: () => void;
  }) {
    return (
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityHint={description}
        accessibilityState={{ checked: selected }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.choice,
          {
            opacity: pressed ? 0.7 : 1,
            borderColor: selected ? theme.colors.primary : theme.colors.line,
            backgroundColor: selected
              ? theme.colors.accentSoft
              : theme.colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.choiceLabel,
            { color: selected ? theme.colors.primary : theme.colors.text },
          ]}
          maxFontSizeMultiplier={1.6}
        >
          {selected ? "✓ " : ""}
          {label}
        </Text>
      </Pressable>
    );
  }
}

function ActiveTripCard({
  journey,
  disabled,
  pending,
  onCheckout,
}: {
  journey: ActiveJourney;
  disabled: boolean;
  pending: boolean;
  onCheckout: () => void;
}) {
  const [elapsed, setElapsed] = useState<number>();
  useEffect(() => {
    const update = () =>
      setElapsed(
        Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(journey.startTime).getTime()) / 60_000,
          ),
        ),
      );
    const frame = requestAnimationFrame(update);
    const timer = setInterval(update, 30_000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, [journey.startTime]);
  return (
    <Card>
      <Heading>You are checked in</Heading>
      <Body secondary>Trip started {formatTime(journey.startTime)}</Body>
      <Body>
        {elapsed === undefined
          ? "Calculating elapsed time"
          : `${elapsed < 1 ? "Less than a minute" : `${elapsed} min`} elapsed`}
      </Body>
      <Button
        label="Check out"
        onPress={onCheckout}
        disabled={disabled}
        pending={pending}
      />
    </Card>
  );
}

function ReceiptCard({ journey }: { journey: JourneyDetail }) {
  return (
    <Card>
      <Heading>Trip complete</Heading>
      {journey.simulated ? (
        <Banner
          kind="info"
          title="Simulated journey"
          message="This receipt was created by the development checkout simulator."
        />
      ) : null}
      <Body>
        {formatTime(journey.startTime)} to {formatTime(journey.endTime)}
      </Body>
      <Body>
        {journey.totalCost} {journey.currency}
      </Body>
    </Card>
  );
}

function toggle(values: string[], value: string, required: boolean): string[] {
  if (values.includes(value)) {
    return required ? values : values.filter((item) => item !== value);
  }
  return [...values, value];
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  choices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choice: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceLabel: { fontSize: 15, fontWeight: "600" },
});
