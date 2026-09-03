/**
 * The marquee — everything above the stage.
 */

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
 * The hero's calls to action, in priority order.
 *
 * `soon` marks something that does not exist yet. It renders as a disabled
 * control rather than a link, because shipping a button that 404s costs more
 * trust than not showing it at all — and saying "soon" out loud is a better
 * signal than silence.
 */
export const HERO_ACTIONS = [
	{
		kind: "external",
		label: "Source",
		href: "https://github.com/FastTrackStudios",
	},
	{ kind: "internal", label: "Contribute", to: "/contribute" },
	{ kind: "soon", label: "Forum" },
] as const;
