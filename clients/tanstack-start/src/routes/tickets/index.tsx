import { ValidTicketIcon } from "@entur/icons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import PageShell from "../../components/layout/PageShell";
import TicketCard from "../../components/tickets/TicketCard";
import { getPackages } from "../../lib/ticket-storage";
import type { StoredPackage } from "../../types/documents";

export const Route = createFileRoute("/tickets/")({ component: TicketsPage });

function TicketsPage() {
	const [packages, setPackages] = useState<StoredPackage[]>([]);

	useEffect(() => {
		setPackages(getPackages());
	}, []);

	if (packages.length === 0) {
		return (
			<PageShell title="My tickets" subtitle="Your purchased travel tickets">
				<div className="mt-12 flex flex-col items-center text-center">
					<div
						className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
						style={{ background: "var(--wayfare-accent-soft)" }}
					>
						<ValidTicketIcon
							size="32"
							aria-hidden="true"
							style={{ color: "var(--wayfare-primary)" }}
						/>
					</div>
					<p
						className="text-sm font-medium"
						style={{ color: "var(--wayfare-text)" }}
					>
						No tickets yet
					</p>
					<p
						className="mt-1 text-xs"
						style={{ color: "var(--wayfare-text-secondary)" }}
					>
						Your purchased tickets will appear here.
					</p>
					<Link
						to="/"
						className="mt-4 inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
						style={{ background: "var(--wayfare-primary)", color: "#fff" }}
					>
						Search for tickets
					</Link>
				</div>
			</PageShell>
		);
	}

	return (
		<PageShell
			title="My tickets"
			subtitle={`${packages.length} ticket${packages.length !== 1 ? "s" : ""}`}
		>
			<div className="mx-auto max-w-xl">
				<div className="flex flex-col gap-3">
					{packages.map((pkg) => (
						<TicketCard key={pkg.packageId} pkg={pkg} />
					))}
				</div>
			</div>
		</PageShell>
	);
}
