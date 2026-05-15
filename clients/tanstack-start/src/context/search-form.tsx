import { createContext, useContext, useEffect, useReducer } from "react";
import type { PlaceReference } from "../types/common";

export interface TravelerIndividual {
	id?: string;
	name?: string;
	age?: number;
	customerId?: string;
}

export interface TravelerGroup {
	id: string;
	ageGroup: "ADULT" | "CHILD" | "YOUTH" | "SENIOR" | "INFANT" | "STUDENT" | "MILITARY";
	count: number;
	minAge?: number;
	maxAge?: number;
	individuals?: TravelerIndividual[];
}

export type SearchType = "zone" | "stop" | "trip";

interface SearchFormState {
	from: PlaceReference | null;
	to: PlaceReference | null;
	travelDate: string;
	travelers: TravelerGroup[];
	searchType: SearchType;
}

type Action =
	| { type: "SET_FROM"; payload: PlaceReference | null }
	| { type: "SET_TO"; payload: PlaceReference | null }
	| { type: "SET_TRAVEL_DATE"; payload: string }
	| { type: "SET_TRAVELERS"; payload: TravelerGroup[] }
	| { type: "SET_SEARCH_TYPE"; payload: SearchType };

function todayIsoLocal(): string {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now.toISOString().slice(0, 16);
}

const defaultState: SearchFormState = {
	from: null,
	to: null,
	travelDate: "", // set on client after mount to avoid SSR/hydration mismatch
	travelers: [{ id: "adult", ageGroup: "ADULT", count: 1, minAge: 18 }],
	searchType: "zone",
};

function reducer(state: SearchFormState, action: Action): SearchFormState {
	switch (action.type) {
		case "SET_FROM":
			return { ...state, from: action.payload };
		case "SET_TO":
			return { ...state, to: action.payload };
		case "SET_TRAVEL_DATE":
			return { ...state, travelDate: action.payload };
		case "SET_TRAVELERS":
			return { ...state, travelers: action.payload };
		case "SET_SEARCH_TYPE":
			// Reset locations when switching mode — they're incompatible across types
			return { ...state, searchType: action.payload, from: null, to: null };
		default:
			return state;
	}
}

const SearchFormContext = createContext<{
	state: SearchFormState;
	dispatch: React.Dispatch<Action>;
} | null>(null);

export function SearchFormProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, dispatch] = useReducer(reducer, defaultState);

	// Initialize travelDate on the client to avoid SSR/hydration mismatch
	useEffect(() => {
		if (!state.travelDate) {
			dispatch({ type: "SET_TRAVEL_DATE", payload: todayIsoLocal() });
		}
	}, [state.travelDate]);

	return (
		<SearchFormContext.Provider value={{ state, dispatch }}>
			{children}
		</SearchFormContext.Provider>
	);
}

export function useSearchForm() {
	const ctx = useContext(SearchFormContext);
	if (!ctx)
		throw new Error("useSearchForm must be used within SearchFormProvider");
	return ctx;
}
