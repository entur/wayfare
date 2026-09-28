// Routes reachable regardless of session state: bypassed server-side in
// access-gate.ts (so auth failures can redirect here without looping back
// through the gate) and rendered outside the app shell in __root.tsx (so the
// nav/footer chrome doesn't imply access the user doesn't have). Both sides
// import this one list so they can't drift out of sync.
export const PUBLIC_PATHNAMES = new Set(["/access-denied"]);
