/**
 * Live version numbers, read from GitHub.
 *
 * CURRENTLY UNUSED, ON PURPOSE. The tags across these repos are wrong and
 * are being renumbered, so the site would report versions that are about to
 * change — no version is shown anywhere at the moment. This module is kept
 * because the work is done and correct (the semver picking below is the part
 * that is easy to get wrong); switch it back on by mapping the exported
 * functions in `projects.ts` through `withLiveVersion` again and restoring
 * the Version row on the project page.
 *
 * SERVER-ONLY. The catalogue in `projects.ts` carries a hand-written
 * `version` as the floor; this module replaces it with whatever the repo
 * actually published, so the site stops drifting from the tags without
 * anyone editing a table.
 *
 * Three rules shape the design:
 *
 * 1. THE PAGE NEVER WAITS ON GITHUB. A render reads the cache and returns
 *    immediately — hit, miss or stale — and a refresh is kicked off in the
 *    background. A marketing page must not have its time-to-first-byte tied
 *    to a third-party API that can be slow or down.
 *
 * 2. FAILURE IS INVISIBLE. Any error (rate limit, network, a repo going
 *    private) leaves the last good answer in place, or falls back to the
 *    catalogue's static version. Nothing here can throw into a render.
 *
 * 3. THE RATE LIMIT IS RESPECTED. Unauthenticated GitHub allows 60 requests
 *    per hour per IP. Five repos at up to two calls each, refreshed every 30
 *    minutes, is ~20/hour — comfortably inside it, with room for the rest of
 *    the cluster to share the egress address. Set `GITHUB_TOKEN` to raise the
 *    ceiling to 5000/hour; nothing else changes.
 */

import "@tanstack/react-start/server-only";

import type { Project } from "#/lib/projects";

/** How long a fetched version is served before a refresh is scheduled. */
const TTL_MS = 30 * 60 * 1000;

/** Per-request ceiling. GitHub is not allowed to hold a socket open. */
const TIMEOUT_MS = 4000;

type Entry = {
	/** `undefined` once fetched means "asked, and the repo publishes none". */
	version: string | undefined;
	fetchedAt: number;
};

/**
 * Process-local, deliberately. The cache is a nicety, not state: a restart or
 * a second replica just re-warms it, and the static versions cover the gap.
 */
const cache = new Map<string, Entry>();

/** Repos currently being fetched, so N concurrent renders make one request. */
const inFlight = new Set<string>();

/**
 * `https://github.com/FastTrackStudios/keyflow` → `FastTrackStudios/keyflow`.
 * Anything that is not a GitHub repo URL returns undefined and is skipped.
 */
function repoPath(url: string): string | undefined {
	const match = /^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/.exec(url);
	return match ? `${match[1]}/${match[2]}` : undefined;
}

function headers(): HeadersInit {
	const base: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		// GitHub rejects unidentified clients; naming the site makes the
		// traffic legible in their logs and ours.
		"User-Agent": "fasttrackstudio.app",
	};
	const token = process.env.GITHUB_TOKEN;
	if (token) base.Authorization = `Bearer ${token}`;
	return base;
}

async function getJson(url: string): Promise<unknown | undefined> {
	try {
		const response = await fetch(url, {
			headers: headers(),
			signal: AbortSignal.timeout(TIMEOUT_MS),
		});
		// 404 is the normal answer for "no releases yet" — not an error worth
		// logging, just a signal to try tags instead.
		if (!response.ok) return undefined;
		return await response.json();
	} catch {
		return undefined;
	}
}

/** `v1.2.3` and `1.2.3` both mean 1.2.3. */
function normalise(tag: string): string {
	return tag.replace(/^v/, "");
}

/**
 * Highest semver wins.
 *
 * `/tags` is ordered by the ref name, NOT by version or date, so `v0.10.0`
 * sorts below `v0.9.0` there and taking the first entry would report a
 * version that went out months ago. Anything unparseable sorts last rather
 * than throwing off the comparison.
 */
function highestSemver(tags: readonly string[]): string | undefined {
	const parsed = tags
		.map((tag) => {
			const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(tag);
			return match
				? {
						tag,
						parts: [
							Number(match[1]),
							Number(match[2]),
							Number(match[3]),
						] as const,
					}
				: undefined;
		})
		.filter((entry): entry is NonNullable<typeof entry> => entry !== undefined);

	if (parsed.length === 0) return undefined;

	parsed.sort(
		(a, b) =>
			b.parts[0] - a.parts[0] ||
			b.parts[1] - a.parts[1] ||
			b.parts[2] - a.parts[2],
	);

	return normalise(parsed[0].tag);
}

/**
 * The published version of one repo: its latest release, or failing that its
 * highest semver tag. `undefined` means the repo publishes neither.
 */
async function fetchVersion(path: string): Promise<string | undefined> {
	const release = await getJson(
		`https://api.github.com/repos/${path}/releases/latest`,
	);
	if (
		release &&
		typeof release === "object" &&
		"tag_name" in release &&
		typeof release.tag_name === "string"
	) {
		return normalise(release.tag_name);
	}

	const tags = await getJson(
		`https://api.github.com/repos/${path}/tags?per_page=100`,
	);
	if (!Array.isArray(tags)) return undefined;

	return highestSemver(
		tags
			.map((tag) =>
				tag && typeof tag === "object" && "name" in tag ? tag.name : undefined,
			)
			.filter((name): name is string => typeof name === "string"),
	);
}

/**
 * Refresh one repo in the background. Never awaited by a render, and never
 * allowed to reject — an unhandled rejection here would take down the server.
 */
function refresh(path: string): void {
	if (inFlight.has(path)) return;
	inFlight.add(path);

	fetchVersion(path)
		.then((version) => {
			cache.set(path, { version, fetchedAt: Date.now() });
		})
		.catch(() => {
			// Keep whatever is cached. Re-stamping the time here would be wrong:
			// a failure should be retried on the next render, not held for a
			// full TTL.
		})
		.finally(() => {
			inFlight.delete(path);
		});
}

/**
 * The version to show for a project, right now, without blocking.
 *
 * Returns the cached value when there is one and the catalogue's static
 * version otherwise, and schedules a refresh whenever the entry is missing
 * or older than the TTL.
 */
export function liveVersion(project: Project): string {
	const path = repoPath(project.repo);
	if (!path) return project.version;

	const entry = cache.get(path);
	if (!entry || Date.now() - entry.fetchedAt > TTL_MS) refresh(path);

	return entry?.version ?? project.version;
}

/** The same project with `version` resolved to what GitHub reports. */
export function withLiveVersion(project: Project): Project {
	return { ...project, version: liveVersion(project) };
}
