import { Link } from "@tanstack/react-router";

import { WaitlistForm } from "#/components/waitlist-form";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "#/lib/site";

export function SiteFooter() {
	return (
		<footer className="mt-24 border-t border-line bg-surface/40">
			<div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[2fr_1fr]">
				<div className="flex flex-col gap-4">
					<p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">
						Stay in the loop
					</p>
					<p className="max-w-md text-sm leading-relaxed text-fg-muted">
						Release notes when something ships. No cadence, no marketing.
					</p>
					<WaitlistForm />
				</div>

				<nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="text-fg-muted transition-colors hover:text-fg"
						>
							{link.label}
						</Link>
					))}
					{SOCIAL_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noreferrer noopener"
							className="text-fg-muted transition-colors hover:text-fg"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>

			<div className="border-t border-line">
				<p className="mx-auto max-w-6xl px-6 py-6 font-mono text-xs text-fg-subtle">
					{SITE.name} — open source, GPL-3.0-or-later.
				</p>
			</div>
		</footer>
	);
}
