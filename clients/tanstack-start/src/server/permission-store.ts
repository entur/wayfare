import PermissionClient, {
	type AuthorizeCache,
	AuthorizeCacheType,
	type BusinessCapability,
	JwtDecoder,
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

export async function hasStagingAccess(idToken: string): Promise<boolean> {
	const authoritySubject = JwtDecoder.getAuthoritySubject(idToken);
	const cache = await getCache();
	return cache.checkBusinessCapabilityPermission(
		authoritySubject,
		WAYFARE_WEB_ACCESS,
	);
}
