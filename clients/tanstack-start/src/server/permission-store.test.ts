import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const permission = vi.hoisted(() => {
	const cache = {
		checkBusinessCapabilityPermission: vi.fn(),
		setScheduleErrorHandler: vi.fn(),
	};
	const tokenFactoryArguments: unknown[] = [];
	const repositoryArguments: unknown[][] = [];
	class TokenFactory {
		constructor(options: unknown) {
			tokenFactoryArguments.push(options);
		}
	}
	class PermissionDeliverRepository {
		constructor(...arguments_: unknown[]) {
			repositoryArguments.push(arguments_);
		}
	}
	return {
		cache,
		permissionClient: vi.fn().mockResolvedValue(cache),
		getAuthoritySubject: vi.fn(),
		PermissionDeliverRepository,
		repositoryArguments,
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

import {
	hasStagingAccess,
	initializePermissionStore,
	WAYFARE_WEB_ACCESS,
} from "./permission-store";

beforeEach(() => {
	vi.stubEnv("REQUIRE_ENTUR_LOGIN", "true");
	vi.stubEnv("OMSA_ENV_MODE", "staging");
	vi.stubEnv("ALLOW_DEV_CONFIG_OVERRIDES", "false");
	vi.stubEnv("COOKIE_SECURE", "true");
	vi.stubEnv("CLIENT_ID", "omsa-client");
	vi.stubEnv("CLIENT_SECRET", "omsa-secret");
	vi.stubEnv("PUBLIC_ORIGIN", "https://wayfare.staging.entur.no");
	vi.stubEnv("ENTUR_LOGIN_DOMAIN", "partner.staging.entur.org");
	vi.stubEnv("ENTUR_LOGIN_CLIENT_ID", "login-client");
	vi.stubEnv("ENTUR_LOGIN_CLIENT_SECRET", "login-secret");
	vi.stubEnv(
		"PERMISSION_STORE_URL",
		"http://permission-store.tst.entur.internal",
	);
	vi.stubEnv("MNG_AUTH0_INT_HOST", "https://internal.staging.entur.org");
	vi.stubEnv("MNG_AUTH0_INT_AUDIENCE", "https://permission-store");
	vi.stubEnv("MNG_AUTH0_INT_CLIENT_ID", "permission-client");
	vi.stubEnv("MNG_AUTH0_INT_CLIENT_SECRET", "permission-secret");
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
