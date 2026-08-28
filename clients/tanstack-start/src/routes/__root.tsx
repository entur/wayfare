import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Link,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";
import PageShell from "../components/layout/PageShell";
import MobileTabBar from "../components/MobileTabBar";
import BackHomeActions from "../components/shared/BackHomeActions";
import IllustratedState from "../components/shared/IllustratedState";
import WayfareWordmark from "../components/WayfareWordmark";
import { DevConfigProvider } from "../context/dev-config";
import { ProfileProvider } from "../context/profile";
import { SearchFormProvider } from "../context/search-form";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import { PUBLIC_PATHNAMES } from "../lib/public-pathnames";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.setAttribute('data-color-mode',resolved);root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Wayfare",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/wayfare-favicon.svg",
				type: "image/svg+xml",
			},
		],
	}),
	notFoundComponent: RouteNotFound,
	errorComponent: RouteError,
	shellComponent: RootDocument,
});

function RouteNotFound() {
	return (
		<PageShell>
			<IllustratedState
				illustration="fox-404"
				illustrationSize="xl"
				title="Page not found"
				description="Check the address, or head back to the start."
				action={<BackHomeActions />}
			/>
		</PageShell>
	);
}

function RouteError({ error }: ErrorComponentProps) {
	console.error("[router] unhandled route error:", error);
	return (
		<PageShell>
			<IllustratedState
				illustration="turtle-magnifying-glass"
				title="Something went wrong"
				description="Try reloading the page. If it keeps happening, let us know."
				action={
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="inline-flex items-center rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white"
					>
						Reload
					</button>
				}
			/>
		</PageShell>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	// Routes that render outside the app shell -- reached by a session that
	// isn't (yet) a logged-in, authorized user, so the nav/footer chrome
	// would imply access the user doesn't have. Shared with the
	// access-gate.ts bypass so the two lists can't drift apart.
	const isStandalone = PUBLIC_PATHNAMES.has(pathname);

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme init script must run inline before render */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere]">
				<TanStackQueryProvider queryClient={queryClient}>
					<DevConfigProvider>
						<ProfileProvider>
							<SearchFormProvider>
								{isStandalone ? (
									<div className="flex h-screen flex-col overflow-y-auto">
										<div className="flex justify-center px-4 py-6 sm:px-6">
											<Link
												to="/"
												className="flex items-center text-wayfare-primary no-underline"
											>
												<WayfareWordmark height={20} />
											</Link>
										</div>
										{children}
									</div>
								) : (
									<div className="flex h-screen flex-col overflow-hidden">
										<Header />
										<div className="mobile-tabbar-pad flex flex-1 flex-col overflow-y-auto">
											<div className="flex flex-1 flex-col">{children}</div>
											<Footer />
										</div>
										<MobileTabBar />
									</div>
								)}
							</SearchFormProvider>
						</ProfileProvider>
					</DevConfigProvider>
					{import.meta.env.DEV && (
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					)}
				</TanStackQueryProvider>
				<Scripts />
			</body>
		</html>
	);
}
