import { createFileRoute } from "@tanstack/react-router";
import PageShell from "../components/layout/PageShell";
import BackHomeActions from "../components/shared/BackHomeActions";
import IllustratedState from "../components/shared/IllustratedState";

// Reached via a server-side redirect from access-gate.ts/entur-login.ts, so
// it must render without requiring a session with wayfare.web access -- see
// the PUBLIC_PATHNAMES bypass in access-gate.ts.
export const Route = createFileRoute("/access-denied")({
	validateSearch: (search: Record<string, unknown>) => ({
		reason: search.reason === "login-failed" ? "login-failed" : "no-access",
	}),
	component: AccessDeniedPage,
});

function AccessDeniedPage() {
	const { reason } = Route.useSearch();

	if (reason === "login-failed") {
		return (
			<PageShell>
				<IllustratedState
					illustration="turtle-magnifying-glass"
					title="Something went wrong signing you in"
					description="Please try signing in again."
					action={
						<a
							href="/auth/login"
							className="inline-flex items-center rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white"
						>
							Try again
						</a>
					}
				/>
			</PageShell>
		);
	}

	return (
		<PageShell>
			<IllustratedState
				illustration="raccoon-403"
				illustrationSize="xl"
				title="Your Entur account doesn't have access to Wayfare"
				description="Contact Team Selgerintegrasjoner if you think this is a mistake."
				action={<BackHomeActions />}
			/>
		</PageShell>
	);
}
