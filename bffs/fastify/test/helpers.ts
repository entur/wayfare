import type { AppConfig } from "../src/config.js";

export const testConfig: AppConfig = {
  NODE_ENV: "test",
  HOST: "127.0.0.1",
  PORT: 3001,
  REISEFRIHET_BASE_URL: "https://reisefrihet.test",
  OAUTH_TOKEN_URL: "https://auth.test/token",
  OAUTH_AUDIENCE: "https://api.test",
  CLIENT_ID: "client",
  CLIENT_SECRET: "secret",
  ENTUR_DISTRIBUTION_CHANNEL: "WAY:DistributionChannel:App",
  ET_CLIENT_NAME: "Wayfare-Mobile-BFF",
  ENTUR_POS: "Wayfare",
  REQUEST_TIMEOUT_MS: 100,
  CHECKOUT_SIMULATOR_ENABLED: true,
  SIMULATOR_FARE_AMOUNT: 42,
  SIMULATOR_DISTANCE_METERS: 4_500,
  SIMULATOR_FROM_ZONE: "RUT:TariffZone:1",
  SIMULATOR_TO_ZONE: "RUT:TariffZone:2",
  SIMULATOR_MAIN_USER_PROFILE: "ADULT",
  SIMULATOR_CONFIDENCE: 0.95,
};
