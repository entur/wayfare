import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const defaultStyles = {
	dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
	light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
};

function getDocumentTheme(): Theme | null {
	if (typeof document === "undefined") return null;
	if (document.documentElement.classList.contains("dark")) return "dark";
	if (document.documentElement.classList.contains("light")) return "light";
	return null;
}

function getSystemTheme(): Theme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function useResolvedTheme(themeProp?: "light" | "dark"): Theme {
	const [detectedTheme, setDetectedTheme] = useState<Theme>(
		() => getDocumentTheme() ?? getSystemTheme(),
	);

	useEffect(() => {
		if (themeProp) return;

		const observer = new MutationObserver(() => {
			const docTheme = getDocumentTheme();
			if (docTheme) {
				setDetectedTheme(docTheme);
			}
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleSystemChange = (e: MediaQueryListEvent) => {
			if (!getDocumentTheme()) {
				setDetectedTheme(e.matches ? "dark" : "light");
			}
		};
		mediaQuery.addEventListener("change", handleSystemChange);

		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener("change", handleSystemChange);
		};
	}, [themeProp]);

	return themeProp ?? detectedTheme;
}

export type { Theme };
export { defaultStyles, useResolvedTheme };
