import { describe, expect, it } from "vitest";
import {
  mapCheckIn,
  mapJourneyDetail,
  mapJourneySummaries,
  mapPaymentStatus,
  mapTravelOptions,
} from "../src/mappers.js";
import { parseCustomerNumber } from "../src/schemas.js";
import { checkoutFixture } from "../src/simulator.js";
import { testConfig } from "./helpers.js";

const journey = {
  journeyId: { uuid: "4a387310-01bf-4ebe-a4a4-0b70bb92412b" },
  stoppedTime: "2026-07-29T08:20:00.000Z",
  cost: [
    {
      amount: { amount: 21, currency: "NOK" as const },
      passenger: {
        userProfileSimple: {
          code: "ADULT",
          userType: "ADULT" as const,
          description: [{ language: "ENG" as const, text: "Adult" }],
        },
      },
      legs: [
        {
          transportMode: "BUS" as const,
          startedAt: "2026-07-29T08:00:00.000Z",
          legZoneInfo: {
            fromZone: { id: "1", name: "A" },
            toZone: { id: "2", name: "B" },
          },
        },
      ],
    },
    {
      amount: { amount: 21, currency: "NOK" as const },
      passenger: {
        userProfileSimple: {
          code: "CHILD",
          userType: "CHILD" as const,
          description: [{ language: "ENG" as const, text: "Child" }],
        },
      },
      legs: [
        {
          transportMode: "BUS" as const,
          startedAt: "2026-07-29T08:00:00.000Z",
          legZoneInfo: {
            fromZone: { id: "1", name: "A" },
            toZone: { id: "2", name: "B" },
          },
        },
      ],
    },
  ],
};

describe("mobile DTO mapping", () => {
  it("normalizes Kotlin UUIDs and travel options", () => {
    expect(
      mapCheckIn({
        journeyId: { uuid: "4a387310-01bf-4ebe-a4a4-0b70bb92412b" },
        startTime: "2026-07-29T08:00:00.000Z",
      }).journeyId,
    ).toBe("4a387310-01bf-4ebe-a4a4-0b70bb92412b");
    expect(
      mapTravelOptions({
        userProfiles: [
          {
            code: "KOL:UserProfile:adult",
            userType: "ADULT",
            description: [{ language: "ENG", text: "Adult" }],
          },
        ],
        luggageAllowances: [
          {
            code: "KOL:LuggageAllowance:bicycle",
            description: [{ language: "ENG", text: "Bicycle" }],
          },
        ],
      }),
    ).toMatchObject({
      passengerProfiles: [
        {
          id: "KOL:UserProfile:adult",
          label: "Adult",
          category: "passenger",
        },
      ],
      luggage: [
        {
          id: "KOL:LuggageAllowance:bicycle",
          label: "Bicycle",
          category: "luggage",
        },
      ],
    });
  });

  it("maps multiple passengers and legs without leaking raw objects", () => {
    const [summary] = mapJourneySummaries([
      {
        ...journey,
        cost: journey.cost.map((cost) => ({
          ...cost,
          legs: [
            ...cost.legs,
            {
              transportMode: "TRAIN" as const,
              startedAt: "2026-07-29T08:10:00.000Z",
              legZoneInfo: {
                fromZone: { id: "2", name: "B" },
                toZone: { id: "3", name: "C" },
              },
            },
          ],
        })),
      },
    ]);
    expect(summary).toMatchObject({
      passengerCount: 2,
      modes: ["BUS", "TRAIN"],
      currency: "NOK",
      detail: { legs: [{ mode: "BUS" }, { mode: "TRAIN" }] },
    });
  });

  it("maps the completed journey shape returned by reisefrihet", () => {
    const fixture = checkoutFixture(testConfig, {
      journeyId: "4a387310-01bf-4ebe-a4a4-0b70bb92412b",
      customerNumber: 123,
      startTime: "2026-07-29T08:00:00.000Z",
    });

    expect(mapJourneyDetail(fixture.completedJourney, true)).toMatchObject({
      id: "4a387310-01bf-4ebe-a4a4-0b70bb92412b",
      startTime: "2026-07-29T08:00:00.000Z",
      endTime: "2026-07-29T08:20:00.000Z",
      totalCost: 42,
      currency: "NOK",
      modes: ["BUS"],
      passengers: [{ profile: "ADULT" }],
      zones: ["RUT:TariffZone:1", "RUT:TariffZone:2"],
      confidence: 0.95,
      simulated: true,
    });
  });

  it("treats a missing credit status as clear", () => {
    expect(mapPaymentStatus(undefined)).toEqual({
      hasFailedTransactions: false,
    });
  });

  it("rejects unsafe customer number conversion and malformed journeys", () => {
    expect(() => parseCustomerNumber("9007199254740992")).toThrow(
      "supported range",
    );
    expect(() =>
      mapJourneySummaries([
        {
          ...journey,
          cost: journey.cost.map((cost) => ({ ...cost, legs: [] })),
        },
      ]),
    ).toThrow("no legs");
  });
});

describe("checkout simulator", () => {
  it("creates the exact deterministic one-leg payload", () => {
    expect(
      checkoutFixture(testConfig, {
        journeyId: "4a387310-01bf-4ebe-a4a4-0b70bb92412b",
        customerNumber: 123,
        startTime: "2026-07-29T08:00:00.000Z",
      }),
    ).toEqual({
      customerNumber: 123,
      completedJourney: {
        journeyId: { uuid: "4a387310-01bf-4ebe-a4a4-0b70bb92412b" },
        serviceJourneyId: null,
        cost: [
          {
            amount: { amount: 42, currency: "NOK" },
            passenger: {
              userProfileSimple: { code: "ADULT", description: [] },
              luggage: [],
            },
            isCoPassenger: false,
            legs: [
              {
                startedAt: "2026-07-29T08:00:00.000Z",
                distance: { value: 4_500, unit: "METER" },
                transportMode: "BUS",
                price: {
                  basePriceComponent: {
                    startUpPrice: 13,
                    distancePrice: 29,
                  },
                  discountedPriceComponent: {
                    startUpPrice: 13,
                    distancePrice: 29,
                  },
                  finalPriceComponent: {
                    startUpPrice: 13,
                    distancePrice: 29,
                  },
                },
                analysisMeta: { confidenceLevel: 0.95 },
                legZoneInfo: {
                  fromZone: {
                    id: "RUT:TariffZone:1",
                    name: "Starting zone",
                  },
                  toZone: {
                    id: "RUT:TariffZone:2",
                    name: "Destination zone",
                  },
                  totalZoneCount: 2,
                },
              },
            ],
          },
        ],
        analysisMeta: {
          confidenceLevel: 0.95,
          checksum: null,
          analysedAt: null,
        },
        startedReason: "USER_INITIATED",
        stoppedReason: { type: "USER_INITIATED" },
        stoppedTime: "2026-07-29T08:20:00.000Z",
      },
    });
  });
});
