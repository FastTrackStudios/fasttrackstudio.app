import { createFileRoute } from "@tanstack/react-router";

import { CONTRIBUTE, WAYS, type Way } from "#/content/contribute";
import { pageHead } from "#/lib/seo";

export const Route = createFileRoute("/contribute")({
	// Full SSR, like every other public page — this one wants to be indexed.
	ssr: true,
	head: () =>
		pageHead({
			title: CONTRIBUTE.title,
			description: CONTRIBUTE.description,
			path: "/contribute",
		}),
	component: Contribute,
});

function Contribute() {
	return (
		<section className="mx-auto max-w-3xl px-6 pt-28 pb-24">
			<p className="u-label text-fg-subtle">{CONTRIBUTE.eyebrow}</p>
			<h1 className="u-display mt-4 text-[clamp(2.5rem,7vw,5rem)]">
				{CONTRIBUTE.title}
			</h1>

			<div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-fg-muted">
				{CONTRIBUTE.intro.map((paragraph) => (
					<p key={paragraph.slice(0, 32)}>{paragraph}</p>
				))}
			</div>

			<ul className="mt-20 space-y-16">
				{WAYS.map((way) => (
					<WayItem key={way.id} way={way} />
				))}
			</ul>
		</section>
	);
}

function WayItem({ way }: { way: Way }) {
	return (
		<li className="grid gap-x-10 gap-y-5 border-t border-line pt-8 md:grid-cols-[10rem_1fr]">
			<h2 className="u-display text-2xl text-fg">{way.title}</h2>

			<div className="space-y-4">
				{way.body.map((paragraph) => (
					<p
						key={paragraph.slice(0, 32)}
						className="max-w-[60ch] text-base leading-relaxed text-fg-muted"
					>
						{paragraph}
					</p>
				))}

				{way.action ? (
					<a
						href={way.action.href}
						target="_blank"
						rel="noreferrer noopener"
						className="u-label inline-block pt-1 text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
					>
						{way.action.label} →
					</a>
				) : null}
			</div>
		</li>
	);
}
