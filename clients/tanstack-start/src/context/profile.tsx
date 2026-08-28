import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { getActiveCustomer } from "../server-functions/customers";
import type { OmsaCustomer } from "../types/customer";
import { useDevConfig } from "./dev-config";

interface ProfileContextValue {
	customer: OmsaCustomer | null;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// The "signed-in customer" isn't picked by searching OMSA's customer records
// anymore (that let anyone browse arbitrary customers' PII) -- it's resolved
// from the Entur customer number a tester already knows and enters in
// Developer settings. Clear that field there and every consumer sees a guest.
export function ProfileProvider({ children }: { children: React.ReactNode }) {
	const { overrides } = useDevConfig();
	const customerNumber = overrides.customerNumber;

	const { data } = useQuery({
		queryKey: ["active-customer", customerNumber],
		queryFn: () =>
			getActiveCustomer({ data: { customerNumber: customerNumber as string } }),
		enabled: !!customerNumber,
		staleTime: 60 * 1000,
	});

	const customer = customerNumber ? (data ?? null) : null;

	return (
		<ProfileContext.Provider value={{ customer }}>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const ctx = useContext(ProfileContext);
	if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
	return ctx;
}
