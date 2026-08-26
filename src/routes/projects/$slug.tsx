import { createFileRoute, Link } from "@tanstack/react-router";

import { fetchProject } from "#/fn/projects";
import { SITE } from "#/lib/site";

export const Route = createFileRoute("/projects/$slug")({
	ssr: true,
	loader: ({ params }) => fetchProject({ data: { slug: params.slug } }),
	/**
	 * `head` reads the loader data, so each project gets its own title,
	 * description and canonical URL in the server-rendered document.
	 */
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{ title: `${loaderData.name} — ${SITE.name}` },
					{ name: "description", content: loaderData.description },
					{
						property: "og:title",
						content: `${loaderData.name} — ${SITE.name}`,
					},
					{ property: "og:description", content: loaderData.description },
				]
			: [],
		links: loaderData
			? [
					{
						rel: "canonical",
						href: `${SITE.url}/projects/${loaderData.slug}`,
					},
				]
			: [],
	}),
	component: ProjectDetail,
});

function ProjectDetail() {
	const project = Route.useLoaderData();

	return (
		<article className="mx-auto max-w-3xl px-6 py-24">
			<Link
				to="/projects"
				className="font-mono text-xs uppercase tracking-[0.18em] text-fg-subtle hover:text-fg"
			>
				← Projects
			</Link>

			<header className="mt-8 border-b border-line pb-8">
				<p
					className="font-mono text-xs uppercase tracking-[0.25em]"
					style={{ color: project.accent }}
				>
					{project.tagline}
				</p>
				<h1 className="mt-3 text-5xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<p className="mt-6 text-lg leading-relaxed text-fg-muted">
					{project.description}
				</p>
			</header>

			<dl className="mt-8 grid grid-cols-2 gap-6 font-mono text-xs uppercase tracking-[0.18em] sm:grid-cols-3">
				<div>
					<dt className="text-fg-subtle">Status</dt>
					<dd className="mt-1 text-fg">{project.status}</dd>
				</div>
				<div>
					<dt className="text-fg-subtle">Version</dt>
					<dd className="mt-1 text-fg">{project.version}</dd>
				</div>
				<div>
					<dt className="text-fg-subtle">Source</dt>
					<dd className="mt-1">
						<a
							href={project.repo}
							target="_blank"
							rel="noreferrer noopener"
							className="text-accent hover:underline"
						>
							Repository
						</a>
					</dd>
				</div>
			</dl>
		</article>
	);
}
