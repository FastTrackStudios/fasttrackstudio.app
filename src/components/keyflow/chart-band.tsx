import { ChartDemo } from "#/components/keyflow/chart-demo";
import { ChartFlow } from "#/components/keyflow/chart-flow";
import { ExternalAction } from "#/components/ui/action";
import { ProjectIcon } from "#/components/ui/project-icon";
import type { Project } from "#/lib/projects";
import { hostOf } from "#/lib/url";

/**
 * Keyflow's splash, in the band directly under the stage.
 *
 * A splash, not a second pitch. Keyflow already has a strong landing page of
 * its own at keyflow.fasttrackstudio.app, so this brings ACROSS that page's
 * argument — its headline, its flow triangle, its two calls to action — and
 * sends you there, rather than inventing a competing one that would drift
 * out of step with it.
 *
 * It is deliberately NOT a fourth stage position. The three specials are
 * instruments and each owns a colour; the format is the paper they all read
 * off, so it stands on the deck below them.
 */
export function ChartBand({ project }: { project: Project }) {
	return (
		<section
			aria-labelledby="chart-band-heading"
			className="relative border-t border-line bg-void"
			style={{
				["--accent" as string]: project.accent,
				// The far stop of Keyflow's sweep — its own dark theme runs
				// violet through blue and back. Declared here rather than in the
				// theme because it belongs to this band, not the site.
				["--accent-far" as string]: "#6ea8fe",
			}}
		>
			{/*
			  Measured with `max-w-6xl`, NOT the `stage-w` utility: this band
			  sits outside `.scene`, and it should read narrower than the stage
			  in any case — it is a signpost, not a fourth position. The demo
			  column is capped rather than left to fill `1fr`, because at full
			  width the preview is ~900px tall and the band grows past a viewport.
			*/}
			<div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,32rem)] lg:justify-center lg:gap-16 2xl:grid-cols-[minmax(0,28rem)_minmax(0,34rem)] 2xl:py-24">
				<div>
					{/* The band's own way out: the icon and the address are one
					    link to the product's site, the same way a position is. */}
					<a
						href={project.site.url}
						className="group inline-flex items-center gap-4 text-fg-subtle transition-colors duration-300 hover:text-fg"
					>
						<ProjectIcon
							project={project}
							size={44}
							className="w-10 2xl:w-11"
							lit
						/>
						<span className="u-label">
							{project.name} · {hostOf(project.site.url)}{" "}
							<span
								aria-hidden="true"
								className="inline-block transition-transform duration-300 group-hover:translate-x-[0.15em] group-hover:-translate-y-[0.15em]"
							>
								↗
							</span>
						</span>
					</a>

					<h2
						id="chart-band-heading"
						className="mt-7 text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-balance text-fg"
					>
						Chart Writing,{" "}
						{/* One word, never wrapped: the gradient is clipped to the
						    text, and a line break inside it restarts the sweep on the
						    second line box. */}
						<span className="accel whitespace-nowrap">Accelerated</span>
					</h2>

					<ChartFlow className="mt-8" />

					<div className="mt-9 flex flex-wrap items-center gap-3">
						<ExternalAction
							href={`${project.site.url}/editor`}
							emphasis="primary"
							size="sm"
						>
							Open the editor
						</ExternalAction>
						<ExternalAction href={`${project.site.url}/guide`} size="sm">
							Read the guide
						</ExternalAction>
					</div>

					<p className="u-label mt-6 text-fg-subtle">
						Open source · No account required
					</p>
				</div>

				<ChartDemo project={project} />
			</div>
		</section>
	);
}
