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
import { findProject, listProjects, queryProjects } from "#/server/projects";

/** Whole catalogue — used by the landing page's streamed grid. */
export const fetchProjects = createServerFn({ method: "GET" }).handler(
	async () => listProjects(),
);

/** Filtered + sorted view — driven by the `/projects` search params. */
export const fetchProjectList = createServerFn({ method: "GET" })
	.inputValidator(projectSearchSchema)
	.handler(async ({ data }) => queryProjects(data));

/** One project. Throws `notFound()` so the route renders its 404 component. */
export const fetchProject = createServerFn({ method: "GET" })
	.inputValidator(z.object({ slug: z.string().min(1).max(64) }))
	.handler(async ({ data }) => {
		const project = findProject(data.slug);
		if (!project) throw notFound();
		return project;
	});
