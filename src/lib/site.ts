/**
 * Site-wide constants. Isomorphic — safe to import from client and server.
 * Everything the shell renders (nav, footer, SEO defaults) reads from here,
 * so a redesign changes markup without hunting for hardcoded strings.
 */

export const SITE = {
	name: "FastTrackStudio",
	domain: "fasttrackstudio.app",
	url: "https://fasttrackstudio.app",
	tagline: "Workflow-driven tools for professionals",
	description:
		"Open-source, cross-platform, cross-DAW music production tools — built around REAPER, with an open chart format (Keyflow) and documented protocols.",
	/** Painted as <meta name="theme-color">; keep in sync with --color-bg. */
	themeColor: "#0d0a14",
	locale: "en_US",
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

export const SOCIAL_LINKS = [
	{
		label: "Codeberg",
		href: "https://codeberg.org/FastTrackStudios",
	},
	{
		label: "GitHub",
		href: "https://github.com/FastTrackStudios",
	},
] as const;
