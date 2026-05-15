import type { DevConfigOverrides } from "../lib/dev-config-storage";
import { getRuntimeConfig } from "./runtime-config";

interface OAuthToken {
	accessToken: string;
	tokenType: string;
	expiresAt: number;
	cacheKey: string;
}

let cachedToken: OAuthToken | null = null;

function isExpired(token: OAuthToken): boolean {
	const safetyWindowMs = 5 * 60 * 1000;
	return Date.now() >= token.expiresAt - safetyWindowMs;
}

export async function getAccessToken(
	devConfig?: DevConfigOverrides,
): Promise<string> {
	const runtimeConfig = getRuntimeConfig(devConfig);
	const tokenUrl = runtimeConfig.oauthTokenUrl;
	const clientId = runtimeConfig.clientId;
	const clientSecret = runtimeConfig.clientSecret;
	const audience = runtimeConfig.auth0Audience;
	const cacheKey = `${tokenUrl}|${clientId ?? ""}|${audience ?? ""}`;

	if (
		cachedToken &&
		cachedToken.cacheKey === cacheKey &&
		!isExpired(cachedToken)
	) {
		return `${cachedToken.tokenType} ${cachedToken.accessToken}`;
	}

	if (!tokenUrl || !clientId || !clientSecret) {
		throw new Error(
			`OAuth credentials not configured for ${runtimeConfig.credentialProfile} profile. Set CLIENT_ID_${runtimeConfig.credentialProfile.toUpperCase()} and CLIENT_SECRET_${runtimeConfig.credentialProfile.toUpperCase()}, or fallback CLIENT_ID/CLIENT_SECRET.`,
		);
	}

	const response = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
			...(audience ? { audience } : {}),
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OAuth token request failed (${response.status}): ${text}`);
	}

	const body = await response.json();
	const expiresIn = Number(body.expires_in ?? 3600);

	cachedToken = {
		accessToken: body.access_token,
		tokenType: body.token_type ?? "Bearer",
		expiresAt: Date.now() + expiresIn * 1000,
		cacheKey,
	};

	return `${cachedToken.tokenType} ${cachedToken.accessToken}`;
}
