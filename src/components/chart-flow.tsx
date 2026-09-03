/**
 * Keyflow's flow triangle, ported from its own landing page
 * (`apps/web/src/routes/home.rs` in the keyflow repo).
 *
 * Three forms of one song, and every edge runs BOTH ways: text parses to a
 * chart and a chart exports back to text; a DAW session imports to a chart
 * and a chart writes back out as one. The base says the two starting points
 * convert to each other too. Each arrow is a real code path, not a diagram
 * of an intention — which is why none of them is single-headed.
 *
 * Geometry is copied verbatim so the shape here and the shape on
 * keyflow.fasttrackstudio.app are the same drawing; only the palette is
 * rebound to this site's tokens.
 *
 * The two strong edges carry the same violet-through-blue sweep as the word
 * "Accelerated" above them, so the diagram and the headline read as one
 * object rather than two things that happen to be nearby.
 */
export function ChartFlow({ className = "" }: { className?: string }) {
	return (
		<svg
			className={`block h-auto w-full max-w-sm overflow-visible ${className}`}
			viewBox="0 0 340 184"
			role="img"
			aria-label="Simple text and a DAW session each convert to a chart, and to each other. Every arrow points both ways."
		>
			<defs>
				{/*
				  `userSpaceOnUse` so ONE gradient spans the whole triangle:
				  with the default objectBoundingBox each line would get its own
				  full violet→blue run, and the two edges would mirror each other
				  instead of belonging to a single sweep across the diagram.
				*/}
				<linearGradient
					id="flow-sweep"
					gradientUnits="userSpaceOnUse"
					x1="40"
					y1="170"
					x2="300"
					y2="20"
				>
					<stop offset="0%" stopColor="var(--accent)" />
					<stop offset="50%" stopColor="var(--accent-far)" />
					<stop offset="100%" stopColor="var(--accent)" />
				</linearGradient>

				{/*
				  Arrowheads get their own bounding-box gradient. A marker is its
				  own coordinate system, so the userSpaceOnUse gradient above
				  would sample a single point inside a 5px head and paint it flat.
				*/}
				<linearGradient id="flow-head-sweep" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor="var(--accent)" />
					<stop offset="100%" stopColor="var(--accent-far)" />
				</linearGradient>
				{/*
				  One marker per colour. A marker cannot inherit the referencing
				  line's stroke without `context-stroke`, which is still not
				  dependable across browsers.
				*/}
				<marker
					id="flow-head-strong"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="5"
					markerHeight="5"
					orient="auto-start-reverse"
				>
					<path d="M0,0 L10,5 L0,10 Z" fill="url(#flow-head-sweep)" />
				</marker>
				<marker
					id="flow-head-soft"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="5"
					markerHeight="5"
					orient="auto-start-reverse"
				>
					<path
						d="M0,0 L10,5 L0,10 Z"
						fill="var(--color-fg-subtle)"
						opacity="0.75"
					/>
				</marker>
			</defs>

			{/* Simple Text ↔ Beautiful Chart */}
			<line
				x1="74.7"
				y1="141.5"
				x2="157.5"
				y2="37.6"
				fill="none"
				stroke="url(#flow-sweep)"
				strokeWidth="1.3"
				strokeLinecap="round"
				markerStart="url(#flow-head-strong)"
				markerEnd="url(#flow-head-strong)"
			/>
			{/* DAW Session ↔ Beautiful Chart */}
			<line
				x1="265.3"
				y1="141.5"
				x2="182.5"
				y2="37.6"
				fill="none"
				stroke="url(#flow-sweep)"
				strokeWidth="1.3"
				strokeLinecap="round"
				markerStart="url(#flow-head-strong)"
				markerEnd="url(#flow-head-strong)"
			/>
			{/* Simple Text ↔ DAW Session — the quieter claim, so a quieter line. */}
			<line
				x1="100"
				y1="165"
				x2="240"
				y2="165"
				fill="none"
				stroke="var(--color-fg-subtle)"
				strokeWidth="1.3"
				strokeLinecap="round"
				opacity="0.75"
				markerStart="url(#flow-head-soft)"
				markerEnd="url(#flow-head-soft)"
			/>

			{/* The destination, not a third input — so it carries the page's ink. */}
			<text
				x="170"
				y="26"
				textAnchor="middle"
				fill="var(--color-fg)"
				fontSize="13"
				fontWeight="640"
				letterSpacing="-0.01em"
			>
				Beautiful Chart
			</text>
			<text
				x="56"
				y="170"
				textAnchor="middle"
				fill="var(--color-fg-muted)"
				fontSize="13"
				fontWeight="500"
				letterSpacing="-0.01em"
			>
				Simple Text
			</text>
			<text
				x="284"
				y="170"
				textAnchor="middle"
				fill="var(--color-fg-muted)"
				fontSize="13"
				fontWeight="500"
				letterSpacing="-0.01em"
			>
				DAW Session
			</text>
		</svg>
	);
}
