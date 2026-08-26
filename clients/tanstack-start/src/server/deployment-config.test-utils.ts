import { vi } from "vitest";

const VALID_PUBLISHED_ENV: NodeJS.ProcessEnv = {
	REQUIRE_ENTUR_LOGIN: "true",
	OMSA_ENV_MODE: "staging",
	ALLOW_DEV_CONFIG_OVERRIDES: "false",
	COOKIE_SECURE: "true",
	CLIENT_ID: "omsa-client",
	CLIENT_SECRET: "omsa-secret",
	PUBLIC_ORIGIN: "https://wayfare.staging.entur.no",
	ENTUR_LOGIN_DOMAIN: "partner.staging.entur.org",
	ENTUR_LOGIN_CLIENT_ID: "login-client",
	ENTUR_LOGIN_CLIENT_SECRET: "login-secret",
	ENTUR_LOGIN_SESSION_SECRET: "0123456789abcdef0123456789abcdef01234567",
	ENTUR_LOGIN_CSRF_SECRET: "fedcba9876543210fedcba9876543210fedcba98",
	PERMISSION_STORE_URL: "http://permission-store.tst.entur.internal",
	MNG_AUTH0_INT_HOST: "https://internal.staging.entur.org",
	MNG_AUTH0_INT_AUDIENCE: "https://permission-store",
	MNG_AUTH0_INT_CLIENT_ID: "permission-client",
	MNG_AUTH0_INT_CLIENT_SECRET: "permission-secret",
};

export function publishedEnvironment(
	overrides: NodeJS.ProcessEnv = {},
): NodeJS.ProcessEnv {
	return { ...VALID_PUBLISHED_ENV, ...overrides };
}

export function stubPublishedEnvironment(): void {
	for (const [name, value] of Object.entries(VALID_PUBLISHED_ENV)) {
		if (value !== undefined) vi.stubEnv(name, value);
	}
}
