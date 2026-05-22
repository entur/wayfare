import { useQuery } from "@tanstack/react-query";
import { useDevConfig } from "../context/dev-config";
import type { OmsaRuntimeMode } from "../server/runtime-config";
import { getResolvedDevConfig } from "../server-functions/dev-config";

export function useEnvMode(): OmsaRuntimeMode | undefined {
	const { overrides } = useDevConfig();
	const { data } = useQuery({
		queryKey: ["resolved-dev-config", overrides.envMode],
		queryFn: () => getResolvedDevConfig(),
		staleTime: 5 * 60 * 1000,
	});

	return (overrides.envMode ?? data?.effectiveMode) as
		| OmsaRuntimeMode
		| undefined;
}

export function envIconSrc(mode: OmsaRuntimeMode | undefined): string | null {
	switch (mode) {
		case "dev":
			return "/dev-square-icon.svg";
		case "staging":
			return "/staging-square-icon.svg";
		case "local-dev":
			return "/local-dev-square-icon.svg";
		case "local-staging":
			return "/local-staging-square-icon.svg";
		default:
			return null;
	}
}

export function envFaviconSrc(mode: OmsaRuntimeMode | undefined): {
	href: string;
	type: string;
} {
	switch (mode) {
		case "dev":
			return { href: "/wayfare-dev-favicon.png", type: "image/png" };
		case "staging":
			return { href: "/wayfare-staging-favicon.svg", type: "image/svg+xml" };
		case "local-dev":
		case "local-staging":
			return { href: "/wayfare-local-favicon.png", type: "image/png" };
		default:
			return { href: "/wayfare-favicon.svg", type: "image/svg+xml" };
	}
}
