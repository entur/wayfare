import type {
	DevConfigOverrides,
	OmsaRuntimeMode,
} from "../lib/dev-config-storage";

export type { OmsaRuntimeMode };

interface ModeDefaults {
	omsaBaseUrl: string;
	salesBaseUrl: string;
	journeyPlannerUrl: string;
	geocoderUrl: string;
	oauthTokenUrl: string;
	auth0Audience: string;
}

export interface RuntimeConfig {
	mode: OmsaRuntimeMode;
	omsaBaseUrl: string;
	salesBaseUrl: string;
	journeyPlannerUrl: string;
	geocoderUrl: string;
	oauthTokenUrl: string;
	auth0Audience: string;
	clientId: string | undefined;
	clientSecret: string | undefined;
	enturDistributionChannel: string | undefined;
	enturClientName: string | undefined;
	enturPos: string | undefined;
	vippsPhoneNumber: string | undefined;
}

interface EnvironmentDefaults {
	salesBaseUrl: string;
	journeyPlannerUrl: string;
	geocoderUrl: string;
	oauthTokenUrl: string;
	auth0Audience: string;
}

const DEV_ENVIRONMENT_DEFAULTS: EnvironmentDefaults = {
	salesBaseUrl: "https://api.dev.entur.io/sales/v1",
	journeyPlannerUrl: "https://api.dev.entur.io/journey-planner/v3/graphql",
	geocoderUrl: "https://api.dev.entur.io/geocoder/v1",
	oauthTokenUrl: "https://partner.dev.entur.org/oauth/token",
	auth0Audience: "https://api.dev.entur.io",
};

const STAGING_ENVIRONMENT_DEFAULTS: EnvironmentDefaults = {
	salesBaseUrl: "https://api.staging.entur.io/sales/v1",
	journeyPlannerUrl: "https://api.staging.entur.io/journey-planner/v3/graphql",
	geocoderUrl: "https://api.staging.entur.io/geocoder/v1",
	oauthTokenUrl: "https://partner.staging.entur.org/oauth/token",
	auth0Audience: "https://api.staging.entur.io",
};

const MODE_DEFAULTS: Record<OmsaRuntimeMode, ModeDefaults> = {
	dev: {
		omsaBaseUrl: "https://api.dev.entur.io/omsa/v1",
		...DEV_ENVIRONMENT_DEFAULTS,
	},
	staging: {
		omsaBaseUrl: "https://api.staging.entur.io/omsa/v1",
		...STAGING_ENVIRONMENT_DEFAULTS,
	},
	"local-dev": {
		omsaBaseUrl: "http://localhost:8080/v1",
		...DEV_ENVIRONMENT_DEFAULTS,
	},
	"local-staging": {
		omsaBaseUrl: "http://localhost:8080/v1",
		...STAGING_ENVIRONMENT_DEFAULTS,
	},
};

export const MODE_ENV_PREFIXES: Record<OmsaRuntimeMode, string> = {
	dev: "DEV",
	staging: "STAGING",
	"local-dev": "LOCAL_DEV",
	"local-staging": "LOCAL_STAGING",
};

function normalizeUrl(url: string): string {
	return url.replace(/\/$/, "");
}

function resolveMode(rawMode: string | undefined): OmsaRuntimeMode {
	const normalized = rawMode?.trim().toLowerCase();
	if (!normalized) {
		return "dev";
	}

	switch (normalized) {
		case "dev":
		case "staging":
		case "local-dev":
		case "local-staging":
			return normalized;
		default:
			throw new Error(
				`Invalid OMSA_ENV_MODE "${rawMode}". Expected one of: dev, staging, local-dev, local-staging.`,
			);
	}
}

// local-dev inherits from dev, local-staging inherits from staging.
const MODE_ENV_PARENTS: Partial<Record<OmsaRuntimeMode, OmsaRuntimeMode>> = {
	"local-dev": "dev",
	"local-staging": "staging",
};

// Resolution order: {MODE_PREFIX}_{field} → {PARENT_PREFIX}_{field} → {field}
// Example for local-staging: LOCAL_STAGING_CLIENT_ID → STAGING_CLIENT_ID → CLIENT_ID
function resolveEnvField(
	fieldName: string,
	mode: OmsaRuntimeMode,
): string | undefined {
	const modeValue = process.env[`${MODE_ENV_PREFIXES[mode]}_${fieldName}`];
	if (modeValue !== undefined) return modeValue;

	const parent = MODE_ENV_PARENTS[mode];
	if (parent !== undefined) {
		const parentValue =
			process.env[`${MODE_ENV_PREFIXES[parent]}_${fieldName}`];
		if (parentValue !== undefined) return parentValue;
	}

	return process.env[fieldName];
}

export function getRuntimeConfig(
	overrides?: DevConfigOverrides,
): RuntimeConfig {
	const mode = resolveMode(overrides?.envMode ?? process.env.OMSA_ENV_MODE);
	const defaults = MODE_DEFAULTS[mode];

	return {
		mode,
		omsaBaseUrl: normalizeUrl(
			resolveEnvField("OMSA_BASE_URL", mode) ?? defaults.omsaBaseUrl,
		),
		salesBaseUrl: normalizeUrl(
			resolveEnvField("SALES_BASE_URL", mode) ?? defaults.salesBaseUrl,
		),
		journeyPlannerUrl: normalizeUrl(
			resolveEnvField("JOURNEY_PLANNER_URL", mode) ??
				defaults.journeyPlannerUrl,
		),
		geocoderUrl: normalizeUrl(
			resolveEnvField("GEOCODER_URL", mode) ?? defaults.geocoderUrl,
		),
		oauthTokenUrl: normalizeUrl(
			resolveEnvField("OAUTH_TOKEN_URL", mode) ?? defaults.oauthTokenUrl,
		),
		auth0Audience: normalizeUrl(
			resolveEnvField("AUTH0_AUDIENCE", mode) ?? defaults.auth0Audience,
		),
		clientId: resolveEnvField("CLIENT_ID", mode),
		clientSecret: resolveEnvField("CLIENT_SECRET", mode),
		enturDistributionChannel: resolveEnvField(
			"ENTUR_DISTRIBUTION_CHANNEL",
			mode,
		),
		enturClientName: resolveEnvField("ENTUR_CLIENT_NAME", mode),
		enturPos: resolveEnvField("ENTUR_POS", mode),
		vippsPhoneNumber: resolveEnvField("VIPPS_PHONE_NUMBER", mode),
	};
}
