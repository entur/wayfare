import WayfareWordmark from "./WayfareWordmark";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-20 border-t border-wayfare-line px-4 pb-10 pt-8 text-wayfare-text-secondary">
			<div className="page-wrap flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
				<div className="flex items-center">
					<WayfareWordmark height={16} />
				</div>
				<p className="m-0 text-xs">
					&copy; {year} Wayfare | All rights reserved
				</p>
			</div>
		</footer>
	);
}
