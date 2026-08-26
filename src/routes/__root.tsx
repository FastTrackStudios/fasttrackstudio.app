/// <reference types="vite/client" />

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { SiteFooter } from "#/components/site-footer";
import { SiteHeader } from "#/components/site-header";
import { SITE } from "#/lib/site";
import appCss from "#/styles.css?url";

/**
 * Root route — owns the whole document.
 *
 * `shellComponent` renders <html> down, which is what makes this full-document
 * SSR: the server streams a complete, crawlable page rather than hydrating an
 * empty div. Per-route `head()` merges into the tags below, so a child route
 * overrides the title and description without re-declaring the rest.
 */
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: `${SITE.name} — ${SITE.tagline}` },
			{ name: "description", content: SITE.description },
			{ name: "theme-color", content: SITE.themeColor },

			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: SITE.name },
			{ property: "og:locale", content: SITE.locale },
			{ property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
			{ property: "og:description", content: SITE.description },
			{ property: "og:url", content: SITE.url },

			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: `${SITE.name} — ${SITE.tagline}` },
			{ name: "twitter:description", content: SITE.description },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico" },
			{ rel: "canonical", href: SITE.url },
		],
	}),
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

function NotFound() {
	return (
		<section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-32">
			<p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">
				404
			</p>
			<h1 className="text-4xl font-semibold tracking-tight">
				That page does not exist.
			</h1>
			<Link
				to="/"
				className="font-mono text-xs uppercase tracking-[0.18em] text-accent hover:underline"
			>
				Back home
			</Link>
		</section>
	);
}

function RootError({ error }: { error: Error }) {
	return (
		<section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-32">
			<p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">
				Error
			</p>
			<h1 className="text-4xl font-semibold tracking-tight">
				Something went wrong.
			</h1>
			<pre className="max-w-full overflow-x-auto rounded border border-line bg-surface p-4 font-mono text-xs text-fg-muted">
				{error.message}
			</pre>
		</section>
	);
}
