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

function permissionStoreIsConfigured(): boolean {
	return Boolean(
		process.env.PERMISSION_STORE_URL &&
			process.env.PERMISSION_M2M_DOMAIN &&
			process.env.PERMISSION_M2M_CLIENT_ID &&
			process.env.PERMISSION_M2M_CLIENT_SECRET &&
			process.env.PERMISSION_M2M_AUDIENCE,
	);
}

let cachePromise: Promise<AuthorizeCache> | undefined;

function getCache(): Promise<AuthorizeCache> {
	cachePromise ??= (async () => {
		const tokenFactory = new TokenFactory({
			domain: process.env.PERMISSION_M2M_DOMAIN as string,
			clientId: process.env.PERMISSION_M2M_CLIENT_ID as string,
			clientSecret: process.env.PERMISSION_M2M_CLIENT_SECRET as string,
			audience: process.env.PERMISSION_M2M_AUDIENCE as string,
		});
		const repository = new PermissionDeliverRepository(
			{ name: "wayfare", refreshRate: 60 },
			tokenFactory,
			new URL(process.env.PERMISSION_STORE_URL as string),
		);
		return PermissionClient(
			AuthorizeCacheType.IN_MEMORY,
			[WAYFARE_WEB_ACCESS],
			repository,
		);
	})();
	return cachePromise;
}

/**
 * Whether the given (already-verified) Entur ID token's subject has been
 * granted WAYFARE_WEB_ACCESS. Returns true unconditionally when
 * Permission Store isn't configured yet — see .env.example — so the login
 * gate alone (any valid Entur/partner identity) still works before the
 * capability is provisioned, rather than hard-failing on a missing URL.
 */
export async function hasStagingAccess(idToken: string): Promise<boolean> {
	if (!permissionStoreIsConfigured()) return true;
	const authoritySubject = JwtDecoder.getAuthoritySubject(idToken);
	const cache = await getCache();
	return cache.checkBusinessCapabilityPermission(
		authoritySubject,
		WAYFARE_WEB_ACCESS,
	);
}
