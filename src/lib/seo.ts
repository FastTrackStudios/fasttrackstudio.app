import { SITE } from "#/content/site";

/**
 * The head tags for one page — title, description, canonical, Open Graph
 * and Twitter — from three facts. Every route builds its head through this
 * so a page can never carry a title without the matching og:title, or a
 * canonical that disagrees with its path.
 *
 * `title` is the page's own; the site name is appended here. Pass nothing
 * for the home page, whose title IS the site.
 */
export function pageHead({
	title,
	description = SITE.description,
	path = "/",
}: {
	title?: string;
	description?: string;
	path?: string;
} = {}) {
	const fullTitle = title
		? `${title} — ${SITE.name}`
		: `${SITE.name} — ${SITE.tagline}`;
	const url = `${SITE.url}${path === "/" ? "" : path}`;

	return {
		meta: [
			{ title: fullTitle },
			{ name: "description", content: description },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ name: "twitter:title", content: fullTitle },
			{ name: "twitter:description", content: description },
		],
		links: [{ rel: "canonical", href: url }],
	};
}
