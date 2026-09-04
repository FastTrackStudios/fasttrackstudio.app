/**
 * Who this site is. Isomorphic — safe to import from client and server.
 *
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
	themeColor: "#0a0a0c",
	locale: "en_US",
	license: "GPL-3.0-or-later",
} as const;

/** Primary nav. Internal links are router `to` paths. */
export const NAV_LINKS = [{ label: "Contribute", to: "/contribute" }] as const;

/**
 * GitHub is the canonical forge — every project link points there. The old
 * Codeberg org still exists but is no longer where the work lives, so it is
 * deliberately not linked.
 */
export const SOCIAL_LINKS = [
	{ label: "GitHub", href: "https://github.com/FastTrackStudios" },
] as const;

/**
 * Sibling apps that deploy to their own subdomain of this apex but are not
 * products (the forum, the guides vault, the docs). Linked, never imported.
 */
export const SUBDOMAINS = {
	forum: "https://forum.fasttrackstudio.app",
	guides: "https://guides.fasttrackstudio.app",
	docs: "https://docs.fasttrackstudio.app",
} as const;
