/**
 * The marquee — everything above the stage.
 */

import { SUBDOMAINS } from "#/content/site";

/**
 * `lead` is the claim, `stance` is the position — the second line is
 * deliberately shorter, with only `emphasis` at full brightness.
 */
export const HERO = {
	/**
	 * The eyebrow. The order is NOT cosmetic: it reads as a legend for the
	 * three positions directly below it, so it must run left-to-right in
	 * stage order — Signal (audio), Session (control), Ignition (light).
	 * Reordering this without reordering the rig breaks the mapping.
	 */
	eyebrow: "Audio · Control · Light",
	lead: "The Complete AV Toolkit",
	stance: { before: "The Future is ", emphasis: "OPEN" },
} as const;

/**
 * The hero's calls to action, in priority order — only the first carries
 * full weight.
 *
 * `newTab` marks a link that LEAVES this universe. GitHub is someone else's
 * site, so it opens beside this one; the forum is ours, on a subdomain of
 * this apex, so it opens in place — the same way the products on the stage
 * do.
 */
export const HERO_ACTIONS = [
	{
		kind: "external",
		label: "Source",
		href: "https://github.com/FastTrackStudios",
		newTab: true,
	},
	{ kind: "internal", label: "Contribute", to: "/contribute" },
	{
		kind: "external",
		label: "Forum",
		href: SUBDOMAINS.forum,
		newTab: false,
	},
] as const;
