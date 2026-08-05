import { getPreferredOperator } from "../../lib/preferences-storage";
import { getFareZoneSuggestions } from "../../server-functions/fare-zones";
import type { PlaceReference } from "../../types/common";
import Combobox, { type ComboboxOption } from "../ui/Combobox";

async function fetchZoneItems(
	input: string,
	signal: AbortSignal,
): Promise<ComboboxOption<PlaceReference>[]> {
	if (!input.trim() || signal.aborted) return [];
	const zones = await getFareZoneSuggestions({
		data: { query: input, preferredOperator: getPreferredOperator() },
	});
	if (signal.aborted) return [];
	return zones.map((zone) => ({
		value: zone,
		label: zone.name ?? zone.placeId,
	}));
}

interface ZoneSearchProps {
	label: string;
	value: PlaceReference | null;
	onChange: (place: PlaceReference | null) => void;
	placeholder?: string;
}

export default function ZoneSearch({
	label,
	value,
	onChange,
	placeholder,
}: ZoneSearchProps) {
	const selected = value ? { value, label: value.name ?? value.placeId } : null;

	return (
		<Combobox<PlaceReference>
			label={label}
			selected={selected}
			onChange={(opt) => onChange(opt?.value ?? null)}
			getOptions={fetchZoneItems}
			placeholder={placeholder ?? "Search for a zone…"}
			debounceMs={0}
			minQueryLength={1}
			noMatchText="No zones found"
		/>
	);
}
