import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const EnvironmentSchema = Type.Object(
  {
    NODE_ENV: Type.Union([
      Type.Literal("development"),
      Type.Literal("test"),
      Type.Literal("production"),
    ]),
    HOST: Type.String({ minLength: 1 }),
    PORT: Type.Integer({ minimum: 1, maximum: 65_535 }),
    REISEFRIHET_BASE_URL: Type.String({ pattern: "^https?://" }),
    OAUTH_TOKEN_URL: Type.String({ pattern: "^https?://" }),
    OAUTH_AUDIENCE: Type.String({ minLength: 1 }),
    CLIENT_ID: Type.String(),
    CLIENT_SECRET: Type.String(),
    ENTUR_DISTRIBUTION_CHANNEL: Type.String({ minLength: 1 }),
    ET_CLIENT_NAME: Type.String({ minLength: 1 }),
    ENTUR_POS: Type.String({ minLength: 1 }),
    REQUEST_TIMEOUT_MS: Type.Integer({ minimum: 100, maximum: 120_000 }),
    CHECKOUT_SIMULATOR_ENABLED: Type.Boolean(),
    SIMULATOR_FARE_AMOUNT: Type.Number({ minimum: 0 }),
    SIMULATOR_DISTANCE_METERS: Type.Integer({ minimum: 0 }),
    SIMULATOR_FROM_ZONE: Type.String({ minLength: 1 }),
    SIMULATOR_TO_ZONE: Type.String({ minLength: 1 }),
    SIMULATOR_MAIN_USER_PROFILE: Type.String({ minLength: 1 }),
    SIMULATOR_CONFIDENCE: Type.Number({ minimum: 0, maximum: 1 }),
  },
  { additionalProperties: false },
);

export type AppConfig = Static<typeof EnvironmentSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const config: AppConfig = {
    NODE_ENV:
      env.NODE_ENV === "production" || env.NODE_ENV === "test"
        ? env.NODE_ENV
        : "development",
    HOST: env.HOST ?? "0.0.0.0",
    PORT: parseInteger(env.PORT, 3001),
    REISEFRIHET_BASE_URL: env.REISEFRIHET_BASE_URL ?? "http://localhost:8080",
    OAUTH_TOKEN_URL:
      env.OAUTH_TOKEN_URL ?? "https://partner.dev.entur.org/oauth/token",
    OAUTH_AUDIENCE: env.OAUTH_AUDIENCE ?? "https://api.dev.entur.io",
    CLIENT_ID: env.CLIENT_ID ?? "",
    CLIENT_SECRET: env.CLIENT_SECRET ?? "",
    ENTUR_DISTRIBUTION_CHANNEL:
      env.ENTUR_DISTRIBUTION_CHANNEL ?? "WAY:DistributionChannel:App",
    ET_CLIENT_NAME: env.ET_CLIENT_NAME ?? "Wayfare-Mobile-BFF",
    ENTUR_POS: env.ENTUR_POS ?? "Wayfare",
    REQUEST_TIMEOUT_MS: parseInteger(env.REQUEST_TIMEOUT_MS, 10_000),
    CHECKOUT_SIMULATOR_ENABLED: parseBoolean(
      env.CHECKOUT_SIMULATOR_ENABLED,
      true,
    ),
    SIMULATOR_FARE_AMOUNT: parseNumber(env.SIMULATOR_FARE_AMOUNT, 42),
    SIMULATOR_DISTANCE_METERS: parseInteger(
      env.SIMULATOR_DISTANCE_METERS,
      4_500,
    ),
    SIMULATOR_FROM_ZONE: env.SIMULATOR_FROM_ZONE ?? "RUT:TariffZone:1",
    SIMULATOR_TO_ZONE: env.SIMULATOR_TO_ZONE ?? "RUT:TariffZone:2",
    SIMULATOR_MAIN_USER_PROFILE: env.SIMULATOR_MAIN_USER_PROFILE ?? "ADULT",
    SIMULATOR_CONFIDENCE: parseNumber(env.SIMULATOR_CONFIDENCE, 0.95),
  };

  if (!Value.Check(EnvironmentSchema, config)) {
    const errors = [...Value.Errors(EnvironmentSchema, config)]
      .map((error) => `${error.path || "environment"} ${error.message}`)
      .join(", ");
    throw new Error(`Invalid configuration: ${errors}`);
  }
  if (config.NODE_ENV === "production" && config.CHECKOUT_SIMULATOR_ENABLED) {
    throw new Error("Checkout simulator cannot be enabled in production");
  }
  return config;
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  return Number(value);
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid boolean value: ${value}`);
}
