import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { GitHubIcon } from "#/components/platform-support";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "#/lib/site";

/**
 * Floats over the stage — no background and no rule, or the truss stops
 * reading as the top of the frame.
 *
 * Below `md` the links collapse into a drawer. Laid out inline they crowded
 * the top of a phone, competing with the marquee directly underneath.
 */
export function SiteHeader() {
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	// Escape closes, and focus goes back to the control that opened it —
	// otherwise focus is left orphaned at the top of the document.
	useEffect(() => {
		if (!open) return;

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setOpen(false);
				buttonRef.current?.focus();
			}
		}

		function onPointerDown(event: PointerEvent) {
			const target = event.target as Node;
			if (
				!panelRef.current?.contains(target) &&
				!buttonRef.current?.contains(target)
			) {
				setOpen(false);
			}
		}

		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("pointerdown", onPointerDown);

		// The drawer covers the page; letting the page scroll behind it means
		// closing it drops you somewhere you did not choose.
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("pointerdown", onPointerDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open]);

	return (
		<header className="absolute inset-x-0 top-0 z-50">
			{/* Above the drawer: the toggle has to stay visible and clickable
			    once the panel is open, or there is no way to close it by hand. */}
			<nav
				aria-label="Primary"
				className="relative z-[60] mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:gap-8 sm:px-6"
			>
				<Link
					to="/"
					className="u-display shrink-0 text-base text-fg transition-opacity hover:opacity-70 sm:text-lg"
				>
					{SITE.name}
				</Link>

				{/* Desktop: the links sit inline. */}
				<ul className="u-label hidden items-center gap-4 md:flex md:gap-6">
					{NAV_LINKS.map((link) => (
						<li key={link.to}>
							<Link
								to={link.to}
								className="text-fg-subtle transition-colors hover:text-fg"
								activeProps={{ className: "text-fg" }}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>

				<ul className="ml-auto hidden shrink-0 items-center gap-5 md:flex">
					{SOCIAL_LINKS.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer noopener"
								className="block text-fg-muted transition-colors hover:text-fg"
							>
								<GitHubIcon className="h-5 w-5" />
							</a>
						</li>
					))}
				</ul>

				{/* Phone: one control. */}
				<button
					ref={buttonRef}
					type="button"
					onClick={() => setOpen((value) => !value)}
					aria-expanded={open}
					aria-controls="site-menu"
					aria-label={open ? "Close menu" : "Open menu"}
					className="ml-auto flex h-10 w-10 items-center justify-center text-fg-muted transition-colors hover:text-fg md:hidden"
				>
					<MenuGlyph open={open} />
				</button>
			</nav>

			{/* Rendered after the button in DOM order, so tab order is natural
			    without trapping focus. */}
			{open ? (
				<>
					{/* Scrim: without it the drawer reads as floating debris over a
					    fully lit page rather than as a layer above it. */}
					<div
						aria-hidden="true"
						className="fixed inset-0 z-40 bg-void/80 md:hidden"
					/>
					<div
						id="site-menu"
						ref={panelRef}
						className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col gap-8 border-l border-line bg-void px-7 pt-24 pb-10 md:hidden"
					>
						<ul className="u-label flex flex-col gap-6">
							{NAV_LINKS.map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										onClick={() => setOpen(false)}
										className="block text-fg-muted transition-colors hover:text-fg"
										activeProps={{ className: "text-fg" }}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>

						<ul className="u-label mt-auto flex flex-col gap-6 border-t border-line pt-8">
							{SOCIAL_LINKS.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										target="_blank"
										rel="noreferrer noopener"
										onClick={() => setOpen(false)}
										className="flex items-center gap-3 text-fg-muted transition-colors hover:text-fg"
									>
										<GitHubIcon className="h-4 w-4" />
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</>
			) : null}
		</header>
	);
}

/** Three rules that become a cross. */
function MenuGlyph({ open }: { open: boolean }) {
	return (
		<span aria-hidden="true" className="relative block h-4 w-5">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="absolute left-0 block h-px w-full bg-current transition-transform duration-300"
					style={
						open
							? {
									top: "50%",
									transform:
										i === 1 ? "scaleX(0)" : `rotate(${i === 0 ? 45 : -45}deg)`,
								}
							: { top: `${i * 7}px` }
					}
				/>
			))}
		</span>
	);
}
