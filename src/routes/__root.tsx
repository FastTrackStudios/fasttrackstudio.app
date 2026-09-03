/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { SiteFooter } from "#/components/layout/site-footer";
import { SiteHeader } from "#/components/layout/site-header";
import { NotFound, RootError } from "#/components/layout/status-pages";
import { SITE } from "#/content/site";
import { pageHead } from "#/lib/seo";
import appCss from "#/styles/index.css?url";

/**
 * Root route — owns the whole document.
 *
 * `shellComponent` renders <html> down, which is what makes this full-document
 * SSR: the server streams a complete, crawlable page rather than hydrating an
 * empty div. Per-route `head()` merges into the tags below, so a child route
 * overrides the title and description without re-declaring the rest.
 *
 * What is here is what every page shares; what a page owns (title,
 * description, canonical, the matching Open Graph tags) comes from
 * `pageHead()` in that page's route.
 */
export const Route = createRootRoute({
	head: () => {
		const home = pageHead();
		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "theme-color", content: SITE.themeColor },
				{ property: "og:type", content: "website" },
				{ property: "og:site_name", content: SITE.name },
				{ property: "og:locale", content: SITE.locale },
				{ name: "twitter:card", content: "summary_large_image" },
				// Defaults, so a page that forgets `pageHead()` is still titled.
				...home.meta,
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", href: "/favicon.ico" },
			],
		};
	},
	notFoundComponent: NotFound,
	errorComponent: RootError,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col">
				<SiteHeader />
				<main className="flex-1">{children}</main>
				<SiteFooter />

				{import.meta.env.DEV ? (
					<TanStackDevtools
						config={{ position: "bottom-right" }}
						plugins={[
							{
								name: "TanStack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				) : null}

				<Scripts />
			</body>
		</html>
	);
}
