import { Marquee } from "#/components/stage/marquee";
import { Position } from "#/components/stage/position";
import { Scene } from "#/components/stage/scene";
import type { Project } from "#/lib/projects";

/**
 * The first screen: the marquee above, the three products standing on the
 * deck below, the rig lighting them from the backdrop.
 *
 * `positions` arrive in stage order — Signal, Session, Ignition — from the
 * catalogue; the one named `centre` stands downstage centre.
 */
export function Stage({
	positions,
	centre = "session",
}: {
	positions: readonly Project[];
	centre?: Project["slug"];
}) {
	return (
		<Scene>
			{/* Clear of the floating header: the eyebrow is the first thing on
			    the page, and it must not sit in the nav bar's own band. */}
			<section className="stage-w flex min-h-[100svh] flex-col px-6 pt-24 pb-[12vh] 2xl:pt-32">
				<Marquee />

				{/*
				  `items-stretch` (the default) gives all three cells one height,
				  so each position can pin its address to the same bottom line
				  while its top edge — and the centre's deliberate drop — stays
				  where it is blocked. The section's deep bottom padding is what
				  stops `mt-auto` from pushing them under the pools their own
				  beams throw — lit stage, dark performers.
				*/}
				<div className="mt-auto grid grid-cols-1 gap-6 pt-10 md:grid-cols-3 md:gap-6 2xl:pt-16">
					{positions.map((project) => (
						<Position
							key={project.slug}
							project={project}
							centre={project.slug === centre}
						/>
					))}
				</div>
			</section>
		</Scene>
	);
}
