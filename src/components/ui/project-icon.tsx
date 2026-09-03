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
 *
 * Not lazy-loaded: every one of these is in the first viewport, and a lazy
 * image above the fold is a plate that pops in after the name.
 *
 * `size` is the intrinsic box, so layout never shifts. A caller may scale
 * the rendered width with a class (`w-9 2xl:w-11`); height follows because
 * the base styles keep images at `height: auto`.
 *
 * `lit` adds the plate's glow (`.plate` in styles/stage.css). A dark launcher
 * tile on the black deck is invisible without it; on a lit surface it is not
 * needed.
 */
export function ProjectIcon({
	project,
	size = 32,
	lit = false,
	className = "",
}: {
	project: Project;
	/** Rendered box in px. Also the intrinsic size, so it never reflows. */
	size?: number;
	lit?: boolean;
	className?: string;
}) {
	return (
		<img
			src={project.icon}
			alt=""
			aria-hidden="true"
			width={size}
			height={size}
			// Icons are square plates with their own rounded corners baked in;
			// the box must not letterbox them if a caller passes a stretched one.
			className={`aspect-square h-auto shrink-0 select-none rounded-[22%] object-contain ${lit ? "plate" : ""} ${className}`}
			decoding="async"
		/>
	);
}
