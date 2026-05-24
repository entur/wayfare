import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../public/stops-geo.json");
const BASE_URL = "https://api.entur.io/stop-places/v1/read";
const CLIENT_NAME = process.env.ENTUR_CLIENT_NAME ?? "Wayfare-Web";
const PAGE_SIZE = 1000;

async function fetchPage(skip) {
	const url = new URL(`${BASE_URL}/stop-places`);
	url.searchParams.set("count", String(PAGE_SIZE));
	url.searchParams.set("skip", String(skip));
	url.searchParams.set("includeDeactivatedStops", "false");

	const res = await fetch(url.toString(), {
		headers: { "ET-Client-Name": CLIENT_NAME },
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
	return res.json();
}

function toName(name) {
	if (typeof name === "string") return name;
	if (name && typeof name.value === "string") return name.value;
	return "";
}

// NSR uses "water" and "waterborne" where the app expects "ferry"
const MODE_ALIASES = { water: "ferry", waterborne: "ferry" };

function toModes(raw) {
	if (!raw) return [];
	const arr = Array.isArray(raw) ? raw : [raw];
	return arr
		.map((m) => {
			const lower = String(m).toLowerCase();
			return MODE_ALIASES[lower] ?? lower;
		})
		.filter(Boolean);
}

async function main() {
	const allStops = [];
	let skip = 0;
	let page = 1;

	while (true) {
		process.stdout.write(`Fetching page ${page} (skip=${skip})... `);
		const stops = await fetchPage(skip);

		if (!Array.isArray(stops) || stops.length === 0) {
			console.log("done (empty page)");
			break;
		}

		allStops.push(...stops);
		console.log(`got ${stops.length} (total: ${allStops.length})`);

		if (stops.length < PAGE_SIZE) break;

		skip += PAGE_SIZE;
		page++;
	}

	// Collect transport modes from children and merge onto their parent hub.
	// Parent hubs (those referenced by parentSiteRef on child stops) often have no
	// transport mode set in NSR, but their children do.
	const parentModes = new Map(); // parentId → Set<string>
	for (const s of allStops) {
		if (s.parentSiteRef) {
			const parentId = typeof s.parentSiteRef === "string" ? s.parentSiteRef : s.parentSiteRef.ref ?? s.parentSiteRef;
			if (!parentModes.has(parentId)) parentModes.set(parentId, new Set());
			for (const m of toModes(s.transportMode ?? s.transportModes)) {
				parentModes.get(parentId).add(m);
			}
		}
	}

	// Skip child stops — keep only parent hubs and standalone stops.
	const features = allStops
		.filter((s) => !s.parentSiteRef && s.centroid?.location?.latitude != null && s.centroid?.location?.longitude != null)
		.map((s) => {
			const ownModes = toModes(s.transportMode ?? s.transportModes);
			const childModes = parentModes.has(s.id) ? [...parentModes.get(s.id)] : [];
			const allModes = [...new Set([...ownModes, ...childModes])];
			return {
				type: "Feature",
				id: s.id,
				geometry: {
					type: "Point",
					coordinates: [s.centroid.location.longitude, s.centroid.location.latitude],
				},
				properties: {
					id: s.id,
					name: toName(s.name),
					transportModes: allModes,
				},
			};
		});

	writeFileSync(OUTPUT_PATH, JSON.stringify({ type: "FeatureCollection", features }));
	console.log(`\nWrote ${features.length} stop places to ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
