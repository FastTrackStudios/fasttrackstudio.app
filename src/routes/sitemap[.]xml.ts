import { createFileRoute } from "@tanstack/react-router";
import { NAV_LINKS, SITE } from "#/lib/site";
import { listProjects } from "#/server/projects";

/**
 * Generated from the same catalogue and the same nav the pages render, so
 * neither adding a project nor adding a top-level page can leave the sitemap
 * stale. (`/contribute` was missing precisely because the static list was
 * written out by hand.)
 *
 * Server route — the handler never ships to the browser, which is why
 * importing the server-only module here is fine.
 */
export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const paths = [
					"/",
					...NAV_LINKS.map((link) => link.to),
					...listProjects().map((project) => `/projects/${project.slug}`),
				];

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
