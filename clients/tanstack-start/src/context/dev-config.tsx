import { createContext, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	clearDevConfigOverrides,
	getDevConfigOverrides,
	setDevConfigOverrides,
	type DevConfigOverrides,
} from "../lib/dev-config-storage";

interface DevConfigContextValue {
	overrides: DevConfigOverrides;
	setOverrides: (overrides: DevConfigOverrides) => void;
	resetOverrides: () => void;
}

const DevConfigContext = createContext<DevConfigContextValue | null>(null);

export function DevConfigProvider({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	const [overrides, setOverridesState] = useState<DevConfigOverrides>(() =>
		getDevConfigOverrides(),
	);

	function setOverrides(next: DevConfigOverrides) {
		const cleaned = setDevConfigOverrides(next);
		if (cleaned.envMode !== overrides.envMode) {
			queryClient.clear();
		}
		setOverridesState(cleaned);
	}

	function resetOverrides() {
		if (overrides.envMode !== undefined) {
			queryClient.clear();
		}
		clearDevConfigOverrides();
		setOverridesState({});
	}

	return (
		<DevConfigContext.Provider
			value={{ overrides, setOverrides, resetOverrides }}
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
