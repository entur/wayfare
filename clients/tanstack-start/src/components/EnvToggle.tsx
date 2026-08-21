import { useEffect } from "react";
import { useDevConfig } from "../context/dev-config";
import {
	envFaviconSrc,
	envIconSrc,
	useEnvMode,
	useResolvedDevConfig,
} from "../hooks/use-env-mode";

export default function EnvToggle() {
	const { overrides, setOverrides } = useDevConfig();
	const envMode = useEnvMode();
	const { data: resolved } = useResolvedDevConfig();
	const allowedModes = resolved?.allowedEnvModes;
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
		if (!allowedModes || allowedModes.length <= 1) return;
		const current = envMode ?? allowedModes[0];
		const idx = allowedModes.indexOf(current);
		const next = allowedModes[(idx + 1) % allowedModes.length];
		setOverrides({ ...overrides, envMode: next });
	}

	if (!allowedModes || allowedModes.length <= 1) return null;
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
