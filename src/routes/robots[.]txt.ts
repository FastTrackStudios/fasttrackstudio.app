import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "#/content/site";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET: () =>
				new Response(
					[
						"User-agent: *",
						"Allow: /",
						`Sitemap: ${SITE.url}/sitemap.xml`,
						"",
					].join("\n"),
					{ headers: { "content-type": "text/plain; charset=utf-8" } },
				),
		},
	},
});
