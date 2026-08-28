import Illustration from "./Illustration";

type IllustrationName = React.ComponentProps<typeof Illustration>["name"];

type IllustrationSize = React.ComponentProps<typeof Illustration>["size"];

interface IllustratedStateProps {
	illustration?: IllustrationName;
	illustrationSize?: IllustrationSize;
	title: string;
	description?: string;
	action?: React.ReactNode;
}

// Full-page counterpart to EmptyState: a hero illustration plus title,
// description and an optional action, for standalone states like an
// unmatched route, a thrown render error, or an auth failure.
export default function IllustratedState({
	illustration,
	illustrationSize = "lg",
	title,
	description,
	action,
}: IllustratedStateProps) {
	return (
		<div className="flex flex-col items-center py-12 text-center">
			{illustration && (
				<Illustration
					name={illustration}
					size={illustrationSize}
					decorative
					className="mb-6"
				/>
			)}
			<p className="text-lg font-bold text-wayfare-text">{title}</p>
			{description && (
				<p className="mt-1 max-w-sm text-sm text-wayfare-text-secondary">
					{description}
				</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
