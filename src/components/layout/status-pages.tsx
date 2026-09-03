import { Link } from "@tanstack/react-router";

/**
 * The two pages the router renders on its own — a missing route and a
 * thrown error. Both keep the site's chrome (they render inside the shell)
 * and the site's voice: an eyebrow, a display line, a way out.
 */

export function NotFound() {
	return (
		<StatusPage eyebrow="404" title="That page does not exist.">
			<Link
				to="/"
				className="u-label text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
			>
				Back home
			</Link>
		</StatusPage>
	);
}

export function RootError({ error }: { error: Error }) {
	return (
		<StatusPage eyebrow="Error" title="Something went wrong.">
			<pre className="max-w-full overflow-x-auto rounded-card border border-line bg-surface p-4 font-mono text-xs text-fg-muted">
				{error.message}
			</pre>
		</StatusPage>
	);
}

function StatusPage({
	eyebrow,
	title,
	children,
}: {
	eyebrow: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-32">
			<p className="u-label text-fg-subtle">{eyebrow}</p>
			<h1 className="u-display text-[clamp(2.25rem,5vw,3.5rem)]">{title}</h1>
			{children}
		</section>
	);
}
