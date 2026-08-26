/**
 * Waitlist sink — server-only.
 *
 * Appends one JSON object per signup to a newline-delimited file so the
 * scaffold has no database dependency. Swap the body for whatever the real
 * backend ends up being (Task server, Postgres, a mailing-list API); the
 * exported signature is the only contract `src/fn/waitlist.ts` relies on.
 */

import "@tanstack/react-start/server-only";

import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const WAITLIST_FILE = process.env.WAITLIST_FILE ?? ".data/waitlist.jsonl";

export interface WaitlistEntry {
	email: string;
	/** Free-form note about what the person is here for. */
	interest?: string;
	/** ISO-8601, stamped server-side — never trust a client clock. */
	createdAt: string;
}

export async function recordSignup(
	entry: Omit<WaitlistEntry, "createdAt">,
): Promise<WaitlistEntry> {
	const record: WaitlistEntry = {
		...entry,
		createdAt: new Date().toISOString(),
	};

	await mkdir(dirname(WAITLIST_FILE), { recursive: true });
	await appendFile(WAITLIST_FILE, `${JSON.stringify(record)}\n`, "utf8");

	return record;
}
