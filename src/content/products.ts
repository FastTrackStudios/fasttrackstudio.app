/**
 * Where each product lives: its own deployment under this apex.
 *
 * This site is ONLY the front door. Every product is a separate repo with its
 * own site, and a product's position on the stage is a link straight to it —
 * there are no per-product pages here. This table is the single source of
 * those addresses: the catalogue (`server/projects.ts`), the footer and the
 * legacy `/projects/…` redirects all read it, so an address can never be
 * right in one place and wrong in another.
 *
 * Some of these are still being stood up and answer with nothing yet. The
 * positions link there regardless: that is the product's address, and the
 * site behind it is on its way.
 *
 * Order is presentation order everywhere the products are listed by name:
 * the three on the stage in stage order, then the format under them.
 */
export const PRODUCT_SITES = {
	signal: { name: "Signal", url: "https://signal.fasttrackstudio.app" },
	session: { name: "Session", url: "https://session.fasttrackstudio.app" },
	ignition: { name: "Ignition", url: "https://ignition.fasttrackstudio.app" },
	keyflow: { name: "Keyflow", url: "https://keyflow.fasttrackstudio.app" },
} as const;

export type ProductSlug = keyof typeof PRODUCT_SITES;

export function isProductSlug(slug: string): slug is ProductSlug {
	return Object.hasOwn(PRODUCT_SITES, slug);
}

/** The products in presentation order, each with its slug attached. */
export const PRODUCTS = (Object.keys(PRODUCT_SITES) as ProductSlug[]).map(
	(slug) => ({ slug, ...PRODUCT_SITES[slug] }),
);
