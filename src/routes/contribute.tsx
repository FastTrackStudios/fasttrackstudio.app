import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "#/lib/site";

export const Route = createFileRoute("/contribute")({
	// Full SSR, like every other public page — this one wants to be indexed.
	ssr: true,
	head: () => ({
		meta: [
			{ title: `Contribute — ${SITE.name}` },
			{
				name: "description",
				content: `How to contribute to ${SITE.name} — an open-source audio-visual toolkit.`,
			},
		],
	}),
	component: Contribute,
});

/**
 * PLACEHOLDER. The real copy is coming from Cody; this exists so the hero's
 * Contribute button has somewhere real to land instead of 404ing.
 *
 * Structure is deliberately plain — one column, one measure — so dropping
 * prose in means writing prose, not fighting a layout.
 */
function Contribute() {
	return (
		<section className="mx-auto max-w-3xl px-6 py-28">
			<p className="u-label text-fg-subtle">Get involved</p>
			<h1 className="u-display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">
				Contribute
			</h1>

			<p className="mt-8 max-w-xl text-base leading-relaxed text-fg-muted">
				{SITE.name} is built in the open under GPL-3.0. Everything — the audio
				engine, the visual engine, the coordinator and the protocols between
				them — is public and takes patches.
			</p>

			<div className="mt-12 border-t border-line pt-8">
				<p className="text-sm leading-relaxed text-fg-subtle">
					This page is still being written. In the meantime, the code and the
					issue trackers are on{" "}
					<a
						href="https://github.com/FastTrackStudios"
						target="_blank"
						rel="noreferrer noopener"
						className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
					>
						GitHub
					</a>
					.
				</p>
			</div>
		</section>
	);
}
