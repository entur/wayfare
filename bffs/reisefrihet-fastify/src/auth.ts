import type { AppConfig } from "./config.js";
import { DownstreamError, DownstreamTimeoutError } from "./errors.js";

interface CachedToken {
  authorization: string;
  expiresAt: number;
}

export class TokenCache {
  private token?: CachedToken;
  private refresh: Promise<CachedToken> | undefined;

  constructor(
    private readonly config: AppConfig,
    private readonly fetchImplementation: typeof fetch = fetch,
    private readonly now: () => number = Date.now,
  ) {}

  async authorization(): Promise<string> {
    if (this.token && this.token.expiresAt - 30_000 > this.now()) {
      return this.token.authorization;
    }
    this.refresh ??= this.fetchToken().finally(() => {
      this.refresh = undefined;
    });
    this.token = await this.refresh;
    return this.token.authorization;
  }

  private async fetchToken(): Promise<CachedToken> {
    if (!this.config.CLIENT_ID || !this.config.CLIENT_SECRET) {
      throw new Error("reisefrihet client credentials are not configured");
    }
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.config.REQUEST_TIMEOUT_MS,
    );
    try {
      const response = await this.fetchImplementation(
        this.config.OAUTH_TOKEN_URL,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: this.config.CLIENT_ID,
            client_secret: this.config.CLIENT_SECRET,
            audience: this.config.OAUTH_AUDIENCE,
          }),
        },
      );
      const body = (await readBody(response)) as {
        access_token?: string;
        token_type?: string;
        expires_in?: number;
      };
      if (!response.ok || !body.access_token) {
        throw new DownstreamError(response.status, body, "TOKEN_ERROR");
      }
      return {
        authorization: `${body.token_type ?? "Bearer"} ${body.access_token}`,
        expiresAt: this.now() + (body.expires_in ?? 3_600) * 1_000,
      };
    } catch (error) {
      if (isAbortError(error)) throw new DownstreamTimeoutError();
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
