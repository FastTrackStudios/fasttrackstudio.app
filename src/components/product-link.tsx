import type { Project } from "#/lib/projects";

/**
 * The button to a product's own site.
 *
 * Only Keyflow is actually deployed today. The other three subdomains are
 * named and reserved, and answer from a wildcard with a blank page — so they
 * render as a disabled control rather than a link. Shipping a button that
 * lands on nothing costs more trust than one that says "soon", and the same
 * rule already governs the hero's Forum action.
 *
 * Greyscale, like every other control on this page: colour here is product
 * identity, and it is already spent on the name and the icon directly above.
 */
const BASE =
	"u-label inline-flex items-center gap-2 rounded-card border px-5 py-2.5 transition-colors duration-300";

export function ProductLink({
	project,
	className = "",
}: {
	project: Project;
	className?: string;
}) {
	if (!project.site) return null;

	/** `keyflow.fasttrackstudio.app` — the address is the label. */
	const host = project.site.url.replace(/^https?:\/\//, "");

	if (!project.site.live) {
		return (
			<button
				type="button"
				// `aria-disabled` rather than `disabled`: a disabled button leaves
				// the tab order, so a keyboard user never learns the address exists.
				// This one is reachable, announced as unavailable, and inert.
				aria-disabled="true"
				// Without this the two spans run together into "…appsoon".
				aria-label={`${host} — coming soon`}
				className={`${BASE} cursor-not-allowed border-line text-fg-subtle ${className}`}
			>
				<span aria-hidden="true">{host}</span>
				<span aria-hidden="true" className="text-[0.625rem] opacity-70">
					soon
				</span>
			</button>
		);
	}

	return (
		<a
			href={project.site.url}
			className={`${BASE} border-fg/70 text-fg hover:bg-fg hover:text-void ${className}`}
		>
			{host} →
		</a>
	);
}
