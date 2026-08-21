import { describe, expect, it } from "vitest";
import {
	isEnturLoginRequired,
	validatePublishedDeploymentConfig,
} from "./deployment-config";

function stagingEnvironment(
	overrides: NodeJS.ProcessEnv = {},
): NodeJS.ProcessEnv {
	return {
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
		PERMISSION_STORE_URL: "http://permission-store.tst.entur.internal",
		MNG_AUTH0_INT_HOST: "https://internal.staging.entur.org",
		MNG_AUTH0_INT_AUDIENCE: "https://permission-store",
		MNG_AUTH0_INT_CLIENT_ID: "permission-client",
		MNG_AUTH0_INT_CLIENT_SECRET: "permission-secret",
		...overrides,
	};
}

describe("published deployment configuration", () => {
	it("does not require staging credentials when the login gate is disabled", () => {
		expect(validatePublishedDeploymentConfig({})).toBeNull();
		expect(isEnturLoginRequired({ REQUIRE_ENTUR_LOGIN: "TRUE" })).toBe(true);
	});

	it("accepts a complete fail-closed staging configuration", () => {
		const config = validatePublishedDeploymentConfig(stagingEnvironment());

		expect(config?.publicOrigin.toString()).toBe(
			"https://wayfare.staging.entur.no/",
		);
		expect(config?.loginClientSecret).toBe("login-secret");
		expect(config?.permissionM2mClientId).toBe("permission-client");
	});

	it.each([
		["production mode", { OMSA_ENV_MODE: "production" }, "OMSA_ENV_MODE"],
		[
			"developer overrides",
			{ ALLOW_DEV_CONFIG_OVERRIDES: "true" },
			"ALLOW_DEV_CONFIG_OVERRIDES",
		],
		["insecure cookies", { COOKIE_SECURE: "false" }, "COOKIE_SECURE"],
		[
			"an insecure origin",
			{ PUBLIC_ORIGIN: "http://wayfare.staging.entur.no" },
			"PUBLIC_ORIGIN must use https:",
		],
		[
			"an origin with a path",
			{ PUBLIC_ORIGIN: "https://wayfare.staging.entur.no/app" },
			"PUBLIC_ORIGIN must contain only scheme and host",
		],
		[
			"another HTTPS origin",
			{ PUBLIC_ORIGIN: "https://another.staging.entur.no" },
			"PUBLIC_ORIGIN must be https://wayfare.staging.entur.no",
		],
		[
			"a login URL instead of a hostname",
			{ ENTUR_LOGIN_DOMAIN: "https://partner.staging.entur.org" },
			"ENTUR_LOGIN_DOMAIN",
		],
	])("rejects %s", (_description, overrides, expectedMessage) => {
		expect(() =>
			validatePublishedDeploymentConfig(stagingEnvironment(overrides)),
		).toThrow(expectedMessage);
	});

	it("reports every missing staging credential in one error", () => {
		const env = stagingEnvironment({
			CLIENT_ID: "",
			CLIENT_SECRET: "",
			ENTUR_LOGIN_CLIENT_SECRET: "",
			MNG_AUTH0_INT_CLIENT_ID: "",
			MNG_AUTH0_INT_CLIENT_SECRET: "",
		});

		expect(() => validatePublishedDeploymentConfig(env)).toThrow(
			/MNG_AUTH0_INT_CLIENT_SECRET must be set/,
		);
		expect(() => validatePublishedDeploymentConfig(env)).toThrow(
			/CLIENT_ID must be set/,
		);
	});
});
