/**
 * The motif behind a catalogue tile — a small, looping picture of what the
 * project actually is: bars for the audio side, a section ruler for the
 * coordinator, panning beams for the lighting side, a staff for the chart
 * format, a key map for the input layer.
 *
 * All of it is CSS keyframes (see "Catalogue tiles" in styles.css) rather
 * than canvas or a JS loop: a catalogue page renders one of these per card,
 * and none of them is worth a frame budget. Every motif is decoration —
 * `aria-hidden`, no pointer events, and frozen under `prefers-reduced-motion`.
 *
 * Dispatch is by slug with a deliberate fallback, so a project added to the
 * catalogue without a motif still renders a tile instead of an empty hole.
 */

type MotifProps = { color: string };

export function ProjectMotif({ slug, color }: { slug: string; color: string }) {
	const Motif = MOTIFS[slug] ?? PulseMotif;

	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			<Motif color={color} />
		</div>
	);
}

const MOTIFS: Record<string, (props: MotifProps) => React.ReactElement> = {
	signal: SpectrumMotif,
	session: SectionsMotif,
	ignition: BeamsMotif,
	keyflow: StaffMotif,
	input: KeysMotif,
};

/**
 * Signal — a full-width spectrum along the floor of the tile.
 *
 * The bars are described once at module scope rather than derived in render:
 * the peaks and periods are pseudo-random but must be IDENTICAL in the server
 * render and the client hydration, so they are computed from the index and
 * frozen here instead of drawn from `Math.random()`.
 */
const SPECTRUM_BARS = Array.from({ length: 44 }, (_, i) => ({
	id: `bar-${i}`,
	peak: 10 + ((i * 17) % 50),
	period: 1.6 + (i % 7) * 0.2,
	// Negative delay so the bars start mid-cycle, already moving, instead of
	// all rising together from flat on first paint.
	delay: ((i * 0.05) % 1.4) - 1.4,
}));

function SpectrumMotif({ color }: MotifProps) {
	const count = SPECTRUM_BARS.length;

	return (
		<div className="absolute inset-x-1 bottom-0 flex items-end justify-between">
			{SPECTRUM_BARS.map((bar) => (
				<span
					key={bar.id}
					className="block rounded-t-[1px]"
					style={{
						background: color,
						opacity: 0.16,
						width: `calc((100% - ${count}px) / ${count})`,
						minWidth: 2,
						["--peak" as string]: `${bar.peak}px`,
						animation: `tile-eq ${bar.period}s ease-in-out infinite`,
						animationDelay: `${bar.delay}s`,
					}}
				/>
			))}
		</div>
	);
}

/** Session — the section ruler of a song, with the playhead running it. */
function SectionsMotif({ color }: MotifProps) {
	const sections = ["INTRO", "VS 1", "CH", "VS 2", "CH", "BR", "OUT"];

	return (
		<div className="absolute inset-0 flex items-end pb-6">
			<div className="relative flex w-full justify-between px-6">
				{sections.map((section) => (
					<span
						key={section}
						className="font-mono tracking-[0.25em]"
						style={{ color, opacity: 0.18, fontSize: "0.55rem" }}
					>
						{section}
					</span>
				))}

				{/* Overshoots the row top and bottom so it reads as a playhead
				    crossing the whole tile, not a tick inside the label strip. */}
				<span
					className="absolute w-px"
					style={{
						background: color,
						opacity: 0.24,
						top: -120,
						bottom: -40,
						animation: "tile-scan 7s linear infinite",
					}}
				/>
			</div>
		</div>
	);
}

/** Ignition — four fixtures hung across the top, panning on their yokes. */
function BeamsMotif({ color }: MotifProps) {
	const fixtures = [
		{ at: "18%", throw: 14, period: 9 },
		{ at: "40%", throw: 20, period: 11 },
		{ at: "62%", throw: 17, period: 8 },
		{ at: "84%", throw: 12, period: 13 },
	];

	return (
		<div className="absolute inset-0">
			{fixtures.map((fixture, i) => (
				<span
					key={fixture.at}
					className="absolute top-0 block"
					style={{
						left: fixture.at,
						width: "7rem",
						height: "22rem",
						marginLeft: "-3.5rem",
						// Swings from the hang point at the top, like a real yoke.
						transformOrigin: "50% 0%",
						["--throw" as string]: fixture.throw,
						animation: `tile-pan ${fixture.period}s ease-in-out infinite`,
						animationDelay: `${-i * 2.3}s`,
						// A hard-edged cone: the gradient is the light in the air,
						// the clip-path is the beam's own spread.
						clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
						background: `linear-gradient(to bottom, ${color}, transparent 78%)`,
						opacity: 0.09,
					}}
				/>
			))}
		</div>
	);
}

/** The y positions of the five staff lines — unique, so they key themselves. */
const STAFF_LINES = [4, 12, 20, 28, 36];

/** Keyflow — five staff lines with notation drifting across them. */
function StaffMotif({ color }: MotifProps) {
	const glyphs = [
		{ ch: "\u{1D11E}", size: 1.6 },
		{ ch: "♩", size: 1.0 },
		{ ch: "♪", size: 1.0 },
		{ ch: "♫", size: 1.1 },
		{ ch: "♬", size: 1.1 },
		{ ch: "♭", size: 0.9 },
		{ ch: "♯", size: 0.9 },
		{ ch: "♮", size: 0.9 },
	];

	return (
		<div className="absolute inset-0">
			<svg
				className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
				style={{ height: "3rem", opacity: 0.07 }}
				preserveAspectRatio="none"
				viewBox="0 0 100 40"
				role="presentation"
			>
				{STAFF_LINES.map((y) => (
					<line
						key={y}
						x1="0"
						y1={y}
						x2="100"
						y2={y}
						stroke={color}
						strokeWidth="0.2"
					/>
				))}
			</svg>

			{glyphs.map((glyph, i) => (
				<span
					key={glyph.ch}
					className="absolute select-none leading-none"
					style={{
						color,
						opacity: 0.13,
						top: `${10 + ((i * 19) % 68)}%`,
						fontSize: `${glyph.size}rem`,
						animation: `tile-drift ${18 + (i % 5) * 3}s linear infinite`,
						animationDelay: `${-i * 2.5}s`,
					}}
				>
					{glyph.ch}
				</span>
			))}
		</div>
	);
}

/** Input — a key map, sitting in the corner like a plan drawing. */
const KEY_ROWS = [
	{
		id: "digits",
		keys: [
			{ id: "esc", w: 1.5, label: "esc" },
			{ id: "1", w: 1, label: "1" },
			{ id: "2", w: 1, label: "2" },
			{ id: "3", w: 1, label: "3" },
			{ id: "4", w: 1, label: "4" },
			{ id: "5", w: 1, label: "5" },
			{ id: "6", w: 1, label: "6" },
			{ id: "7", w: 1, label: "7" },
			{ id: "8", w: 1, label: "8" },
			{ id: "9", w: 1, label: "9" },
			{ id: "back", w: 1.5, label: "\u232B" },
		],
	},
	{
		id: "qwerty",
		keys: [
			{ id: "tab", w: 1.5, label: "\u21E5" },
			{ id: "q", w: 1, label: "Q" },
			{ id: "w", w: 1, label: "W" },
			{ id: "e", w: 1, label: "E" },
			{ id: "r", w: 1, label: "R" },
			{ id: "t", w: 1, label: "T" },
			{ id: "y", w: 1, label: "Y" },
			{ id: "u", w: 1, label: "U" },
			{ id: "i", w: 1, label: "I" },
			{ id: "o", w: 1, label: "O" },
			{ id: "backslash", w: 1.5, label: "\\" },
		],
	},
	{
		id: "home",
		keys: [
			{ id: "caps", w: 1.75, label: "\u21EA" },
			{ id: "a", w: 1, label: "A" },
			{ id: "s", w: 1, label: "S" },
			{ id: "d", w: 1, label: "D" },
			{ id: "f", w: 1, label: "F" },
			{ id: "g", w: 1, label: "G" },
			{ id: "h", w: 1, label: "H" },
			{ id: "j", w: 1, label: "J" },
			{ id: "k", w: 1, label: "K" },
			{ id: "enter", w: 2.25, label: "\u21B5" },
		],
	},
	{
		// The modifier row repeats its labels, which is exactly why each key
		// carries an id of its own rather than being keyed by label.
		id: "mods",
		keys: [
			{ id: "ctrl", w: 1.25, label: "ctrl" },
			{ id: "alt-l", w: 1.25, label: "\u2325" },
			{ id: "cmd-l", w: 1.5, label: "\u2318" },
			{ id: "space", w: 5.25, label: "" },
			{ id: "cmd-r", w: 1.5, label: "\u2318" },
			{ id: "alt-r", w: 1.25, label: "\u2325" },
		],
	},
] as const;

function KeysMotif({ color }: MotifProps) {
	const unit = 14;
	const gap = 2;

	return (
		<div className="absolute inset-0 flex items-end justify-end pb-3 pr-3">
			<div className="flex flex-col" style={{ gap, padding: 4 }}>
				{KEY_ROWS.map((row) => (
					<div key={row.id} className="flex" style={{ gap }}>
						{row.keys.map((key) => (
							<div
								key={`${row.id}-${key.id}`}
								className="flex select-none items-center justify-center font-mono"
								style={{
									width: key.w * unit + (key.w - 1) * gap,
									height: unit,
									fontSize: "0.5rem",
									color,
									borderRadius: 2,
									border: `1px solid ${color}`,
									opacity: 0.35,
								}}
							>
								{key.label}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

/** Fallback — a single scanning hairline. Says "there is a thing here"
 *  without pretending to depict something the catalogue has not described. */
function PulseMotif({ color }: MotifProps) {
	return (
		<div className="absolute inset-0">
			<span
				className="absolute inset-y-0 w-px"
				style={{
					background: color,
					opacity: 0.35,
					animation: "tile-scan 11s linear infinite",
				}}
			/>
		</div>
	);
}
