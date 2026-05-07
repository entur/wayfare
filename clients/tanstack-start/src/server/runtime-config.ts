export type OmsaRuntimeMode = "dev" | "staging" | "local" | "local-tst";
type CredentialProfile = "dev" | "staging";

interface ModeDefaults {
	omsaBaseUrl: string;
	salesBaseUrl: string;
	journeyPlannerUrl: string;
	geocoderUrl: string;
	oauthTokenUrl: string;
	auth0Audience: string;
	credentialProfile: CredentialProfile;
}

export interface RuntimeConfig {
	mode: OmsaRuntimeMode;
	credentialProfile: CredentialProfile;
	omsaBaseUrl: string;
	salesBaseUrl: string;
	journeyPlannerUrl: string;
	geocoderUrl: string;
	oauthTokenUrl: string;
	auth0Audience: string;
	clientId: string | undefined;
	clientSecret: string | undefined;
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
		credentialProfile: "dev",
	},
	staging: {
		omsaBaseUrl: "https://api.staging.entur.io/omsa/v1",
		...STAGING_ENVIRONMENT_DEFAULTS,
		credentialProfile: "staging",
	},
	local: {
		omsaBaseUrl: "http://localhost:8080/v1",
		...DEV_ENVIRONMENT_DEFAULTS,
		credentialProfile: "dev",
	},
	"local-tst": {
		omsaBaseUrl: "http://localhost:8080/v1",
		...STAGING_ENVIRONMENT_DEFAULTS,
		credentialProfile: "staging",
	},
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
		case "local":
		case "local-tst":
			return normalized;
		default:
			throw new Error(
				`Invalid OMSA_ENV_MODE "${rawMode}". Expected one of: dev, staging, local, local-tst.`,
			);
	}
}

function resolveCredentialProfile(
	rawProfile: string | undefined,
	modeDefaultProfile: CredentialProfile,
): CredentialProfile {
	const normalized = rawProfile?.trim().toLowerCase();
	if (!normalized) {
		return modeDefaultProfile;
	}
	if (normalized === "dev" || normalized === "staging") {
		return normalized;
	}
	throw new Error(
		`Invalid OMSA_CREDENTIAL_PROFILE "${rawProfile}". Expected one of: dev, staging.`,
	);
}

function resolveProfileCredentials(profile: CredentialProfile): {
	clientId: string | undefined;
	clientSecret: string | undefined;
} {
	if (profile === "staging") {
		return {
			clientId: process.env.CLIENT_ID_STAGING ?? process.env.CLIENT_ID,
			clientSecret:
				process.env.CLIENT_SECRET_STAGING ?? process.env.CLIENT_SECRET,
		};
	}

	return {
		clientId: process.env.CLIENT_ID_DEV ?? process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET_DEV ?? process.env.CLIENT_SECRET,
	};
}

export function getRuntimeConfig(): RuntimeConfig {
	const mode = resolveMode(process.env.OMSA_ENV_MODE);
	const defaults = MODE_DEFAULTS[mode];
	const credentialProfile = resolveCredentialProfile(
		process.env.OMSA_CREDENTIAL_PROFILE,
		defaults.credentialProfile,
	);
	const credentials = resolveProfileCredentials(credentialProfile);

	return {
		mode,
		credentialProfile,
		omsaBaseUrl: normalizeUrl(
			process.env.OMSA_BASE_URL ?? defaults.omsaBaseUrl,
		),
		salesBaseUrl: normalizeUrl(
			process.env.SALES_BASE_URL ?? defaults.salesBaseUrl,
		),
		journeyPlannerUrl: normalizeUrl(
			process.env.JOURNEY_PLANNER_URL ?? defaults.journeyPlannerUrl,
		),
		geocoderUrl: normalizeUrl(process.env.GEOCODER_URL ?? defaults.geocoderUrl),
		oauthTokenUrl: normalizeUrl(
			process.env.OAUTH_TOKEN_URL ?? defaults.oauthTokenUrl,
		),
		auth0Audience: normalizeUrl(
			process.env.AUTH0_AUDIENCE ?? defaults.auth0Audience,
		),
		clientId: credentials.clientId,
		clientSecret: credentials.clientSecret,
	};
}
