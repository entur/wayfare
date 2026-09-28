function shortHash(input: string): string {
	let hash = 5381;
	for (let i = 0; i < input.length; i++) {
		hash = (hash * 33) ^ input.charCodeAt(i);
	}
	return (hash >>> 0).toString(36);
}

/**
 * Storage-key segment for the configured dev-config customer number, or
 * undefined when none is set. Used to scope per-customer client-side data
 * (tickets) so a configured test customer doesn't see another one's
 * purchases. Hashed so the key carries no customer details.
 */
export function getCustomerStorageSegment(
	customerNumber: string | undefined,
): string | undefined {
	return customerNumber ? `c${shortHash(customerNumber)}` : undefined;
}
