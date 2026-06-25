/**
 * Detect an OMSA "package not found" error on the client. OMSA returns this when
 * a packageId refers to a package not visible to the current OAuth caller (e.g.
 * a stale ticket purchased under different credentials).
 *
 * Errors thrown by omsa-client cross the server-function boundary and lose their
 * class identity, so detection is by the serialized message shape, not
 * `instanceof`. The message looks like:
 *   `OMSA GET /collections/packages/items/X failed (404): {"code":"PACKAGE_NOT_FOUND",...}`
 */
export function isPackageNotFound(error: unknown): boolean {
	const msg = error instanceof Error ? error.message : String(error ?? "");
	return /\(404\)/.test(msg) && /PACKAGE_NOT_FOUND/.test(msg);
}
