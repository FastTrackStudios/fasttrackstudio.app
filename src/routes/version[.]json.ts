import { createFileRoute } from "@tanstack/react-router";

/**
 * Deploy probe. CI polls `https://fasttrackstudio.app/version.json` after a
 * push and only goes green once `rev` equals the pushed commit — that is what
 * makes a green deploy mean "the cluster SERVES this commit", not "an image
 * was pushed". `GIT_SHA` is baked in by the Dockerfile build arg.
 */
export const Route = createFileRoute("/version.json")({
	server: {
		handlers: {
			GET: () =>
				Response.json(
					{
						rev: process.env.GIT_SHA ?? "dev",
						builtAt: process.env.BUILD_TIME || null,
					},
					{ headers: { "cache-control": "no-store" } },
				),
		},
	},
});
