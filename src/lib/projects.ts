/**
 * Project domain types + the search-param schema for the project index.
 *
 * Type-only + schema module: importable from client components without
 * dragging in the server-only data source (`src/server/projects.ts`).
 */

import * as z from "zod";

export const PROJECT_STATUSES = ["alpha", "beta", "stable"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/**
 * One thing a product does.
 *
 * `tags` exists for capabilities that are really a set — the live rig covers
 * guitar, keys, drums and more, and "Live Guitar/Keys/Drums/Bass/More! Rig"
 * as one string is unreadable. Splitting the head from its members lets the
 * head stay a plain capability and the members render as what they are.
 */
export interface Capability {
	label: string;
	tags?: readonly string[];
}

export interface Project {
	/** URL segment — `/projects/keyflow`. */
	slug: string;
	name: string;
	/** Two or three words, rendered under the name. */
	tagline: string;
	description: string;
	/** Short monospace mark, e.g. `.kf`. */
	glyph: string;
	/**
	 * The product's shipped app icon, copied into `public/icons/` from its own
	 * repo (`apps/<product>/ios/icon.svg`). Optional: a project without a released
	 * app has no icon, and everything that renders one falls back to `glyph`.
	 *
	 * Re-copy it when the upstream icon changes — this is a snapshot, not a
	 * live reference.
	 */
	icon?: string;
	/** Hex accent used for borders, rules and the tile's motif. */
	accent: string;
	/** Hex tile background — each project owns a slightly different dark. */
	background: string;
	/**
	 * The three things this product does, for the landing page. Kept separate
	 * from `description`, which is a sentence and still feeds meta tags and the
	 * catalogue cards.
	 */
	capabilities: readonly Capability[];
	/**
	 * The product's own deployment under this apex, when it has one.
	 *
	 * `live: false` means the subdomain is planned and named but is not
	 * serving the product yet — today it answers from a wildcard with a blank
	 * page. Those render as a disabled control rather than a link: a button
	 * that lands on nothing costs more trust than one that says wait.
	 */
	site?: { url: string; live: boolean };
	status: ProjectStatus;
	version: string;
	repo: string;
}

export const PROJECT_SORTS = ["name", "status"] as const;
export type ProjectSort = (typeof PROJECT_SORTS)[number];

/**
 * Validated search params for `/projects`.
 *
 * Every field is `optional` rather than `default`ed on purpose: a defaulted
 * field makes the router rewrite a bare `/projects` to
 * `/projects?q=&sort=name` (a 307 on the canonical marketing URL). Absent
 * means "default" and is resolved at the point of use instead.
 *
 * `catch` means a hand-edited or stale URL degrades to the default view
 * instead of throwing — search params are user input.
 */
export const projectSearchSchema = z.object({
	q: z.string().trim().max(64).optional().catch(undefined),
	status: z.enum(PROJECT_STATUSES).optional().catch(undefined),
	sort: z.enum(PROJECT_SORTS).optional().catch(undefined),
});

export type ProjectSearch = z.infer<typeof projectSearchSchema>;
