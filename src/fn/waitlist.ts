/**
 * Waitlist mutation. POST — it writes.
 */

import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";

import { recordSignup } from "#/server/waitlist";

export const waitlistSchema = z.object({
	email: z.email("Enter a valid email address").max(320),
	interest: z.string().trim().max(280).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export const joinWaitlist = createServerFn({ method: "POST" })
	.inputValidator(waitlistSchema)
	.handler(async ({ data }) => {
		const entry = await recordSignup(data);
		return { ok: true as const, createdAt: entry.createdAt };
	});
