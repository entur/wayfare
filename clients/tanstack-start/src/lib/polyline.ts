export function decodePolyline(
	encoded: string,
	precision = 5,
): [number, number][] {
	const factor = 10 ** precision;
	const coordinates: [number, number][] = [];
	let index = 0;
	let lat = 0;
	let lng = 0;

	while (index < encoded.length) {
		let result = 0;
		let shift = 0;
		let byte: number;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		const dLat = result & 1 ? ~(result >> 1) : result >> 1;
		lat += dLat;

		result = 0;
		shift = 0;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		const dLng = result & 1 ? ~(result >> 1) : result >> 1;
		lng += dLng;

		coordinates.push([lng / factor, lat / factor]);
	}

	return coordinates;
}
