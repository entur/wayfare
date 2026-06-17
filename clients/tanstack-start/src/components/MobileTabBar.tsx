import {
	AdditionalZonesTicketIcon,
	MapIcon,
	SearchIcon,
	UserIcon,
} from "@entur/icons";
import { Link, useRouterState } from "@tanstack/react-router";
import { useProfile } from "../context/profile";

const tabClass = (active: boolean) =>
	`flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-medium no-underline transition-colors ${
		active
			? "text-wayfare-primary"
			: "text-wayfare-text-secondary active:text-wayfare-text"
	}`;

export default function MobileTabBar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { customer } = useProfile();
	const settingsActive = pathname === "/settings";

	return (
		<nav
			aria-label="Primary"
			className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-stretch border-t border-wayfare-line bg-wayfare-surface-strong pb-[env(safe-area-inset-bottom)] sm:hidden"
		>
			<Link to="/" className={tabClass(pathname === "/")}>
				<span className="flex items-center" aria-hidden="true">
					<SearchIcon size={20} />
				</span>
				<span>Search</span>
			</Link>
			<Link to="/map" className={tabClass(pathname === "/map")}>
				<span className="flex items-center" aria-hidden="true">
					<MapIcon size={20} />
				</span>
				<span>Map</span>
			</Link>
			<Link to="/tickets" className={tabClass(pathname.startsWith("/tickets"))}>
				<span className="flex items-center" aria-hidden="true">
					<AdditionalZonesTicketIcon size={20} />
				</span>
				<span>Tickets</span>
			</Link>
			<Link
				to="/settings"
				search={{ tab: "profile", pendingCardId: undefined }}
				className={tabClass(settingsActive)}
			>
				<span className="flex items-center" aria-hidden="true">
					<UserIcon size={20} />
				</span>
				<span>{customer?.firstName ?? "Profile"}</span>
			</Link>
		</nav>
	);
}
