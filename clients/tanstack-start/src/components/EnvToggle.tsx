import { useEffect } from "react";
import { useDevConfig } from "../context/dev-config";
import { envFaviconSrc, envIconSrc, useEnvMode } from "../hooks/use-env-mode";
import type { OmsaRuntimeMode } from "../server/runtime-config";

const ENV_CYCLE: OmsaRuntimeMode[] = ["dev", "staging", "local", "local-tst"];

export default function EnvToggle() {
	const { overrides, setOverrides } = useDevConfig();
	const envMode = useEnvMode();
	const iconSrc = envIconSrc(envMode);
	const favicon = envFaviconSrc(envMode);

	useEffect(() => {
		let link = document.querySelector(
			"link[rel~='icon']",
		) as HTMLLinkElement | null;
		if (!link) {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}
		link.href = favicon.href;
		link.type = favicon.type;
	}, [favicon.href, favicon.type]);

	function cycleMode() {
		const current = envMode ?? "dev";
		const idx = ENV_CYCLE.indexOf(current);
		const next = ENV_CYCLE[(idx + 1) % ENV_CYCLE.length];
		setOverrides({ ...overrides, envMode: next });
	}

	if (!iconSrc) return null;

	const label = `Environment: ${envMode}. Click to cycle.`;

	return (
		<button
			type="button"
			onClick={cycleMode}
			aria-label={label}
			title={label}
			className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-wayfare-text-secondary transition-colors hover:bg-wayfare-bg"
		>
			<img
				src={iconSrc}
				alt=""
				aria-hidden="true"
				width={16}
				height={16}
				className="rounded-[2px]"
			/>
		</button>
	);
}
