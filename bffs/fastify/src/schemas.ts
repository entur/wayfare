import { Type, type Static } from "@sinclair/typebox";

export const CustomerNumber = Type.String({
  pattern: "^[0-9]+$",
  minLength: 1,
  maxLength: 15,
  description:
    "Customer number represented as digits to avoid JSON precision loss",
});
export const IsoDate = Type.String({
  pattern: "^\\d{4}-\\d{2}-\\d{2}$",
});
export const IsoDateTime = Type.String({ format: "date-time" });

export const MobileErrorSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
  retryable: Type.Boolean(),
  requestId: Type.Optional(Type.String()),
});

export const TravelOptionSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  description: Type.Optional(Type.String()),
  category: Type.Union([Type.Literal("passenger"), Type.Literal("luggage")]),
  required: Type.Boolean(),
});

export const TravelOptionsSchema = Type.Object({
  passengerProfiles: Type.Array(TravelOptionSchema),
  luggage: Type.Array(TravelOptionSchema),
});

export const CheckInBodySchema = Type.Object({
  customerNumber: CustomerNumber,
  userProfileIds: Type.Array(Type.String()),
  luggageIds: Type.Array(Type.String(), { default: [] }),
});
export type CheckInBody = Static<typeof CheckInBodySchema>;

export const ActiveJourneySchema = Type.Object({
  journeyId: Type.String({ format: "uuid" }),
  startTime: IsoDateTime,
});

export const CheckOutBodySchema = Type.Object({
  customerNumber: CustomerNumber,
  startTime: IsoDateTime,
});
export type CheckOutBody = Static<typeof CheckOutBodySchema>;

export const JourneyLegSchema = Type.Object({
  mode: Type.String(),
  from: Type.String(),
  to: Type.String(),
  startTime: IsoDateTime,
  endTime: IsoDateTime,
  distanceMeters: Type.Optional(Type.Integer({ minimum: 0 })),
  zones: Type.Array(Type.String()),
});

export const PassengerSchema = Type.Object({
  profile: Type.String(),
  label: Type.String(),
});

export const JourneyDetailSchema = Type.Object({
  id: Type.String(),
  startTime: IsoDateTime,
  endTime: IsoDateTime,
  totalCost: Type.Number(),
  currency: Type.String(),
  modes: Type.Array(Type.String()),
  passengers: Type.Array(PassengerSchema),
  legs: Type.Array(JourneyLegSchema),
  zones: Type.Array(Type.String()),
  confidence: Type.Optional(Type.Number()),
  simulated: Type.Boolean(),
});

export const JourneySummarySchema = Type.Object({
  id: Type.String(),
  startTime: IsoDateTime,
  endTime: IsoDateTime,
  totalCost: Type.Number(),
  currency: Type.String(),
  modes: Type.Array(Type.String()),
  passengerCount: Type.Integer({ minimum: 1 }),
  simulated: Type.Boolean(),
  detail: JourneyDetailSchema,
});

export const PaymentStatusSchema = Type.Object({
  hasFailedTransactions: Type.Boolean(),
  overdueAmount: Type.Optional(Type.Number()),
  currency: Type.Optional(Type.String()),
});

export const PaymentRetryResultSchema = Type.Object({
  total: Type.Integer({ minimum: 0 }),
  paid: Type.Integer({ minimum: 0 }),
  retried: Type.Integer({ minimum: 0 }),
  failed: Type.Integer({ minimum: 0 }),
});

export function parseCustomerNumber(value: string): number {
  if (!/^\d+$/.test(value)) throw new Error("Customer number must use digits");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error("Customer number is outside the supported range");
  }
  return parsed;
}
