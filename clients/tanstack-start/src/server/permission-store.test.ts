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
		getAuthoritySubject: vi.fn(),
		PermissionDeliverRepository,
		TokenFactory,
		tokenFactoryArguments,
	};
});

vi.mock("@entur-partner/permission-client-node", () => ({
	default: permission.permissionClient,
	AuthorizeCacheType: { IN_MEMORY: "IN_MEMORY" },
	JwtDecoder: { getAuthoritySubject: permission.getAuthoritySubject },
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
		permission.getAuthoritySubject.mockReturnValue("auth0|employee");
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
		expect(await hasStagingAccess("id-token")).toBe(true);
		expect(await hasStagingAccess("id-token")).toBe(false);
		expect(permission.getAuthoritySubject).toHaveBeenCalledWith("id-token");
	});
});
