export interface PublishedDeploymentConfig {
	publicOrigin: URL;
	loginDomain: string;
	loginClientId: string;
	loginClientSecret: string;
	permissionStoreUrl: URL;
	permissionM2mDomain: string;
	permissionM2mAudience: string;
	permissionM2mClientId: string;
	permissionM2mClientSecret: string;
}

const PUBLIC_ORIGIN_BY_MODE: Record<string, string> = {
	dev: "https://wayfare.dev.entur.no",
	staging: "https://wayfare.staging.entur.no",
};

function isTrue(value: string | undefined): boolean {
	return value?.trim().toLowerCase() === "true";
}

export function isEnturLoginRequired(
	env: NodeJS.ProcessEnv = process.env,
): boolean {
	return isTrue(env.REQUIRE_ENTUR_LOGIN);
}

function requireValue(
	env: NodeJS.ProcessEnv,
	name: string,
	errors: string[],
): string {
	const value = env[name]?.trim();
	if (!value) errors.push(`${name} must be set`);
	return value ?? "";
}

function parseUrl(
	name: string,
	value: string,
	errors: string[],
	allowedProtocols: string[],
): URL {
	try {
		const parsed = new URL(value);
		if (!allowedProtocols.includes(parsed.protocol)) {
			errors.push(`${name} must use ${allowedProtocols.join(" or ")}`);
		}
		if (parsed.username || parsed.password) {
			errors.push(`${name} must not include credentials`);
		}
		return parsed;
	} catch {
		errors.push(`${name} must be a valid URL`);
		return new URL("https://invalid.example");
	}
}

export function validatePublishedDeploymentConfig(
	env: NodeJS.ProcessEnv = process.env,
): PublishedDeploymentConfig | null {
	if (!isEnturLoginRequired(env)) return null;

	const errors: string[] = [];
	const mode = env.OMSA_ENV_MODE?.trim().toLowerCase();
	const expectedOrigin = mode ? PUBLIC_ORIGIN_BY_MODE[mode] : undefined;
	if (!expectedOrigin) {
		errors.push(
			`OMSA_ENV_MODE must be one of: ${Object.keys(PUBLIC_ORIGIN_BY_MODE).join(", ")}`,
		);
	}
	if (env.ALLOW_DEV_CONFIG_OVERRIDES?.trim().toLowerCase() !== "false") {
		errors.push("ALLOW_DEV_CONFIG_OVERRIDES must be false");
	}
	if (!isTrue(env.COOKIE_SECURE)) {
		errors.push("COOKIE_SECURE must be true");
	}

	requireValue(env, "CLIENT_ID", errors);
	requireValue(env, "CLIENT_SECRET", errors);

	const publicOriginValue = requireValue(env, "PUBLIC_ORIGIN", errors);
	const publicOrigin = parseUrl("PUBLIC_ORIGIN", publicOriginValue, errors, [
		"https:",
	]);
	if (expectedOrigin && publicOrigin.origin !== expectedOrigin) {
		errors.push(`PUBLIC_ORIGIN must be ${expectedOrigin}`);
	}
	if (
		publicOrigin.pathname !== "/" ||
		publicOrigin.search ||
		publicOrigin.hash
	) {
		errors.push("PUBLIC_ORIGIN must contain only scheme and host");
	}

	const loginDomain = requireValue(env, "ENTUR_LOGIN_DOMAIN", errors);
	if (
		loginDomain.includes("://") ||
		loginDomain.includes("/") ||
		loginDomain.includes("?") ||
		loginDomain.includes("#")
	) {
		errors.push("ENTUR_LOGIN_DOMAIN must be a hostname without scheme or path");
	}

	const permissionStoreUrlValue = requireValue(
		env,
		"PERMISSION_STORE_URL",
		errors,
	);
	const permissionStoreUrl = parseUrl(
		"PERMISSION_STORE_URL",
		permissionStoreUrlValue,
		errors,
		["http:", "https:"],
	);

	const config: PublishedDeploymentConfig = {
		publicOrigin: new URL(publicOrigin.origin),
		loginDomain,
		loginClientId: requireValue(env, "ENTUR_LOGIN_CLIENT_ID", errors),
		loginClientSecret: requireValue(env, "ENTUR_LOGIN_CLIENT_SECRET", errors),
		permissionStoreUrl,
		permissionM2mDomain: requireValue(env, "MNG_AUTH0_INT_HOST", errors),
		permissionM2mAudience: requireValue(env, "MNG_AUTH0_INT_AUDIENCE", errors),
		permissionM2mClientId: requireValue(env, "MNG_AUTH0_INT_CLIENT_ID", errors),
		permissionM2mClientSecret: requireValue(
			env,
			"MNG_AUTH0_INT_CLIENT_SECRET",
			errors,
		),
	};

	if (errors.length > 0) {
		throw new Error(
			`Invalid published deployment configuration:\n- ${errors.join("\n- ")}`,
		);
	}
	return config;
}

export function requirePublishedDeploymentConfig(): PublishedDeploymentConfig {
	const config = validatePublishedDeploymentConfig();
	if (!config) {
		throw new Error(
			"Published deployment configuration was requested while REQUIRE_ENTUR_LOGIN is disabled",
		);
	}
	return config;
}
