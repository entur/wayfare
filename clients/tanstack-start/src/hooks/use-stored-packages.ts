import { useCallback, useEffect, useState } from "react";
import { useDevConfig } from "../context/dev-config";
import { getPackages } from "../lib/ticket-storage";
import type { StoredPackage } from "../types/documents";

const NONE: StoredPackage[] = [];

/**
 * Locally stored packages for the active env, OAuth client and customer.
 * Returns an empty list until the active client's fingerprint is known.
 */
export function useStoredPackages(customerKey: string | null) {
	const { overrides, clientFingerprint } = useDevConfig();
	const scope =
		clientFingerprint === undefined
			? null
			: [
					overrides.envMode,
					overrides.customerNumber,
					clientFingerprint,
					customerKey,
				].join("|");
	const [stored, setStored] = useState<{
		scope: string | null;
		packages: StoredPackage[];
	}>({ scope: null, packages: NONE });

	useEffect(() => {
		if (scope !== null) setStored({ scope, packages: getPackages() });
	}, [scope]);

	const reload = useCallback(() => {
		if (scope !== null) setStored({ scope, packages: getPackages() });
	}, [scope]);

	// After an env or client switch, the list read by the effect still belongs
	// to the old scope for one render. Querying with it would fetch the old
	// env's package IDs against the new env.
	return [stored.scope === scope ? stored.packages : NONE, reload] as const;
}
