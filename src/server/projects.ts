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
 * Signal, Session and Ignition are the products — the audio side, the
 * coordinator, and the visual side. They are what the front page is, in that
 * left-to-right order, so `stagePositions()` below returns them explicitly
 * rather than by slicing this list.
 *
 * Keyflow, the DAW layer and the plugin suite are deliberately NOT here: they
 * are features and substrate inside those three, not things anyone obtains
 * separately, and listing them made the toolkit look like seven half-products
 * instead of three whole ones.
 *
 * Every repo link points at GitHub — the pre-split Codeberg URLs the old site
 * used are 404 now. Input is not a standalone repo and links to `daw`, which
 * absorbed it. Verify a link resolves before changing it.
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
			"The visual side. Lighting design and projection mapping, cued from the same timeline.",
		glyph: "✦",
		accent: "#fbbf24",
		background: "#140f05",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/Ignition",
	},
	{
		slug: "input",
		name: "Input",
		tagline: "Wiring closet",
		description:
			"MIDI, keys, hardware controllers — into the action system. Part of the DAW substrate.",
		glyph: "I/O",
		accent: "#a1a1aa",
		background: "#0f0f12",
		status: "alpha",
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/daw",
	},
];

/**
 * The three products, in the order they stand on the stage: Signal at stage
 * left, Session downstage centre, Ignition at stage right. Order is the
 * layout, so it is fixed here rather than left to catalogue order.
 */
export function stagePositions(): Project[] {
	return ["signal", "session", "ignition"]
		.map((slug) => PROJECTS.find((p) => p.slug === slug))
		.filter((p): p is Project => p !== undefined);
}

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
