import { describe, expect, it, vi } from "vitest";
import { TokenCache } from "../src/auth.js";
import { loadConfig } from "../src/config.js";
import { testConfig } from "./helpers.js";

describe("configuration", () => {
  it("loads defaults and rejects a production simulator", () => {
    expect(loadConfig({ NODE_ENV: "test" }).PORT).toBe(3001);
    expect(() =>
      loadConfig({
        NODE_ENV: "production",
        CHECKOUT_SIMULATOR_ENABLED: "true",
      }),
    ).toThrow("cannot be enabled in production");
  });

  it("validates numeric values", () => {
    expect(() => loadConfig({ NODE_ENV: "test", PORT: "not-a-port" })).toThrow(
      "Invalid configuration",
    );
    expect(() =>
      loadConfig({
        NODE_ENV: "test",
        CHECKOUT_SIMULATOR_ENABLED: "sometimes",
      }),
    ).toThrow("Invalid boolean value");
  });
});

describe("token cache", () => {
  it("shares a cached token until its refresh window", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "token",
          token_type: "Bearer",
          expires_in: 3_600,
        }),
        { status: 200 },
      ),
    );
    const cache = new TokenCache(testConfig, fetchMock, () => 1_000);

    await expect(cache.authorization()).resolves.toBe("Bearer token");
    await expect(cache.authorization()).resolves.toBe("Bearer token");
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
