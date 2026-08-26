import { Link } from "@tanstack/react-router";

import type { Project } from "#/lib/projects";

/**
 * One project tile. Placeholder styling on purpose — the accent and
 * background come from the project record, so a redesign can lean on
 * per-project color without touching the data.
 */
export function ProjectCard({ project }: { project: Project }) {
	return (
		<Link
			to="/projects/$slug"
			params={{ slug: project.slug }}
			style={{
				backgroundColor: project.background,
				borderColor: "var(--color-line)",
			}}
			className="group relative flex min-h-56 flex-col overflow-hidden rounded-card border p-7 transition-all duration-300 hover:-translate-y-0.5"
		>
			<div className="mb-8 flex items-start justify-between">
				<span className="u-label opacity-75" style={{ color: project.accent }}>
					{project.status} v{project.version}
				</span>
				<span
					className="font-mono text-lg tracking-tight opacity-80"
					style={{ color: project.accent }}
				>
					{project.glyph}
				</span>
			</div>

			<div>
				<h3 className="u-display text-[2.5rem] text-fg">{project.name}</h3>
				<p className="u-label mt-3" style={{ color: project.accent }}>
					{project.tagline}
				</p>
				<p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-fg-muted">
					{project.description}
				</p>
			</div>

			<span
				aria-hidden="true"
				className="absolute bottom-0 left-0 h-px w-12 transition-all duration-300 group-hover:w-24"
				style={{ backgroundColor: project.accent }}
			/>
		</Link>
	);
}
