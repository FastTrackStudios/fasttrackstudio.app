import { createFileRoute } from "@tanstack/react-router";

import { ProjectCard } from "#/components/project-card";
import { fetchProjectList } from "#/fn/projects";
import {
	PROJECT_SORTS,
	PROJECT_STATUSES,
	projectSearchSchema,
} from "#/lib/projects";
import { SITE } from "#/lib/site";

export const Route = createFileRoute("/projects/")({
	ssr: true,
	/**
	 * Search params are parsed and typed by this schema. Everything
	 * downstream — `Route.useSearch()`, `navigate({ search })`, the loader
	 * deps — is typed from it, and an unparseable URL falls back to defaults
	 * instead of throwing (see the `.catch()` calls in the schema).
	 */
	validateSearch: projectSearchSchema,
	/**
	 * Only these params re-run the loader. Without `loaderDeps` the loader
	 * would not see search at all; with a wider object it would refetch on
	 * unrelated param changes.
	 */
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) => fetchProjectList({ data: deps }),
	head: () => ({
		meta: [
			{ title: `Projects — ${SITE.name}` },
			{
				name: "description",
				content: `Open-source music production tools built by ${SITE.name}.`,
			},
		],
	}),
	component: ProjectsIndex,
});

function ProjectsIndex() {
	const projects = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	/** Search params are the single source of truth — no mirrored state. */
	function setSearch(patch: Partial<typeof search>) {
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
	}

	return (
		<section className="mx-auto max-w-6xl px-6 py-24">
			<header className="mb-10">
				<p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">
					Catalogue
				</p>
				<h1 className="mt-3 text-4xl font-semibold tracking-tight">Projects</h1>
			</header>

			<div className="mb-10 flex flex-wrap items-center gap-3">
				<label htmlFor="project-search" className="sr-only">
					Filter projects
				</label>
				<input
					id="project-search"
					type="search"
					value={search.q ?? ""}
					onChange={(event) =>
						setSearch({ q: event.target.value || undefined })
					}
					placeholder="Filter…"
					className="w-56 rounded border border-line-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle"
				/>

				<label htmlFor="project-status" className="sr-only">
					Status
				</label>
				<select
					id="project-status"
					value={search.status ?? ""}
					onChange={(event) =>
						setSearch({
							status: (event.target.value || undefined) as typeof search.status,
						})
					}
					className="rounded border border-line-strong bg-surface px-3 py-2 text-sm text-fg"
				>
					<option value="">All statuses</option>
					{PROJECT_STATUSES.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>

				<label htmlFor="project-sort" className="sr-only">
					Sort
				</label>
				<select
					id="project-sort"
					value={search.sort ?? "name"}
					onChange={(event) =>
						setSearch({ sort: event.target.value as typeof search.sort })
					}
					className="rounded border border-line-strong bg-surface px-3 py-2 text-sm text-fg"
				>
					{PROJECT_SORTS.map((sort) => (
						<option key={sort} value={sort}>
							Sort by {sort}
						</option>
					))}
				</select>
			</div>

			{projects.length === 0 ? (
				<p className="text-sm text-fg-muted">Nothing matches that filter.</p>
			) : (
				<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard key={project.slug} project={project} />
					))}
				</div>
			)}
		</section>
	);
}
