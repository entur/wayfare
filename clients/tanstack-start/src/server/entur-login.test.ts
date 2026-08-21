import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const oidc = vi.hoisted(() => ({
	authorizationCodeGrant: vi.fn(),
	buildAuthorizationUrl: vi.fn(),
	buildEndSessionUrl: vi.fn(),
	calculatePKCECodeChallenge: vi.fn(),
	discovery: vi.fn(),
	randomNonce: vi.fn(),
	randomPKCECodeVerifier: vi.fn(),
	randomState: vi.fn(),
}));

const jose = vi.hoisted(() => ({
	createRemoteJWKSet: vi.fn(),
	jwtVerify: vi.fn(),
}));

vi.mock("openid-client", () => oidc);
vi.mock("jose", () => jose);

import {
	buildLoginRedirect,
	getSessionIdToken,
	handleCallback,
	handleLogout,
	sanitizeReturnTo,
	startLogin,
} from "./entur-login";

function stubStagingEnvironment(): void {
	vi.stubEnv("REQUIRE_ENTUR_LOGIN", "true");
	vi.stubEnv("OMSA_ENV_MODE", "staging");
	vi.stubEnv("ALLOW_DEV_CONFIG_OVERRIDES", "false");
	vi.stubEnv("COOKIE_SECURE", "true");
	vi.stubEnv("CLIENT_ID", "omsa-client");
	vi.stubEnv("CLIENT_SECRET", "omsa-secret");
	vi.stubEnv("PUBLIC_ORIGIN", "https://wayfare.staging.entur.no");
	vi.stubEnv("ENTUR_LOGIN_DOMAIN", "partner.staging.entur.org");
	vi.stubEnv("ENTUR_LOGIN_CLIENT_ID", "login-client");
	vi.stubEnv("ENTUR_LOGIN_CLIENT_SECRET", "login-secret");
	vi.stubEnv(
		"PERMISSION_STORE_URL",
		"http://permission-store.tst.entur.internal",
	);
	vi.stubEnv("MNG_AUTH0_INT_HOST", "https://internal.staging.entur.org");
	vi.stubEnv("MNG_AUTH0_INT_AUDIENCE", "https://permission-store");
	vi.stubEnv("MNG_AUTH0_INT_CLIENT_ID", "permission-client");
	vi.stubEnv("MNG_AUTH0_INT_CLIENT_SECRET", "permission-secret");
}

beforeEach(() => {
	stubStagingEnvironment();
	oidc.discovery.mockResolvedValue({});
	oidc.randomState.mockReturnValue("state-123");
	oidc.randomNonce.mockReturnValue("nonce-123");
	oidc.randomPKCECodeVerifier.mockReturnValue("verifier-123");
	oidc.calculatePKCECodeChallenge.mockResolvedValue("challenge-123");
	oidc.buildAuthorizationUrl.mockImplementation(
		(_configuration, parameters: Record<string, string>) => {
			const url = new URL("https://partner.staging.entur.org/authorize");
			for (const [key, value] of Object.entries(parameters)) {
				url.searchParams.set(key, value);
			}
			return url;
		},
	);
	oidc.authorizationCodeGrant.mockResolvedValue({
		id_token: "signed-id-token",
		claims: () => ({ exp: Math.floor(Date.now() / 1000) + 1800 }),
	});
	oidc.buildEndSessionUrl.mockReturnValue(
		new URL("https://partner.staging.entur.org/v2/logout"),
	);
	jose.createRemoteJWKSet.mockReturnValue(vi.fn());
	jose.jwtVerify.mockResolvedValue({ payload: {} });
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.clearAllMocks();
});

describe("Entur login", () => {
	it.each([
		[null, "/"],
		["/map?from=Oslo", "/map?from=Oslo"],
		["https://attacker.example", "/"],
		["//attacker.example/path", "/"],
		["/\\attacker.example/path", "/"],
		["map", "/"],
	])("sanitizes return path %s", (input, expected) => {
		expect(sanitizeReturnTo(input)).toBe(expected);
	});

	it("builds protected-route redirects from the configured public origin", () => {
		const response = buildLoginRedirect(
			new URL("http://internal-service/map?from=Oslo"),
		);

		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe(
			"https://wayfare.staging.entur.no/auth/login?returnTo=%2Fmap%3Ffrom%3DOslo",
		);
		expect(response.headers.get("cache-control")).toBe("no-store");
	});

	it("starts Authorization Code with PKCE, state, nonce, and a secure cookie", async () => {
		const response = await startLogin(
			new Request(
				"http://internal-service/auth/login?returnTo=%2Fmap%3Ffrom%3DOslo",
			),
		);

		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toContain(
			"redirect_uri=https%3A%2F%2Fwayfare.staging.entur.no%2Fauth%2Fcallback",
		);
		expect(response.headers.get("location")).toContain("state=state-123");
		expect(response.headers.get("location")).toContain("nonce=nonce-123");
		expect(response.headers.get("location")).toContain(
			"code_challenge=challenge-123",
		);
		expect(response.headers.get("set-cookie")).toMatch(/HttpOnly/);
		expect(response.headers.get("set-cookie")).toMatch(/SameSite=Lax/);
		expect(response.headers.get("set-cookie")).toMatch(/Secure/);
	});

	it("validates callback state, nonce, and verifier before creating a session", async () => {
		const pending = encodeURIComponent(
			JSON.stringify({
				state: "state-123",
				nonce: "nonce-123",
				codeVerifier: "verifier-123",
				returnTo: "/map",
			}),
		);
		const response = await handleCallback(
			new Request(
				"http://internal-service/auth/callback?code=code-123&state=state-123",
				{ headers: { cookie: `wayfare_login_pending=${pending}` } },
			),
		);

		expect(oidc.authorizationCodeGrant).toHaveBeenCalledWith(
			expect.anything(),
			new URL(
				"https://wayfare.staging.entur.no/auth/callback?code=code-123&state=state-123",
			),
			{
				expectedState: "state-123",
				expectedNonce: "nonce-123",
				pkceCodeVerifier: "verifier-123",
				idTokenExpected: true,
			},
		);
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe(
			"https://wayfare.staging.entur.no/map",
		);
		expect(response.headers.get("set-cookie")).toContain(
			"wayfare_session=signed-id-token",
		);
		expect(response.headers.get("cache-control")).toBe("no-store");
	});

	it("returns a generic error for an invalid callback", async () => {
		oidc.authorizationCodeGrant.mockRejectedValue(
			new Error("token endpoint returned client secret details"),
		);
		const pending = encodeURIComponent(
			JSON.stringify({
				state: "state-123",
				nonce: "nonce-123",
				codeVerifier: "verifier-123",
				returnTo: "/",
			}),
		);
		const response = await handleCallback(
			new Request(
				"https://wayfare.staging.entur.no/auth/callback?code=bad&state=bad",
				{
					headers: { cookie: `wayfare_login_pending=${pending}` },
				},
			),
		);

		expect(response.status).toBe(400);
		expect(await response.text()).toBe(
			"Login could not be completed. Please try again.",
		);
	});

	it("rejects invalid or expired session cookies", async () => {
		const request = new Request("https://wayfare.staging.entur.no/", {
			headers: { cookie: "wayfare_session=expired-token" },
		});
		expect(await getSessionIdToken(request)).toBe("expired-token");

		jose.jwtVerify.mockRejectedValue(new Error("JWT expired"));
		expect(await getSessionIdToken(request)).toBeUndefined();
	});

	it("logs out through Auth0 and clears the local session", async () => {
		await handleLogout(
			new Request("http://internal-service/auth/logout", {
				headers: { cookie: "wayfare_session=signed-id-token" },
			}),
		);

		expect(oidc.buildEndSessionUrl).toHaveBeenCalledWith(expect.anything(), {
			post_logout_redirect_uri: "https://wayfare.staging.entur.no/",
			id_token_hint: "signed-id-token",
		});
	});
});
