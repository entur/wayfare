import {
	ValidationErrorIcon,
	ValidationInfoIcon,
	WarningIcon,
} from "@entur/icons";
import { useState } from "react";
import { pickText, severityRank } from "../../lib/situations";
import type {
	PtSituationElement,
	SituationSeverity,
} from "../../types/situations";

type SeverityTier = "info" | "warning" | "error";

function severityTier(
	severity: SituationSeverity | null | undefined,
): SeverityTier {
	const rank = severityRank(severity);
	if (rank >= 4) return "error";
	if (rank >= 3) return "warning";
	return "info";
}

const TIER_STYLES: Record<
	SeverityTier,
	{ border: string; bg: string; text: string; icon: string }
> = {
	info: {
		border: "border-l-wayfare-alert-info-border",
		bg: "bg-wayfare-alert-info-bg",
		text: "text-wayfare-alert-info-text",
		icon: "text-wayfare-alert-info-border",
	},
	warning: {
		border: "border-l-wayfare-alert-warning-border",
		bg: "bg-wayfare-alert-warning-bg",
		text: "text-wayfare-alert-warning-text",
		icon: "text-wayfare-alert-warning-border",
	},
	error: {
		border: "border-l-wayfare-alert-error-border",
		bg: "bg-wayfare-alert-error-bg",
		text: "text-wayfare-alert-error-text",
		icon: "text-wayfare-alert-error-border",
	},
};

function SituationIcon({
	tier,
	className,
}: {
	tier: SeverityTier;
	className?: string;
}) {
	if (tier === "error")
		return <ValidationErrorIcon aria-hidden className={className} />;
	if (tier === "warning")
		return <WarningIcon aria-hidden className={className} />;
	return <ValidationInfoIcon aria-hidden className={className} />;
}

function SituationItem({ situation }: { situation: PtSituationElement }) {
	const [expanded, setExpanded] = useState(false);
	const tier = severityTier(situation.severity);
	const styles = TIER_STYLES[tier];

	const summary = pickText(situation.summary);
	const description = pickText(situation.description);
	const uniqueDescription = description !== summary ? description : undefined;
	const advice = pickText(situation.advice);
	const hasMore = uniqueDescription || advice || situation.infoLinks?.length;

	if (!summary) return null;

	return (
		<div
			className={`rounded-md border-l-4 px-3 py-2 text-sm ${styles.border} ${styles.bg}`}
		>
			<div className="flex items-start gap-2">
				<SituationIcon
					tier={tier}
					className={`mt-0.5 shrink-0 ${styles.icon}`}
				/>
				<div className="flex-1 min-w-0">
					<p className={`font-medium leading-snug ${styles.text}`}>{summary}</p>

					{expanded && (
						<div className={`mt-2 space-y-1.5 ${styles.text} opacity-90`}>
							{uniqueDescription && <p>{uniqueDescription}</p>}
							{advice && <p className="italic">{advice}</p>}
							{situation.infoLinks?.map((link) => (
								<a
									key={link.uri}
									href={link.uri}
									target="_blank"
									rel="noopener noreferrer"
									className="block underline underline-offset-2"
								>
									{link.label ?? link.uri}
								</a>
							))}
						</div>
					)}

					{hasMore && (
						<button
							type="button"
							onClick={() => setExpanded((v) => !v)}
							className={`mt-1 text-xs underline underline-offset-2 ${styles.text} opacity-70 hover:opacity-100`}
						>
							{expanded ? "Show less" : "More info"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

interface Props {
	situations: PtSituationElement[];
}

/**
 * Renders a list of disruption/situation messages.
 * Returns null when the list is empty so callers can drop this in unconditionally.
 */
export default function SituationBanner({ situations }: Props) {
	if (!situations || situations.length === 0) return null;

	return (
		<div className="flex flex-col gap-2">
			{situations.map((s) => (
				<SituationItem key={s.id} situation={s} />
			))}
		</div>
	);
}
