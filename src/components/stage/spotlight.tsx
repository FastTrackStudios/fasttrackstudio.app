/**
 * The light on one stacked product (phones only).
 *
 * A follow-spot from a wing: a shaft from a point off the edge of the frame,
 * widening as it travels, landing in a wide, low pool behind the name. It is
 * drawn as ONE path — from the source to the ellipse's two tangent points,
 * closed along the ellipse's far arc — so the shaft and the pool cannot come
 * apart, and a single gradient runs the length of it. A soft blur turns the
 * geometry into light in haze.
 *
 * SVG rather than CSS gradients: a fixed viewBox means the drawing is the
 * same shape at every phone width, and the shaft is aimed by geometry (the
 * tangent points are computed, not eyeballed) rather than by a rotation
 * that only looks right at one aspect ratio. The blur is on a ~400px
 * element, which a phone GPU handles easily; the beams on the desktop rig
 * are what made blur expensive, and those are hidden here.
 *
 * Right-wing lights are the same drawing mirrored.
 */

/** Where the ellipse sits in the box, and where the shaft comes from. */
const VIEW = { w: 400, h: 300 } as const;
const SOURCE = { x: -70, y: -30 } as const;
const POOL = { cx: 200, cy: 78, rx: 172, ry: 44 } as const;
/** Tangent points from SOURCE to POOL (computed; recompute if either moves). */
const TANGENT_FAR = { x: 304.3, y: 43.0 } as const;
const TANGENT_NEAR = { x: 32.1, y: 87.5 } as const;

const CONE = [
	`M ${SOURCE.x} ${SOURCE.y}`,
	`L ${TANGENT_FAR.x} ${TANGENT_FAR.y}`,
	// The far arc, the long way round, so the pool's whole outline is part of
	// the light and the shaft meets it at the tangents.
	`A ${POOL.rx} ${POOL.ry} 0 1 1 ${TANGENT_NEAR.x} ${TANGENT_NEAR.y}`,
	"Z",
].join(" ");

export function Spotlight({
	id,
	color,
	side,
	className = "",
}: {
	/** Unique per instance: gradient and filter ids are document-global. */
	id: string;
	color: string;
	/** -1 from stage left, 1 from stage right. */
	side: -1 | 1;
	className?: string;
}) {
	const sweep = `spot-${id}-sweep`;
	const pool = `spot-${id}-pool`;
	const haze = `spot-${id}-haze`;

	return (
		<svg
			aria-hidden="true"
			viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
			preserveAspectRatio="xMidYMin meet"
			// The shaft starts off the edge of the box on purpose — it comes in
			// from the wing — and the blur spills past the pool. Clipping either
			// to the box put a hard vertical edge on the light.
			overflow="visible"
			className={`pointer-events-none absolute inset-x-0 top-0 h-auto w-full ${className}`}
			style={{
				// Mirror for a right-wing throw. The gradients mirror with it.
				transform: side === 1 ? "scaleX(-1)" : undefined,
			}}
		>
			<defs>
				{/* Along the throw: nothing at the lens, everything on the deck.
				    userSpaceOnUse so the ramp is over real distance. */}
				<linearGradient
					id={sweep}
					gradientUnits="userSpaceOnUse"
					x1={SOURCE.x}
					y1={SOURCE.y}
					x2={POOL.cx}
					y2={POOL.cy}
				>
					<stop offset="0" stopColor={color} stopOpacity="0" />
					<stop offset="0.35" stopColor={color} stopOpacity="0.12" />
					<stop offset="1" stopColor={color} stopOpacity="0.3" />
				</linearGradient>
				<radialGradient id={pool} cx="0.42" cy="0.5" r="0.55">
					<stop offset="0" stopColor={color} stopOpacity="0.32" />
					<stop offset="0.6" stopColor={color} stopOpacity="0.1" />
					<stop offset="1" stopColor={color} stopOpacity="0" />
				</radialGradient>
				<filter id={haze} x="-30%" y="-60%" width="160%" height="220%">
					<feGaussianBlur stdDeviation="9" />
				</filter>
			</defs>

			<g filter={`url(#${haze})`}>
				<path d={CONE} fill={`url(#${sweep})`} />
				<ellipse
					cx={POOL.cx}
					cy={POOL.cy}
					rx={POOL.rx}
					ry={POOL.ry}
					fill={`url(#${pool})`}
				/>
			</g>
		</svg>
	);
}
