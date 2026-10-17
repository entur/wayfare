import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	assetCompartmentLabel,
	assetFareClass,
	assetSeatNumber,
	assetSeatPosition,
	assetTypeOf,
	geometryKind,
	isAssignableSeat,
	isReservableAsset,
	isSeatClosed,
	isSeatFeature,
	isSelectedSeat,
} from "../../lib/asset-features";
import { seatmapImageQuery } from "../../server-functions/assets.queries";
import type { AssetFeature, AssetGeometry } from "../../types/assets";

interface AssetSeatmapViewProps {
	features: AssetFeature[];
	selectedAssetIds?: string[];
	/** Asset id that just failed a 409 "Asset Not Available" assign, if any. */
	conflictAssetId?: string;
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

// GeoJSON rings close with a duplicate last point — drop it
function dedupeRing(ring: number[][]): number[][] {
	return ring.length > 1 ? ring.slice(0, -1) : ring;
}

/** One ring per polygon: a single ring for Polygon, one per member for MultiPolygon. */
function polygonRings(geometry: AssetGeometry): number[][][] {
	const kind = geometryKind(geometry);
	if (kind === "Polygon") {
		return [dedupeRing((geometry.coordinates as number[][][])[0] ?? [])];
	}
	if (kind === "MultiPolygon") {
		return (geometry.coordinates as number[][][][]).map((polygon) =>
			dedupeRing(polygon[0] ?? []),
		);
	}
	return [];
}

function polygonPoints(ring: number[][]): string {
	return ring.map(([x, y]) => `${x},${y}`).join(" ");
}

function centroid(points: number[][]): [number, number] {
	if (points.length === 0) return [0, 0];
	const sumX = points.reduce((s, [x]) => s + x, 0);
	const sumY = points.reduce((s, [, y]) => s + y, 0);
	return [sumX / points.length, sumY / points.length];
}

/** Every coordinate pair a geometry contributes, for bounds/centroid purposes. */
function geometryPoints(geometry: AssetGeometry): number[][] {
	const kind = geometryKind(geometry);
	if (kind === "Point") return [geometry.coordinates as number[]];
	if (kind === "LineString") return geometry.coordinates as number[][];
	if (kind === "Polygon" || kind === "MultiPolygon")
		return polygonRings(geometry).flat();
	return [];
}

function extendBounds(bounds: Bounds, geometry: AssetGeometry | null): void {
	if (!geometry) return;
	for (const [x, y] of geometryPoints(geometry)) {
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

type SeatStatus =
	| "non-reservable"
	| "conflict"
	| "confirmed"
	| "chosen"
	| "available"
	| "unavailable";

function seatStatus(
	feature: AssetFeature,
	isChosenLocally: boolean,
	isConflict: boolean,
): SeatStatus {
	if (!isReservableAsset(feature)) return "non-reservable";
	if (isConflict) return "conflict";
	if (isSelectedSeat(feature)) return "confirmed";
	if (isChosenLocally) return "chosen";
	if (isSeatClosed(feature)) return "unavailable";
	if (isAssignableSeat(feature)) return "available";
	return "unavailable";
}

function seatFill(
	status: SeatStatus,
	hasBaseImage: boolean,
): {
	className: string;
	interactive: boolean;
} {
	switch (status) {
		case "non-reservable":
			return {
				className: hasBaseImage
					? "fill-transparent stroke-transparent"
					: "fill-black/[0.06] stroke-black/15",
				interactive: false,
			};
		case "conflict":
			return {
				className: hasBaseImage
					? "fill-rose-500/30 stroke-rose-600"
					: "fill-rose-500/40 stroke-rose-600",
				interactive: false,
			};
		case "confirmed":
		case "chosen":
			return {
				className: hasBaseImage
					? "fill-emerald-500/40 stroke-emerald-600"
					: "fill-emerald-500/50 stroke-emerald-600",
				interactive: false,
			};
		case "available":
			return {
				className: hasBaseImage
					? "fill-sky-500/10 hover:fill-sky-500/30 stroke-sky-500/50"
					: "fill-sky-500/25 stroke-sky-500/70",
				interactive: true,
			};
		default:
			// UNAVAILABLE, OCCUPIED, CLOSED, LAST_STOP
			return {
				className: hasBaseImage
					? "fill-black/35 stroke-transparent"
					: "fill-black/15 stroke-black/30",
				interactive: false,
			};
	}
}

function iconHref(feature: AssetFeature, status: SeatStatus): string | undefined {
	const preferredRel =
		status === "conflict"
			? "icon-conflict"
			: status === "confirmed"
				? "icon-confirmed"
				: status === "chosen"
					? "icon-chosen"
					: status === "available"
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
	const points = polygonRings(geometry).flat();
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
	conflictAssetId,
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
	const carriageWidth =
		carriageFeature?.properties.type === "carriage"
			? carriageFeature.properties.width
			: undefined;
	const carriageHeight =
		carriageFeature?.properties.type === "carriage"
			? carriageFeature.properties.height
			: undefined;
	const previewHref = carriageFeature?.links?.find(
		(l) => l.rel === "preview",
	)?.href;
	const seatAndFacilityFeatures = features.filter(
		(f) => f.properties.type !== "carriage",
	);
	const imageQuery = useQuery(seatmapImageQuery(previewHref));
	const hasBaseImage = !!previewHref && !!imageQuery.data?.dataUrl;

	function statusOf(feature: AssetFeature): SeatStatus {
		return seatStatus(
			feature,
			selectedAssetIds.includes(feature.id),
			!!conflictAssetId && conflictAssetId === feature.id,
		);
	}

	const iconHrefs = Array.from(
		new Set(
			seatAndFacilityFeatures
				.map((feature) => iconHref(feature, statusOf(feature)))
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

	// Carriage-native dimensions take precedence — they're the coordinate
	// space the seat/facility geometry is actually authored in. The preview
	// image's intrinsic size is a fallback for carriages that don't report
	// width/height; computeViewBox is the last resort when there's no base
	// image at all.
	const viewBox =
		carriageWidth && carriageHeight
			? { minX: 0, minY: 0, width: carriageWidth, height: carriageHeight }
			: hasBaseImage && imageQuery.data?.width && imageQuery.data?.height
				? {
						minX: 0,
						minY: 0,
						width: imageQuery.data.width,
						height: imageQuery.data.height,
					}
				: computeViewBox(seatAndFacilityFeatures);
	const { minX, minY, width, height } = viewBox;

	const isImageLoading = !!previewHref && imageQuery.isPending;
	const overlayFeatures = seatAndFacilityFeatures;

	return (
		<div>
			<div className="relative">
				{/* Sized off the available width rather than fitting the whole carriage into
				a fixed box — a portrait carriage reads far larger this way, and scrolling
				down the page to see the rest of it beats a tiny, hard-to-tap seatmap. */}
				<div className="overflow-x-auto rounded">
					{loading || isImageLoading ? (
						<div className="flex h-40 w-full items-center justify-center">
							<div className="h-5 w-5 animate-spin rounded-full border-2 border-wayfare-line border-t-wayfare-primary" />
						</div>
					) : (
						<svg
							viewBox={`${minX} ${minY} ${width} ${height}`}
							style={{
								width: `${Math.round(scale * 45)}%`,
								height: "auto",
								display: "block",
							}}
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
								if (!f.geometry) return null;

								const isSeat = isSeatFeature(f);
								const status = statusOf(f);
								const isSelected =
									status === "confirmed" || status === "chosen";
								const looksUnavailable =
									status === "unavailable" || status === "non-reservable";

								const { className, interactive: seatInteractive } = isSeat
									? seatFill(status, hasBaseImage)
									: {
											className: "fill-black/[0.06] stroke-black/15",
											interactive: false,
										};
								const interactive = seatInteractive && !!onSeatClick;
								const featureIconHref = iconHref(f, status);
								const featureIcon = featureIconHref
									? iconDataUrls.get(featureIconHref)
									: undefined;

								const seatNumber = assetSeatNumber(f);
								const seatKind =
									assetTypeOf(f) === "BICYCLE_SPACE" ? "Bicycle space" : "Seat";
								const detailParts = isSeat
									? [assetSeatPosition(f), assetFareClass(f), assetCompartmentLabel(f)]
											.filter((part): part is string => !!part)
											.map((part) => part.toLowerCase())
									: [];
								const detailSuffix =
									detailParts.length > 0 ? ` (${detailParts.join(", ")})` : "";
								const statusSuffix =
									status === "conflict"
										? " (just taken)"
										: isSelected
											? " (selected)"
											: looksUnavailable
												? " (unavailable)"
												: " (available)";
								const label = isSeat
									? `${seatKind} ${seatNumber ?? f.id}${detailSuffix}${statusSuffix}`
									: f.properties.type === "facility"
										? (f.properties.name ?? f.properties.facilityType)
										: f.id;
								const textColor = isSelected
									? "rgba(255,255,255,0.95)"
									: looksUnavailable
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

								const kind = geometryKind(f.geometry);

								if (kind === "Point") {
									const [cx, cy] = f.geometry.coordinates as number[];
									const showNumber = !hasBaseImage && isSeat && seatNumber != null;
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

								if (kind === "LineString") {
									// Layout markings (aisle edges, walls) — drawn for context, never interactive.
									const linePoints = (f.geometry.coordinates as number[][])
										.map(([x, y]) => `${x},${y}`)
										.join(" ");
									return (
										<polyline
											key={f.id}
											points={linePoints}
											fill="none"
											className="stroke-black/15"
											strokeWidth={1}
											style={{ pointerEvents: "none" }}
										/>
									);
								}

								if (kind !== "Polygon" && kind !== "MultiPolygon") return null;

								const rings = polygonRings(f.geometry);
								const allPoints = rings.flat();
								const [cx, cy] = centroid(allPoints);
								const bounds = geometryBounds(f.geometry);
								const showNumber = !hasBaseImage && isSeat && seatNumber != null;

								if (featureIcon && bounds) {
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
											{rings.map((ring, index) => (
												// biome-ignore lint/a11y/noStaticElementInteractions: SVG polygon uses a conditional button role
												<polygon
													// biome-ignore lint/suspicious/noArrayIndexKey: rings of one feature are stable per render
													key={index}
													points={polygonPoints(ring)}
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
											))}
										</g>
									);
								}

								return (
									<g key={f.id}>
										{rings.map((ring, index) => (
											// biome-ignore lint/a11y/noStaticElementInteractions: SVG polygon needs role for interactive seats
											<polygon
												// biome-ignore lint/suspicious/noArrayIndexKey: rings of one feature are stable per render
												key={index}
												points={polygonPoints(ring)}
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
										))}
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
					<span className="inline-block h-3 w-3 rounded border border-black/10 bg-[#ebebf1]" />
					Available
				</span>
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-black/10 bg-[#54568c]" />
					Selected
				</span>
				<span className="flex items-center gap-1">
					<span className="inline-block h-3 w-3 rounded border border-black/10 bg-[#f8f8f8]" />
					Occupied
				</span>
			</div>
		</div>
	);
}
