import { Link } from "@tanstack/react-router";

import { NAV_LINKS, SITE, SOCIAL_LINKS } from "#/lib/site";

/**
 * Sticky top bar. Internal nav uses router `Link` (so `defaultPreload:
 * "intent"` prefetches the loader on hover); external links are plain
 * anchors — sibling apps are separate deployments, not routes here.
 */
export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 border-b border-line/80 bg-bg/80 backdrop-blur-md">
			<nav
				aria-label="Primary"
				className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6"
			>
				<Link
					to="/"
					className="font-semibold tracking-tight text-fg transition-colors hover:text-accent"
				>
					{SITE.name}
				</Link>

				<ul className="flex items-center gap-6 text-sm">
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

				<ul className="ml-auto flex items-center gap-5 font-mono text-xs uppercase tracking-[0.18em]">
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
