import { createFileRoute, redirect } from "@tanstack/react-router";

import { isProductSlug, PRODUCT_SITES } from "#/content/products";

/**
 * Legacy address. The site used to carry a page per product here, and those
 * URLs were in the sitemap, so they may be indexed or bookmarked. Each
 * product now lives on its own site, so a known slug goes straight there and
 * anything else goes home. Nothing is rendered: `beforeLoad` throws before
 * the component exists, on the server for a direct hit and on the client for
 * an in-app navigation.
 */
export const Route = createFileRoute("/projects/$slug")({
	beforeLoad: ({ params }) => {
		if (isProductSlug(params.slug)) {
			throw redirect({ href: PRODUCT_SITES[params.slug].url, statusCode: 301 });
		}
		throw redirect({ to: "/", statusCode: 301 });
	},
});
