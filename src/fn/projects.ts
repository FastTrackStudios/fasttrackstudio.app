/**
 * Typed RPC boundary for product data.
 *
 * This is the ONLY way client code reaches `src/server/projects.ts`.
 */

import { createServerFn } from "@tanstack/react-start";

import { chartFormat, stagePositions } from "#/server/projects";

/**
 * The whole landing page in ONE round trip: the three stage positions plus
 * the format band under them. Awaited by the home loader rather than
 * streamed — these ARE the page, so they belong in the first response, not
 * in a second flush behind a fallback.
 */
export const fetchLanding = createServerFn({ method: "GET" }).handler(
	async () => ({ positions: stagePositions(), format: chartFormat() ?? null }),
);
