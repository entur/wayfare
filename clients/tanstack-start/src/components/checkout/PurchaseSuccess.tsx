import { ValidationSuccessFilledIcon } from "@entur/icons";
import { Link } from "@tanstack/react-router";

interface PurchaseSuccessProps {
	packageId: string;
}

export default function PurchaseSuccess({ packageId }: PurchaseSuccessProps) {
	return (
		<div className="flex flex-col items-center py-12 text-center">
			<div
				className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
				style={{ background: "var(--color-wayfare-accent-soft)" }}
			>
				<ValidationSuccessFilledIcon
					size="32"
					aria-hidden="true"
					style={{ color: "var(--color-wayfare-primary)" }}
				/>
			</div>
			<h2
				className="text-xl font-bold"
				style={{ color: "var(--color-wayfare-text)" }}
			>
				Purchase confirmed!
			</h2>
			<p
				className="mt-2 text-sm"
				style={{ color: "var(--color-wayfare-text-secondary)" }}
			>
				Your ticket is ready. Package ID: <strong>{packageId}</strong>
			</p>
			<div className="mt-6 flex gap-3">
				<Link
					to="/tickets/$packageId"
					params={{ packageId }}
					className="rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
					style={{ background: "var(--color-wayfare-primary)", color: "#fff" }}
				>
					View ticket
				</Link>
				<Link
					to="/"
					className="rounded-xl px-5 py-2.5 text-sm font-semibold no-underline"
					style={{
						background: "var(--color-wayfare-surface-strong)",
						border: "1px solid var(--color-wayfare-line)",
						color: "var(--color-wayfare-text)",
					}}
				>
					Search again
				</Link>
			</div>
		</div>
	);
}
