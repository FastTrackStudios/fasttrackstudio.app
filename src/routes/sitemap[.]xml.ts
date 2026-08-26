import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "#/lib/site";
import { listProjects } from "#/server/projects";

/**
 * Generated from the same catalogue the pages render, so adding a project
 * cannot leave the sitemap stale. Server route — the handler never ships to
 * the browser, which is why importing the server-only module here is fine.
 */
export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const paths = [
					"/",
					"/projects",
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
