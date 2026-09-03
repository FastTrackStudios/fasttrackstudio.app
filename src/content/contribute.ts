/**
 * The Contribute page.
 */

import { SOCIAL_LINKS } from "#/content/site";

export const CONTRIBUTE = {
	title: "Contribute",
	eyebrow: "Get involved",
	description:
		"You do not need to write software to contribute to FastTrackStudio. Money, introductions, testing and word of mouth all move it forward.",
	intro: [
		"You do not need to know how to write software to contribute. Participating on the forums, filing bugs and issues, and helping carve the vision of what the software needs to be able to do are all invaluable contributions that you can make.",
		"Here are a few ways you can help.",
	],
} as const;

export interface Way {
	id: string;
	title: string;
	body: readonly string[];
	/** Omitted where there is genuinely nowhere to send someone yet. */
	action?: { label: string; href: string };
}

/**
 * Ways to help.
 *
 * Deliberately NOT numbered. Numbered markers say "these happen in order",
 * and these are parallel options — a reader picks the one that fits them,
 * and implying a sequence would suggest the first is the price of entry.
 */
export const WAYS: readonly Way[] = [
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
];
