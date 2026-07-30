import { describe, expect, it } from "vitest";
import {
  DownstreamError,
  DownstreamTimeoutError,
  normalizedError,
} from "../src/errors.js";

describe("downstream error normalization", () => {
  it("preserves conflicts without exposing raw payloads", () => {
    expect(
      normalizedError(
        new DownstreamError(409, { token: "must not leak" }),
        "req-1",
      ),
    ).toEqual({
      statusCode: 409,
      body: {
        code: "JOURNEY_CONFLICT",
        message: "The journey state changed. Refresh before trying again.",
        retryable: false,
        requestId: "req-1",
      },
    });
  });

  it("marks timeouts as an unknown retryable result", () => {
    expect(normalizedError(new DownstreamTimeoutError()).body).toMatchObject({
      code: "DOWNSTREAM_TIMEOUT",
      retryable: true,
    });
  });
});
