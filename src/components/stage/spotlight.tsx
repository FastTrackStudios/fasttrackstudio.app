/**
 * The light on one stacked product (phones only).
 *
 * A follow-spot hung high in the wing: a shaft from a point above and to the
 * side of the frame, widening as it falls, landing in a wide pool behind the
 * name. It is drawn as ONE path — from the source to the pool's two tangent
 * points, closed along the pool's far arc — so the shaft and the pool cannot
 * come apart, and a single gradient runs the length of it. A soft blur turns
 * the geometry into light in haze.
 *
 * SVG rather than CSS gradients: a fixed viewBox means the drawing is the
 * same shape at every phone width, and the throw is aimed by geometry rather
 * than by a rotation that only looks right at one aspect ratio. The blur is
 * on a ~400px element, which a phone GPU handles easily; the beams on the
 * desktop rig are what made blur expensive, and those are hidden here.
 *
 * Right-wing lights are the same drawing mirrored.
 */

/** The drawing's own coordinate space. Scaled to the product's width. */
const VIEW = { w: 400, h: 300 } as const;

/**
 * Where the instrument hangs. Well ABOVE the frame and only a little to the
 * side, so the beam comes down at a steep rake — it falls further than it
 * travels across — the way a spot hung on a boom actually reaches a
 * performer. Moving it closer to the pool widens the cone; moving it further
 * out narrows it.
 */
const SOURCE = { x: 10, y: -215 } as const;

/** Where it lands: a wide ellipse behind the icon and the name. */
const POOL = { cx: 200, cy: 78, rx: 170, ry: 66 } as const;

/**
 * The two points where a line from the source just grazes the pool — the
 * edges of the cone. Computed rather than written down, so moving either the
 * source or the pool reshapes the whole light and nothing can fall out of
 * step. The ellipse is scaled to a circle, where the tangent angles are
 * `± acos(r / d)` off the bearing to the centre, and the results scaled back.
 */
function tangentPoints() {
	const k = POOL.rx / POOL.ry;
	const sx = SOURCE.x - POOL.cx;
	const sy = (SOURCE.y - POOL.cy) * k;
	const bearing = Math.atan2(sy, sx);
	const spread = Math.acos(POOL.rx / Math.hypot(sx, sy));

	return [bearing + spread, bearing - spread].map((angle) => ({
		x: POOL.cx + POOL.rx * Math.cos(angle),
		y: POOL.cy + (POOL.rx * Math.sin(angle)) / k,
	}));
}

const [EDGE_A, EDGE_B] = tangentPoints();

const CONE = [
	`M ${SOURCE.x} ${SOURCE.y}`,
	`L ${EDGE_A.x.toFixed(2)} ${EDGE_A.y.toFixed(2)}`,
	// The long way round, through the far side, so the pool's whole outline
	// belongs to the light and the shaft meets it exactly at the tangents.
	`A ${POOL.rx} ${POOL.ry} 0 1 1 ${EDGE_B.x.toFixed(2)} ${EDGE_B.y.toFixed(2)}`,
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
			// The shaft starts above and outside the box on purpose — it comes in
			// from the wing — and the blur spills past the pool. Clipping either
			// to the box put a hard edge on the light.
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
					<stop offset="0.4" stopColor={color} stopOpacity="0.1" />
					<stop offset="1" stopColor={color} stopOpacity="0.28" />
				</linearGradient>
				<radialGradient id={pool} cx="0.46" cy="0.5" r="0.55">
					<stop offset="0" stopColor={color} stopOpacity="0.3" />
					<stop offset="0.6" stopColor={color} stopOpacity="0.1" />
					<stop offset="1" stopColor={color} stopOpacity="0" />
				</radialGradient>
				<filter id={haze} x="-30%" y="-60%" width="160%" height="220%">
					<feGaussianBlur stdDeviation="6" />
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
