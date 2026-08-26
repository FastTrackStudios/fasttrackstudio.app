import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { joinWaitlist, waitlistSchema } from "#/fn/waitlist";

type State =
	| { kind: "idle" }
	| { kind: "submitting" }
	| { kind: "done" }
	| { kind: "error"; message: string };

/**
 * Email capture. Client-side validation runs the SAME zod schema the server
 * function validates with, so the fast path and the trustworthy path can
 * never drift; the server check is the one that counts.
 */
export function WaitlistForm() {
	const submit = useServerFn(joinWaitlist);
	const [state, setState] = useState<State>({ kind: "idle" });

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		const parsed = waitlistSchema.safeParse({
			email: String(form.get("email") ?? ""),
		});

		if (!parsed.success) {
			setState({
				kind: "error",
				message: parsed.error.issues[0]?.message ?? "Check your details.",
			});
			return;
		}

		setState({ kind: "submitting" });
		try {
			await submit({ data: parsed.data });
			setState({ kind: "done" });
		} catch {
			setState({
				kind: "error",
				message: "Something broke. Try again shortly.",
			});
		}
	}

	if (state.kind === "done") {
		return (
			<output className="block text-sm text-fg-muted">
				You&rsquo;re on the list. We&rsquo;ll be in touch.
			</output>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex w-full max-w-md flex-col gap-3">
			<div className="flex gap-2">
				<label htmlFor="waitlist-email" className="sr-only">
					Email address
				</label>
				<input
					id="waitlist-email"
					name="email"
					type="email"
					required
					autoComplete="email"
					placeholder="you@studio.com"
					className="min-w-0 flex-1 rounded border border-line-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle"
				/>
				<button
					type="submit"
					disabled={state.kind === "submitting"}
					className="rounded border border-accent/60 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
				>
					{state.kind === "submitting" ? "…" : "Join"}
				</button>
			</div>

			{state.kind === "error" ? (
				<p className="text-xs text-red-400" role="alert">
					{state.message}
				</p>
			) : null}
		</form>
	);
}
