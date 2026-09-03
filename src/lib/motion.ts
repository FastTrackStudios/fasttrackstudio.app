import type { CSSProperties } from "react";

/**
 * The entrance cue's stagger, as a style object.
 *
 *   <h1 className="rise …" style={rise(200)}>…</h1>
 *
 * Pairs with `.rise` in styles/motion.css: the class carries the animation,
 * the custom property carries the delay. Keeping the delay as data rather
 * than as an inline `animation:` string means the timing curve and duration
 * are defined once and every element that rises rises the same way.
 */
export function rise(delayMs = 0): CSSProperties {
	return { "--rise-delay": `${delayMs}ms` } as CSSProperties;
}
