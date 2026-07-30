import createClient, { type Middleware } from "openapi-fetch";
import type { AppConfig } from "./config.js";
import { DownstreamError, DownstreamTimeoutError } from "./errors.js";
import type { components, paths } from "./generated/reisefrihet.js";
import { TokenCache } from "./auth.js";

export interface RequestContext {
  requestId: string;
}

type StopJourneyRequest = components["schemas"]["StopJourneyRequest"];

export class ReisefrihetClient {
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(
    private readonly config: AppConfig,
    tokenCache: TokenCache,
    fetchImplementation: typeof fetch = fetch,
  ) {
    this.client = createClient<paths>({
      baseUrl: config.REISEFRIHET_BASE_URL,
      fetch: timeoutFetch(fetchImplementation, config.REQUEST_TIMEOUT_MS),
    });
    const middleware: Middleware = {
      async onRequest({ request }) {
        request.headers.set("authorization", await tokenCache.authorization());
        request.headers.set(
          "Entur-Distribution-Channel",
          config.ENTUR_DISTRIBUTION_CHANNEL,
        );
        request.headers.set("ET-Client-Name", config.ET_CLIENT_NAME);
        request.headers.set("Entur-POS", config.ENTUR_POS);
        request.headers.set("accept-language", "en");
        return request;
      },
    };
    this.client.use(middleware);
  }

  async travelOptions(fareFrameId: string, context: RequestContext) {
    const options = {
      params: { query: { fareFrameId } },
      headers: requestHeaders(context),
    };
    const [userProfiles, luggageAllowances] = await Promise.all([
      this.client.GET("/available-products/user-profiles", options),
      this.client.GET("/available-products/luggage-allowances", options),
    ]);
    return {
      userProfiles: unwrap(userProfiles),
      luggageAllowances: unwrap(luggageAllowances),
    };
  }

  async checkIn(
    body: {
      customerNumber: number;
      userProfileIds: string[];
      luggageIds: string[];
    },
    context: RequestContext,
  ) {
    const result = await this.client.POST("/journey/start", {
      headers: requestHeaders(context),
      body: {
        customerNumber: body.customerNumber,
        copassengerUserProfiles: body.userProfileIds,
        luggageCodes: body.luggageIds,
      },
    });
    return unwrap(result);
  }

  async checkOut(body: StopJourneyRequest, context: RequestContext) {
    const result = await this.client.POST("/journey/stop", {
      headers: requestHeaders(context),
      body,
    });
    return unwrap(result);
  }

  async journeys(
    customerNumber: number,
    date: string,
    context: RequestContext,
  ) {
    const result = await this.client.GET("/journey/list", {
      params: {
        query: { customerNumber, filterByStoppedDate: date },
      },
      headers: requestHeaders(context),
    });
    if (result.response.status === 404) return [];
    return unwrap(result);
  }

  async paymentStatus(customerNumber: number, context: RequestContext) {
    const result = await this.client.GET("/customer/failed-transactions", {
      params: {
        query: { customerNumber },
      },
      headers: requestHeaders(context),
    });
    if (result.response.status === 404) return undefined;
    return unwrap(result);
  }

  async retryPayments(customerNumber: number, context: RequestContext) {
    const result = await this.client.POST("/payments/retry-failed", {
      headers: requestHeaders(context),
      body: { customerNumber },
    });
    return unwrap(result);
  }
}

function requestHeaders(context: RequestContext): HeadersInit {
  return { "X-Request-ID": context.requestId };
}

function unwrap<
  T extends { data?: unknown; error?: unknown; response: Response },
>(result: T): NonNullable<T["data"]> {
  if (result.error !== undefined) {
    throw new DownstreamError(result.response.status, result.error);
  }
  return result.data as NonNullable<T["data"]>;
}

function timeoutFetch(
  implementation: typeof fetch,
  timeoutMs: number,
): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, controller.signal])
      : controller.signal;
    try {
      return await implementation(input, { ...init, signal });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new DownstreamTimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };
}
