import PermissionClient, {
	type AuthoritySubject,
	type AuthorizeCache,
	AuthorizeCacheType,
	type BusinessCapability,
	PermissionDeliverRepository,
	TokenFactory,
} from "@entur-partner/permission-client-node";
import { requirePublishedDeploymentConfig } from "./deployment-config.ts";

export const WAYFARE_WEB_ACCESS: BusinessCapability = {
	operation: "wayfare.web",
	access: "les",
};

let cachePromise: Promise<AuthorizeCache> | undefined;

function getCache(): Promise<AuthorizeCache> {
	cachePromise ??= (async () => {
		const config = requirePublishedDeploymentConfig();
		const tokenFactory = new TokenFactory({
			domain: config.permissionM2mDomain,
			clientId: config.permissionM2mClientId,
			clientSecret: config.permissionM2mClientSecret,
			audience: config.permissionM2mAudience,
		});
		const repository = new PermissionDeliverRepository(
			{ name: "wayfare", refreshRate: 60 },
			tokenFactory,
			config.permissionStoreUrl,
		);
		const cache = await PermissionClient(
			AuthorizeCacheType.IN_MEMORY,
			[WAYFARE_WEB_ACCESS],
			repository,
		);
		cache.setScheduleErrorHandler((error) => {
			console.error("[permission-store] cache refresh failed", error);
		});
		return cache;
	})();
	return cachePromise;
}

export async function initializePermissionStore(): Promise<void> {
	await getCache();
}

// Mirrors JwtDecoder.getAuthoritySubject's own derivation (issuer's first
// hostname label), but without decoding a token: the login gate's session is
// managed by @auth0/auth0-server-js, whose issuer is always this domain.
function authorityFromLoginDomain(loginDomain: string): string {
	return (
		`https://${loginDomain}/`.match(/^(http:\/\/|https:\/\/)(\w*)/)?.[2] ?? ""
	);
}

export async function hasStagingAccess(subject: string): Promise<boolean> {
	const { loginDomain } = requirePublishedDeploymentConfig();
	const authoritySubject: AuthoritySubject = {
		authority: authorityFromLoginDomain(loginDomain),
		subject,
	};
	const cache = await getCache();
	return cache.checkBusinessCapabilityPermission(
		authoritySubject,
		WAYFARE_WEB_ACCESS,
	);
}
