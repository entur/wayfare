import { describe, expect, it } from "vitest";
import type { TravelerGroup } from "../context/search-form";
import {
	authorityOfferQueryKey,
	buildAuthorityOfferSearchRequest,
} from "./offer-query";

const ONE_ADULT: TravelerGroup[] = [
	{ id: "adult", ageGroup: "ADULT", count: 1, minAge: 18 },
];

describe("buildAuthorityOfferSearchRequest", () => {
	it("sends an organisational requirement with no route or time", () => {
		const request = buildAuthorityOfferSearchRequest(
			"KOL:Authority:8",
			"Kolumbus (Rogaland)",
			ONE_ADULT,
		);

		expect(request.inputs.requirements).toEqual({
			organisational: [
				{
					type: "organisational",
					id: "KOL:Authority:8",
					name: "Kolumbus (Rogaland)",
				},
			],
		});
		// Standalone means no specification and no pattern — supplying either
		// turns it back into an ordinary search.
		expect(request.inputs.specification).toBeUndefined();
		expect(request.inputs.pattern).toBeUndefined();
	});

	it("never attaches recommendation control", () => {
		// OMSA rejects the request outright: "Recommendation control is not
		// supported for standalone authority searches".
		const request = buildAuthorityOfferSearchRequest(
			"RUT:Authority:RUT",
			"Ruter (Oslo og Akershus)",
			ONE_ADULT,
		);
		expect(request.inputs.entur).toBeUndefined();
	});

	it("carries the traveller profile", () => {
		const request = buildAuthorityOfferSearchRequest(
			"VYG:Authority:VY",
			"Vy",
			ONE_ADULT,
		);
		expect(request.inputs.profiles?.length).toBe(1);
	});

	it("keys the cache by authority so switching operator refetches", () => {
		expect(authorityOfferQueryKey("KOL:Authority:8", ONE_ADULT)).not.toEqual(
			authorityOfferQueryKey("RUT:Authority:RUT", ONE_ADULT),
		);
	});
});
