/**
 * Converts fare-zones.json (NeTEx format) to a GeoJSON FeatureCollection.
 *
 * NeTEx posList is a flat [lat, lng, lat, lng, ...] array.
 * GeoJSON polygon rings expect [[lng, lat], [lng, lat], ...] with the ring closed
 * (first and last point identical).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "../src/assets/fare-zones.json");
const outputPath = join(__dirname, "../src/assets/fare-zones-geo.json");

const zones = JSON.parse(readFileSync(inputPath, "utf-8"));

function posListToRing(flatCoords) {
  const ring = [];
  for (let i = 0; i < flatCoords.length - 1; i += 2) {
    const lat = flatCoords[i];
    const lng = flatCoords[i + 1];
    ring.push([lng, lat]);
  }
  // Close the ring if needed
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([first[0], first[1]]);
  }
  return ring;
}

const features = zones.map((zone) => {
  const flatCoords = zone.polygon.exterior.abstractRing.value.posList.value;
  const ring = posListToRing(flatCoords);

  const operator = zone.id.split(":")[0];
  const tariffZoneId =
    zone.keyList?.keyValue?.find((kv) => kv.key === "tzMapping")?.value ?? null;

  return {
    type: "Feature",
    id: zone.id,
    properties: {
      id: zone.id,
      name: zone.name.value,
      operator,
      tariffZoneId,
    },
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  };
});

const geojson = {
  type: "FeatureCollection",
  features,
};

writeFileSync(outputPath, JSON.stringify(geojson));
console.log(`Wrote ${features.length} fare zones to ${outputPath}`);
