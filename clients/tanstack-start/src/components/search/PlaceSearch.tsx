import {
	BusIcon,
	FerryIcon,
	MapPinIcon,
	PlaneIcon,
	TrainIcon,
	TramIcon,
	ZoneIcon,
} from "@entur/icons";
import { getFareZoneSuggestions } from "../../server-functions/fare-zones";
import { autocompletePlaces } from "../../server-functions/geocoder";
import type { PlaceReference } from "../../types/common";
import type { GeocoderFeature } from "../../types/geocoder";
import Combobox, { type ComboboxOption } from "../ui/Combobox";

function getStopIcon(feature: GeocoderFeature): React.ComponentType {
	const modeKeys = (feature.properties.mode ?? []).flatMap((m) =>
		Object.keys(m),
	);
	if (modeKeys.includes("rail")) return TrainIcon;
	if (modeKeys.includes("metro") || modeKeys.includes("tram")) return TramIcon;
	if (modeKeys.includes("ferry")) return FerryIcon;
	if (modeKeys.includes("air")) return PlaneIcon;
	if (modeKeys.includes("bus")) return BusIcon;
	return MapPinIcon;
}

async function fetchPlaceItems(
	input: string,
	signal: AbortSignal,
): Promise<ComboboxOption<PlaceReference>[]> {
	if (input.trim().length < 2) return [];

	const [stopsResult, zonesResult] = await Promise.allSettled([
		autocompletePlaces({
			data: { text: input, size: 7, lang: "no", layers: "venue" },
			signal,
		}),
		getFareZoneSuggestions({ data: input }),
	]);

	if (signal.aborted) return [];

	const stopOptions: ComboboxOption<PlaceReference>[] =
		stopsResult.status === "fulfilled"
			? stopsResult.value.features.map((feature) => ({
					value: {
						placeId: feature.properties.id,
						name: feature.properties.label,
						type: "stop" as const,
					},
					label: feature.properties.label,
					icon: getStopIcon(feature),
				}))
			: [];

	const zoneOptions: ComboboxOption<PlaceReference>[] =
		zonesResult.status === "fulfilled"
			? zonesResult.value.slice(0, 5).map((zone) => ({
					value: { ...zone, type: "zone" as const },
					label: zone.name ?? zone.placeId,
					icon: ZoneIcon,
				}))
			: [];

	return [...stopOptions, ...zoneOptions];
}

interface PlaceSearchProps {
	label: string;
	value: PlaceReference | null;
	onChange: (place: PlaceReference | null) => void;
	placeholder?: string;
}

export default function PlaceSearch({
	label,
	value,
	onChange,
	placeholder,
}: PlaceSearchProps) {
	const selected = value ? { value, label: value.name ?? value.placeId } : null;

	return (
		<Combobox<PlaceReference>
			label={label}
			selected={selected}
			onChange={(opt) => onChange(opt?.value ?? null)}
			getOptions={fetchPlaceItems}
			placeholder={placeholder ?? "Search for a stop or zone…"}
			debounceMs={350}
			minQueryLength={2}
			noMatchText="No stops or zones found"
		/>
	);
}
