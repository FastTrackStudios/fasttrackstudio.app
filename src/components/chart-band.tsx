import { Link } from "@tanstack/react-router";

import { ProductLink } from "#/components/product-link";
import { ProjectIcon } from "#/components/project-icon";
import type { Project } from "#/lib/projects";

/**
 * Keyflow's splash, in the band directly under the stage.
 *
 * A splash, not a pitch: Keyflow already has a full landing page of its own
 * at keyflow.fasttrackstudio.app, so duplicating that argument here would
 * mean two pages to keep in step and one of them always stale. This says
 * what it is, shows a chart, and sends you there.
 *
 * It is deliberately NOT a fourth stage position. The three specials are
 * instruments standing in their own light; the format is the paper they all
 * read off, so it sits on the deck below them.
 */
export function ChartBand({ project }: { project: Project }) {
	return (
		<section
			aria-labelledby="chart-band-heading"
			className="relative border-t border-line bg-void"
			style={{ ["--accent" as string]: project.accent }}
		>
			<div className="stage-w grid items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-24">
				<div>
					<p className="u-label text-fg-subtle">The score everything reads</p>

					<div className="mt-6 flex items-center gap-5">
						<ProjectIcon project={project} size={64} className="rounded-xl" />
						<div>
							<h2
								id="chart-band-heading"
								className="u-display text-[clamp(2.25rem,5vw,4rem)] text-fg"
							>
								{project.name}
							</h2>
							<p className="u-label mt-2 text-[var(--accent)]">
								{project.tagline}
							</p>
						</div>
					</div>

					<p className="mt-7 max-w-lg leading-relaxed text-fg-muted">
						{project.description}
					</p>

					<div className="mt-9 flex flex-wrap items-center gap-3">
						<ProductLink project={project} />
						<Link
							to="/projects/$slug"
							params={{ slug: project.slug }}
							className="u-label px-3 py-2.5 text-fg-subtle transition-colors hover:text-fg"
						>
							Details →
						</Link>
					</div>
				</div>

				<figure className="m-0 overflow-hidden rounded-card border border-line bg-bg">
					<figcaption className="u-label flex items-center gap-3 border-b border-line px-5 py-3.5 text-fg-subtle">
						<span aria-hidden="true" className="text-[var(--accent)]">
							{project.glyph}
						</span>
						build-my-life.kf
					</figcaption>
					<ChartSample />
				</figure>
			</div>
		</section>
	);
}

/**
 * A real chart in the format, from Keyflow's README — the header, numbered
 * sections, and the ChordPro block that layers lyrics onto them. A format is
 * best argued by showing the file.
 *
 * Marked up by hand rather than run through a highlighter: it is one fixed
 * sample, and shipping a syntax-highlighting dependency to colour a constant
 * is a poor trade on a landing page.
 */
function ChartSample() {
	return (
		<pre className="overflow-x-auto px-5 py-6 font-mono text-[0.8rem] leading-relaxed text-fg-muted">
			<code>
				<span className="text-fg-subtle">--- keyflow ---{"\n"}</span>
				<span className="text-fg">Build My Life</span>
				<span className="text-fg-subtle"> - Housefires{"\n"}</span>
				<span className="text-fg-subtle">72bpm 4/4 </span>
				<span className="text-[var(--accent)]">#G{"\n\n"}</span>
				<span className="text-[var(--accent)]">Intro: </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">1 4 </span>
				<span className="text-fg-subtle">|{"\n\n"}</span>
				<span className="text-[var(--accent)]">VS 1: </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">1 4 </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">5 6- </span>
				<span className="text-fg-subtle">|{"\n\n"}</span>
				<span className="text-[var(--accent)]">CH: </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">4 1 </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">5 6- </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">4 1 </span>
				<span className="text-fg-subtle">| </span>
				<span className="text-fg">5 </span>
				<span className="text-fg-subtle">| x2{"\n\n"}</span>
				<span className="text-fg-subtle">--- chordpro ---{"\n"}</span>
				<span className="text-[var(--accent)]">
					{"{sov: Verse 1 sync=lines}"}
				</span>
				{"\n"}
				<span className="text-fg-subtle">[</span>
				<span className="text-fg">G</span>
				<span className="text-fg-subtle">]</span>
				Worthy of every so
				<span className="text-fg-subtle">[</span>
				<span className="text-fg">C/G</span>
				<span className="text-fg-subtle">]</span>
				ng we could ever sing{"\n"}
				<span className="text-[var(--accent)]">{"{eov}"}</span>
			</code>
		</pre>
	);
}
