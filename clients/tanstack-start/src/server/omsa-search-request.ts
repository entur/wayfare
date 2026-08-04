import type { PlaceReference } from "../types/common";
import type {
	EnturRecommendationControl,
	IndividualTraveller,
	SearchOfferRequest,
	SearchOffersRequirements,
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
		requirements?: SearchOffersRequirements;
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

	// A standalone authority search carries an organisational requirement and no
	// route. OMSA rejects those with recommendation control attached
	// ("Recommendation control is not supported for standalone authority
	// searches"), so drop the global dev override rather than fail the request.
	const isStandaloneAuthoritySearch =
		(inputs.requirements?.organisational?.length ?? 0) > 0 &&
		inputs.specification === undefined &&
		inputs.pattern === undefined;

	const recommendationControl = isStandaloneAuthoritySearch
		? undefined
		: inputs.entur?.recommendationControl;

	return {
		inputs: {
			type: inputs.type,
			...(inputs.travellers !== undefined && inputs.travellers.length > 0
				? { travellers: inputs.travellers }
				: {}),
			...(inputs.profiles !== undefined && inputs.profiles.length > 0
				? { profiles: inputs.profiles }
				: {}),
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
			...(inputs.requirements?.organisational !== undefined &&
			inputs.requirements.organisational.length > 0
				? {
						requirements: {
							// OMSA accepts at most one organisational parameter.
							organisational: inputs.requirements.organisational
								.slice(0, 1)
								.map((org) => ({
									type: org.type,
									id: org.id,
									...(org.name !== undefined ? { name: org.name } : {}),
									...(org.legalName !== undefined
										? { legalName: org.legalName }
										: {}),
								})),
						},
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
