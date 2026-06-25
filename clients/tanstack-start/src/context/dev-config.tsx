import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
	clearDevConfigOverrides,
	type DevConfigOverrides,
	getClientFingerprint,
	getDevConfigOverrides,
	setClientFingerprint,
	setDevConfigOverrides,
} from "../lib/dev-config-storage";
import { getResolvedDevConfig } from "../server-functions/dev-config";

interface DevConfigContextValue {
	overrides: DevConfigOverrides;
	setOverrides: (overrides: DevConfigOverrides) => void;
	resetOverrides: () => void;
	/**
	 * Fingerprint of the active OAuth client. Undefined until first resolved.
	 * Consumers that read credential-scoped storage (tickets) should gate on
	 * this being defined so they read from the correct key.
	 */
	clientFingerprint: string | undefined;
}

const DevConfigContext = createContext<DevConfigContextValue | null>(null);

export function DevConfigProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const [overrides, setOverridesState] = useState<DevConfigOverrides>(() =>
		getDevConfigOverrides(),
	);
	const [clientFingerprint, setFingerprintState] = useState<string | undefined>(
		() => getClientFingerprint(getDevConfigOverrides().envMode),
	);
	const prevFingerprint = useRef(clientFingerprint);

	const { data: resolved } = useQuery({
		queryKey: ["resolved-dev-config", overrides.envMode],
		queryFn: () => getResolvedDevConfig(),
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		const fp = resolved?.clientFingerprint;
		if (!fp || fp === clientFingerprint) return;
		setClientFingerprint(overrides.envMode, fp);
		// A change from a previously-known client means we're now a different
		// OMSA caller; drop cached per-package results from the old client.
		if (prevFingerprint.current !== undefined) {
			queryClient.clear();
		}
		prevFingerprint.current = fp;
		setFingerprintState(fp);
	}, [
		resolved?.clientFingerprint,
		overrides.envMode,
		clientFingerprint,
		queryClient,
	]);

	function setOverrides(next: DevConfigOverrides) {
		const cleaned = setDevConfigOverrides(next);
		if (cleaned.envMode !== overrides.envMode) {
			queryClient.clear();
			// Re-read the cached fingerprint for the new env; the query will
			// refresh it shortly after.
			const fp = getClientFingerprint(cleaned.envMode);
			prevFingerprint.current = fp;
			setFingerprintState(fp);
		}
		setOverridesState(cleaned);
	}

	function resetOverrides() {
		if (overrides.envMode !== undefined) {
			queryClient.clear();
		}
		clearDevConfigOverrides();
		const fp = getClientFingerprint(undefined);
		prevFingerprint.current = fp;
		setFingerprintState(fp);
		setOverridesState({});
	}

	return (
		<DevConfigContext.Provider
			value={{ overrides, setOverrides, resetOverrides, clientFingerprint }}
		>
			{children}
		</DevConfigContext.Provider>
	);
}

export function useDevConfig() {
	const ctx = useContext(DevConfigContext);
	if (!ctx)
		throw new Error("useDevConfig must be used within DevConfigProvider");
	return ctx;
}
