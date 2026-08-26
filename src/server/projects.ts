/**
 * Project catalogue — the SERVER side of the boundary.
 *
 * The marker import below makes this module server-only: importing it from
 * client code is a build-time violation, not a runtime surprise. Reach it
 * from the browser through the server functions in `src/fn/projects.ts`.
 *
 * The data is a static table today. When it moves to a CMS or a database,
 * only this file changes — the server functions, loaders and components
 * above it keep their shapes.
 */

import "@tanstack/react-start/server-only";

import type { Project, ProjectSearch } from "#/lib/projects";

const PROJECTS: readonly Project[] = [
	{
		slug: "keyflow",
		name: "Keyflow",
		tagline: "Charts as code",
		description: "Plain-text music format that compiles into real lead sheets.",
		glyph: ".kf",
		accent: "#a78bfa",
		background: "#0d0a14",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/keyflow",
	},
	{
		slug: "session",
		name: "Session",
		tagline: "Performance brain",
		description: "Setlist · song · section navigation across the network.",
		glyph: "→→",
		accent: "#86efac",
		background: "#0a1310",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/session",
	},
	{
		slug: "signal",
		name: "Signal",
		tagline: "The audio rig",
		description: "Plugin chains, profiles, snapshots, live morphing.",
		glyph: "≋",
		accent: "#60a5fa",
		background: "#0a1018",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/signal",
	},
	{
		slug: "input",
		name: "Input",
		tagline: "Wiring closet",
		description: "MIDI, keys, hardware controllers — into the action system.",
		glyph: "I/O",
		accent: "#a1a1aa",
		background: "#0f0f12",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/input",
	},
	{
		slug: "daw",
		name: "DAW",
		tagline: "REAPER layer",
		description: "Unified API. Transport, tracks, FX, project files.",
		glyph: "⏵",
		accent: "#52525b",
		background: "#050507",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/daw",
	},
	{
		slug: "plugins",
		name: "Plugins",
		tagline: "DSP suite",
		description: "In-house CLAP/VST3 plugins with detachable GUI.",
		glyph: "FX",
		accent: "#b54234",
		background: "#140a08",
		status: "alpha",
		version: "0.0.1",
		repo: "https://codeberg.org/FastTrackStudios/FTS-Plugins",
	},
];

/** Every project, in catalogue order. */
export function listProjects(): readonly Project[] {
	return PROJECTS;
}

/** Filtered + sorted view backing the `/projects` index. */
export function queryProjects(search: ProjectSearch): Project[] {
	const needle = search.q?.toLowerCase() ?? "";

	const matched = PROJECTS.filter((project) => {
		if (search.status && project.status !== search.status) return false;
		if (!needle) return true;
		return `${project.name} ${project.tagline} ${project.description}`
			.toLowerCase()
			.includes(needle);
	});

	return [...matched].sort((a, b) =>
		(search.sort ?? "name") === "status"
			? a.status.localeCompare(b.status) || a.name.localeCompare(b.name)
			: a.name.localeCompare(b.name),
	);
}

/** One project, or `undefined` when the slug does not exist. */
export function findProject(slug: string): Project | undefined {
	return PROJECTS.find((project) => project.slug === slug);
}
