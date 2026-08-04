import { Link } from "@tanstack/react-router";
import { type CSSProperties, useEffect, useState } from "react";
import { accentFor, accentTint } from "../../lib/operator-accent";
import { findOperator } from "../../lib/operators";
import { getPreferredOperator } from "../../lib/preferences-storage";
import OperatorIcon from "../shared/OperatorIcon";

export default function QuickActionsRow() {
	const [operatorCode, setOperatorCode] = useState<string | undefined>();

	useEffect(() => {
		setOperatorCode(getPreferredOperator());
	}, []);

	const operator = findOperator(operatorCode);
	if (!operator?.authorityRef) return null;

	const accent = accentFor(operator.code);

	return (
		<section>
			<h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-wayfare-text-secondary">
				Shortcuts
			</h2>
			<Link
				to="/products"
				className={`flex items-center gap-3 rounded-lg border border-wayfare-line bg-wayfare-surface-strong p-4 pl-5 no-underline transition-colors ${accent ? "brand-rail" : ""}`}
				style={
					accent
						? ({
								"--brand-rail-color": accent,
								background: accentTint(accent, 0.08),
							} as CSSProperties)
						: undefined
				}
			>
				<OperatorIcon operator={operator} />
				<span className="min-w-0 flex-1">
					<span className="block truncate text-sm font-semibold text-wayfare-text">
						{operator.name} products
					</span>
					<span className="block text-xs text-wayfare-text-secondary">
						Passes sold without a route, like city bikes
					</span>
				</span>
				<span
					aria-hidden="true"
					className="shrink-0 text-wayfare-text-secondary"
				>
					›
				</span>
			</Link>
		</section>
	);
}
