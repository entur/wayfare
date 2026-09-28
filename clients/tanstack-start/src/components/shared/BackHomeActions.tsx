import { HomeIcon, LeftArrowIcon } from "@entur/icons";
import { Link, useRouter } from "@tanstack/react-router";

// Paired actions for a full-page dead end (404/403): retrace the user's
// steps, or bail out to the app's start page.
export default function BackHomeActions() {
	const router = useRouter();

	return (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={() => router.history.back()}
				className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-wayfare-line bg-transparent px-5 py-2.5 text-sm font-semibold text-wayfare-text transition-colors hover:bg-wayfare-bg"
			>
				<LeftArrowIcon aria-hidden="true" />
				Back
			</button>
			<Link
				to="/"
				className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white no-underline"
			>
				<HomeIcon aria-hidden="true" />
				Home
			</Link>
		</div>
	);
}
