import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import type { PlaceReference } from "../types/common";

export interface TravelerIndividual {
	id?: string;
	name?: string;
	age?: number;
	customerId?: string;
}

export interface TravelerGroup {
	id: string;
	ageGroup:
		| "ADULT"
		| "CHILD"
		| "YOUTH"
		| "SENIOR"
		| "INFANT"
		| "STUDENT"
		| "MILITARY";
	count: number;
	minAge?: number;
	maxAge?: number;
	individuals?: TravelerIndividual[];
}

export type TimeMode = "now" | "depart" | "arrive";

interface SearchFormState {
	from: PlaceReference | null;
	to: PlaceReference | null;
	travelDate: string;
	timeMode: TimeMode;
	travelers: TravelerGroup[];
}

type Action =
	| { type: "RESTORE"; payload: SearchFormState }
	| { type: "SET_FROM"; payload: PlaceReference | null }
	| { type: "SET_TO"; payload: PlaceReference | null }
	| { type: "SET_TRAVEL_DATE"; payload: string }
	| { type: "SET_TIME_MODE"; payload: TimeMode }
	| { type: "SET_TRAVELERS"; payload: TravelerGroup[] };

function todayIsoLocal(): string {
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	return now.toISOString().slice(0, 16);
}

const defaultState: SearchFormState = {
	from: null,
	to: null,
	travelDate: "", // set on client after mount to avoid SSR/hydration mismatch
	timeMode: "depart",
	travelers: [{ id: "adult", ageGroup: "ADULT", count: 1, minAge: 18 }],
};

function reducer(state: SearchFormState, action: Action): SearchFormState {
	switch (action.type) {
		case "RESTORE":
			return action.payload;
		case "SET_FROM":
			return { ...state, from: action.payload };
		case "SET_TO":
			return { ...state, to: action.payload };
		case "SET_TRAVEL_DATE":
			return { ...state, travelDate: action.payload };
		case "SET_TIME_MODE":
			return { ...state, timeMode: action.payload };
		case "SET_TRAVELERS":
			return { ...state, travelers: action.payload };
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
	const [restored, setRestored] = useState(false);

	useEffect(() => {
		try {
			const saved = window.sessionStorage.getItem("searchForm");
			if (saved) {
				const parsed = JSON.parse(saved) as SearchFormState;
				if (Array.isArray(parsed.travelers)) {
					dispatch({ type: "RESTORE", payload: parsed });
				}
			}
		} catch {
			// Ignore an unavailable or invalid saved form.
		}
		setRestored(true);
	}, []);

	useEffect(() => {
		if (!restored) return;
		try {
			window.sessionStorage.setItem("searchForm", JSON.stringify(state));
		} catch {
			// Searching still works when session storage is unavailable.
		}
	}, [restored, state]);

	// Initialize travelDate on the client to avoid SSR/hydration mismatch
	useEffect(() => {
		if (restored && !state.travelDate) {
			dispatch({ type: "SET_TRAVEL_DATE", payload: todayIsoLocal() });
		}
	}, [restored, state.travelDate]);

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
