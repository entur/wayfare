import type MapLibreGL from "maplibre-gl";
import { useEffect, useState } from "react";

export const STOP_ICON_MODES = [
	"bus",
	"metro",
	"tram",
	"ferry",
	"rail",
	"air",
	"coach",
] as const;

export type StopIconMode = (typeof STOP_ICON_MODES)[number];

// White SVG path content for each mode, extracted from @entur/icons (16x16 viewBox)
const MODE_ICON_PATHS: Record<StopIconMode, string> = {
	bus: `<g fill="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M10.5 11.8a1 1 0 1 1 1.998.003A1 1 0 0 1 10.5 11.8"/><path d="m14.996 9.595-.7-4.296A.35.35 0 0 0 13.95 5H1.7c-.35 0-.7.358-.7.717v4.925c0 .178.128.358.3.358h1.547c.236-.719.906-1.2 1.703-1.2s1.468.481 1.703 1.2h3.544c.236-.719.906-1.2 1.703-1.2s1.467.481 1.703 1.2h1.447c.193 0 .35-.161.35-.358v-.988q0-.03-.004-.06m-2.84-2.805c0-.198.158-.358.35-.358h1.087a.35.35 0 0 1 .347.311l.185 1.432a.36.36 0 0 1-.085.282.34.34 0 0 1-.262.122h-1.272a.354.354 0 0 1-.35-.358zm-4.2 0c0-.198.157-.358.35-.358h2.8c.193 0 .35.16.35.358V8.22a.354.354 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358zm-4.2 0c0-.198.157-.358.35-.358h2.8c.194 0 .351.16.351.358V8.22a.355.355 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358zm-2.1 0c0-.198.158-.358.35-.358h.701c.193 0 .349.16.349.358V8.22a.353.353 0 0 1-.349.358h-.7a.354.354 0 0 1-.35-.358z"/><path d="M3.55 11.8c0-.551.449-1 1-1s1 .449 1 1a1 1 0 0 1-2 0"/></g>`,
	coach: `<g fill="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M10.5 11.8a1 1 0 1 1 1.998.003A1 1 0 0 1 10.5 11.8"/><path d="m14.996 9.595-.7-4.296A.35.35 0 0 0 13.95 5H1.7c-.35 0-.7.358-.7.717v4.925c0 .178.128.358.3.358h1.547c.236-.719.906-1.2 1.703-1.2s1.468.481 1.703 1.2h3.544c.236-.719.906-1.2 1.703-1.2s1.467.481 1.703 1.2h1.447c.193 0 .35-.161.35-.358v-.988q0-.03-.004-.06m-2.84-2.805c0-.198.158-.358.35-.358h1.087a.35.35 0 0 1 .347.311l.185 1.432a.36.36 0 0 1-.085.282.34.34 0 0 1-.262.122h-1.272a.354.354 0 0 1-.35-.358zm-4.2 0c0-.198.157-.358.35-.358h2.8c.193 0 .35.16.35.358V8.22a.354.354 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358zm-4.2 0c0-.198.157-.358.35-.358h2.8c.194 0 .351.16.351.358V8.22a.355.355 0 0 1-.35.358h-2.8a.354.354 0 0 1-.35-.358zm-2.1 0c0-.198.158-.358.35-.358h.701c.193 0 .349.16.349.358V8.22a.353.353 0 0 1-.349.358h-.7a.354.354 0 0 1-.35-.358z"/><path d="M3.55 11.8c0-.551.449-1 1-1s1 .449 1 1a1 1 0 0 1-2 0"/></g>`,
	rail: `<path fill="white" fill-rule="evenodd" d="M1 12H14V13H1z" clip-rule="evenodd"/><path fill="white" d="M14.75 8.1a.6.6 0 0 0-.091-.11l-.035-.036-.093-.095c-.315-.314-2.34-1.805-3.436-2.528-.358-.236-.76-.331-.999-.331h-3.54l1.295-.89c.1-.076.149-.134.149-.256a.33.33 0 0 0-.142-.276L6.364 2.399H5.4l1.702 1.434-1.7 1.166h.001H1v6h12.612c.196 0 .38-.098.488-.263.49-.755.9-1.41.9-1.902 0-.277-.095-.529-.25-.735m-2.537-.508c-.046.136-.173.172-.317.172h-.666c-.071 0-.185.01-.284-.063l-.95-.671a.332.332 0 0 1 .2-.599h.666c.072 0 .142.024.2.068l1.034.778c.115.086.162.18.117.315"/>`,
	tram: `<path fill="white" fill-rule="evenodd" d="M14.062 5.272a.35.35 0 0 0-.341-.273H8.566l1.289-.89c.1-.075.149-.133.149-.255a.33.33 0 0 0-.142-.276L8.368 2.399h-.964l1.701 1.434-1.7 1.166H2.28a.35.35 0 0 0-.341.273L1.009 9.38a.45.45 0 0 0 .074.35l.812 1.124a.35.35 0 0 0 .283.145h11.643a.35.35 0 0 0 .284-.145l.812-1.123a.45.45 0 0 0 .074-.351zM3.75 8.182a.35.35 0 0 1-.35.35H2.35a.35.35 0 0 1-.342-.426l.31-1.4a.35.35 0 0 1 .34-.275H3.4a.35.35 0 0 1 .35.35zm3.5 0a.35.35 0 0 1-.35.35H4.799a.35.35 0 0 1-.35-.35V6.78a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35zm3.51 0a.35.35 0 0 1-.35.35h-2.1a.35.35 0 0 1-.35-.35V6.78a.35.35 0 0 1 .35-.35h2.1a.35.35 0 0 1 .35.35zm3.073.219a.35.35 0 0 1-.272.131H11.81a.35.35 0 0 1-.35-.35V6.781a.35.35 0 0 1 .35-.35h1.441a.35.35 0 0 1 .342.275l.309 1.4a.35.35 0 0 1-.07.295" clip-rule="evenodd"/><path fill="white" fill-rule="evenodd" d="M2 11.999H14V12.999H2z" clip-rule="evenodd"/>`,
	ferry: `<path fill="white" d="M8.737 13c-.824 0-1.253-.226-1.632-.425-.33-.173-.591-.31-1.168-.31s-.838.137-1.168.31c-.38.2-.81.425-1.633.425-1.052 0-1.969-.588-2.007-.613L1 12.316l.447-.894.196.108c.037.023.743.47 1.493.47.577 0 .838-.137 1.168-.31.38-.199.81-.424 1.633-.424s1.254.225 1.633.424c.33.173.59.31 1.167.31s.837-.137 1.167-.31c.379-.199.81-.424 1.632-.424.643 0 1.046.137 1.372.292l-.479.88c-.23-.103-.48-.172-.893-.172-.577 0-.837.136-1.168.31-.378.198-.808.424-1.631.424M14.75 7.456h-1.432a.05.05 0 0 1-.05-.036l-.907-2.746a.35.35 0 0 0-.33-.242h-.554a.05.05 0 0 1-.047-.034l-.34-.825c-.073-.186-.214-.298-.417-.198l-1.213.706a.45.45 0 0 0-.244.402v.463c0 .04-.026.054-.047.054H5.78a.35.35 0 0 0-.318.198L4.362 7.422a.05.05 0 0 1-.047.034h-.667a.35.35 0 0 0-.314.195l-1.496 3.047c.313.16.658.302 1.275.302 1.4 0 1.4-.733 2.8-.733s1.4.733 2.8.733 1.4-.733 2.8-.733c.9 0 1.45.306 1.845.521l1.611-2.963a.25.25 0 0 0-.22-.37m-7.353-.2a.2.2 0 0 1-.2.2H5.272c-.125 0-.236-.098-.133-.279l.381-.78a.25.25 0 0 1 .228-.141h1.45c.11 0 .2.09.2.2zm2.204-.004a.204.204 0 0 1-.204.204H8.005a.204.204 0 0 1-.204-.204V6.46c0-.113.091-.204.204-.204h1.392c.113 0 .204.091.204.204zm2.535.204-1.933.001A.2.2 0 0 1 10 7.256v-.799c0-.11.09-.201.202-.201h1.653c.116 0 .217.079.245.191l.193.78c.053.165-.049.229-.158.229"/>`,
	metro: `<path fill="white" fill-rule="evenodd" d="M5.004 5 5.004 6.166 7.416 6.166 7.416 12 8.584 12 8.584 6.166 10.999 6.166 10.999 5z" clip-rule="evenodd"/><path fill="white" d="M8 2c3.308 0 6 2.692 6 6s-2.692 6-6 6c-3.309 0-6-2.692-6-6s2.691-6 6-6m0-1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7"/>`,
	air: `<path fill="white" fill-rule="evenodd" d="M14.833 5.682a.2.2 0 0 0-.044-.03l-.016-.011-.043-.025c-.146-.084-1.008-.42-1.478-.576a.76.76 0 0 0-.398-.024L9.037 6.044 5.21 4.438c-.273-.118-.318-.14-.57-.125l-.794.076c-.171.018-.198.158-.055.294L6.01 6.858 3.621 7.5l-2.13-.824c-.176-.069-.231-.068-.323-.043l-.08.022c-.063.016-.09.056-.088.1.002.057.046.076.19.228 0 0 2.873 2.805 3.033 2.948a.22.22 0 0 0 .204.048l10.138-2.731a.22.22 0 0 0 .151-.144c.131-.4.313-1.058.28-1.179a.46.46 0 0 0-.163-.243m-1.252.206-.271.073c-.03.008-.074.026-.122.006l-.46-.169a.14.14 0 0 1-.087-.138.14.14 0 0 1 .103-.127l.271-.073a.14.14 0 0 1 .088.005l.506.204c.056.023.086.055.082.115s-.052.09-.11.104" clip-rule="evenodd"/><path fill="white" fill-rule="evenodd" d="M2 11.999H14V12.999H2z" clip-rule="evenodd"/>`,
};

const STOP_ICON_COLORS = {
	light: {
		bus: "#c5044e",
		metro: "#bf5826",
		tram: "#78469a",
		ferry: "#0c6693",
		rail: "#00367f",
		air: "#800664",
		coach: "#c5044e",
	},
	dark: {
		bus: "#ef7398",
		metro: "#dd973c",
		tram: "#b898e5",
		ferry: "#8ccfe2",
		rail: "#60a2d7",
		air: "#f2b8e5",
		coach: "#ef7398",
	},
} as const;

// Canvas size in actual pixels; pixelRatio:2 means 28px display size
const CANVAS_SIZE = 56;
const BORDER_RADIUS = 12;
const ICON_PADDING = 12;

function createIconImageData(
	bgColor: string,
	iconPaths: string,
): Promise<ImageData> {
	return new Promise((resolve, reject) => {
		const iconSize = CANVAS_SIZE - ICON_PADDING * 2;
		const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}">
      <rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" rx="${BORDER_RADIUS}" ry="${BORDER_RADIUS}" fill="${bgColor}"/>
      <svg x="${ICON_PADDING}" y="${ICON_PADDING}" width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16">
        ${iconPaths}
      </svg>
    </svg>`;

		const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const img = new Image(CANVAS_SIZE, CANVAS_SIZE);

		img.onload = () => {
			URL.revokeObjectURL(url);
			const canvas = document.createElement("canvas");
			canvas.width = CANVAS_SIZE;
			canvas.height = CANVAS_SIZE;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				reject(new Error("canvas 2d context unavailable"));
				return;
			}
			ctx.drawImage(img, 0, 0);
			resolve(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE));
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("failed to load icon SVG"));
		};

		img.src = url;
	});
}

export function useStopIcons(
	map: MapLibreGL.Map | null,
	isLoaded: boolean,
	theme: "light" | "dark",
): boolean {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!map || !isLoaded) return;

		const colors = STOP_ICON_COLORS[theme];

		Promise.all(
			STOP_ICON_MODES.map(async (mode) => {
				const imageData = await createIconImageData(
					colors[mode],
					MODE_ICON_PATHS[mode],
				);
				const name = `stop-icon-${mode}`;
				if (map.hasImage(name)) {
					map.updateImage(name, imageData);
				} else {
					map.addImage(name, imageData, { pixelRatio: 2 });
				}
			}),
		)
			.then(() => setReady(true))
			.catch(console.error);
	}, [map, isLoaded, theme]);

	return ready;
}
