import { Link } from "@tanstack/react-router";

import { ProjectIcon } from "#/components/project-icon";
import { ProjectMotif } from "#/components/project-motif";
import type { Project } from "#/lib/projects";

/**
 * One catalogue tile.
 *
 * The tile is a stage in miniature: its own dark, its own colour, and a
 * looping motif of the thing it is running behind the type. The motif is
 * painted first and the content sits above it on `z-10`, so the picture is
 * lit from behind the words rather than competing with them.
 */
export function ProjectCard({ project }: { project: Project }) {
	return (
		<Link
			to="/projects/$slug"
			params={{ slug: project.slug }}
			style={{
				backgroundColor: project.background,
				["--accent" as string]: project.accent,
			}}
			className="group relative flex min-h-72 flex-col overflow-hidden rounded-card border border-line p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]"
		>
			<ProjectMotif slug={project.slug} color={project.accent} />

			<div className="relative z-10 mb-8 flex items-start justify-between">
				<span className="u-label text-[var(--accent)] opacity-75">
					{project.status} v{project.version}
				</span>
				<span className="font-mono text-lg tracking-tight text-[var(--accent)] opacity-80">
					{project.glyph}
				</span>
			</div>

			<div className="relative z-10">
				<div className="flex items-center gap-3">
					<ProjectIcon project={project} size={36} className="rounded-[22%]" />
					<h3 className="u-display text-[2.5rem] text-fg">{project.name}</h3>
				</div>
				<p className="u-label mt-3 text-[var(--accent)]">{project.tagline}</p>
				<p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-fg-muted">
					{project.description}
				</p>
			</div>

			<span
				aria-hidden="true"
				className="absolute bottom-0 left-0 z-10 h-px w-12 bg-[var(--accent)] transition-all duration-300 group-hover:w-24"
			/>
		</Link>
	);
}
