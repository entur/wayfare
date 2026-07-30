import createClient from "openapi-fetch";
import type { paths } from "./schema";

export type TravelOptions =
  paths["/v1/travel-options"]["get"]["responses"][200]["content"]["application/json"];
export type ActiveJourney =
  paths["/v1/journeys/check-in"]["post"]["responses"][200]["content"]["application/json"];
export type JourneyDetail =
  paths["/v1/journeys/{journeyId}/check-out"]["post"]["responses"][200]["content"]["application/json"];
export type JourneySummary =
  paths["/v1/customers/{customerNumber}/journeys"]["get"]["responses"][200]["content"]["application/json"][number];
export type PaymentStatus =
  paths["/v1/customers/{customerNumber}/payment-status"]["get"]["responses"][200]["content"]["application/json"];
export type PaymentRetryResult =
  paths["/v1/customers/{customerNumber}/payments/retry"]["post"]["responses"][200]["content"]["application/json"];

export class ApiError extends Error {
  readonly name = "ApiError";

  constructor(
    readonly code: string,
    message: string,
    readonly retryable: boolean,
    readonly requestId?: string,
    readonly unknownResult = false,
  ) {
    super(message);
  }
}

async function fetchByUrl(request: Request): Promise<Response> {
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  return fetch(request.url, {
    method: request.method,
    headers: request.headers,
    signal: request.signal,
    ...(hasBody ? { body: await request.text() } : {}),
  });
}

export function wayfareApi(baseUrl: string) {
  const client = createClient<paths>({ baseUrl, fetch: fetchByUrl });

  return {
    async travelOptions(fareFrameId: string): Promise<TravelOptions> {
      return call(() =>
        client.GET("/v1/travel-options", {
          params: { query: { fareFrameId } },
        }),
      );
    },
    async checkIn(input: {
      customerNumber: string;
      userProfileIds: string[];
      luggageIds: string[];
    }): Promise<ActiveJourney> {
      return call(() => client.POST("/v1/journeys/check-in", { body: input }));
    },
    async checkOut(
      journeyId: string,
      input: { customerNumber: string; startTime: string },
    ): Promise<JourneyDetail> {
      return call(
        () =>
          client.POST("/v1/journeys/{journeyId}/check-out", {
            params: { path: { journeyId } },
            body: input,
          }),
        true,
      );
    },
    async journeys(
      customerNumber: string,
      date: string,
    ): Promise<JourneySummary[]> {
      return call(() =>
        client.GET("/v1/customers/{customerNumber}/journeys", {
          params: { path: { customerNumber }, query: { date } },
        }),
      );
    },
    async paymentStatus(customerNumber: string): Promise<PaymentStatus> {
      return call(() =>
        client.GET("/v1/customers/{customerNumber}/payment-status", {
          params: { path: { customerNumber } },
        }),
      );
    },
    async retryPayments(customerNumber: string): Promise<PaymentRetryResult> {
      return call(
        () =>
          client.POST("/v1/customers/{customerNumber}/payments/retry", {
            params: { path: { customerNumber } },
          }),
        true,
      );
    },
  };
}

async function call<T>(
  execute: () => Promise<{
    data?: T;
    error?: unknown;
    response: Response;
  }>,
  mutationWithUnknownResult = false,
): Promise<T> {
  try {
    const result = await execute();
    if (result.error !== undefined) {
      const error = normalizeBody(result.error);
      throw new ApiError(
        error.code,
        error.message,
        error.retryable,
        error.requestId,
      );
    }
    if (result.data === undefined) {
      throw new ApiError(
        "EMPTY_RESPONSE",
        "The service returned no data.",
        true,
      );
    }
    return result.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "NETWORK_ERROR",
      mutationWithUnknownResult
        ? "The result is unknown because the connection was lost. Check the current state before trying again."
        : "Check your connection and try again.",
      true,
      undefined,
      mutationWithUnknownResult,
    );
  }
}

function normalizeBody(value: unknown): {
  code: string;
  message: string;
  retryable: boolean;
  requestId?: string;
} {
  if (typeof value !== "object" || value === null) {
    return {
      code: "API_ERROR",
      message: "The request could not be completed.",
      retryable: false,
    };
  }
  const body = value as Record<string, unknown>;
  return {
    code: typeof body.code === "string" ? body.code : "API_ERROR",
    message:
      typeof body.message === "string"
        ? body.message
        : "The request could not be completed.",
    retryable: body.retryable === true,
    ...(typeof body.requestId === "string"
      ? { requestId: body.requestId }
      : {}),
  };
}
