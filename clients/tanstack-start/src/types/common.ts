export interface PlaceReference {
	placeId: string;
	name?: string;
	type?: "zone" | "stop";
	/** [longitude, latitude] — populated for stops from geocoder results */
	coordinates?: [number, number];
}

export interface AmountOfMoney {
	amount: number;
	currencyCode?: string;
}

export interface Link {
	href: string;
	rel: string;
	type?: string;
	title?: string;
}
