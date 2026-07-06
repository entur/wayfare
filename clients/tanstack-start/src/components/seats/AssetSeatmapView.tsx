import { useState } from "react";
import type { AssetFeature } from "../../types/assets";

interface AssetSeatmapViewProps {
	features: AssetFeature[];
	selectedAssetId?: string;
	onSeatClick?: (feature: AssetFeature) => void;
	loading?: boolean;
	scale?: number;
	onScaleChange?: (scale: number) => void;
}

function polygonPoints(coordinates: number[][][]): string {
	const ring = coordinates[0] ?? [];
	// GeoJSON rings close with a duplicate last point — drop it
	const pts = ring.length > 1 ? ring.slice(0, -1) : ring;
	return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

function centroid(coordinates: number[][][]): [number, number] {
	const ring = coordinates[0] ?? [];
	const pts = ring.length > 1 ? ring.slice(0, -1) : ring;
	if (pts.length === 0) return [0, 0];
	const sumX = pts.reduce((s, [x]) => s + x, 0);
	const sumY = pts.reduce((s, [, y]) => s + y, 0);
	return [sumX / pts.length, sumY / pts.length];
}

function computeViewBox(features: AssetFeature[]): {
	minX: number;
	minY: number;
	width: number;
	height: number;
} {
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;

	for (const f of features) {
		for (const ring of f.geometry.coordinates) {
			for (const [x, y] of ring) {
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}
		}
	}

	if (!Number.isFinite(minX)) return { minX: 0, minY: 0, width: 100, height: 100 };

	const pad = 8;
	return {
		minX: minX - pad,
		minY: minY - pad,
		width: maxX - minX + pad * 2,
		height: maxY - minY + pad * 2,
	};
}

export default function AssetSeatmapView({
	features,
	selectedAssetId,
	onSeatClick,
	loading,
	scale: externalScale,
	onScaleChange,
}: AssetSeatmapViewProps) {
	const [internalScale, setInternalScale] = useState(1);
	const scale = externalScale ?? internalScale;

	function adjustScale(delta: number) {
		const next = Math.min(4, Math.max(0.25, scale + delta));
		if (onScaleChange) {
			onScaleChange(next);
		} else {
			setInternalScale(next);
		}
	}

	const { minX, minY, width, height } = computeViewBox(features);
	const svgWidth = Math.round(width * scale);
	const svgHeight = Math.round(height * scale);

	return (
		<div>
			<div className="relative">
				<div className="overflow-auto rounded">
					{loading ? (
						<div
							className="flex items-center justify-center"
							style={{ width: svgWidth || 300, height: svgHeight || 120 }}
						>
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
						</div>
					) : (
						<svg
							width={svgWidth}
							height={svgHeight}
							viewBox={`${minX} ${minY} ${width} ${height}`}
							role="img"
							aria-label="Seat map"
						>
							{features.map((f) => {
								const isSeat = f.properties.type === "seat";
								const isSelected = f.id === selectedAssetId;
								const availability =
									f.properties.type === "seat"
										? f.properties.availability
										: null;
								const isAvailable = availability === "AVAILABLE";
								const isOccupied =
									availability === "OCCUPIED" ||
									availability === "CLOSED" ||
									availability === "LAST_STOP";
								const interactive = isSeat && isAvailable && !!onSeatClick;

								let fill: string;
								let stroke: string;
								if (!isSeat) {
									fill = "rgba(0,0,0,0.06)";
									stroke = "rgba(0,0,0,0.15)";
								} else if (isSelected) {
									fill = "rgba(34,197,94,0.5)";
									stroke = "rgba(22,163,74,1)";
								} else if (isOccupied) {
									fill = "rgba(0,0,0,0.15)";
									stroke = "rgba(0,0,0,0.3)";
								} else {
									fill = "rgba(59,130,246,0.25)";
									stroke = "rgba(59,130,246,0.7)";
								}

								const [cx, cy] = centroid(f.geometry.coordinates);
								const seatNumber =
									f.properties.type === "seat"
										? f.properties.seatNumber
										: undefined;

								const label = isSeat
									? `Seat ${seatNumber ?? f.id}${isSelected ? " (selected)" : isOccupied ? " (occupied)" : " (available)"}`
									: (f.properties.type === "facility"
											? f.properties.facilityType
											: f.id);

								const textColor =
									isSelected
										? "rgba(255,255,255,0.92)"
										: "rgba(0,0,0,0.72)";

								return (
									<g key={f.id}>
										{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG polygon needs role for interactive seats */}
										<polygon
											points={polygonPoints(f.geometry.coordinates)}
											fill={fill}
											stroke={stroke}
											strokeWidth={1}
											role={interactive ? "button" : undefined}
											aria-label={label}
											tabIndex={interactive ? 0 : undefined}
											style={{
												cursor: interactive ? "pointer" : "default",
												pointerEvents: interactive ? "auto" : "none",
											}}
											onClick={interactive ? () => onSeatClick(f) : undefined}
											onKeyDown={
												interactive
													? (e) => {
															if (e.key === "Enter" || e.key === " ")
																onSeatClick(f);
														}
													: undefined
											}
										>
											<title>{label}</title>
										</polygon>
										{isSeat && seatNumber != null && (
											<text
												x={cx}
												y={cy}
												textAnchor="middle"
												dominantBaseline="central"
												fontSize={7}
												fontWeight={700}
												fill={textColor}
												style={{ pointerEvents: "none", userSelect: "none" }}
											>
												{seatNumber}
											</text>
										)}
									</g>
								);
							})}
						</svg>
					)}
				</div>
				{externalScale === undefined && (
					<div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border border-wayfare-line bg-wayfare-bg/95 px-2 py-1 shadow-sm backdrop-blur-sm">
						<button
							type="button"
							className="rounded px-1.5 py-0.5 text-xs text-wayfare-text-secondary hover:bg-wayfare-surface"
							onClick={() => adjustScale(-0.25)}
							aria-label="Zoom out"
						>
							−
						</button>
						<span className="min-w-[2.75rem] text-center text-xs text-wayfare-text-secondary">
							{Math.round(scale * 100)}%
						</span>
						<button
							type="button"
							className="rounded px-1.5 py-0.5 text-xs text-wayfare-text-secondary hover:bg-wayfare-surface"
							onClick={() => adjustScale(0.25)}
							aria-label="Zoom in"
						>
							+
						</button>
					</div>
				)}
			</div>
			<div className="mt-2 flex flex-wrap gap-3 text-xs text-wayfare-text-secondary">
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-blue-500/70 bg-blue-500/20" />
					Available
				</span>
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-green-600 bg-green-500/50" />
					Selected
				</span>
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-black/30 bg-black/15" />
					Occupied
				</span>
			</div>
		</div>
	);
}
