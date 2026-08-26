import { Link } from "@tanstack/react-router";

import { NAV_LINKS, SITE, SOCIAL_LINKS } from "#/lib/site";

/**
 * Sticky top bar. Internal nav uses router `Link` (so `defaultPreload:
 * "intent"` prefetches the loader on hover); external links are plain
 * anchors — sibling apps are separate deployments, not routes here.
 */
export function SiteHeader() {
	return (
		// No background, no rule: the header floats over the stage so the truss
		// reads as the top of the frame. Anything opaque here re-introduces the
		// seam that made the beams look like they started halfway down.
		<header className="absolute inset-x-0 top-0 z-50">
			<nav
				aria-label="Primary"
				className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6"
			>
				<Link
					to="/"
					className="u-display text-lg text-fg transition-opacity hover:opacity-70"
				>
					{SITE.name}
				</Link>

				<ul className="u-label flex items-center gap-6">
					{NAV_LINKS.map((link) => (
						<li key={link.to}>
							<Link
								to={link.to}
								className="text-fg-muted transition-colors hover:text-fg"
								activeProps={{ className: "text-fg" }}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>

				<ul className="u-label ml-auto flex items-center gap-5">
					{SOCIAL_LINKS.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer noopener"
								className="text-fg-subtle transition-colors hover:text-fg"
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
}
