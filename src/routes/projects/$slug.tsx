import { createFileRoute, Link } from "@tanstack/react-router";

import { ProductLink } from "#/components/product-link";
import { ProjectIcon } from "#/components/project-icon";

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
		<article
			className="mx-auto max-w-3xl px-6 py-24"
			style={{ ["--accent" as string]: project.accent }}
		>
			<Link to="/projects" className="u-label text-fg-subtle hover:text-fg">
				← Projects
			</Link>

			<header className="mt-8 border-b border-line pb-8">
				<div className="flex items-center gap-4">
					<ProjectIcon project={project} size={48} className="rounded-[22%]" />
					<p className="u-label text-[var(--accent)]">{project.tagline}</p>
				</div>

				<h1 className="u-display mt-5 text-[clamp(3rem,7vw,5.5rem)]">
					{project.name}
				</h1>
				<p className="mt-6 text-lg leading-relaxed text-fg-muted">
					{project.description}
				</p>

				{/* The same three capabilities the stage shows, so a product reads
				    the same on its own page as it does on the front one. */}
				<ul className="mt-8 flex max-w-md flex-col gap-2.5">
					{project.capabilities.map((capability) => (
						<li key={capability.label} className="flex items-baseline gap-3">
							<span
								aria-hidden="true"
								className="mt-[0.45rem] h-px w-3 shrink-0 bg-[var(--accent)] opacity-70"
							/>
							<span className="text-sm leading-snug text-fg-muted">
								{capability.label}
								{capability.tags ? (
									<span className="u-label mt-1.5 block text-fg-subtle">
										{capability.tags.join(" · ")}
									</span>
								) : null}
							</span>
						</li>
					))}
				</ul>

				<div className="mt-9">
					<ProductLink project={project} />
				</div>
			</header>

			{/* No Version row: the repos' tags are being renumbered, so any
			    number here would be wrong within the week. src/server/releases.ts
			    can put it back — and make it live — in one line. */}
			<dl className="u-label mt-8 grid grid-cols-2 gap-6">
				<div>
					<dt className="text-fg-subtle">Status</dt>
					<dd className="mt-1 text-fg">{project.status}</dd>
				</div>
				<div>
					<dt className="text-fg-subtle">Source</dt>
					<dd className="mt-1">
						<a
							href={project.repo}
							target="_blank"
							rel="noreferrer noopener"
							className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
						>
							Repository
						</a>
					</dd>
				</div>
			</dl>
		</article>
	);
}
