// Authorization on top of Entur login: being a valid Entur/partner identity
// (see entur-login.ts) proves who you are, not that you're allowed into this
// deployment. That's a separate Permission Store business capability,
// checked via the real Node client — mirrors how entur/data-portal and
// several other Entur GKE frontends wire the same package.
import PermissionClient, {
	type AuthorizeCache,
	AuthorizeCacheType,
	type BusinessCapability,
	JwtDecoder,
	PermissionDeliverRepository,
	TokenFactory,
} from "@entur-partner/permission-client-node";
import { requirePublishedDeploymentConfig } from "./deployment-config.ts";

/**
 * The capability that gates this deployment. Declaring it here and passing
 * it into PermissionClient() below is also how it gets registered with
 * Permission Store — the client self-registers its declared permissions on
 * startup. After the first deploy, someone needs to restrict it to Entur in
 * the Permission Admin UI (new capabilities default to open to every
 * organisation) and attach it to a role that specific employee accounts get
 * assigned to.
 */
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

/**
 * Whether the given (already-verified) Entur ID token's subject has been
 * granted WAYFARE_WEB_ACCESS. Startup initializes the client before the
 * server listens, so missing configuration or an unavailable initial cache
 * can never turn this check into an allow-all fallback.
 */
export async function hasStagingAccess(idToken: string): Promise<boolean> {
	const authoritySubject = JwtDecoder.getAuthoritySubject(idToken);
	const cache = await getCache();
	return cache.checkBusinessCapabilityPermission(
		authoritySubject,
		WAYFARE_WEB_ACCESS,
	);
}
