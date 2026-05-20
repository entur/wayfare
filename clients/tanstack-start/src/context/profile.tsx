import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDevConfig } from "./dev-config";
import {
	clearStoredCustomer,
	getStoredCustomer,
	storeCustomer,
} from "../lib/profile-storage";
import type { OmsaCustomer } from "../types/customer";

interface ProfileContextValue {
	customer: OmsaCustomer | null;
	signIn: (customer: OmsaCustomer) => void;
	signOut: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
	const { overrides } = useDevConfig();
	const [customer, setCustomer] = useState<OmsaCustomer | null>(null);
	const prevEnvMode = useRef(overrides.envMode);

	useEffect(() => {
		setCustomer(getStoredCustomer());
	}, []);

	useEffect(() => {
		if (prevEnvMode.current === overrides.envMode) return;
		prevEnvMode.current = overrides.envMode;
		clearStoredCustomer();
		setCustomer(null);
	}, [overrides.envMode]);

	const signIn = useCallback((c: OmsaCustomer) => {
		storeCustomer(c);
		setCustomer(c);
	}, []);

	const signOut = useCallback(() => {
		clearStoredCustomer();
		setCustomer(null);
	}, []);

	return (
		<ProfileContext.Provider value={{ customer, signIn, signOut }}>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const ctx = useContext(ProfileContext);
	if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
	return ctx;
}
