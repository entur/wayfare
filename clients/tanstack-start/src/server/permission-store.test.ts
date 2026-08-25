import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const permission = vi.hoisted(() => {
	const cache = {
		checkBusinessCapabilityPermission: vi.fn(),
		setScheduleErrorHandler: vi.fn(),
	};
	const tokenFactoryArguments: unknown[] = [];
	class TokenFactory {
		constructor(options: unknown) {
			tokenFactoryArguments.push(options);
		}
	}
	class PermissionDeliverRepository {}
	return {
		cache,
		permissionClient: vi.fn().mockResolvedValue(cache),
		PermissionDeliverRepository,
		TokenFactory,
		tokenFactoryArguments,
	};
});

vi.mock("@entur-partner/permission-client-node", () => ({
	default: permission.permissionClient,
	AuthorizeCacheType: { IN_MEMORY: "IN_MEMORY" },
	PermissionDeliverRepository: permission.PermissionDeliverRepository,
	TokenFactory: permission.TokenFactory,
}));

import { stubPublishedEnvironment } from "./deployment-config.test-utils";
import {
	hasStagingAccess,
	initializePermissionStore,
	WAYFARE_WEB_ACCESS,
} from "./permission-store";

beforeEach(() => {
	stubPublishedEnvironment();
});

afterEach(() => {
	vi.unstubAllEnvs();
});

describe("Permission Store gate", () => {
	it("initializes the wayfare.web capability before checking allow and deny", async () => {
		permission.cache.checkBusinessCapabilityPermission
			.mockReturnValueOnce(true)
			.mockReturnValueOnce(false);

		await initializePermissionStore();

		expect(permission.permissionClient).toHaveBeenCalledWith(
			"IN_MEMORY",
			[WAYFARE_WEB_ACCESS],
			expect.any(permission.PermissionDeliverRepository),
		);
		expect(permission.tokenFactoryArguments).toEqual([
			{
				domain: "https://internal.staging.entur.org",
				clientId: "permission-client",
				clientSecret: "permission-secret",
				audience: "https://permission-store",
			},
		]);
		expect(await hasStagingAccess("auth0|employee")).toBe(true);
		expect(await hasStagingAccess("auth0|employee")).toBe(false);
		// The authority is derived from ENTUR_LOGIN_DOMAIN
		// ("partner.staging.entur.org"), the same value used as the token
		// issuer -- no JWT decoding needed.
		expect(
			permission.cache.checkBusinessCapabilityPermission,
		).toHaveBeenCalledWith(
			{ authority: "partner", subject: "auth0|employee" },
			WAYFARE_WEB_ACCESS,
		);
	});
});
