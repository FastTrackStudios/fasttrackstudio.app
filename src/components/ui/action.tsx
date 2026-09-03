import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * The site's one button shape, in its three weights.
 *
 * Greyscale by design: on this page colour is product identity, so a button
 * that borrowed Signal's green would read as being about Signal. Priority is
 * carried by weight — the brightness of the border — not by hue.
 *
 *   primary    a bright border, fills on hover. One per group.
 *   secondary  a quiet border, brightens on hover.
 *   soon       named but not built. Renders inert, and says so.
 */
export type Emphasis = "primary" | "secondary";

const BASE =
	"u-label inline-flex items-center gap-2 rounded-card border transition-colors duration-300";

const SIZE = {
	md: "px-6 py-3",
	sm: "px-5 py-3",
} as const;

const EMPHASIS: Record<Emphasis, string> = {
	primary: "border-fg/70 text-fg hover:border-fg hover:bg-fg hover:text-void",
	secondary: "border-line-strong text-fg-muted hover:border-fg hover:text-fg",
};

interface Common {
	emphasis?: Emphasis;
	size?: keyof typeof SIZE;
	className?: string;
	children: ReactNode;
}

function classes({
	emphasis = "secondary",
	size = "md",
	className = "",
}: Omit<Common, "children">) {
	return `${BASE} ${SIZE[size]} ${EMPHASIS[emphasis]} ${className}`;
}

/** An action that leaves the site. Opens in the same tab unless `newTab`. */
export function ExternalAction({
	href,
	newTab = false,
	children,
	...rest
}: Common & { href: string; newTab?: boolean }) {
	return (
		<a
			href={href}
			{...(newTab ? { target: "_blank", rel: "noreferrer noopener" } : {})}
			className={classes(rest)}
		>
			{children}
		</a>
	);
}

/** An action within the site — a typed router link. */
export function InternalAction({
	to,
	children,
	...rest
}: Common & { to: LinkProps["to"] }) {
	return (
		<Link to={to} className={classes(rest)}>
			{children}
		</Link>
	);
}

/**
 * Something that does not exist yet.
 *
 * `aria-disabled` rather than `disabled`: a disabled button drops out of the
 * tab order entirely, so a keyboard user never learns the action exists.
 * This one is reachable, announced as unavailable, and does nothing when
 * pressed. The explicit label stops the two spans concatenating to
 * "Forumsoon" for a screen reader.
 */
export function SoonAction({
	label,
	size = "md",
	className = "",
}: {
	label: string;
	size?: keyof typeof SIZE;
	className?: string;
}) {
	return (
		<button
			type="button"
			aria-disabled="true"
			aria-label={`${label} — coming soon`}
			className={`${BASE} ${SIZE[size]} cursor-not-allowed border-line text-fg-subtle ${className}`}
		>
			<span aria-hidden="true">{label}</span>
			<SoonTag />
		</button>
	);
}

/** The small "soon" mark, for anything named ahead of existing. */
export function SoonTag({ className = "" }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={`rounded-[2px] border border-current px-1.5 py-1 text-[0.5625rem] tracking-[0.18em] opacity-70 ${className}`}
		>
			soon
		</span>
	);
}
