import { ValidationSuccessFilledIcon } from "@entur/icons";
import { Link } from "@tanstack/react-router";

interface PurchaseSuccessProps {
	packageId: string;
}

export default function PurchaseSuccess({ packageId }: PurchaseSuccessProps) {
	return (
		<div className="flex flex-col items-center py-12 text-center">
			<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wayfare-accent-soft">
				<ValidationSuccessFilledIcon
					size="32"
					aria-hidden="true"
					className="text-wayfare-primary"
				/>
			</div>
			<h2 className="text-xl font-bold text-wayfare-text">
				Purchase confirmed!
			</h2>
			<p className="mt-2 text-sm text-wayfare-text-secondary">
				Your ticket is ready. Package ID: <strong>{packageId}</strong>
			</p>
			<div className="mt-6 flex gap-3">
				<Link
					to="/tickets/$packageId"
					params={{ packageId }}
					className="rounded-xl bg-wayfare-primary px-5 py-2.5 text-sm font-semibold text-white no-underline"
				>
					View ticket
				</Link>
				<Link
					to="/"
					className="rounded-xl border border-wayfare-line bg-wayfare-surface-strong px-5 py-2.5 text-sm font-semibold text-wayfare-text no-underline"
				>
					Search again
				</Link>
			</div>
		</div>
	);
}
