import { createFileRoute } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "#/content/site";

/**
 * Generated from the same nav the shell renders, so adding a top-level page
 * cannot leave the sitemap stale. (`/contribute` was once missing precisely
 * because the static list was written out by hand.)
 *
 * No product URLs: the products live on their own sites, which carry their
 * own sitemaps. The old `/projects/…` addresses are 301s now and a sitemap
 * must not list redirects.
 *
 * Server route — the handler never ships to the browser.
 */
export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const paths = ["/", ...NAV_LINKS.map((link) => link.to)];

				const body = [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
					...paths.map((path) => `  <url><loc>${SITE.url}${path}</loc></url>`),
					"</urlset>",
					"",
				].join("\n");

				return new Response(body, {
					headers: { "content-type": "application/xml; charset=utf-8" },
				});
			},
		},
	},
});
