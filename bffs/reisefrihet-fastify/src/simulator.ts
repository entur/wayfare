import type { AppConfig } from "./config.js";
import type { components } from "./generated/reisefrihet.js";

type StopJourneyRequest = components["schemas"]["StopJourneyRequest"];

interface CheckoutFixtureInput {
  journeyId: string;
  customerNumber: number;
  startTime: string;
  endTime?: string;
}

export function checkoutFixture(
  config: AppConfig,
  input: CheckoutFixtureInput,
): StopJourneyRequest {
  const endTime =
    input.endTime ??
    new Date(new Date(input.startTime).getTime() + 20 * 60_000).toISOString();
  const startUpPrice = Math.round(config.SIMULATOR_FARE_AMOUNT * 0.3);
  const distancePrice = Math.round(config.SIMULATOR_FARE_AMOUNT - startUpPrice);
  const priceComponent = { startUpPrice, distancePrice };
  return {
    customerNumber: input.customerNumber,
    completedJourney: {
      journeyId: { uuid: input.journeyId },
      serviceJourneyId: null,
      cost: [
        {
          amount: {
            amount: config.SIMULATOR_FARE_AMOUNT,
            currency: "NOK",
          },
          passenger: {
            userProfileSimple: {
              code: config.SIMULATOR_MAIN_USER_PROFILE,
              description: [],
            },
            luggage: [],
          },
          isCoPassenger: false,
          legs: [
            {
              startedAt: input.startTime,
              distance: {
                value: config.SIMULATOR_DISTANCE_METERS,
                unit: "METER",
              },
              transportMode: "BUS",
              price: {
                basePriceComponent: priceComponent,
                discountedPriceComponent: priceComponent,
                finalPriceComponent: priceComponent,
              },
              analysisMeta: {
                confidenceLevel: config.SIMULATOR_CONFIDENCE,
              },
              legZoneInfo: {
                fromZone: {
                  id: config.SIMULATOR_FROM_ZONE,
                  name: "Starting zone",
                },
                toZone: {
                  id: config.SIMULATOR_TO_ZONE,
                  name: "Destination zone",
                },
                totalZoneCount:
                  config.SIMULATOR_FROM_ZONE === config.SIMULATOR_TO_ZONE
                    ? 1
                    : 2,
              },
            },
          ],
        },
      ],
      analysisMeta: {
        confidenceLevel: config.SIMULATOR_CONFIDENCE,
        checksum: null,
        analysedAt: null,
      },
      startedReason: "USER_INITIATED",
      stoppedReason: { type: "USER_INITIATED" },
      stoppedTime: endTime,
    },
  };
}
