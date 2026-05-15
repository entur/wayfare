import { createContext, useContext, useState } from "react";
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
	const [overrides, setOverridesState] = useState<DevConfigOverrides>(
		() => getDevConfigOverrides(),
	);

	function setOverrides(next: DevConfigOverrides) {
		setDevConfigOverrides(next);
		setOverridesState(next);
	}

	function resetOverrides() {
		clearDevConfigOverrides();
		setOverridesState({});
	}

	return (
		<DevConfigContext.Provider value={{ overrides, setOverrides, resetOverrides }}>
			{children}
		</DevConfigContext.Provider>
	);
}

export function useDevConfig() {
	const ctx = useContext(DevConfigContext);
	if (!ctx) throw new Error("useDevConfig must be used within DevConfigProvider");
	return ctx;
}
