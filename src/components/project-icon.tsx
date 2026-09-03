import type { Project } from "#/lib/projects";

/**
 * A product's shipped app icon, at the size the caller asks for.
 *
 * These are the real launcher icons, copied out of each product's own repo
 * (see `Project.icon`), so the thing beside the name here is the same thing
 * that sits in a dock. They are `<img>` rather than inlined SVG on purpose:
 * every one of them declares gradients under the same ids (`plate`,
 * `ambient`, …), and inlining four of those into one document makes the last
 * definition win for all of them.
 *
 * Decorative: the product name is always right next to it, so announcing the
 * icon too would just make a screen reader say the name twice.
 */
export function ProjectIcon({
	project,
	className = "",
	size = 32,
}: {
	project: Project;
	className?: string;
	/** Rendered box in px. Also the intrinsic size, so it never reflows. */
	size?: number;
}) {
	if (!project.icon) {
		return (
			<span
				aria-hidden="true"
				className={`inline-flex shrink-0 items-center justify-center font-mono ${className}`}
				style={{ width: size, height: size, color: project.accent }}
			>
				{project.glyph}
			</span>
		);
	}

	return (
		<img
			src={project.icon}
			alt=""
			aria-hidden="true"
			width={size}
			height={size}
			// Icons are square plates with their own rounded corners baked in;
			// the box must not letterbox them if a caller passes a stretched one.
			className={`shrink-0 select-none object-contain ${className}`}
			style={{ width: size, height: size }}
			loading="lazy"
			decoding="async"
		/>
	);
}
