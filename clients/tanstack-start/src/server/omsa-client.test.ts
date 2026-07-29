import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getAccessTokenMock } = vi.hoisted(() => ({
	getAccessTokenMock: vi.fn(),
}));

vi.mock("./auth", () => ({
	getAccessToken: getAccessTokenMock,
}));

import { createOmsaClient, stringifyJsonLog } from "./omsa-client";

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
	});
}

beforeEach(() => {
	vi.stubEnv("ENABLE_REQUEST_RESPONSE_LOGGING", "false");
	vi.stubGlobal("fetch", vi.fn());
	getAccessTokenMock.mockResolvedValue("Bearer test-token");
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	vi.clearAllMocks();
});

describe("stringifyJsonLog", () => {
	it("replaces circular references", () => {
		const body: Record<string, unknown> = { id: "ticket-1" };
		body.self = body;

		expect(JSON.parse(stringifyJsonLog({ body }))).toEqual({
			body: {
				id: "ticket-1",
				self: "[Circular]",
			},
		});
	});

	it("keeps repeated non-circular references", () => {
		const ticket = { id: "ticket-1" };

		expect(
			JSON.parse(stringifyJsonLog({ first: ticket, second: ticket })),
		).toEqual({
			first: ticket,
			second: ticket,
		});
	});

	it("converts BigInt values to strings", () => {
		expect(JSON.parse(stringifyJsonLog({ value: 12n }))).toEqual({
			value: "12",
		});
	});
});

describe("createOmsaClient", () => {
	it("sends GET query parameters and authorized Entur headers", async () => {
		vi.mocked(fetch).mockResolvedValue(
			jsonResponse({ packages: [{ id: "package-1" }] }),
		);
		const client = createOmsaClient({
			envMode: "local-dev",
			clientName: "Boundary-Test",
			distributionChannel: "WAY:DistributionChannel:Test",
			pos: "Test-POS",
		});

		const result = await client.get<{ packages: { id: string }[] }>(
			"/collections/packages/items",
			{ customerId: "customer 1", limit: "20" },
		);

		expect(result).toEqual({ packages: [{ id: "package-1" }] });
		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:8080/v1/collections/packages/items?customerId=customer+1&limit=20",
			{
				headers: {
					Authorization: "Bearer test-token",
					Accept: "application/json",
					"Accept-Language": "en-GB",
					"Entur-Distribution-Channel": "WAY:DistributionChannel:Test",
					"ET-Client-Name": "Boundary-Test",
					"Entur-POS": "Test-POS",
				},
			},
		);
		expect(getAccessTokenMock).toHaveBeenCalledWith(
			expect.objectContaining({ envMode: "local-dev" }),
		);
	});

	it.each([
		"post",
		"put",
		"patch",
	] as const)("sends JSON bodies for %s requests", async (method) => {
		vi.mocked(fetch).mockResolvedValue(jsonResponse({ id: "result-1" }));
		const client = createOmsaClient({ envMode: "local-dev" });
		const body = { inputs: { type: "test_input" } };

		const result = await client[method]<{ id: string }>(
			"/processes/test/execute",
			body,
		);

		expect(result).toEqual({ id: "result-1" });
		expect(fetch).toHaveBeenCalledWith(
			"http://localhost:8080/v1/processes/test/execute",
			{
				method: method.toUpperCase(),
				headers: expect.objectContaining({
					Authorization: "Bearer test-token",
					Accept: "application/json",
					"Content-Type": "application/json",
				}),
				body: JSON.stringify(body),
			},
		);
	});

	it("includes the OMSA response body in HTTP errors", async () => {
		vi.mocked(fetch).mockResolvedValue(
			new Response('{"message":"offer expired"}', {
				status: 409,
				statusText: "Conflict",
				headers: { "Content-Type": "application/json" },
			}),
		);
		const client = createOmsaClient({ envMode: "local-dev" });

		await expect(
			client.post("/processes/purchase-offers/execute", {
				inputs: { type: "purchase_offers", offerIds: ["expired-offer"] },
			}),
		).rejects.toThrow(
			'OMSA POST /processes/purchase-offers/execute failed (409): {"message":"offer expired"}',
		);
	});

	it("propagates network errors", async () => {
		vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"));
		const client = createOmsaClient({ envMode: "local-dev" });

		await expect(client.get("/collections/packages/items")).rejects.toThrow(
			"fetch failed",
		);
	});
});
