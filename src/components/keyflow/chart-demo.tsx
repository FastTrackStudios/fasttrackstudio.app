import { useEffect, useRef } from "react";

import type { Project } from "#/lib/projects";

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
export function ChartDemo({ project }: { project: Project }) {
	const video = useRef<HTMLVideoElement>(null);
	useReducedMotionPause(video);

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

/**
 * The stylesheet's `prefers-reduced-motion` block zeroes every animation on
 * the page, but CSS cannot stop a video — without this, the one thing that
 * moves most would be the one thing that ignored the request.
 *
 * Done in an effect rather than by rendering `autoPlay` conditionally: the
 * server has no media queries, so branching on it during render would
 * produce markup that disagrees with the client and a hydration error. The
 * video is paused on mount instead, and falls back to its poster — which is
 * the first frame, so the figure still shows the chart.
 */
function useReducedMotionPause(
	video: React.RefObject<HTMLVideoElement | null>,
) {
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
	}, [video]);
}
