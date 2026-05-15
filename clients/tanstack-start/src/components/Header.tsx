import { UserIcon } from "@entur/icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { useProfile } from "../context/profile";
import ThemeToggle from "./ThemeToggle";
import WayfareWordmark from "./WayfareWordmark";

function NavItem({
	to,
	active,
	children,
}: {
	to: string;
	active: boolean;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			className="rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-colors"
			style={{
				color: active
					? "var(--wayfare-primary)"
					: "var(--wayfare-text-secondary)",
				background: active ? "var(--wayfare-accent-soft)" : "transparent",
			}}
		>
			{children}
		</Link>
	);
}

export default function Header() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { customer } = useProfile();

	const initials = customer
		? [customer.firstName?.[0], customer.lastName?.[0]].filter(Boolean).join("")
		: null;

	const isSettingsActive = pathname === "/settings";

	return (
		<header
			className="sticky top-0 z-50 border-b backdrop-blur-lg"
			style={{
				borderColor: "var(--wayfare-line)",
				backgroundColor: "var(--wayfare-header-bg)",
			}}
		>
			<nav className="page-wrap flex items-center gap-4 px-4 py-3 sm:py-4">
				<Link
					to="/"
					className="flex items-center no-underline"
					style={{ color: "var(--wayfare-primary)" }}
				>
					<WayfareWordmark height={16} />
				</Link>

				<div className="ml-auto flex items-center gap-1">
					<NavItem to="/" active={pathname === "/"}>
						Search
					</NavItem>
					<NavItem to="/tickets" active={pathname.startsWith("/tickets")}>
						Tickets
					</NavItem>
					<Link
						to="/settings"
						aria-label="Settings"
						className="flex items-center justify-center rounded-full p-1 no-underline transition-colors"
						style={{
							color:
								isSettingsActive || customer
									? "var(--wayfare-primary)"
									: "var(--wayfare-text-secondary)",
							background: isSettingsActive
								? "var(--wayfare-accent-soft)"
								: "transparent",
						}}
					>
						{initials ? (
							<span
								className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
								style={{ background: "var(--wayfare-primary)", color: "#fff" }}
							>
								{initials}
							</span>
						) : (
							<span className="flex h-7 w-7 items-center justify-center">
								<UserIcon aria-hidden="true" />
							</span>
						)}
					</Link>
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
