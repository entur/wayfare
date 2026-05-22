import { afterEach, describe, expect, it } from "vitest";
import { getRuntimeConfig } from "./runtime-config";

const ORIGINAL_ENV = { ...process.env };

function resetRuntimeEnv() {
	process.env = { ...ORIGINAL_ENV };
	delete process.env.OMSA_ENV_MODE;
	delete process.env.OMSA_BASE_URL;
	delete process.env.SALES_BASE_URL;
	delete process.env.JOURNEY_PLANNER_URL;
	delete process.env.GEOCODER_URL;
	delete process.env.OAUTH_TOKEN_URL;
	delete process.env.AUTH0_AUDIENCE;
	delete process.env.CLIENT_ID;
	delete process.env.CLIENT_SECRET;
	delete process.env.DEV_CLIENT_ID;
	delete process.env.DEV_CLIENT_SECRET;
	delete process.env.STAGING_CLIENT_ID;
	delete process.env.STAGING_CLIENT_SECRET;
	delete process.env.LOCAL_DEV_CLIENT_ID;
	delete process.env.LOCAL_DEV_CLIENT_SECRET;
	delete process.env.LOCAL_STAGING_CLIENT_ID;
	delete process.env.LOCAL_STAGING_CLIENT_SECRET;
	for (const prefix of [
		"",
		"DEV_",
		"STAGING_",
		"LOCAL_DEV_",
		"LOCAL_STAGING_",
	]) {
		delete process.env[`${prefix}ENTUR_DISTRIBUTION_CHANNEL`];
		delete process.env[`${prefix}ENTUR_CLIENT_NAME`];
		delete process.env[`${prefix}ENTUR_POS`];
		delete process.env[`${prefix}VIPPS_PHONE_NUMBER`];
		delete process.env[`${prefix}OMSA_BASE_URL`];
		delete process.env[`${prefix}SALES_BASE_URL`];
		delete process.env[`${prefix}JOURNEY_PLANNER_URL`];
		delete process.env[`${prefix}GEOCODER_URL`];
		delete process.env[`${prefix}OAUTH_TOKEN_URL`];
		delete process.env[`${prefix}AUTH0_AUDIENCE`];
	}
}

afterEach(() => {
	resetRuntimeEnv();
});

describe("getRuntimeConfig — mode defaults", () => {
	it("uses dev OAuth defaults in dev mode", () => {
		process.env.OMSA_ENV_MODE = "dev";

		const config = getRuntimeConfig();

		expect(config.oauthTokenUrl).toBe(
			"https://partner.dev.entur.org/oauth/token",
		);
		expect(config.auth0Audience).toBe("https://api.dev.entur.io");
		expect(config.salesBaseUrl).toBe("https://api.dev.entur.io/sales/v1");
		expect(config.journeyPlannerUrl).toBe(
			"https://api.dev.entur.io/journey-planner/v3/graphql",
		);
		expect(config.geocoderUrl).toBe("https://api.dev.entur.io/geocoder/v1");
	});

	it("uses staging OAuth defaults in staging mode", () => {
		process.env.OMSA_ENV_MODE = "staging";

		const config = getRuntimeConfig();

		expect(config.oauthTokenUrl).toBe(
			"https://partner.staging.entur.org/oauth/token",
		);
		expect(config.auth0Audience).toBe("https://api.staging.entur.io");
		expect(config.salesBaseUrl).toBe("https://api.staging.entur.io/sales/v1");
		expect(config.journeyPlannerUrl).toBe(
			"https://api.staging.entur.io/journey-planner/v3/graphql",
		);
		expect(config.geocoderUrl).toBe("https://api.staging.entur.io/geocoder/v1");
	});

	it("uses staging OAuth defaults in local-staging while keeping OMSA local", () => {
		process.env.OMSA_ENV_MODE = "local-staging";

		const config = getRuntimeConfig();

		expect(config.omsaBaseUrl).toBe("http://localhost:8080/v1");
		expect(config.oauthTokenUrl).toBe(
			"https://partner.staging.entur.org/oauth/token",
		);
		expect(config.auth0Audience).toBe("https://api.staging.entur.io");
		expect(config.salesBaseUrl).toBe("https://api.staging.entur.io/sales/v1");
		expect(config.journeyPlannerUrl).toBe(
			"https://api.staging.entur.io/journey-planner/v3/graphql",
		);
		expect(config.geocoderUrl).toBe("https://api.staging.entur.io/geocoder/v1");
	});

	it("uses dev Journey Planner and geocoder in local-dev", () => {
		process.env.OMSA_ENV_MODE = "local-dev";

		const config = getRuntimeConfig();

		expect(config.omsaBaseUrl).toBe("http://localhost:8080/v1");
		expect(config.journeyPlannerUrl).toBe(
			"https://api.dev.entur.io/journey-planner/v3/graphql",
		);
		expect(config.geocoderUrl).toBe("https://api.dev.entur.io/geocoder/v1");
	});
});

describe("getRuntimeConfig — env field hierarchy", () => {
	it("falls back to unprefixed field when no mode-specific value is set", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.CLIENT_ID = "base-id";
		process.env.CLIENT_SECRET = "base-secret";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("base-id");
		expect(config.clientSecret).toBe("base-secret");
	});

	it("uses mode-specific prefix over unprefixed fallback", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.CLIENT_ID = "base-id";
		process.env.CLIENT_SECRET = "base-secret";
		process.env.STAGING_CLIENT_ID = "staging-id";
		process.env.STAGING_CLIENT_SECRET = "staging-secret";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("staging-id");
		expect(config.clientSecret).toBe("staging-secret");
	});

	it("mode-specific override does not bleed into other modes", () => {
		process.env.OMSA_ENV_MODE = "dev";
		process.env.CLIENT_ID = "base-id";
		process.env.STAGING_CLIENT_ID = "staging-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("base-id");
	});

	it("uses LOCAL_DEV_ prefix for local-dev mode", () => {
		process.env.OMSA_ENV_MODE = "local-dev";
		process.env.CLIENT_ID = "base-id";
		process.env.LOCAL_DEV_CLIENT_ID = "local-dev-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("local-dev-id");
	});

	it("uses LOCAL_STAGING_ prefix for local-staging mode", () => {
		process.env.OMSA_ENV_MODE = "local-staging";
		process.env.CLIENT_ID = "base-id";
		process.env.LOCAL_STAGING_CLIENT_ID = "local-staging-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("local-staging-id");
	});

	it("local-dev falls back to DEV_ when LOCAL_DEV_ is not set", () => {
		process.env.OMSA_ENV_MODE = "local-dev";
		process.env.CLIENT_ID = "base-id";
		process.env.DEV_CLIENT_ID = "dev-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("dev-id");
	});

	it("local-staging falls back to STAGING_ when LOCAL_STAGING_ is not set", () => {
		process.env.OMSA_ENV_MODE = "local-staging";
		process.env.CLIENT_ID = "base-id";
		process.env.STAGING_CLIENT_ID = "staging-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("staging-id");
	});

	it("LOCAL_DEV_ wins over DEV_ when both are set", () => {
		process.env.OMSA_ENV_MODE = "local-dev";
		process.env.DEV_CLIENT_ID = "dev-id";
		process.env.LOCAL_DEV_CLIENT_ID = "local-dev-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("local-dev-id");
	});

	it("LOCAL_STAGING_ wins over STAGING_ when both are set", () => {
		process.env.OMSA_ENV_MODE = "local-staging";
		process.env.STAGING_CLIENT_ID = "staging-id";
		process.env.LOCAL_STAGING_CLIENT_ID = "local-staging-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("local-staging-id");
	});

	it("DEV_ parent does not apply when in plain staging mode", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.DEV_CLIENT_ID = "dev-id";
		process.env.CLIENT_ID = "base-id";

		const config = getRuntimeConfig();

		expect(config.clientId).toBe("base-id");
	});

	it("applies hierarchy to Entur headers", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.ENTUR_DISTRIBUTION_CHANNEL = "WAY:DistributionChannel:Base";
		process.env.STAGING_ENTUR_DISTRIBUTION_CHANNEL =
			"WAY:DistributionChannel:Staging";

		const config = getRuntimeConfig();

		expect(config.enturDistributionChannel).toBe(
			"WAY:DistributionChannel:Staging",
		);
	});

	it("falls back to base Entur header when no mode-specific value is set", () => {
		process.env.OMSA_ENV_MODE = "dev";
		process.env.ENTUR_DISTRIBUTION_CHANNEL = "WAY:DistributionChannel:Base";

		const config = getRuntimeConfig();

		expect(config.enturDistributionChannel).toBe(
			"WAY:DistributionChannel:Base",
		);
	});

	it("applies hierarchy to VIPPS_PHONE_NUMBER", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.VIPPS_PHONE_NUMBER = "+4799999999";
		process.env.STAGING_VIPPS_PHONE_NUMBER = "+4788888888";

		const config = getRuntimeConfig();

		expect(config.vippsPhoneNumber).toBe("+4788888888");
	});

	it("returns undefined for vippsPhoneNumber when not set", () => {
		process.env.OMSA_ENV_MODE = "dev";

		const config = getRuntimeConfig();

		expect(config.vippsPhoneNumber).toBeUndefined();
	});

	it("applies hierarchy to URL overrides", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.JOURNEY_PLANNER_URL =
			"https://custom.example.com/journey-planner/v3/graphql/";
		process.env.STAGING_JOURNEY_PLANNER_URL =
			"https://staging-custom.example.com/journey-planner/v3/graphql/";

		const config = getRuntimeConfig();

		expect(config.journeyPlannerUrl).toBe(
			"https://staging-custom.example.com/journey-planner/v3/graphql",
		);
	});

	it("honors unprefixed URL override across all modes", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.JOURNEY_PLANNER_URL =
			"https://custom.example.com/journey-planner/v3/graphql/";

		const config = getRuntimeConfig();

		expect(config.journeyPlannerUrl).toBe(
			"https://custom.example.com/journey-planner/v3/graphql",
		);
	});

	it("honors unprefixed GEOCODER_URL override", () => {
		process.env.OMSA_ENV_MODE = "dev";
		process.env.GEOCODER_URL = "https://custom.example.com/geocoder/v1/";

		const config = getRuntimeConfig();

		expect(config.geocoderUrl).toBe("https://custom.example.com/geocoder/v1");
	});
});
