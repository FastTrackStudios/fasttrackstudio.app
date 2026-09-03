import { useEffect, useRef } from "react";

import { ChartFlow } from "#/components/chart-flow";
import { ProjectIcon } from "#/components/project-icon";
import type { Project } from "#/lib/projects";

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
				// theme block because it belongs to this band, not the site.
				["--accent-far" as string]: "#6ea8fe",
			}}
		>
			{/*
			  Measured with `max-w-6xl`, NOT the `stage-w` utility. `--stage-w`
			  is declared on `.scene`, and this band deliberately sits outside
			  it — so `stage-w` here resolves to nothing but a stray
			  `container-type`, and the band should read narrower than the stage
			  in any case: it is a signpost, not a fourth position.

			  The demo column is capped rather than left to fill `1fr`, because
			  at full width the preview is ~900px tall and the band grows past a
			  viewport.
			*/}
			<div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[minmax(0,28rem)_minmax(0,34rem)] lg:justify-center lg:gap-16 lg:py-24">
				<div>
					<div className="flex items-center gap-4">
						<ProjectIcon
							project={project}
							size={44}
							className="rounded-[22%]"
						/>
						<p className="u-label text-fg-subtle">
							{project.name} · the score everything reads
						</p>
					</div>

					<h2
						id="chart-band-heading"
						className="mt-7 text-[clamp(2.2rem,4.4vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-balance text-fg"
					>
						Chart Writing,{" "}
						{/* One word, never wrapped: the gradient is clipped to the text,
						    and a line break inside it restarts the sweep on the second
						    line box. */}
						<span className="accel whitespace-nowrap">Accelerated</span>
					</h2>

					<ChartFlow className="mt-8" />

					<div className="mt-9 flex flex-wrap items-center gap-3">
						<a
							href={`${project.site?.url}/editor`}
							className="u-label rounded-card border border-fg/70 px-5 py-3 text-fg transition-colors duration-300 hover:bg-fg hover:text-void"
						>
							Open the editor
						</a>
						<a
							href={`${project.site?.url}/guide`}
							className="u-label rounded-card border border-line-strong px-5 py-3 text-fg-muted transition-colors duration-300 hover:border-fg hover:text-fg"
						>
							Read the guide
						</a>
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

/**
 * The live preview from Keyflow's own hero — the source typing itself while
 * the engraved page re-renders beside it, keystroke by keystroke.
 *
 * It is a recording, not the component. That component is Dioxus/WASM and
 * cannot be imported into a TypeScript app, and standing up a whole WASM
 * bundle on the apex page to draw one loop would cost far more than it is
 * worth here. `tools/record-keyflow-preview.ts` drives the DEPLOYED page over
 * CDP and captures exactly one chart cycle, so the loop is seamless and
 * re-recording it is one command when the design changes.
 *
 * `<video>` rather than a GIF: the same loop is half the bytes as video, at
 * 1000px/25fps against 760px/14fps, and stays sharp instead of being
 * quantised to 256 colours. The poster is the first frame, so nothing pops in.
 */
function ChartDemo({ project }: { project: Project }) {
	const video = useRef<HTMLVideoElement>(null);

	/*
	 * The stylesheet's `prefers-reduced-motion` block zeroes every animation
	 * on the page, but CSS cannot stop a video — without this, the one thing
	 * that moves most would be the one thing that ignored the request.
	 *
	 * Done in an effect rather than by rendering `autoPlay` conditionally:
	 * the server has no media queries, so branching on it during render would
	 * produce markup that disagrees with the client and a hydration error.
	 * The video is paused on mount instead, and falls back to its poster —
	 * which is the first frame, so the figure still shows the chart.
	 */
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");

		function apply() {
			const element = video.current;
			if (!element) return;
			if (media.matches) {
				element.pause();
				element.currentTime = 0;
			} else {
				// Rejected autoplay is normal (a policy, a background tab); there
				// is nothing to recover, so the promise is simply not awaited.
				void element.play().catch(() => {});
			}
		}

		apply();
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, []);

	return (
		<figure className="m-0 w-full overflow-hidden rounded-card border border-line bg-bg">
			<video
				ref={video}
				src="/media/keyflow-preview.mp4"
				poster="/media/keyflow-preview.jpg"
				// A silent looping demo, so it may autoplay: `muted` and
				// `playsInline` are both required or iOS refuses and Chrome
				// blocks it.
				autoPlay
				muted
				loop
				playsInline
				// It carries no information the copy beside it does not, and a
				// screen reader announcing a video here is noise.
				aria-hidden="true"
				tabIndex={-1}
				width={1000}
				height={910}
				className="block h-auto w-full"
			/>
			<figcaption className="u-label flex items-center gap-3 border-t border-line px-5 py-3.5 text-fg-subtle">
				<span aria-hidden="true" className="text-[var(--accent)]">
					{project.glyph}
				</span>
				Engraving live, on keyflow.fasttrackstudio.app
			</figcaption>
		</figure>
	);
}
