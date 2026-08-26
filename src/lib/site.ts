/**
 * Site-wide constants. Isomorphic — safe to import from client and server.
 * Everything the shell renders (nav, footer, SEO defaults) reads from here,
 * so a redesign changes markup without hunting for hardcoded strings.
 */

export const SITE = {
	name: "FastTrackStudio",
	domain: "fasttrackstudio.app",
	url: "https://fasttrackstudio.app",
	tagline: "The Complete AV Toolkit",
	description:
		"Open-source audio-visual software for live performance and production. Signal drives the sound, Ignition drives the light, Session runs the show.",
	/**
	 * Shown as the hero eyebrow. The order is NOT cosmetic: it reads as a
	 * legend for the three positions directly below it, so it must run
	 * left-to-right in stage order — Signal (audio), Session (control),
	 * Ignition (light). Reordering this without reordering the rig breaks the
	 * mapping.
	 */
	domains: "Audio · Control · Light",
	/** Painted as <meta name="theme-color">; keep in sync with --color-bg. */
	themeColor: "#0d0a14",
	locale: "en_US",
} as const;

/**
 * Hero copy.
 *
 * `lead` is the claim, `stance` is the position — the second line is
 * deliberately shorter, with only `emphasis` at full brightness.
 *
 * `subhead` must not restate the three products: they are set in display type
 * immediately below it on the landing page, so the sentence earns its place by
 * carrying what they cannot — that this is one system, and where it runs.
 */
export const HERO = {
	lead: "The Complete AV Toolkit",
	stance: { before: "The Future is ", emphasis: "OPEN" },
	subhead:
		"One rig instead of three vendors. Open formats and documented protocols.",
} as const;

/**
 * The hero's calls to action, in priority order.
 *
 * `soon` marks something that does not exist yet. It renders as a disabled
 * control rather than a link, because shipping a button that 404s costs more
 * trust than not showing it at all — and saying "soon" out loud is a better
 * signal than silence.
 */
export const ACTIONS = [
	{
		kind: "external",
		label: "Source",
		href: "https://github.com/FastTrackStudios",
	},
	{ kind: "internal", label: "Contribute", to: "/contribute" },
	{ kind: "soon", label: "Forum" },
] as const;

/**
 * Sibling apps that deploy to their own subdomain of this apex.
 *
 * They are SEPARATE repos/deployments (the Dioxus editor, the guides vault,
 * the input tutorial). This site only links to them — it never imports them.
 * Add an entry here, then link it wherever it belongs; nothing is wired into
 * the nav by default.
 */
export const SUBDOMAINS = {
	keyflow: "https://keyflow.fasttrackstudio.app",
	guides: "https://guides.fasttrackstudio.app",
	input: "https://input.fasttrackstudio.app",
	docs: "https://docs.fasttrackstudio.app",
} as const;

export type SubdomainKey = keyof typeof SUBDOMAINS;

/** Primary nav. Internal links are router `to` paths. */
export const NAV_LINKS = [
	{ label: "Projects", to: "/projects" },
	{ label: "Contribute", to: "/contribute" },
] as const;

/**
 * GitHub is the canonical forge — every project link points there. The old
 * Codeberg org still exists but is no longer where the work lives, so it is
 * deliberately not linked.
 */
export const SOCIAL_LINKS = [
	{
		label: "GitHub",
		href: "https://github.com/FastTrackStudios",
	},
] as const;
