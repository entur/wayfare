import type { PlaceReference } from "../types/common";
import type {
	EnturRecommendationControl,
	IndividualTraveller,
	SearchOfferRequest,
	UserProfile,
} from "../types/search";

export interface OmsaPlaceReference {
	placeId: string;
	name?: string;
}

interface OmsaTripPatternLeg {
	serviceJourney: string;
	date: string;
	from?: OmsaPlaceReference;
	to?: OmsaPlaceReference;
}

interface OmsaSearchSpecification {
	from?: OmsaPlaceReference;
	to?: OmsaPlaceReference;
	startTime?: string;
	endTime?: string;
}

export interface OmsaSearchOfferRequest {
	inputs: {
		type: "search_offer";
		travellers?: IndividualTraveller[];
		profiles?: UserProfile[];
		specification?: OmsaSearchSpecification;
		pattern?: OmsaTripPatternLeg[];
		entur?: { recommendationControl: EnturRecommendationControl };
	};
}

function mapPlaceReference(place: PlaceReference): OmsaPlaceReference {
	return {
		placeId: place.placeId,
		...(place.name !== undefined ? { name: place.name } : {}),
	};
}

export function mapSearchOfferRequest(
	request: SearchOfferRequest,
): OmsaSearchOfferRequest {
	const { inputs } = request;
	const recommendationControl = inputs.entur?.recommendationControl;

	return {
		inputs: {
			type: inputs.type,
			...(inputs.travellers !== undefined
				? { travellers: inputs.travellers }
				: {}),
			...(inputs.profiles !== undefined ? { profiles: inputs.profiles } : {}),
			...(inputs.specification !== undefined
				? {
						specification: {
							...(inputs.specification.from !== undefined
								? { from: mapPlaceReference(inputs.specification.from) }
								: {}),
							...(inputs.specification.to !== undefined
								? { to: mapPlaceReference(inputs.specification.to) }
								: {}),
							...(inputs.specification.startTime !== undefined
								? { startTime: inputs.specification.startTime }
								: {}),
							...(inputs.specification.endTime !== undefined
								? { endTime: inputs.specification.endTime }
								: {}),
						},
					}
				: {}),
			...(inputs.pattern !== undefined
				? {
						pattern: inputs.pattern.map((leg) => ({
							serviceJourney: leg.serviceJourney,
							date: leg.date,
							...(leg.from !== undefined
								? { from: mapPlaceReference(leg.from) }
								: {}),
							...(leg.to !== undefined
								? { to: mapPlaceReference(leg.to) }
								: {}),
						})),
					}
				: {}),
			...(recommendationControl !== undefined
				? {
						entur: {
							recommendationControl: {
								enabled: recommendationControl.enabled,
								...(recommendationControl.types !== undefined
									? { types: recommendationControl.types }
									: {}),
								...(recommendationControl.stripDuplicates !== undefined
									? {
											stripDuplicates: recommendationControl.stripDuplicates,
										}
									: {}),
							},
						},
					}
				: {}),
		},
	};
}
