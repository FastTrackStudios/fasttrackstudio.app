import type { ReactNode } from "react";

/**
 * The stage: a black room seen from the house, with three instruments hung
 * on a truss and a lit deck underneath.
 *
 * Everything in here is decoration and is hidden from assistive tech — the
 * meaning lives in the content layered on top. It is also entirely CSS: no
 * canvas, no animation frames, no measurement, so it server-renders as-is
 * and costs nothing to hydrate.
 *
 * The cue (engaging one position dims the other two) is CSS `:has()` in
 * styles.css rather than React state — no JS, and it works before hydrate.
 */

/**
 * Where each instrument hangs, left to right across the truss.
 *
 * No x coordinates: the rig is laid out on the SAME three-column grid as the
 * content, and each beam is centred in its own cell. Positioning them at
 * 20/50/80% instead looked right at one width and drifted 72px off the outer
 * columns on an ultrawide, because a grid's cell centres move with the gap
 * and the padding. Sharing the grid makes drift impossible.
 */
const RIG = [
	{ id: "signal", color: "var(--color-signal)", side: -1 },
	{ id: "session", color: "var(--color-session)", side: 1 },
	{ id: "ignition", color: "var(--color-ignition)", side: -1 },
] as const;

/** Matches the content grid in src/routes/index.tsx exactly. */
const RIG_GRID = "rig-grid grid grid-cols-3 gap-6 px-6";

/**
 * Visualiser bar heights. A fixed pattern, not random: the markup has to be
 * identical on server and client or hydration mismatches, and a repeating
 * asymmetric figure reads more like programme material than noise anyway.
 */
const VIZ = [
	0.32, 0.55, 0.41, 0.78, 0.6, 0.35, 0.5, 0.88, 0.62, 0.44, 0.71, 0.39, 0.58,
	0.95, 0.66, 0.42, 0.53, 0.8, 0.47, 0.34, 0.68, 0.9, 0.51, 0.38, 0.63, 0.45,
	0.76, 0.57, 0.4, 0.85, 0.6, 0.36, 0.49, 0.72, 0.43, 0.66, 0.31, 0.54,
].map((peak, i) => ({
	id: `bar-${i}`,
	peak,
	delay: (i % 7) * 140,
	period: 1500 + (i % 5) * 260,
}));

export function StageBackdrop() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			{/* ── The room ────────────────────────────────────────────────────
			    Full bleed. These are properties of the venue, not of the rig,
			    so they run edge to edge however wide the display is. */}

			{/* Fly space: black above the truss, so the lit deck has something
			    to be lit against. */}
			<div className="absolute inset-0 bg-void" />

			{/* Side booms — the wide, colourless cross-light that fills a room
			    with haze. Always on, always quiet; they are the air, not the
			    subject. */}
			<div
				className="absolute inset-y-0 left-0 w-1/3"
				style={{
					background:
						"linear-gradient(105deg, #ffffff0e 0%, #ffffff05 30%, transparent 62%)",
				}}
			/>
			<div
				className="absolute inset-y-0 right-0 w-1/3"
				style={{
					background:
						"linear-gradient(255deg, #ffffff0e 0%, #ffffff05 30%, transparent 62%)",
				}}
			/>

			{/* Deck: the bottom of the frame, in real perspective. */}
			<div className="deck absolute inset-x-0 bottom-0 h-[38vh] max-h-[34rem]">
				<div className="deck__plane" />
			</div>

			{/* ── The rig ─────────────────────────────────────────────────────
			    Measured off --stage-w, exactly like the content underneath, so
			    every beam stays over its own performer at any width. */}
			<div className="stage-w absolute inset-y-0 left-1/2 -translate-x-1/2">
				{/* The truss the instruments hang from. */}
				<div className="absolute inset-x-0 top-0 h-px bg-line" />

				<div className={`${RIG_GRID} absolute inset-0`}>
					{RIG.map((fixture, i) => (
						<div key={fixture.id} className="relative">
							{/* Clamp: where this instrument is hung. */}
							<div className="absolute top-0 left-1/2 h-3 w-6 -translate-x-1/2 rounded-b-sm border-x border-b border-line bg-surface" />

							<div
								data-beam={fixture.id}
								className="beam"
								style={{
									// --i and --side drive the phone layout, where the
									// products stack and the light comes in from the
									// sides instead of down from a truss.
									// @ts-expect-error -- custom properties
									"--beam": fixture.color,
									"--i": i,
									"--side": fixture.side,
									animation: `cue-up 900ms ease-out ${240 + i * 180}ms backwards`,
								}}
							/>
						</div>
					))}
				</div>

				{/* Where the beams land. Same grid again, so a pool sits under
				    its own beam. Above the deck plane, so they read as light ON
				    the floor rather than pattern in it. */}
				<div
					className={`${RIG_GRID} absolute inset-x-0 bottom-0 h-[38vh] max-h-[34rem]`}
				>
					{RIG.map((fixture) => (
						<div key={fixture.id} className="relative">
							<div
								data-beam={fixture.id}
								className="pool left-1/2 w-[130%] -translate-x-1/2"
								style={{
									top: "-3vh",
									height: "15vh",
									// @ts-expect-error -- custom property
									"--beam": fixture.color,
								}}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Footlights along the downstage edge. Full bleed: they belong to
			    the front of the stage, not to any one instrument. */}
			<div className="absolute inset-x-0 bottom-0 flex h-16 items-end gap-[3px] px-[5vw] opacity-45 sm:h-24">
				{VIZ.map((bar) => (
					<div
						key={bar.id}
						className="viz__bar"
						style={{
							height: `${bar.peak * 100}%`,
							animationDelay: `${bar.delay}ms`,
							animationDuration: `${bar.period}ms`,
						}}
					/>
				))}
			</div>
		</div>
	);
}

/** Wraps the backdrop and the content that stands on it. */
export function Scene({ children }: { children: ReactNode }) {
	return (
		// -mt-16/pt-16 pulls the stage up behind the floating header, so the
		// truss sits at the top of the viewport instead of under a 65px bar.
		<div className="scene relative isolate -mt-16 overflow-hidden pt-16">
			<StageBackdrop />
			<div className="relative z-10">{children}</div>
		</div>
	);
}
