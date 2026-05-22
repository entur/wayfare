import { StarredIcon, UnstarredIcon } from "@entur/icons";
import { useState } from "react";
import {
	addFavorite,
	isFavorite,
	removeFavorite,
} from "../../lib/favorites-storage";
import type { PlaceReference } from "../../types/common";

interface FavoriteToggleProps {
	from: PlaceReference;
	to: PlaceReference;
	variant?: "icon" | "text";
}

export default function FavoriteToggle({
	from,
	to,
	variant = "icon",
}: FavoriteToggleProps) {
	const [favorite, setFavorite] = useState(() => isFavorite(from, to));

	function toggle() {
		if (favorite) {
			removeFavorite(favorite.id);
			setFavorite(undefined);
		} else {
			const entry = addFavorite(from, to);
			setFavorite(entry);
		}
	}

	if (variant === "text") {
		return (
			<button
				type="button"
				onClick={toggle}
				className={`flex cursor-pointer items-center gap-1 text-xs transition-opacity hover:opacity-70 focus:outline-none ${favorite ? "text-wayfare-primary" : "text-wayfare-text-secondary"}`}
			>
				{favorite ? (
					<StarredIcon aria-hidden="true" />
				) : (
					<UnstarredIcon aria-hidden="true" />
				)}
				{favorite ? "Saved" : "Save route"}
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={favorite ? "Remove from favorites" : "Save as favorite"}
			className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-wayfare-primary/30 ${
				favorite
					? "border-wayfare-primary bg-wayfare-primary/10 text-wayfare-primary"
					: "border-wayfare-line bg-wayfare-surface-strong text-wayfare-text-secondary"
			}`}
		>
			{favorite ? (
				<StarredIcon aria-hidden="true" />
			) : (
				<UnstarredIcon aria-hidden="true" />
			)}
		</button>
	);
}
