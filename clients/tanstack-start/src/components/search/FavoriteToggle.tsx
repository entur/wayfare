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
}

export default function FavoriteToggle({ from, to }: FavoriteToggleProps) {
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

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={favorite ? "Remove from favorites" : "Save as favorite"}
			className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors focus:outline-none focus:ring-2"
			style={{
				borderColor: favorite
					? "var(--wayfare-primary)"
					: "var(--wayfare-line)",
				background: favorite
					? "color-mix(in srgb, var(--wayfare-primary) 10%, transparent)"
					: "var(--wayfare-surface-strong)",
				color: favorite
					? "var(--wayfare-primary)"
					: "var(--wayfare-text-secondary)",
				// @ts-expect-error - css custom prop
				"--tw-ring-color":
					"color-mix(in srgb, var(--wayfare-primary) 30%, transparent)",
			}}
		>
			{favorite ? (
				<StarredIcon aria-hidden="true" />
			) : (
				<UnstarredIcon aria-hidden="true" />
			)}
		</button>
	);
}
