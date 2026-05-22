import { createServerFn } from "@tanstack/react-start";
import { devConfigMiddleware } from "../server/middleware";
import { getRuntimeConfig } from "../server/runtime-config";

export interface ResolvedDevConfig {
	effectiveMode: string;
	effectiveOmsaBaseUrl: string;
	effectiveSalesBaseUrl: string;
	effectiveJourneyPlannerUrl: string;
	effectiveGeocoderUrl: string;
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
		return {
			effectiveMode: config.mode,
			effectiveOmsaBaseUrl: config.omsaBaseUrl,
			effectiveSalesBaseUrl: config.salesBaseUrl,
			effectiveJourneyPlannerUrl: config.journeyPlannerUrl,
			effectiveGeocoderUrl: config.geocoderUrl,
			envDefaults: {
				mode: process.env.OMSA_ENV_MODE ?? "dev",
				distributionChannel:
					envConfig.enturDistributionChannel ?? "WAY:DistributionChannel:App",
				clientName: envConfig.enturClientName ?? "Wayfare-Web",
				pos: envConfig.enturPos ?? "Wayfare",
			},
		};
	});
