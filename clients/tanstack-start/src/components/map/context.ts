import type MapLibreGL from "maplibre-gl";
import { createContext, useContext } from "react";

type MapContextValue = {
	map: MapLibreGL.Map | null;
	isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

function useMap() {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMap must be used within a Map component");
	}
	return context;
}

export type { MapContextValue };
export { MapContext, useMap };
