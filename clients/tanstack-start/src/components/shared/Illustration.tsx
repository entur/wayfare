type IllustrationName =
	| "turtle-magnifying-glass"
	| "turtle-food-bowl"
	| "ninja-turtle"
	| "crocodile-on-bus"
	| "octopus-payment-processing"
	| "crab-ticket-expired";

type IllustrationSize = "sm" | "md" | "lg";

const WIDTHS: Record<IllustrationSize, number> = { sm: 96, md: 160, lg: 240 };

const ALT: Record<IllustrationName, string> = {
	"turtle-magnifying-glass": "A turtle inspecting with a magnifying glass",
	"turtle-food-bowl": "A turtle with a food bowl",
	"ninja-turtle": "A ninja turtle in disguise",
	"crocodile-on-bus": "A crocodile riding the bus",
	"octopus-payment-processing": "An octopus processing a payment",
	"crab-ticket-expired": "A crab holding an expired ticket",
};

interface IllustrationProps {
	name: IllustrationName;
	size?: IllustrationSize;
	decorative?: boolean;
	className?: string;
}

export default function Illustration({
	name,
	size = "md",
	decorative = false,
	className,
}: IllustrationProps) {
	const w = WIDTHS[size];
	return (
		<img
			src={`/wayfare-${name}.svg`}
			alt={decorative ? "" : ALT[name]}
			aria-hidden={decorative || undefined}
			width={w}
			style={{ height: "auto" }}
			loading="lazy"
			className={className}
		/>
	);
}
