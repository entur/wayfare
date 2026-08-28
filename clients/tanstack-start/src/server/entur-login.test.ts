import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const auth0 = vi.hoisted(() => {
	const client = {
		startInteractiveLogin: vi.fn(),
		completeInteractiveLogin: vi.fn(),
		getSession: vi.fn(),
		getAccessToken: vi.fn(),
		logout: vi.fn(),
	};
	return {
		client,
		ServerClient: vi.fn(function ServerClient() {
			return client;
		}),
		CookieTransactionStore: vi.fn(),
		StatelessStateStore: vi.fn(),
	};
});

vi.mock("@auth0/auth0-server-js", () => ({
	ServerClient: auth0.ServerClient,
	CookieTransactionStore: auth0.CookieTransactionStore,
	StatelessStateStore: auth0.StatelessStateStore,
}));

import { stubPublishedEnvironment } from "./deployment-config.test-utils";
import {
	buildLoginRedirect,
	getSessionSubject,
	handleCallback,
	handleLogout,
	sanitizeReturnTo,
	startLogin,
} from "./entur-login";

beforeEach(() => {
	stubPublishedEnvironment();
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

	it("starts an interactive login carrying the sanitized return path as app state", async () => {
		auth0.client.startInteractiveLogin.mockImplementation(
			async (_options: unknown, storeOptions: { responseHeaders: Headers }) => {
				storeOptions.responseHeaders.append(
					"set-cookie",
					"wayfare_login_pending=encrypted-transaction; HttpOnly; SameSite=Lax; Secure",
				);
				return new URL("https://partner.staging.entur.org/authorize?state=abc");
			},
		);

		const response = await startLogin(
			new Request(
				"http://internal-service/auth/login?returnTo=%2Fmap%3Ffrom%3DOslo",
			),
		);

		expect(auth0.client.startInteractiveLogin).toHaveBeenCalledWith(
			{ appState: { returnTo: "/map?from=Oslo" } },
			expect.objectContaining({ responseHeaders: expect.any(Headers) }),
		);
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe(
			"https://partner.staging.entur.org/authorize?state=abc",
		);
		expect(response.headers.get("set-cookie")).toMatch(/HttpOnly/);
		expect(response.headers.get("set-cookie")).toMatch(/Secure/);
		expect(response.headers.get("cache-control")).toBe("no-store");
	});

	it("completes the login and redirects to the sanitized return path", async () => {
		auth0.client.completeInteractiveLogin.mockImplementation(
			async (_url: URL, storeOptions: { responseHeaders: Headers }) => {
				storeOptions.responseHeaders.append(
					"set-cookie",
					"wayfare_session.0=encrypted-session; HttpOnly; Secure",
				);
				return { appState: { returnTo: "/map" } };
			},
		);

		// The incoming request is plain http, as srvx sees it behind the
		// TLS-terminating ingress. completeInteractiveLogin must still be
		// called with the public https origin so its redirect_uri matches the
		// one sent to /authorize.
		const response = await handleCallback(
			new Request(
				"http://internal-service/auth/callback?code=code-123&state=state-123",
			),
		);

		expect(auth0.client.completeInteractiveLogin).toHaveBeenCalledWith(
			new URL(
				"https://wayfare.staging.entur.no/auth/callback?code=code-123&state=state-123",
			),
			expect.objectContaining({ responseHeaders: expect.any(Headers) }),
		);
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe(
			"https://wayfare.staging.entur.no/map",
		);
		expect(response.headers.get("set-cookie")).toContain("wayfare_session");
		expect(response.headers.get("cache-control")).toBe("no-store");
	});

	it("returns a generic error for an invalid callback", async () => {
		auth0.client.completeInteractiveLogin.mockRejectedValue(
			new Error("token endpoint returned client secret details"),
		);

		const response = await handleCallback(
			new Request(
				"https://wayfare.staging.entur.no/auth/callback?code=bad&state=bad",
			),
		);

		expect(response.status).toBe(400);
		expect(await response.text()).toBe(
			"Login could not be completed. Please try again.",
		);
	});

	it("returns the session subject for a valid, refreshable session", async () => {
		auth0.client.getSession.mockResolvedValue({
			user: { sub: "auth0|employee" },
		});
		auth0.client.getAccessToken.mockResolvedValue({ accessToken: "unused" });

		const request = new Request("https://wayfare.staging.entur.no/");
		expect(await getSessionSubject(request, new Headers())).toBe(
			"auth0|employee",
		);
	});

	it("treats a session with no refreshable token as logged out", async () => {
		auth0.client.getSession.mockResolvedValue({
			user: { sub: "auth0|employee" },
		});
		auth0.client.getAccessToken.mockRejectedValue(
			new Error("refresh token expired"),
		);

		const request = new Request("https://wayfare.staging.entur.no/");
		expect(await getSessionSubject(request, new Headers())).toBeUndefined();
	});

	it("treats a missing session as logged out", async () => {
		auth0.client.getSession.mockResolvedValue(undefined);

		const request = new Request("https://wayfare.staging.entur.no/");
		expect(await getSessionSubject(request, new Headers())).toBeUndefined();
	});

	it("logs out through Auth0 and clears the local session", async () => {
		auth0.client.logout.mockImplementation(
			async (_options: unknown, storeOptions: { responseHeaders: Headers }) => {
				storeOptions.responseHeaders.append(
					"set-cookie",
					"wayfare_session.0=; Max-Age=0",
				);
				return new URL("https://partner.staging.entur.org/v2/logout");
			},
		);

		const response = await handleLogout(
			new Request("http://internal-service/auth/logout"),
		);

		expect(auth0.client.logout).toHaveBeenCalledWith(
			{ returnTo: "https://wayfare.staging.entur.no/" },
			expect.objectContaining({ responseHeaders: expect.any(Headers) }),
		);
		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe(
			"https://partner.staging.entur.org/v2/logout",
		);
		expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
	});
});
