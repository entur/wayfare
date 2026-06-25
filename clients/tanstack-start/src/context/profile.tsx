import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	clearStoredCustomer,
	getStoredCustomer,
	storeCustomer,
} from "../lib/profile-storage";
import type { OmsaCustomer } from "../types/customer";
import { useDevConfig } from "./dev-config";

interface ProfileContextValue {
	customer: OmsaCustomer | null;
	signIn: (customer: OmsaCustomer) => void;
	signOut: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
	const { overrides, clientFingerprint } = useDevConfig();
	const [customer, setCustomer] = useState<OmsaCustomer | null>(null);
	const prevEnvMode = useRef(overrides.envMode);
	const prevFingerprint = useRef(clientFingerprint);

	useEffect(() => {
		setCustomer(getStoredCustomer());
	}, []);

	useEffect(() => {
		if (prevEnvMode.current === overrides.envMode) return;
		prevEnvMode.current = overrides.envMode;
		clearStoredCustomer();
		setCustomer(null);
	}, [overrides.envMode]);

	// A customer created under the old OAuth client may be invisible to a new
	// one, so isolate the signed-in customer per credential too. Only clear on a
	// real switch (a defined fingerprint changing), not the first resolve.
	useEffect(() => {
		if (prevFingerprint.current === clientFingerprint) return;
		const hadFingerprint = prevFingerprint.current !== undefined;
		prevFingerprint.current = clientFingerprint;
		if (!hadFingerprint) return;
		clearStoredCustomer();
		setCustomer(null);
	}, [clientFingerprint]);

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
