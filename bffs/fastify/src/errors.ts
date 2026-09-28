import type { FastifyReply, FastifyRequest } from "fastify";

export interface MobileError {
  code: string;
  message: string;
  retryable: boolean;
  requestId?: string;
}

export class DownstreamError extends Error {
  constructor(
    readonly statusCode: number,
    readonly body: unknown,
    readonly code = "DOWNSTREAM_ERROR",
  ) {
    super(`reisefrihet returned ${statusCode}`);
  }
}

export class DownstreamTimeoutError extends Error {
  constructor() {
    super("reisefrihet request timed out");
  }
}

export function normalizedError(
  error: unknown,
  requestId?: string,
): { statusCode: number; body: MobileError } {
  if (error instanceof DownstreamTimeoutError) {
    return {
      statusCode: 504,
      body: withRequestId(
        {
          code: "DOWNSTREAM_TIMEOUT",
          message:
            "The trip service did not confirm the result. Check your trip state before trying again.",
          retryable: true,
        },
        requestId,
      ),
    };
  }
  if (error instanceof DownstreamError) {
    const statusCode =
      error.statusCode === 400 ||
      error.statusCode === 401 ||
      error.statusCode === 403 ||
      error.statusCode === 404 ||
      error.statusCode === 409
        ? error.statusCode
        : error.statusCode === 429
          ? 503
          : 502;
    return {
      statusCode,
      body: withRequestId(
        {
          code:
            error.statusCode === 409
              ? "JOURNEY_CONFLICT"
              : error.statusCode === 401 || error.statusCode === 403
                ? "DOWNSTREAM_AUTHORIZATION"
                : error.code,
          message:
            error.statusCode === 409
              ? "The journey state changed. Refresh before trying again."
              : statusCode === 502 || statusCode === 503
                ? "The trip service is temporarily unavailable."
                : downstreamMessage(error.body),
          retryable: statusCode >= 500,
        },
        requestId,
      ),
    };
  }
  return {
    statusCode: 500,
    body: withRequestId(
      {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        retryable: false,
      },
      requestId,
    ),
  };
}

export function errorHandler(
  error: Error & { statusCode?: number; validation?: unknown },
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error.validation) {
    reply.status(400).send({
      code: "VALIDATION_ERROR",
      message: error.message,
      retryable: false,
      requestId: request.id,
    } satisfies MobileError);
    return;
  }
  request.log.error({ err: error }, "request failed");
  const normalized = normalizedError(error, request.id);
  reply.status(normalized.statusCode).send(normalized.body);
}

function downstreamMessage(body: unknown): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    return body.message;
  }
  return "The request could not be completed.";
}

function withRequestId(
  error: Omit<MobileError, "requestId">,
  requestId: string | undefined,
): MobileError {
  return requestId ? { ...error, requestId } : error;
}
