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

/**
 * Catalogue order is deliberate: the three products that define the system
 * come first — Signal (audio), Ignition (visual), Session (the coordinator
 * that drives both) — then the layers underneath them.
 *
 * Every repo link points at GitHub — the pre-split Codeberg URLs the old site
 * used are 404 now. Three of these are not standalone repos after the August
 * 2026 split and link to the repo that absorbed them: Keyflow lives in
 * `session`, Input in `daw`, Plugins in `signal`. Verify a link resolves
 * before changing it.
 */
const PROJECTS: readonly Project[] = [
	{
		slug: "session",
		name: "Session",
		tagline: "Runs the show",
		description:
			"The coordinator. Drives Signal and Ignition together over the network — setlists, songs, sections, cues.",
		glyph: "→→",
		accent: "#86efac",
		background: "#0a1310",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/session",
	},
	{
		slug: "signal",
		name: "Signal",
		tagline: "Drives the sound",
		description:
			"The audio side. Sampler, sound generation, plugin rigs, profiles and live morphing.",
		glyph: "≋",
		accent: "#60a5fa",
		background: "#0a1018",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/signal",
	},
	{
		slug: "ignition",
		name: "Ignition",
		tagline: "Drives the light",
		description:
			"The visual side. Lighting and projection mapping on a Bevy visuals engine.",
		glyph: "✦",
		accent: "#fbbf24",
		background: "#140f05",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/Ignition",
	},
	{
		slug: "keyflow",
		name: "Keyflow",
		tagline: "Charts as code",
		description:
			"Plain-text music format that compiles into real lead sheets. Lives inside the session repo.",
		glyph: ".kf",
		accent: "#a78bfa",
		background: "#0d0a14",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/session",
	},
	{
		slug: "daw",
		name: "DAW",
		tagline: "The substrate",
		description:
			"Unified API over the DAW. Transport, tracks, FX, project files, and the shared audio/MIDI substrate.",
		glyph: "⏵",
		accent: "#52525b",
		background: "#050507",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/daw",
	},
	{
		slug: "input",
		name: "Input",
		tagline: "Wiring closet",
		description:
			"MIDI, keys, hardware controllers — into the action system. Part of the daw substrate.",
		glyph: "I/O",
		accent: "#a1a1aa",
		background: "#0f0f12",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/daw",
	},
	{
		slug: "plugins",
		name: "Plugins",
		tagline: "DSP suite",
		description:
			"In-house CLAP/VST3 plugins with detachable GUI. Ship inside the signal repo.",
		glyph: "FX",
		accent: "#b54234",
		background: "#140a08",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/signal",
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
