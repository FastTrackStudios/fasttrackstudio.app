import { Await, createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { ProjectCard } from "#/components/project-card";
import { fetchProjects } from "#/fn/projects";
import { HERO, SITE } from "#/lib/site";

export const Route = createFileRoute("/")({
	// Full SSR. This is the page search engines and link unfurlers read, so
	// the markup has to exist in the first response — never `data-only` here.
	ssr: true,
	head: () => ({
		meta: [
			{ title: `${SITE.name} — ${SITE.tagline}` },
			{ name: "description", content: SITE.description },
		],
	}),
	/**
	 * The promise is returned UNAWAITED on purpose: the hero flushes to the
	 * browser immediately and the grid streams in behind it. Await a value
	 * here instead and the whole document waits on the slowest query.
	 */
	loader: () => ({ projects: fetchProjects() }),
	component: Home,
});

function Home() {
	const { projects } = Route.useLoaderData();

	return (
		<>
			<Hero />

			<section className="mx-auto max-w-6xl px-6 py-24">
				<header className="mb-12">
					<p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">
						Currently in development
					</p>
					<h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
						Active projects
					</h2>
				</header>

				<Suspense fallback={<ProjectGridSkeleton />}>
					<Await promise={projects}>
						{(list) => (
							<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
								{list.map((project) => (
									<ProjectCard key={project.slug} project={project} />
								))}
							</div>
						)}
					</Await>
				</Suspense>

				<Link
					to="/projects"
					className="mt-10 inline-block font-mono text-xs uppercase tracking-[0.18em] text-accent hover:underline"
				>
					Browse all projects →
				</Link>
			</section>
		</>
	);
}

/**
 * Hero. Copy lives in `HERO` (src/lib/site.ts) so wording changes do not
 * mean touching markup.
 *
 * The two lines carry different jobs, so they are weighted differently: the
 * lead states what this is and takes the size; the stance is the position and
 * takes the color, with "OPEN" alone in the accent gradient. Giving both lines
 * the gradient would flatten them into one shout.
 */
function Hero() {
	return (
		<section className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-32">
			<h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight md:text-7xl">
				{HERO.lead}
				<span className="mt-3 block text-3xl font-light text-fg-muted md:text-5xl">
					{HERO.stance.before}
					<span className="bg-gradient-to-r from-accent to-accent-alt bg-clip-text font-semibold text-transparent">
						{HERO.stance.emphasis}
					</span>
				</span>
			</h1>

			<p className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted">
				{HERO.subhead}
			</p>
		</section>
	);
}

function ProjectGridSkeleton() {
	return (
		<div
			className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
			aria-hidden="true"
		>
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<div
					key={i}
					className="min-h-56 animate-pulse rounded-card border border-line bg-surface/50"
				/>
			))}
		</div>
	);
}
