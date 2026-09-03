import { Link } from "@tanstack/react-router";

import { PRODUCTS } from "#/content/products";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "#/content/site";
import { hostOf } from "#/lib/url";

export function SiteFooter() {
	return (
		// No top margin of its own: whatever page ends above it owns the gap, so
		// the landing page's band can butt straight up against it while a text
		// page keeps its own bottom padding.
		<footer className="border-t border-line bg-surface/40">
			<div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
				<div className="flex flex-col gap-4">
					<Link
						to="/"
						className="u-display self-start text-lg text-fg transition-opacity hover:opacity-70"
					>
						{SITE.name}
					</Link>
					<p className="max-w-sm text-sm leading-relaxed text-fg-muted">
						{SITE.description}
					</p>
				</div>

				{/* Every product, by address — from the same table the stage links
				    from, so the footer can never name a site the stage does not. */}
				<FooterColumn title="Products">
					{PRODUCTS.map((product) => (
						<li key={product.slug}>
							<a
								href={product.url}
								className="group inline-flex flex-col gap-1 text-fg-muted transition-colors hover:text-fg"
							>
								<span>{product.name}</span>
								<span className="font-mono text-[0.6875rem] text-fg-subtle transition-colors group-hover:text-fg-muted">
									{hostOf(product.url)}
								</span>
							</a>
						</li>
					))}
				</FooterColumn>

				<FooterColumn title="More">
					{NAV_LINKS.map((link) => (
						<li key={link.to}>
							<Link
								to={link.to}
								className="text-fg-muted transition-colors hover:text-fg"
							>
								{link.label}
							</Link>
						</li>
					))}
					{SOCIAL_LINKS.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								target="_blank"
								rel="noreferrer noopener"
								className="text-fg-muted transition-colors hover:text-fg"
							>
								{link.label}
							</a>
						</li>
					))}
				</FooterColumn>
			</div>

			<div className="border-t border-line">
				<p className="mx-auto max-w-6xl px-6 py-6 font-mono text-xs text-fg-subtle">
					{SITE.name} — open source, {SITE.license}.
				</p>
			</div>
		</footer>
	);
}

function FooterColumn({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<nav aria-label={title} className="flex flex-col gap-4">
			<p className="u-label text-fg-subtle">{title}</p>
			<ul className="flex flex-col gap-4 text-sm">{children}</ul>
		</nav>
	);
}
