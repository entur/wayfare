import WayfareCombinedHeaderAsset from "../../../tanstack-start/public/wayfare_combined_header.svg";
import TurtleMagnifyingGlassAsset from "../../../tanstack-start/public/wayfare-turtle-magnifying-glass.svg";

export function WayfareCombinedHeader({ width = 174 }: { width?: number }) {
  return (
    <WayfareCombinedHeaderAsset
      accessibilityElementsHidden
      width={width}
      height={(49 / 198) * width}
    />
  );
}

export function TurtleMagnifyingGlass({ size = 160 }: { size?: number }) {
  return (
    <TurtleMagnifyingGlassAsset
      accessibilityElementsHidden
      width={size}
      height={size}
    />
  );
}
