import type { Static } from "@sinclair/typebox";
import type { components } from "./generated/reisefrihet.js";
import type {
  JourneyDetailSchema,
  JourneySummarySchema,
  PaymentRetryResultSchema,
  PaymentStatusSchema,
  TravelOptionsSchema,
} from "./schemas.js";

type Schema = components["schemas"];
type CompletedJourney = Schema["CompletedJourney"];
type TravelOptionsSource = {
  userProfiles: Schema["UserProfileSimple"][];
  luggageAllowances: Schema["LuggageAllowanceSimple"][];
};
type TravelOptions = Static<typeof TravelOptionsSchema>;
type JourneyDetail = Static<typeof JourneyDetailSchema>;
type JourneySummary = Static<typeof JourneySummarySchema>;
type PaymentStatus = Static<typeof PaymentStatusSchema>;
type PaymentRetryResult = Static<typeof PaymentRetryResultSchema>;

export function mapTravelOptions(raw: TravelOptionsSource): TravelOptions {
  return {
    passengerProfiles: raw.userProfiles.map((profile) => {
      const description = translatedText(profile.description);
      const id = requiredString(profile.code, "passenger option identifier");
      return {
        id,
        label:
          description ??
          (profile.userType ? humanize(profile.userType) : humanize(id)),
        ...(description ? { description } : {}),
        category: "passenger",
        required: false,
      };
    }),
    luggage: raw.luggageAllowances.map((allowance) => {
      const description = translatedText(allowance.description);
      const id = requiredString(allowance.code, "luggage option identifier");
      return {
        id,
        label: description ?? humanize(id),
        ...(description ? { description } : {}),
        category: "luggage",
        required: false,
      };
    }),
  };
}

export function mapCheckIn(raw: Schema["ActiveJourney"]): {
  journeyId: string;
  startTime: string;
} {
  return {
    journeyId: requiredString(raw.journeyId?.uuid, "journey identifier"),
    startTime: requiredString(raw.startTime, "journey start time"),
  };
}

export function mapJourneyDetail(
  raw: CompletedJourney,
  simulated = false,
): JourneyDetail {
  const endTime = requiredString(raw.stoppedTime, "journey end time");
  const costs = raw.cost ?? [];
  const mappedLegs = costs
    .flatMap((cost) => cost.legs ?? [])
    .map((leg) => {
      const from = leg.legZoneInfo?.fromZone;
      const to = leg.legZoneInfo?.toZone;
      const zones = unique(
        [from?.id, to?.id].filter(
          (zone): zone is string => typeof zone === "string" && zone.length > 0,
        ),
      );
      const distanceMeters = distanceInMeters(leg.distance);
      return {
        mode: requiredString(leg.transportMode, "journey leg mode"),
        from: placeLabel(from),
        to: placeLabel(to),
        startTime: requiredString(leg.startedAt, "journey leg start time"),
        endTime,
        ...(distanceMeters === undefined ? {} : { distanceMeters }),
        zones,
      };
    });
  const legs = [
    ...new Map(
      mappedLegs.map((leg) => [
        `${leg.startTime}\0${leg.mode}\0${leg.from}\0${leg.to}`,
        leg,
      ]),
    ).values(),
  ];
  const firstLeg = legs[0];
  if (!firstLeg) throw new Error("Journey has no legs");

  const passengers = costs.map((cost) => {
    const profile = requiredString(
      cost.passenger?.userProfileSimple?.code,
      "passenger profile",
    );
    const description = translatedText(
      cost.passenger?.userProfileSimple?.description,
    );
    return {
      profile,
      label:
        description ??
        (cost.passenger?.userProfileSimple?.userType
          ? humanize(cost.passenger.userProfileSimple.userType)
          : humanize(profile)),
    };
  });
  if (passengers.length === 0) throw new Error("Journey has no passengers");

  const currencies = unique(
    costs.map((cost) =>
      requiredString(cost.amount?.currency, "journey currency"),
    ),
  );
  if (currencies.length > 1) throw new Error("Journey has mixed currencies");

  const confidence = numberOrUndefined(raw.analysisMeta?.confidenceLevel);
  return {
    id: requiredString(raw.journeyId?.uuid, "journey identifier"),
    startTime: firstLeg.startTime,
    endTime,
    totalCost: costs.reduce(
      (total, cost) =>
        total + requiredNumber(cost.amount?.amount, "journey total cost"),
      0,
    ),
    currency: requiredString(currencies[0], "journey currency"),
    modes: unique(legs.map((leg) => leg.mode)),
    passengers,
    legs,
    zones: unique(legs.flatMap((leg) => leg.zones)),
    ...(confidence === undefined ? {} : { confidence }),
    simulated,
  };
}

export function mapJourneySummaries(
  journeys: CompletedJourney[],
): JourneySummary[] {
  return journeys.map((journey) => {
    const detail = mapJourneyDetail(journey);
    return {
      id: detail.id,
      startTime: detail.startTime,
      endTime: detail.endTime,
      totalCost: detail.totalCost,
      currency: detail.currency,
      modes: detail.modes,
      passengerCount: detail.passengers.length,
      simulated: detail.simulated,
      detail,
    };
  });
}

export function mapPaymentStatus(
  raw: Schema["FailedTransactionsResponse"] | undefined,
): PaymentStatus {
  return { hasFailedTransactions: raw?.hasFailedTransactions === true };
}

export function mapPaymentRetry(
  raw: Schema["RetryPaymentsResponse"],
): PaymentRetryResult {
  return {
    total: requiredNumber(raw.total, "payment total"),
    paid: requiredNumber(raw.paid, "paid payment count"),
    retried: requiredNumber(raw.retried, "retried payment count"),
    failed: requiredNumber(raw.failed, "failed payment count"),
  };
}

function distanceInMeters(
  distance: Schema["Distance"] | undefined,
): number | undefined {
  const value = numberOrUndefined(distance?.value);
  if (value === undefined) return undefined;
  return distance?.unit === "KILOMETER" ? value * 1_000 : value;
}

function translatedText(
  translations: Schema["Translation"][] | undefined,
): string | undefined {
  return (
    translations?.find((translation) => translation.language === "ENG")?.text ??
    translations?.find((translation) => translation.language === "NOB")?.text ??
    translations?.find((translation) => translation.language === "NNO")?.text ??
    translations?.[0]?.text
  );
}

function placeLabel(zone: Schema["Zone"] | undefined): string {
  return requiredString(zone?.name ?? zone?.id, "place label");
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Missing ${label}`);
  }
  return value;
}

function requiredNumber(value: unknown, label: string): number {
  const result = numberOrUndefined(value);
  if (result === undefined) throw new Error(`Missing ${label}`);
  return result;
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function humanize(value: string): string {
  const name = value.split(":").at(-1) ?? value;
  return name
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/^\w/, (first) => first.toUpperCase());
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
