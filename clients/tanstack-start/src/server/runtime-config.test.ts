import { afterEach, describe, expect, it } from "vitest";
import { getRuntimeConfig } from "./runtime-config";

const ORIGINAL_ENV = { ...process.env };

function resetRuntimeEnv() {
	process.env = { ...ORIGINAL_ENV };
	delete process.env.OMSA_ENV_MODE;
	delete process.env.OMSA_CREDENTIAL_PROFILE;
	delete process.env.OMSA_BASE_URL;
	delete process.env.SALES_BASE_URL;
	delete process.env.JOURNEY_PLANNER_URL;
	delete process.env.GEOCODER_URL;
	delete process.env.OAUTH_TOKEN_URL;
	delete process.env.AUTH0_AUDIENCE;
	delete process.env.CLIENT_ID;
	delete process.env.CLIENT_SECRET;
	delete process.env.CLIENT_ID_DEV;
	delete process.env.CLIENT_SECRET_DEV;
	delete process.env.CLIENT_ID_STAGING;
	delete process.env.CLIENT_SECRET_STAGING;
}

afterEach(() => {
	resetRuntimeEnv();
});

describe("getRuntimeConfig", () => {
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
		expect(config.credentialProfile).toBe("dev");
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
		expect(config.credentialProfile).toBe("staging");
	});

	it("uses staging OAuth defaults in local-tst mode while keeping OMSA local", () => {
		process.env.OMSA_ENV_MODE = "local-tst";

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
		expect(config.credentialProfile).toBe("staging");
	});

	it("uses dev Journey Planner and geocoder in local mode", () => {
		process.env.OMSA_ENV_MODE = "local";

		const config = getRuntimeConfig();

		expect(config.omsaBaseUrl).toBe("http://localhost:8080/v1");
		expect(config.journeyPlannerUrl).toBe(
			"https://api.dev.entur.io/journey-planner/v3/graphql",
		);
		expect(config.geocoderUrl).toBe("https://api.dev.entur.io/geocoder/v1");
	});

	it("honors JOURNEY_PLANNER_URL override regardless of mode", () => {
		process.env.OMSA_ENV_MODE = "staging";
		process.env.JOURNEY_PLANNER_URL =
			"https://custom.example.com/journey-planner/v3/graphql/";

		const config = getRuntimeConfig();

		expect(config.journeyPlannerUrl).toBe(
			"https://custom.example.com/journey-planner/v3/graphql",
		);
	});

	it("honors GEOCODER_URL override regardless of mode", () => {
		process.env.OMSA_ENV_MODE = "dev";
		process.env.GEOCODER_URL = "https://custom.example.com/geocoder/v1/";

		const config = getRuntimeConfig();

		expect(config.geocoderUrl).toBe("https://custom.example.com/geocoder/v1");
	});
});
