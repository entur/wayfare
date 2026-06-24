import { createServerFn } from "@tanstack/react-start";
import { dedupeSituations } from "../lib/situations";
import { devConfigMiddleware } from "../server/middleware";
import { createJourneyPlannerClient } from "../server/omsa-client";
import type { PtSituationElement } from "../types/situations";
import { SITUATION_FRAGMENT } from "./graphql-fragments";

const SERVICE_JOURNEY_SITUATIONS_QUERY = `
	query ServiceJourneySituations($id: String!) {
		serviceJourney(id: $id) {
			id
			situations { ${SITUATION_FRAGMENT} }
			line {
				situations { ${SITUATION_FRAGMENT} }
			}
		}
	}
`;

interface ServiceJourneySituationsData {
	serviceJourney: {
		id: string;
		situations: PtSituationElement[];
		line?: {
			situations: PtSituationElement[];
		} | null;
	} | null;
}

interface FetchJourneySituationsInput {
	serviceJourneyIds: string[];
}

export const fetchJourneySituations = createServerFn({ method: "POST" })
	.middleware([devConfigMiddleware])
	.inputValidator((data: FetchJourneySituationsInput) => data)
	.handler(async ({ data, context }): Promise<PtSituationElement[]> => {
		const journeyPlanner = createJourneyPlannerClient(context.devConfig);
		const ids = [...new Set(data.serviceJourneyIds.filter(Boolean))];

		if (ids.length === 0) return [];

		const results = await Promise.allSettled(
			ids.map((id) =>
				journeyPlanner.query<ServiceJourneySituationsData>(
					SERVICE_JOURNEY_SITUATIONS_QUERY,
					{ id },
				),
			),
		);

		const allSituations = results.flatMap((r) => {
			if (r.status === "rejected") return [];
			const sj = r.value.serviceJourney;
			if (!sj) return [];
			return [...(sj.situations ?? []), ...(sj.line?.situations ?? [])];
		});

		return dedupeSituations(allSituations);
	});
