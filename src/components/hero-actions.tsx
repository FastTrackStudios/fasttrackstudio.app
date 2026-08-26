import { Link } from "@tanstack/react-router";

import { ACTIONS } from "#/lib/site";

/**
 * The hero's three calls to action.
 *
 * Greyscale by design: on this page colour is product identity, so a button
 * that borrowed Signal's blue would read as being about Signal. The first
 * action carries a brighter border instead — weight, not hue, marks priority.
 */

const BASE =
	"u-label inline-flex items-center gap-2 rounded-card border px-6 py-3 transition-colors duration-300";

export function HeroActions({ className = "" }: { className?: string }) {
	return (
		<div
			className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
		>
			{ACTIONS.map((action, i) => {
				const emphasis =
					i === 0
						? "border-fg/70 text-fg hover:border-fg hover:bg-fg hover:text-void"
						: "border-line-strong text-fg-muted hover:border-fg hover:text-fg";

				// Nothing to link to yet: render a disabled control, not an
				// anchor. A button that 404s is worse than one that says wait.
				if (action.kind === "soon") {
					return (
						<span
							key={action.label}
							aria-disabled="true"
							// Without an explicit label the two spans concatenate to
							// "Forumsoon" for a screen reader.
							aria-label={`${action.label} — coming soon`}
							className={`${BASE} cursor-not-allowed border-line text-fg-subtle`}
						>
							<span aria-hidden="true">{action.label}</span>
							<span aria-hidden="true" className="text-[0.625rem] opacity-70">
								soon
							</span>
						</span>
					);
				}

				if (action.kind === "external") {
					return (
						<a
							key={action.label}
							href={action.href}
							target="_blank"
							rel="noreferrer noopener"
							className={`${BASE} ${emphasis}`}
						>
							{action.label}
						</a>
					);
				}

				return (
					<Link
						key={action.label}
						to={action.to}
						className={`${BASE} ${emphasis}`}
					>
						{action.label}
					</Link>
				);
			})}
		</div>
	);
}
