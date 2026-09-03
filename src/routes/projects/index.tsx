import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy address. There is no catalogue any more — the products ARE the
 * front page, and each one links to its own site — so the old index goes
 * home. Kept as a redirect rather than dropped so an indexed or bookmarked
 * `/projects` never 404s.
 */
export const Route = createFileRoute("/projects/")({
	beforeLoad: () => {
		throw redirect({ to: "/", statusCode: 301 });
	},
});
