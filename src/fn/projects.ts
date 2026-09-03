/**
 * Typed RPC boundary for project data.
 *
 * These are the ONLY way client code reaches `src/server/projects.ts`. Each
 * one validates its input before the handler runs, so a hand-crafted request
 * can never reach the data layer with an unchecked shape.
 */

import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

import { projectSearchSchema } from "#/lib/projects";
import {
	chartFormat,
	findProject,
	listProjects,
	queryProjects,
	stagePositions,
} from "#/server/projects";

/** Whole catalogue. */
export const fetchProjects = createServerFn({ method: "GET" }).handler(
	async () => listProjects(),
);

/**
 * The three the landing page is built around. Awaited by the home loader
 * rather than streamed: these ARE the page, so they belong in the first
 * response, not in a second flush behind a fallback.
 */
export const fetchStagePositions = createServerFn({ method: "GET" }).handler(
	async () => stagePositions(),
);

/**
 * The stage plus the format band under it, in ONE round trip. Keyflow is
 * part of the same first response as the three positions — a second call
 * would put the band behind a flush the rest of the page does not need.
 */
export const fetchLanding = createServerFn({ method: "GET" }).handler(
	async () => ({ positions: stagePositions(), format: chartFormat() ?? null }),
);

/** Filtered + sorted view — driven by the `/projects` search params. */
export const fetchProjectList = createServerFn({ method: "GET" })
	.validator(projectSearchSchema)
	.handler(async ({ data }) => queryProjects(data));

/** One project. Throws `notFound()` so the route renders its 404 component. */
export const fetchProject = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string().min(1).max(64) }))
	.handler(async ({ data }) => {
		const project = findProject(data.slug);
		if (!project) throw notFound();
		return project;
	});
