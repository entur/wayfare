import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	assetAvailability,
	assetSeatNumber,
	isSeatFeature,
} from "../../lib/asset-features";
import { seatmapImageQuery } from "../../server-functions/assets.queries";
import type { AssetFeature, AssetGeometry } from "../../types/assets";

interface AssetSeatmapViewProps {
	features: AssetFeature[];
	selectedAssetIds?: string[];
	onSeatClick?: (feature: AssetFeature) => void;
	loading?: boolean;
	scale?: number;
	onScaleChange?: (scale: number) => void;
}

interface Bounds {
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

function polygonRing(coordinates: number[][][]): number[][] {
	const ring = coordinates[0] ?? [];
	// GeoJSON rings close with a duplicate last point — drop it
	return ring.length > 1 ? ring.slice(0, -1) : ring;
}

function polygonPoints(coordinates: number[][][]): string {
	return polygonRing(coordinates)
		.map(([x, y]) => `${x},${y}`)
		.join(" ");
}

function centroid(coordinates: number[][][]): [number, number] {
	const pts = polygonRing(coordinates);
	if (pts.length === 0) return [0, 0];
	const sumX = pts.reduce((s, [x]) => s + x, 0);
	const sumY = pts.reduce((s, [, y]) => s + y, 0);
	return [sumX / pts.length, sumY / pts.length];
}

function extendBounds(bounds: Bounds, geometry: AssetGeometry | null): void {
	if (!geometry) return;
	const isPolygon = Array.isArray(geometry.coordinates[0]);
	const points = isPolygon
		? polygonRing(geometry.coordinates as number[][][])
		: [geometry.coordinates as number[]];
	for (const [x, y] of points) {
		if (x < bounds.minX) bounds.minX = x;
		if (y < bounds.minY) bounds.minY = y;
		if (x > bounds.maxX) bounds.maxX = x;
		if (y > bounds.maxY) bounds.maxY = y;
	}
}

function computeViewBox(features: AssetFeature[], pad = 8) {
	const bounds: Bounds = {
		minX: Number.POSITIVE_INFINITY,
		minY: Number.POSITIVE_INFINITY,
		maxX: Number.NEGATIVE_INFINITY,
		maxY: Number.NEGATIVE_INFINITY,
	};
	for (const f of features) extendBounds(bounds, f.geometry);

	if (!Number.isFinite(bounds.minX))
		return { minX: 0, minY: 0, width: 100, height: 100 };

	return {
		minX: bounds.minX - pad,
		minY: bounds.minY - pad,
		width: bounds.maxX - bounds.minX + pad * 2,
		height: bounds.maxY - bounds.minY + pad * 2,
	};
}

function seatAvailability(feature: AssetFeature): string | null {
	return assetAvailability(feature);
}

function seatFill(
	feature: AssetFeature,
	isSelected: boolean,
	hasBaseImage: boolean,
): {
	className: string;
	interactive: boolean;
} {
	const availability = seatAvailability(feature);
	if (isSelected) {
		return {
			className: hasBaseImage
				? "fill-emerald-500/40 stroke-emerald-600"
				: "fill-emerald-500/50 stroke-emerald-600",
			interactive: false,
		};
	}
	if (availability === "AVAILABLE") {
		return {
			className: hasBaseImage
				? "fill-sky-500/10 hover:fill-sky-500/30 stroke-sky-500/50"
				: "fill-sky-500/25 stroke-sky-500/70",
			interactive: true,
		};
	}
	// OCCUPIED, CLOSED, LAST_STOP
	return {
		className: hasBaseImage
			? "fill-black/35 stroke-transparent"
			: "fill-black/15 stroke-black/30",
		interactive: false,
	};
}

function iconHref(
	feature: AssetFeature,
	isSelected: boolean,
): string | undefined {
	const availability = seatAvailability(feature);
	const preferredRel = isSelected
		? "icon-chosen"
		: availability === "AVAILABLE"
			? "icon-free"
			: isSeatFeature(feature)
				? "icon-unavailable"
				: "icon";
	return (
		feature.links?.find((link) => link.rel === preferredRel)?.href ??
		feature.links?.find((link) => link.rel === "icon")?.href
	);
}

function geometryBounds(geometry: AssetGeometry): Bounds | null {
	if (!Array.isArray(geometry.coordinates[0])) return null;
	const points = polygonRing(geometry.coordinates as number[][][]);
	if (points.length === 0) return null;
	const xs = points.map(([x]) => x);
	const ys = points.map(([, y]) => y);
	return {
		minX: Math.min(...xs),
		minY: Math.min(...ys),
		maxX: Math.max(...xs),
		maxY: Math.max(...ys),
	};
}

export default function AssetSeatmapView({
	features,
	selectedAssetIds = [],
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

	const carriageFeature = features.find(
		(f) => f.properties.type === "carriage",
	);
	const previewHref = carriageFeature?.links?.find(
		(l) => l.rel === "preview",
	)?.href;
	const seatAndFacilityFeatures = features.filter(
		(f) => f.properties.type !== "carriage",
	);
	const imageQuery = useQuery(seatmapImageQuery(previewHref));
	const hasBaseImage = !!previewHref && !!imageQuery.data?.dataUrl;
	const iconHrefs = Array.from(
		new Set(
			seatAndFacilityFeatures
				.map((feature) =>
					iconHref(feature, selectedAssetIds.includes(feature.id)),
				)
				.filter((href): href is string => !!href),
		),
	);
	const iconQueries = useQueries({
		queries: iconHrefs.map((href) => seatmapImageQuery(href)),
	});
	const iconDataUrls = new Map(
		iconHrefs.flatMap((href, index) => {
			const dataUrl = iconQueries[index]?.data?.dataUrl;
			return dataUrl ? [[href, dataUrl] as const] : [];
		}),
	);

	const imageWidth = imageQuery.data?.width;
	const imageHeight = imageQuery.data?.height;
	const viewBox =
		hasBaseImage && imageWidth && imageHeight
			? { minX: 0, minY: 0, width: imageWidth, height: imageHeight }
			: computeViewBox(seatAndFacilityFeatures);
	const { minX, minY, width, height } = viewBox;
	// Keep the complete carriage visible at 100%. Fitting only by width makes a
	// narrow portrait carriage several screens tall.
	const fitScale =
		width > 0 && height > 0 ? Math.min(640 / width, 640 / height) : 1;
	const svgWidth = Math.round(width * fitScale * scale);
	const svgHeight = Math.round(height * fitScale * scale);

	const isImageLoading = !!previewHref && imageQuery.isPending;
	const overlayFeatures = seatAndFacilityFeatures;

	return (
		<div>
			<div className="relative">
				<div className="max-h-[640px] overflow-auto rounded">
					{loading || isImageLoading ? (
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
							{hasBaseImage && imageQuery.data && (
								<image
									href={imageQuery.data.dataUrl}
									x={minX}
									y={minY}
									width={width}
									height={height}
									preserveAspectRatio="xMidYMid meet"
								/>
							)}
							{overlayFeatures.map((f) => {
								const isSeat = isSeatFeature(f);
								const isSelected = selectedAssetIds.includes(f.id);
								const availability = seatAvailability(f);
								const isOccupied =
									availability === "OCCUPIED" ||
									availability === "CLOSED" ||
									availability === "LAST_STOP";

								const { className, interactive: seatInteractive } = isSeat
									? seatFill(f, isSelected, hasBaseImage)
									: {
											className: "fill-black/[0.06] stroke-black/15",
											interactive: false,
										};
								const interactive = seatInteractive && !!onSeatClick;
								const featureIconHref = iconHref(f, isSelected);
								const featureIcon = featureIconHref
									? iconDataUrls.get(featureIconHref)
									: undefined;

								const seatNumber = assetSeatNumber(f);
								const label = isSeat
									? `Seat ${seatNumber ?? f.id}${isSelected ? " (selected)" : isOccupied ? " (occupied)" : " (available)"}`
									: f.properties.type === "facility"
										? (f.properties.name ?? f.properties.facilityType)
										: f.id;
								const textColor = isSelected
									? "rgba(255,255,255,0.95)"
									: isOccupied
										? "rgba(0,0,0,0.58)"
										: "rgba(0,0,0,0.78)";

								const handleClick = interactive
									? () => onSeatClick?.(f)
									: undefined;
								const handleKeyDown = interactive
									? (e: React.KeyboardEvent) => {
											if (e.key === "Enter" || e.key === " ") onSeatClick?.(f);
										}
									: undefined;

								if (!f.geometry) return null;

								const bounds = geometryBounds(f.geometry);
								if (featureIcon && bounds) {
									const coordinates = f.geometry.coordinates as number[][][];
									const points = polygonPoints(coordinates);
									const [cx, cy] = centroid(coordinates);
									return (
										<g key={f.id}>
											<image
												href={featureIcon}
												x={bounds.minX}
												y={bounds.minY}
												width={bounds.maxX - bounds.minX}
												height={bounds.maxY - bounds.minY}
												preserveAspectRatio="none"
												style={{ pointerEvents: "none" }}
											/>
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
											{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG polygon uses a conditional button role */}
											<polygon
												points={points}
												fill="transparent"
												role={interactive ? "button" : undefined}
												aria-label={label}
												tabIndex={interactive ? 0 : undefined}
												style={{ cursor: interactive ? "pointer" : "default" }}
												onClick={handleClick}
												onKeyDown={handleKeyDown}
											>
												<title>{label}</title>
											</polygon>
										</g>
									);
								}

								const showNumber =
									!hasBaseImage && isSeat && seatNumber != null;

								if (!Array.isArray(f.geometry.coordinates[0])) {
									const [cx, cy] = f.geometry.coordinates as number[];
									return (
										<g key={f.id}>
											{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG circle needs role for interactive seats */}
											<circle
												cx={cx}
												cy={cy}
												r={6}
												className={className}
												strokeWidth={hasBaseImage ? 0 : 1}
												role={interactive ? "button" : undefined}
												aria-label={label}
												tabIndex={interactive ? 0 : undefined}
												style={{
													cursor: interactive ? "pointer" : "default",
													pointerEvents: interactive ? "all" : "none",
												}}
												onClick={handleClick}
												onKeyDown={handleKeyDown}
											>
												<title>{label}</title>
											</circle>
											{showNumber && (
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
								}

								const polygonCoordinates = f.geometry
									.coordinates as number[][][];
								const [cx, cy] = centroid(polygonCoordinates);

								return (
									<g key={f.id}>
										{/* biome-ignore lint/a11y/noStaticElementInteractions: SVG polygon needs role for interactive seats */}
										<polygon
											points={polygonPoints(polygonCoordinates)}
											className={className}
											strokeWidth={hasBaseImage ? 0 : 1}
											role={interactive ? "button" : undefined}
											aria-label={label}
											tabIndex={interactive ? 0 : undefined}
											style={{
												cursor: interactive ? "pointer" : "default",
												pointerEvents: interactive ? "all" : "none",
											}}
											onClick={handleClick}
											onKeyDown={handleKeyDown}
										>
											<title>{label}</title>
										</polygon>
										{showNumber && (
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
					<span className="inline-block h-3 w-3 rounded border border-sky-500/70 bg-sky-500/20" />
					Available
				</span>
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-emerald-600 bg-emerald-500/50" />
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
