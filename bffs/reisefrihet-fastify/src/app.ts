import swagger from "@fastify/swagger";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify, { type FastifyInstance } from "fastify";
import { TokenCache } from "./auth.js";
import { type AppConfig, loadConfig } from "./config.js";
import { ReisefrihetClient } from "./downstream.js";
import { errorHandler } from "./errors.js";
import {
  mapCheckIn,
  mapJourneyDetail,
  mapJourneySummaries,
  mapPaymentRetry,
  mapPaymentStatus,
  mapTravelOptions,
} from "./mappers.js";
import {
  ActiveJourneySchema,
  CheckInBodySchema,
  CheckOutBodySchema,
  CustomerNumber,
  IsoDate,
  JourneyDetailSchema,
  JourneySummarySchema,
  MobileErrorSchema,
  parseCustomerNumber,
  PaymentRetryResultSchema,
  PaymentStatusSchema,
  TravelOptionsSchema,
} from "./schemas.js";
import { checkoutFixture } from "./simulator.js";
import { Type } from "@sinclair/typebox";

interface BuildAppOptions {
  config?: AppConfig;
  client?: ReisefrihetClient;
  fetchImplementation?: typeof fetch;
}

export async function buildApp(
  options: BuildAppOptions = {},
): Promise<FastifyInstance> {
  const config = options.config ?? loadConfig();
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "test" ? "silent" : "info",
      redact: {
        paths: [
          "req.headers.authorization",
          "request.headers.authorization",
          "headers.authorization",
          "CLIENT_SECRET",
        ],
        censor: "[Redacted]",
      },
    },
    requestIdHeader: "x-request-id",
    genReqId: (request) =>
      String(request.headers["x-request-id"] ?? crypto.randomUUID()),
  })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Wayfare reisefrihet mobile API",
        version: "1.0.0",
      },
    },
  });

  const downstream =
    options.client ??
    new ReisefrihetClient(
      config,
      new TokenCache(config, options.fetchImplementation),
      options.fetchImplementation,
    );

  app.setErrorHandler(errorHandler);

  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        response: {
          200: Type.Object({ status: Type.Literal("ok") }),
        },
      },
    },
    async () => ({ status: "ok" as const }),
  );

  app.get(
    "/ready",
    {
      schema: {
        tags: ["system"],
        response: {
          200: Type.Object({ status: Type.Literal("ready") }),
          503: MobileErrorSchema,
        },
      },
    },
    async (_request, reply) => {
      if (!config.CLIENT_ID || !config.CLIENT_SECRET) {
        return reply.status(503).send({
          code: "NOT_READY",
          message: "reisefrihet credentials are not configured",
          retryable: false,
        });
      }
      return { status: "ready" as const };
    },
  );

  app.get(
    "/v1/travel-options",
    {
      schema: {
        tags: ["travel"],
        querystring: Type.Object({
          fareFrameId: Type.String({ minLength: 1 }),
        }),
        response: {
          200: TravelOptionsSchema,
          400: MobileErrorSchema,
          502: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request) =>
      mapTravelOptions(
        await downstream.travelOptions(request.query.fareFrameId, {
          requestId: request.id,
        }),
      ),
  );

  app.post(
    "/v1/journeys/check-in",
    {
      schema: {
        tags: ["journeys"],
        body: CheckInBodySchema,
        response: {
          200: ActiveJourneySchema,
          400: MobileErrorSchema,
          409: MobileErrorSchema,
          502: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request) =>
      mapCheckIn(
        await downstream.checkIn(
          {
            ...request.body,
            customerNumber: parseCustomerNumber(request.body.customerNumber),
          },
          { requestId: request.id },
        ),
      ),
  );

  app.post(
    "/v1/journeys/:journeyId/check-out",
    {
      schema: {
        tags: ["journeys"],
        params: Type.Object({
          journeyId: Type.String({ format: "uuid" }),
        }),
        body: CheckOutBodySchema,
        response: {
          200: JourneyDetailSchema,
          400: MobileErrorSchema,
          409: MobileErrorSchema,
          502: MobileErrorSchema,
          503: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request, reply) => {
      if (!config.CHECKOUT_SIMULATOR_ENABLED) {
        return reply.status(503).send({
          code: "CHECKOUT_UNAVAILABLE",
          message: "Checkout is not available in this environment.",
          retryable: false,
          requestId: request.id,
        });
      }
      const payload = checkoutFixture(config, {
        journeyId: request.params.journeyId,
        customerNumber: parseCustomerNumber(request.body.customerNumber),
        startTime: request.body.startTime,
      });
      return mapJourneyDetail(
        await downstream.checkOut(payload, { requestId: request.id }),
        true,
      );
    },
  );

  app.get(
    "/v1/customers/:customerNumber/journeys",
    {
      schema: {
        tags: ["journeys"],
        params: Type.Object({ customerNumber: CustomerNumber }),
        querystring: Type.Object({ date: IsoDate }),
        response: {
          200: Type.Array(JourneySummarySchema),
          400: MobileErrorSchema,
          502: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request) =>
      mapJourneySummaries(
        await downstream.journeys(
          parseCustomerNumber(request.params.customerNumber),
          request.query.date,
          { requestId: request.id },
        ),
      ),
  );

  app.get(
    "/v1/customers/:customerNumber/payment-status",
    {
      schema: {
        tags: ["payments"],
        params: Type.Object({ customerNumber: CustomerNumber }),
        response: {
          200: PaymentStatusSchema,
          400: MobileErrorSchema,
          502: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request) =>
      mapPaymentStatus(
        await downstream.paymentStatus(
          parseCustomerNumber(request.params.customerNumber),
          { requestId: request.id },
        ),
      ),
  );

  app.post(
    "/v1/customers/:customerNumber/payments/retry",
    {
      schema: {
        tags: ["payments"],
        params: Type.Object({ customerNumber: CustomerNumber }),
        response: {
          200: PaymentRetryResultSchema,
          400: MobileErrorSchema,
          502: MobileErrorSchema,
          504: MobileErrorSchema,
        },
      },
    },
    async (request) =>
      mapPaymentRetry(
        await downstream.retryPayments(
          parseCustomerNumber(request.params.customerNumber),
          { requestId: request.id },
        ),
      ),
  );

  await app.ready();
  return app;
}
