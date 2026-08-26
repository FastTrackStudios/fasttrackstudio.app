/**
 * Project domain types + the search-param schema for the project index.
 *
 * Type-only + schema module: importable from client components without
 * dragging in the server-only data source (`src/server/projects.ts`).
 */

import * as z from "zod";

export const PROJECT_STATUSES = ["alpha", "beta", "stable"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
	/** URL segment — `/projects/keyflow`. */
	slug: string;
	name: string;
	/** Two or three words, rendered under the name. */
	tagline: string;
	description: string;
	/** Short monospace mark, e.g. `.kf`. */
	glyph: string;
	/** Hex accent used for borders, rules and the tile's motif. */
	accent: string;
	/** Hex tile background — each project owns a slightly different dark. */
	background: string;
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
