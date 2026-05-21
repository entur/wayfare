export interface PlaceReference {
	placeId: string;
	name?: string;
	type?: "zone" | "stop";
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
