import { createFileRoute } from "@tanstack/react-router";

import { SITE, SOCIAL_LINKS } from "#/lib/site";

export const Route = createFileRoute("/contribute")({
	// Full SSR, like every other public page — this one wants to be indexed.
	ssr: true,
	head: () => ({
		meta: [
			{ title: `Contribute — ${SITE.name}` },
			{
				name: "description",
				content:
					"You do not need to write software to contribute to FastTrackStudio. Money, introductions, testing and word of mouth all move it forward.",
			},
		],
	}),
	component: Contribute,
});

/**
 * Ways to help.
 *
 * Deliberately NOT numbered. Numbered markers say "these happen in order",
 * and these are parallel options — a reader picks the one that fits them, and
 * implying a sequence would suggest the first is the price of entry.
 *
 * `href` is omitted where there is genuinely nowhere to send someone yet;
 * a section renders without an action rather than with a dead link.
 */
const WAYS = [
	{
		id: "finances",
		title: "Finances",
		body: [
			"I started working on these projects my sophomore year in college. Now I am a recent college grad who needs to figure out my financial situation. At the same time, I do not want to abandon this project, and I don't want to charge money for it either.",
			"Financial support is probably the most direct way of helping me continue development and dedicate more time to this project.",
		],
	},
	{
		id: "connections",
		title: "Connections",
		body: [
			"If you know anybody in the field who is a master at what they do — mixers, lighting designers, project managers, live performers — I would love to meet with them and set up interviews to learn more about what they need, and make sure this software is truly meeting those needs.",
		],
	},
	{
		id: "testing",
		title: "Testing",
		body: [
			"I can't test everything by myself. Just running the beta versions of the software and poking around helps out tremendously.",
		],
		action: { label: "Issue trackers", href: SOCIAL_LINKS[0].href },
	},
	{
		id: "code",
		title: "Code",
		body: [
			"If you do write software, all of it is public and takes patches — the audio engine, the visual engine, the coordinator, and the protocols between them. Mostly Rust, GPL-3.0, and every repository has its issues open.",
		],
		action: { label: "Browse the source", href: SOCIAL_LINKS[0].href },
	},
	{
		id: "sharing",
		title: "Sharing",
		body: [
			"Sharing this project and helping it become more well known is an amazing way to contribute to this open-source vision for production — one that isn't gate-kept behind crazy high paywalls or anti-consumer practices.",
		],
	},
] as const;

function Contribute() {
	return (
		<section className="mx-auto max-w-3xl px-6 pt-28 pb-24">
			<p className="u-label text-fg-subtle">Get involved</p>
			<h1 className="u-display mt-4 text-[clamp(2.5rem,7vw,5rem)]">
				Contribute
			</h1>

			<div className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-fg-muted">
				<p>
					You do not need to know how to write software to contribute.
					Participating on the forums, filing bugs and issues, and helping carve
					the vision of what the software needs to be able to do are all
					invaluable contributions that you can make.
				</p>
				<p>Here are a few ways you can help.</p>
			</div>

			<ol className="mt-20 space-y-16">
				{WAYS.map((way) => (
					<li
						key={way.id}
						className="grid gap-x-10 gap-y-5 border-t border-line pt-8 md:grid-cols-[10rem_1fr]"
					>
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

							{"action" in way && way.action ? (
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
				))}
			</ol>
		</section>
	);
}
