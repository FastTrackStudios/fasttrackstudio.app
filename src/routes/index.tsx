import { createFileRoute, Link } from "@tanstack/react-router";

import { ChartBand } from "#/components/chart-band";
import { HeroActions } from "#/components/hero-actions";
import { PlatformSupport } from "#/components/platform-support";
import { ProductLink } from "#/components/product-link";
import { ProjectIcon } from "#/components/project-icon";
import { Scene } from "#/components/stage";
import { fetchLanding } from "#/fn/projects";
import type { Project } from "#/lib/projects";
import { HERO, SITE } from "#/lib/site";

export const Route = createFileRoute("/")({
	// Full SSR. This is the page search engines and link unfurlers read, so
	// the markup has to exist in the first response — never `data-only` here.
	ssr: true,
	head: () => ({
		meta: [
			{ title: `${SITE.name} — ${SITE.tagline}` },
			{ name: "description", content: SITE.description },
		],
	}),
	loader: () => fetchLanding(),
	component: Home,
});

function Home() {
	const { positions, format } = Route.useLoaderData();

	return (
		<>
			<Scene>
				<section className="stage-w flex min-h-[100svh] flex-col px-6 pt-14 pb-[15vh]">
					<Marquee />

					{/*
				  The rig. Three positions across the stage: Signal at stage left,
				  Session downstage centre, Ignition at stage right. `items-end`
				  stands them on the deck rather than floating them in the frame.

				  The section carries a deep bottom padding so `mt-auto` stops
				  short of the floor: pushed all the way down, the products sat
				  BELOW the pools their own beams were throwing — lit stage, dark
				  performers. They stand in the light now.
				*/}
					<div className="mt-auto grid grid-cols-1 items-end gap-10 pt-2 md:grid-cols-3 md:gap-6">
						{positions.map((project, i) => (
							<Position
								key={project.slug}
								project={project}
								centre={project.slug === "session"}
								// Alternating wings, so no two neighbours are lit from
								// the same side once they stack.
								side={i % 2 === 0 ? -1 : 1}
							/>
						))}
					</div>

					<div className="mt-6 flex justify-center">
						<Link
							to="/projects"
							className="u-label text-fg-subtle transition-colors hover:text-fg"
						>
							Everything else →
						</Link>
					</div>
				</section>
			</Scene>

			{/* Under the stage, outside <Scene>: the band is lit by the house,
			    not by the rig, so it must not sit inside the beams' stacking
			    context or pick up their cues. */}
			{format ? <ChartBand project={format} /> : null}
		</>
	);
}

/**
 * The headline. Set in the condensed display face at marquee scale, because
 * the thing above a stage is a marquee.
 *
 * "OPEN" is the only word that changes weight — the claim is in the first
 * line, the position is in the second, and putting emphasis on both would
 * flatten them into one shout.
 */
function Marquee() {
	return (
		// Measure widens with the display so the headline is not stuck in an
		// 896px column in the middle of a 5120px stage.
		<header className="mx-auto max-w-[56rem] text-center min-[1600px]:max-w-[76rem] min-[2200px]:max-w-[108rem]">
			{/* Hidden on phones: stacked directly above the marquee it crowded
			    the top of the frame, and the three products name the same three
			    domains a screen further down anyway. */}
			<p
				className="u-label hidden text-fg-subtle md:block"
				style={{ animation: "rise 700ms ease-out 100ms backwards" }}
			>
				{SITE.domains}
			</p>

			<h1
				className="u-display mt-6 text-[clamp(2.25rem,min(7.6cqw,13.5vh),11rem)] text-fg"
				style={{ animation: "rise 700ms ease-out 200ms backwards" }}
			>
				{HERO.lead}
			</h1>

			<p
				className="u-display mt-3 text-[clamp(1.55rem,2.9cqw,3.5rem)] text-fg-muted"
				style={{ animation: "rise 700ms ease-out 320ms backwards" }}
			>
				{HERO.stance.before}
				<span className="text-fg">{HERO.stance.emphasis}</span>
			</p>

			{/* Platforms as marks rather than a sentence: three logos are read at
			    a glance, where "runs on Linux, macOS and Windows" has to be read
			    word by word and was competing with the subhead for the same
			    breath. */}
			<PlatformSupport
				className="mt-9"
				style={{ animation: "rise 700ms ease-out 540ms backwards" }}
			/>

			<div style={{ animation: "rise 700ms ease-out 620ms backwards" }}>
				<HeroActions className="mt-6" />
			</div>
		</header>
	);
}

/**
 * One position on the stage.
 *
 * `centre` is not styling for its own sake: Session stands downstage centre
 * because it coordinates the other two, so it is set larger and lower in the
 * frame — nearer the audience — the way a director would block it.
 *
 * `.pos` sits on the WRAPPER, not on the link. The lighting cue keys off
 * `.pos:hover` / `.pos:focus-within` (see `.scene:has(...)` in styles.css),
 * and the wrapper is what contains both the link and the product-site button
 * — so either one brings the beam up, and the button is a SIBLING of the
 * link rather than nested inside it. A control inside an anchor is invalid
 * HTML and leaves a keyboard user with two overlapping targets.
 */
function Position({
	project,
	centre,
	side,
}: {
	project: Project;
	centre: boolean;
	/** -1 lights this product from the left wing, 1 from the right. */
	side: -1 | 1;
}) {
	return (
		<div
			data-id={project.slug}
			className={`pos group relative rounded-card px-2 py-6 text-center transition-transform duration-500 md:px-4 ${
				centre ? "md:-mb-6 md:pb-10" : "md:mb-4"
			}`}
			style={{
				animation: `rise 800ms ease-out ${560 + (centre ? 80 : 0)}ms backwards`,
			}}
		>
			{/*
			  Phone-only light, rendered INSIDE the product and clipped to it.

			  The rig's beams are hung on a shared truss, which is right when the
			  three stand side by side but wrong once they stack: a shaft long
			  enough to reach the bottom product crosses the two above it, and
			  the straight clip edges cut diagonal lines through the type. Giving
			  each product its own contained light means one can never spill onto
			  another.
			*/}
			<span
				aria-hidden="true"
				className="pos-light md:hidden"
				style={{
					// @ts-expect-error -- custom properties
					"--beam": project.accent,
					"--side": side,
				}}
			/>

			<Link
				to="/projects/$slug"
				params={{ slug: project.slug }}
				className="block"
			>
				<span className="relative block">
					{/* Channel label — the instrument's colour is the only colour on the
			    page, so it belongs on the identifier. */}
					<span className="u-label block" style={{ color: project.accent }}>
						{project.tagline}
					</span>

					{/* The shipped app icon sits with the name, and is lit in the same
				    hue: each product's accent is taken from its icon, so the plate
				    and the beam on it agree. */}
					<span className="mt-4 flex items-center justify-center gap-3 md:gap-4">
						<ProjectIcon
							project={project}
							size={centre ? 56 : 44}
							className="rounded-[22%]"
						/>
						<span
							className={`u-display block text-fg transition-colors duration-300 ${
								centre
									? "text-[clamp(2.25rem,min(6cqw,11vh),8rem)]"
									: "text-[clamp(1.85rem,min(4.6cqw,8.5vh),6.25rem)]"
							}`}
						>
							{project.name}
						</span>
					</span>

					{/* The instrument's own rule, brightening as its beam comes up. */}
					<span
						aria-hidden="true"
						className="mx-auto mt-4 block h-px w-10 opacity-50 transition-all duration-500 group-hover:w-20 group-hover:opacity-100 group-focus-visible:w-20 group-focus-visible:opacity-100"
						style={{ backgroundColor: project.accent }}
					/>

					{/*
			  Three capabilities, not a sentence. The list is left-aligned inside
			  a centred block: centred list items with leading markers look
			  ragged on both edges and are harder to scan.

			  The marker is a short rule in the product's colour — the same patch
			  -cable stub used under the name, so the whole position reads as one
			  channel rather than a name plus unrelated bullets.
			*/}
					<span className="mt-4 flex justify-center">
						{/* Fixed measure so all three lists share one left edge. Centring
				    each list as a block let a wider list (Signal's, with its tag
				    line) start further left than its neighbours, which reads as
				    ragged once the columns stack on a phone. */}
						<span className="flex w-full max-w-[15rem] flex-col gap-2.5 text-left">
							{project.capabilities.map((capability) => (
								<span
									key={capability.label}
									className="flex items-baseline gap-3"
								>
									<span
										aria-hidden="true"
										className="mt-[0.45rem] h-px w-3 shrink-0 opacity-60"
										style={{ backgroundColor: project.accent }}
									/>
									<span className="text-sm leading-snug text-fg-muted">
										{capability.label}
										{capability.tags ? (
											// A set, not a slash-jammed string: rendering the
											// members on their own line keeps the capability
											// readable and lets the members read as members.
											<span className="u-label mt-1.5 block text-fg-subtle">
												{capability.tags.join(" · ")}
											</span>
										) : null}
									</span>
								</span>
							))}
						</span>
					</span>
				</span>
			</Link>

			{/* Where the product itself will live. Three of the four are not
			    deployed yet, so this renders disabled rather than absent —
			    naming the address is the point. Outside the link on purpose: see
			    the note on `.pos` above. */}
			<div className="relative mt-7 flex justify-center">
				<ProductLink project={project} />
			</div>
		</div>
	);
}
