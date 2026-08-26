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
	/** Painted as <meta name="theme-color">; keep in sync with --color-bg. */
	themeColor: "#0d0a14",
	locale: "en_US",
} as const;

/**
 * Hero copy.
 *
 * `lead` is the claim, `stance` is the position — the second line is
 * deliberately shorter and louder, with `emphasis` picked out in the accent
 * gradient. `subhead` does the disambiguation work: bare "AV" can read as
 * conference-room A/V to a cold visitor, so the sentence underneath names the
 * three products and what each one drives.
 */
export const HERO = {
	lead: "The Complete AV Toolkit",
	stance: { before: "The Future is ", emphasis: "OPEN" },
	subhead:
		"Signal drives the sound. Ignition drives the light. Session runs the show. All of it open source, cross-platform, and yours to build on.",
} as const;

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
export const NAV_LINKS = [{ label: "Projects", to: "/projects" }] as const;

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
