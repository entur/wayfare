import { afterEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../src/app.js";
import { testConfig } from "./helpers.js";

describe("BFF integration", () => {
  const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("calls reisefrihet with OAuth, Entur, and request ID headers", async () => {
    const calls: Request[] = [];
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      const request = new Request(input, init);
      calls.push(request.clone());
      if (request.url === testConfig.OAUTH_TOKEN_URL) {
        return new Response(
          JSON.stringify({
            access_token: "downstream-token",
            token_type: "Bearer",
            expires_in: 3_600,
          }),
          { status: 200 },
        );
      }
      if (request.url.includes("/available-products/user-profiles")) {
        return new Response(
          JSON.stringify([
            {
              code: "KOL:UserProfile:adult",
              userType: "ADULT",
              description: [{ language: "ENG", text: "Adult" }],
            },
          ]),
          { status: 200 },
        );
      }
      if (request.url.includes("/available-products/luggage-allowances")) {
        return new Response(
          JSON.stringify([
            {
              code: "KOL:LuggageAllowance:bicycle",
              description: [{ language: "ENG", text: "Bicycle" }],
            },
          ]),
          { status: 200 },
        );
      }
      return new Response(undefined, { status: 404 });
    });
    const app = await buildApp({
      config: testConfig,
      fetchImplementation: fetchMock,
    });
    apps.push(app);

    const response = await app.inject({
      method: "GET",
      url: "/v1/travel-options?fareFrameId=KOL:FareFrame:FareData",
      headers: { "x-request-id": "mobile-request" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      passengerProfiles: [
        { id: "KOL:UserProfile:adult", label: "Adult", required: false },
      ],
      luggage: [
        {
          id: "KOL:LuggageAllowance:bicycle",
          label: "Bicycle",
          required: false,
        },
      ],
    });
    const downstream = calls.slice(1);
    expect(downstream).toHaveLength(2);
    expect(downstream.map((request) => request.url).sort()).toEqual([
      "https://reisefrihet.test/available-products/luggage-allowances?fareFrameId=KOL%3AFareFrame%3AFareData",
      "https://reisefrihet.test/available-products/user-profiles?fareFrameId=KOL%3AFareFrame%3AFareData",
    ]);
    for (const request of downstream) {
      expect(request.headers.get("authorization")).toBe(
        "Bearer downstream-token",
      );
      expect(request.headers.get("Entur-Distribution-Channel")).toBe(
        "WAY:DistributionChannel:App",
      );
      expect(request.headers.get("ET-Client-Name")).toBe("Wayfare-Mobile-BFF");
      expect(request.headers.get("Entur-POS")).toBe("Wayfare");
      expect(request.headers.get("X-Request-ID")).toBe("mobile-request");
    }
  });

  it("translates the mobile check-in body to the reisefrihet contract", async () => {
    const calls: Request[] = [];
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      const request = new Request(input, init);
      calls.push(request);
      if (request.url === testConfig.OAUTH_TOKEN_URL) {
        return new Response(
          JSON.stringify({ access_token: "token", expires_in: 3_600 }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({
          journeyId: { uuid: "4a387310-01bf-4ebe-a4a4-0b70bb92412b" },
          startTime: "2026-07-30T08:00:00.000Z",
        }),
        { status: 200 },
      );
    });
    const app = await buildApp({
      config: testConfig,
      fetchImplementation: fetchMock,
    });
    apps.push(app);

    const response = await app.inject({
      method: "POST",
      url: "/v1/journeys/check-in",
      payload: {
        customerNumber: "99999999",
        userProfileIds: ["KOL:UserProfile:child"],
        luggageIds: ["KOL:LuggageAllowance:bicycle"],
      },
    });

    expect(response.statusCode).toBe(200);
    const downstream = calls[1];
    expect(downstream?.url).toBe("https://reisefrihet.test/journey/start");
    expect(await downstream?.json()).toEqual({
      customerNumber: 99999999,
      copassengerUserProfiles: ["KOL:UserProfile:child"],
      luggageCodes: ["KOL:LuggageAllowance:bicycle"],
    });
  });

  it("sends the development checkout fixture to reisefrihet", async () => {
    const calls: Request[] = [];
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      const request = new Request(input, init);
      calls.push(request.clone());
      if (request.url === testConfig.OAUTH_TOKEN_URL) {
        return new Response(
          JSON.stringify({ access_token: "token", expires_in: 3_600 }),
          { status: 200 },
        );
      }
      const body = (await request.json()) as { completedJourney: unknown };
      return new Response(JSON.stringify(body.completedJourney), {
        status: 200,
      });
    });
    const app = await buildApp({
      config: testConfig,
      fetchImplementation: fetchMock,
    });
    apps.push(app);

    const response = await app.inject({
      method: "POST",
      url: "/v1/journeys/4a387310-01bf-4ebe-a4a4-0b70bb92412b/check-out",
      payload: {
        customerNumber: "99999999",
        startTime: "2026-07-30T08:00:00.000Z",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: "4a387310-01bf-4ebe-a4a4-0b70bb92412b",
      totalCost: 42,
      currency: "NOK",
      simulated: true,
    });
    expect(calls[1]?.url).toBe("https://reisefrihet.test/journey/stop");
    expect(await calls[1]?.json()).toMatchObject({
      customerNumber: 99999999,
      completedJourney: {
        journeyId: { uuid: "4a387310-01bf-4ebe-a4a4-0b70bb92412b" },
        stoppedTime: "2026-07-30T08:20:00.000Z",
      },
    });
  });

  it("rejects checkout when the development simulator is disabled", async () => {
    const app = await buildApp({
      config: { ...testConfig, CHECKOUT_SIMULATOR_ENABLED: false },
    });
    apps.push(app);

    const response = await app.inject({
      method: "POST",
      url: "/v1/journeys/4a387310-01bf-4ebe-a4a4-0b70bb92412b/check-out",
      payload: {
        customerNumber: "99999999",
        startTime: "2026-07-30T08:00:00.000Z",
      },
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      code: "CHECKOUT_UNAVAILABLE",
      retryable: false,
    });
  });

  it("returns an empty journey list for a downstream 404", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (input) => {
      if (String(input) === testConfig.OAUTH_TOKEN_URL) {
        return new Response(
          JSON.stringify({ access_token: "token", expires_in: 3_600 }),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify({ message: "not found" }), {
        status: 404,
      });
    });
    const app = await buildApp({
      config: testConfig,
      fetchImplementation: fetchMock,
    });
    apps.push(app);

    const response = await app.inject({
      method: "GET",
      url: "/v1/customers/123/journeys?date=2026-07-29",
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
    const downstream = fetchMock.mock.calls[1]?.[0];
    expect(downstream).toBeInstanceOf(Request);
    expect((downstream as Request).url).toBe(
      "https://reisefrihet.test/journey/list?customerNumber=123&filterByStoppedDate=2026-07-29",
    );
  });

  it("uses the reisefrihet failed-payment routes and request body", async () => {
    const calls: Request[] = [];
    const fetchMock = vi.fn<typeof fetch>(async (input, init) => {
      const request = new Request(input, init);
      calls.push(request);
      if (request.url === testConfig.OAUTH_TOKEN_URL) {
        return new Response(
          JSON.stringify({ access_token: "token", expires_in: 3_600 }),
          { status: 200 },
        );
      }
      if (request.url.includes("/customer/failed-transactions")) {
        return new Response(JSON.stringify({ hasFailedTransactions: true }), {
          status: 200,
        });
      }
      if (request.url.endsWith("/payments/retry-failed")) {
        return new Response(
          JSON.stringify({ total: 2, paid: 1, retried: 1, failed: 0 }),
          { status: 200 },
        );
      }
      return new Response(undefined, { status: 404 });
    });
    const app = await buildApp({
      config: testConfig,
      fetchImplementation: fetchMock,
    });
    apps.push(app);

    const status = await app.inject({
      method: "GET",
      url: "/v1/customers/99999999/payment-status",
    });
    const retry = await app.inject({
      method: "POST",
      url: "/v1/customers/99999999/payments/retry",
    });

    expect(status.json()).toEqual({ hasFailedTransactions: true });
    expect(retry.json()).toEqual({ total: 2, paid: 1, retried: 1, failed: 0 });
    expect(calls[1]?.url).toBe(
      "https://reisefrihet.test/customer/failed-transactions?customerNumber=99999999",
    );
    expect(calls[2]?.url).toBe(
      "https://reisefrihet.test/payments/retry-failed",
    );
    expect(await calls[2]?.json()).toEqual({ customerNumber: 99999999 });
  });

  it("does not expose an administrative bill-customer route", async () => {
    const app = await buildApp({ config: testConfig });
    apps.push(app);
    expect(
      (
        await app.inject({
          method: "POST",
          url: "/payments/bill-customer",
        })
      ).statusCode,
    ).toBe(404);
  });
});
