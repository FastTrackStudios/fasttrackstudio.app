/**
 * Product catalogue — the SERVER side of the boundary.
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

import { PRODUCT_SITES } from "#/content/products";
import type { Project } from "#/lib/projects";

// NOT WIRED IN. `withLiveVersion` reads each repo's published version from
// GitHub and is ready to use, but the tags across these repos are wrong right
// now and are being renumbered, so the site would be reporting numbers that
// are about to change. Versions are therefore not displayed at all for the
// moment — see the note in src/server/releases.ts. Re-enable by mapping the
// exported functions below through it again.
// import { withLiveVersion } from "#/server/releases";

/**
 * Signal, Session and Ignition are the products — the audio side, the
 * coordinator, and the visual side. They are what the front page is, so
 * `stagePositions()` below returns them explicitly, in stage order, rather
 * than by slicing this list.
 *
 * Keyflow is here but is NOT a stage position: it is the chart format the
 * three products read, so it gets its own band under the stage rather than a
 * fourth special.
 *
 * Accents are taken from each product's shipped app icon (the ambient light
 * in `apps/<product>/ios/icon.svg` in its own repo), so the icon and the light
 * on the name beside it are the same colour. Keyflow is the exception: its
 * icon is pink but the product reads violet, so the site uses violet and the
 * icon keeps its own ambient.
 *
 * The DAW layer, the input layer and the plugin suite are deliberately NOT
 * here: they are substrate inside those products, not things anyone obtains
 * separately, and listing them made the toolkit look like seven
 * half-products instead of three whole ones.
 *
 * Every repo link points at GitHub — the pre-split Codeberg URLs the old site
 * used are 404 now. Verify a link resolves before changing it.
 */
const PROJECTS: readonly Project[] = [
	{
		slug: "session",
		name: "Session",
		tagline: "Runs the show",
		description:
			"The coordinator. Drives Signal and Ignition together over the network — setlists, songs, sections, cues.",
		glyph: "→→",
		icon: "/icons/session.svg",
		accent: "#2e9bff",
		capabilities: [
			{ label: "Playback" },
			{ label: "Lyric and cue sync" },
			{ label: "Automatic charts" },
		],
		site: PRODUCT_SITES.session,
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
		icon: "/icons/signal.svg",
		accent: "#2fd673",
		capabilities: [
			{ label: "Audio sampler" },
			{ label: "Synthesizer" },
			{
				label: "Live rig",
				tags: ["Guitar", "Keys", "Drums", "Bass", "more"],
			},
		],
		site: PRODUCT_SITES.signal,
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
		icon: "/icons/ignition.svg",
		accent: "#ff8a2b",
		capabilities: [
			{ label: "Lighting board" },
			{ label: "Projection mapping" },
			{ label: "Live video processing" },
		],
		site: PRODUCT_SITES.ignition,
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/Ignition",
	},
	{
		slug: "keyflow",
		name: "Keyflow",
		tagline: "Charts as code",
		description:
			"The chart format all three read. Plain text in, real lead sheets out — Nashville numbers, Roman numerals or letter names.",
		glyph: ".kf",
		icon: "/icons/keyflow.svg",
		accent: "#a78bfa",
		capabilities: [
			{ label: "Plain-text charts" },
			{ label: "Lyrics and sections" },
			{
				label: "Imports and exports",
				tags: ["MIDI", "MusicXML", "ChordPro", "Finale"],
			},
		],
		site: PRODUCT_SITES.keyflow,
		version: "0.0.1",
		repo: "https://github.com/FastTrackStudios/keyflow",
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

/**
 * Keyflow — the band under the stage. Looked up rather than positioned,
 * because it is not one of the three specials and must never be rendered
 * as if it were.
 */
export function chartFormat(): Project | undefined {
	return PROJECTS.find((project) => project.slug === "keyflow");
}

/** Every product, in catalogue order. */
export function listProjects(): readonly Project[] {
	return PROJECTS;
}
