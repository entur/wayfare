import { AdditionalZonesTicketIcon, SearchIcon, UserIcon } from "@entur/icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { useProfile } from "../context/profile";
import ThemeToggle from "./ThemeToggle";
import WayfareWordmark from "./WayfareWordmark";

function NavItem({
	to,
	active,
	icon,
	children,
}: {
	to: string;
	active: boolean;
	icon: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Link
			to={to}
			className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
				active
					? "bg-[var(--wayfare-accent-soft)] text-[var(--wayfare-primary)]"
					: "text-[var(--wayfare-text-secondary)] hover:bg-[var(--wayfare-bg)]"
			}`}
		>
			<span className="flex shrink-0 items-center" aria-hidden="true">
				{icon}
			</span>
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
	const profileActive = isSettingsActive || !!customer;

	const profileIcon = initials ? (
		<span
			className="flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full text-[0.5rem] font-bold"
			style={{ background: "var(--wayfare-primary)", color: "#fff" }}
		>
			{initials}
		</span>
	) : (
		<UserIcon size={16} aria-hidden="true" />
	);

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
					<NavItem
						to="/"
						active={pathname === "/"}
						icon={<SearchIcon size={16} />}
					>
						Search
					</NavItem>
					<NavItem
						to="/tickets"
						active={pathname.startsWith("/tickets")}
						icon={<AdditionalZonesTicketIcon size={16} />}
					>
						Tickets
					</NavItem>
					<Link
						to="/settings"
						search={{ tab: "profile", pendingCardId: undefined }}
						className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
							isSettingsActive
								? "bg-[var(--wayfare-accent-soft)] text-[var(--wayfare-primary)]"
								: `hover:bg-[var(--wayfare-bg)] ${profileActive ? "text-[var(--wayfare-primary)]" : "text-[var(--wayfare-text-secondary)]"}`
						}`}
					>
						<span className="flex shrink-0 items-center" aria-hidden="true">
							{profileIcon}
						</span>
						{customer?.firstName ?? "Profile"}
					</Link>
					<div
						className="mx-1 h-4 w-px self-center"
						style={{ background: "var(--wayfare-line)" }}
						aria-hidden="true"
					/>
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
