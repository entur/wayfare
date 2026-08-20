import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import {
	areDevConfigOverridesAllowed,
	fingerprintClientId,
	getRuntimeConfig,
	type OmsaRuntimeMode,
} from "../server/runtime-config";

const ALL_ENV_MODES: OmsaRuntimeMode[] = [
	"dev",
	"staging",
	"local-dev",
	"local-staging",
];

export interface ResolvedDevConfig {
	effectiveMode: string;
	effectiveOmsaBaseUrl: string;
	effectiveSalesBaseUrl: string;
	effectiveJourneyPlannerUrl: string;
	effectiveGeocoderUrl: string;
	clientFingerprint: string;
	/**
	 * Whether the client is allowed to override env mode / Entur headers at
	 * all. False on a published deployment (see areDevConfigOverridesAllowed).
	 */
	overridesEnabled: boolean;
	/** Env modes the client may switch to. A single-item list when locked. */
	allowedEnvModes: OmsaRuntimeMode[];
	envDefaults: {
		mode: string;
		distributionChannel: string;
		clientName: string;
		pos: string;
	};
}

export const getResolvedDevConfig = createServerFn({ method: "GET" })
	.middleware([devConfigMiddleware])
	.handler(async ({ context }): Promise<ResolvedDevConfig> => {
		const config = getRuntimeConfig(context.devConfig);
		const envConfig = getRuntimeConfig({ envMode: config.mode });
		const overridesEnabled = areDevConfigOverridesAllowed();
		return {
			effectiveMode: config.mode,
			effectiveOmsaBaseUrl: config.omsaBaseUrl,
			effectiveSalesBaseUrl: config.salesBaseUrl,
			effectiveJourneyPlannerUrl: config.journeyPlannerUrl,
			effectiveGeocoderUrl: config.geocoderUrl,
			clientFingerprint: fingerprintClientId(config.clientId),
			overridesEnabled,
			allowedEnvModes: overridesEnabled ? ALL_ENV_MODES : [config.mode],
			envDefaults: {
				mode: process.env.OMSA_ENV_MODE ?? "dev",
				distributionChannel:
					envConfig.enturDistributionChannel ?? "WAY:DistributionChannel:App",
				clientName: envConfig.enturClientName ?? "Wayfare-Web",
				pos: envConfig.enturPos ?? "Wayfare",
			},
		};
	});
