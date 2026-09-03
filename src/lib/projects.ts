/**
 * Project domain types.
 *
 * Type-only module: importable from client components without dragging in
 * the server-only data source (`src/server/projects.ts`).
 */

import type { ProductSlug } from "#/content/products";

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
	/** Keys `PRODUCT_SITES` — every product has a site of its own. */
	slug: ProductSlug;
	name: string;
	/** Two or three words, rendered under the name. */
	tagline: string;
	description: string;
	/** Short monospace mark, e.g. `.kf`. */
	glyph: string;
	/**
	 * The product's shipped app icon, copied into `public/icons/` from its own
	 * repo (`apps/<product>/ios/icon.svg`). Re-copy it when the upstream icon
	 * changes — this is a snapshot, not a live reference.
	 */
	icon: string;
	/** Hex accent: the beam, the rule, the label. Taken from the icon. */
	accent: string;
	/**
	 * The three things this product does, for the landing page. Kept separate
	 * from `description`, which is a sentence and still feeds meta tags.
	 */
	capabilities: readonly Capability[];
	/** The product's own site. Resolved from `PRODUCT_SITES` by slug. */
	site: { url: string };
	/**
	 * Static floor for the version. Not displayed anywhere today — see the
	 * note at the top of `src/server/releases.ts`.
	 */
	version: string;
	repo: string;
}
