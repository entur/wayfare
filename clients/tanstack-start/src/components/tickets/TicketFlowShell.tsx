import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { PackageItem } from "../../types/documents";
import PageShell from "../layout/PageShell";

/** One line identifying the ticket, for the header of a flow screen. */
export function ticketContext(
	item: PackageItem | undefined,
): string | undefined {
	const from = item?.properties?.from?.name;
	const to = item?.properties?.to?.name;
	if (from && to) return `${from} – ${to}`;
	return item?.offers?.[0]?.properties?.products?.[0]?.productName;
}

interface TicketFlowShellProps {
	packageId: string;
	title: string;
	/** One line naming the ticket being changed, e.g. "Oslo S – Lillestrøm". */
	context?: string;
	children: ReactNode;
}

export default function TicketFlowShell({
	packageId,
	title,
	context,
	children,
}: TicketFlowShellProps) {
	return (
		<PageShell>
			<div className="mx-auto w-full max-w-lg">
				<div className="mb-6">
					<Link
						to="/tickets/$packageId"
						params={{ packageId }}
						className="inline-block text-sm font-medium text-wayfare-text-secondary no-underline"
					>
						← Ticket details
					</Link>
				</div>
				<h1 className="m-0 text-2xl font-bold text-wayfare-text">{title}</h1>
				{context && (
					<p className="m-0 mt-1 text-sm text-wayfare-text-secondary">
						{context}
					</p>
				)}
				<div className="mt-6 flex flex-col gap-4">{children}</div>
			</div>
		</PageShell>
	);
}
