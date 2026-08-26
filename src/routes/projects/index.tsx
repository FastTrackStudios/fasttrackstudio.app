import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

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

	/**
	 * Discrete controls (the selects) write straight to the URL — one change,
	 * one navigation.
	 */
	function setSearch(patch: Partial<typeof search>) {
		navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
	}

	/**
	 * The filter box is deliberately UNCONTROLLED.
	 *
	 * Binding `value` to `search.q` makes React rewrite the DOM value on every
	 * render while the router round-trip is still in flight, which eats
	 * characters mid-word. Letting the DOM own the text and publishing it to
	 * the URL on a debounce keeps typing instant, keeps the URL the source of
	 * truth for the query, and re-runs the loader once per settled word
	 * instead of once per keystroke.
	 */
	const inputRef = useRef<HTMLInputElement>(null);

	/** The last value this component published, to recognise its own echo. */
	const published = useRef(search.q ?? "");

	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	/** Debounced: only settled input reaches the URL and re-runs the loader. */
	function publishQuery(value: string) {
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			published.current = value;
			navigate({
				search: (prev) => ({ ...prev, q: value || undefined }),
				replace: true,
			});
		}, 250);
	}

	useEffect(
		() => () => {
			if (timer.current) clearTimeout(timer.current);
		},
		[],
	);

	// Push the URL into the box only when it changed from OUTSIDE it —
	// back/forward, a pasted link. Our own echo is ignored, so typing is
	// never interrupted.
	useEffect(() => {
		const fromUrl = search.q ?? "";
		if (fromUrl === published.current) return;
		published.current = fromUrl;
		if (inputRef.current) inputRef.current.value = fromUrl;
	}, [search.q]);

	return (
		<section className="mx-auto max-w-6xl px-6 py-24">
			<header className="mb-10">
				<p className="u-label text-fg-subtle">Catalogue</p>
				<h1 className="u-display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">
					Projects
				</h1>
			</header>

			<div className="mb-10 flex flex-wrap items-center gap-3">
				<label htmlFor="project-search" className="sr-only">
					Filter projects
				</label>
				<input
					id="project-search"
					type="search"
					ref={inputRef}
					defaultValue={search.q ?? ""}
					onChange={(event) => publishQuery(event.target.value)}
					placeholder="Filter…"
					className="w-56 rounded-card border border-line-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle"
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
					className="rounded-card border border-line-strong bg-surface px-3 py-2 text-sm text-fg"
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
					className="rounded-card border border-line-strong bg-surface px-3 py-2 text-sm text-fg"
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
