import { ProjectIcon } from "#/components/ui/project-icon";
import { rise } from "#/lib/motion";
import type { Capability, Project } from "#/lib/projects";

/**
 * One position on the stage — and the way off this site to the product.
 *
 * The WHOLE position is one link to the product's own site. There is no page
 * for it here: every product is its own deployment, and this page is the
 * front door. Making the entire block the target means there is nothing to
 * aim for — the name, the icon, the capabilities and the address are all one
 * control, and one hover lights one beam.
 *
 * `centre` is not styling for its own sake: Session stands downstage centre
 * because it coordinates the other two, so it is set larger and lower in the
 * frame — nearer the audience — the way a director would block it.
 *
 * `.pos` carries the lighting cue: `.scene:has(.pos:hover)` in
 * styles/stage.css brings this beam up and takes the other two down.
 */
export function Position({
	project,
	centre = false,
}: {
	project: Project;
	centre?: boolean;
}) {
	return (
		<a
			href={project.site.url}
			data-id={project.slug}
			aria-label={`${project.name} — ${project.tagline}. Read more`}
			// The centre position starts lower — downstage — but ends on the
			// same line as the wings, so the three addresses read as one row.
			className={`pos rise group relative flex flex-col rounded-card px-2 py-4 text-center outline-offset-8 md:px-4 2xl:py-6 ${
				centre ? "md:pt-8 2xl:pt-12" : ""
			}`}
			style={{
				// Session comes up a beat after the wings: the coordinator
				// arrives once the two it drives are already standing.
				...rise(centre ? 640 : 560),
				// @ts-expect-error -- custom property
				"--accent": project.accent,
			}}
		>
			{/* Phone-only light: once the products stack, each one hangs its
			    own spot overhead — see "One light per product" in stage.css. */}
			<span
				aria-hidden="true"
				className="pos-light md:hidden"
				style={{
					// @ts-expect-error -- custom property
					"--beam": project.accent,
				}}
			/>

			<span className="relative flex flex-1 flex-col">
				{/* Channel label — the instrument's colour is the only colour on
				    the page, so it belongs on the identifier. */}
				<span className="u-label block text-[var(--accent)]">
					{project.tagline}
				</span>

				<span className="mt-4 flex items-center justify-center gap-3 md:gap-4 2xl:mt-5">
					<ProjectIcon
						project={project}
						size={centre ? 56 : 44}
						className={centre ? "w-11 2xl:w-14" : "w-9 2xl:w-11"}
						lit
					/>
					<span
						className={`u-display block text-fg ${
							centre
								? "text-[calc(var(--ui)*clamp(2.25rem,min(6cqw,11vh),8rem))]"
								: "text-[calc(var(--ui)*clamp(1.85rem,min(4.6cqw,8.5vh),6.25rem))]"
						}`}
					>
						{project.name}
					</span>
				</span>

				{/* The instrument's own rule, brightening as its beam comes up. */}
				<span
					aria-hidden="true"
					className="mx-auto mt-4 block h-px w-10 2xl:mt-5 bg-[var(--accent)] opacity-50 transition-all duration-500 group-hover:w-20 group-hover:opacity-100 group-focus-visible:w-20 group-focus-visible:opacity-100"
				/>

				<Capabilities items={project.capabilities} />

				<ReadMore />
			</span>
		</a>
	);
}

/**
 * Three capabilities, not a sentence. Left-aligned inside a centred block —
 * centred list items with leading markers look ragged on both edges — at a
 * fixed measure so all three positions share one left edge.
 *
 * The marker is a short rule in the product's colour: the same patch-cable
 * stub used under the name, so the position reads as one channel rather
 * than a name plus unrelated bullets.
 */
function Capabilities({ items }: { items: readonly Capability[] }) {
	return (
		<span className="mt-5 flex justify-center 2xl:mt-6">
			<span className="flex w-full max-w-[15rem] flex-col gap-2.5 text-left">
				{items.map((capability) => (
					<span key={capability.label} className="flex items-baseline gap-3">
						<span
							aria-hidden="true"
							className="mt-[0.45rem] h-px w-3 shrink-0 bg-[var(--accent)] opacity-60"
						/>
						<span className="text-sm leading-snug text-fg-muted">
							{capability.label}
							{capability.tags ? (
								// A set, not a slash-jammed string: the members on their
								// own line read as members.
								<span className="u-label mt-1.5 block text-fg-subtle">
									{capability.tags.join(" · ")}
								</span>
							) : null}
						</span>
					</span>
				))}
			</span>
		</span>
	);
}

/**
 * The affordance. The whole position is the link, so this is not a second
 * target — it is the one line that says the block goes somewhere. It sits
 * quiet until the block is engaged, then brightens with the beam and the
 * arrow moves, the same cue every other link on the page gives.
 */
function ReadMore() {
	return (
		<span className="mt-auto flex justify-center pt-7 2xl:pt-9">
			<span className="u-label inline-flex items-center gap-2 rounded-card border border-line px-4 py-2.5 text-fg-muted transition-colors duration-300 group-hover:border-fg group-hover:text-fg group-focus-visible:border-fg group-focus-visible:text-fg">
				Read more
				<span
					aria-hidden="true"
					className="pos-arrow inline-block transition-transform duration-300"
				>
					→
				</span>
			</span>
		</span>
	);
}
