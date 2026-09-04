import { ExternalAction, InternalAction } from "#/components/ui/action";
import { PlatformMarks } from "#/components/ui/icons";
import { HERO, HERO_ACTIONS } from "#/content/hero";
import { rise } from "#/lib/motion";

/**
 * The headline. Set in the condensed display face at marquee scale, because
 * the thing above a stage is a marquee.
 *
 * "OPEN" is the only word that changes weight — the claim is in the first
 * line, the position is in the second, and putting emphasis on both would
 * flatten them into one shout.
 */
export function Marquee() {
	return (
		// Measure widens with the display so the headline is not stuck in a
		// narrow column in the middle of a 5120px stage.
		<header className="mx-auto max-w-[64rem] text-center min-[1600px]:max-w-[76rem] min-[2200px]:max-w-[108rem]">
			{/* Hidden on phones: stacked directly above the marquee it crowded
			    the top of the frame, and the three products name the same three
			    domains a screen further down anyway. */}
			<Eyebrow />

			<h1
				className="u-display rise mt-5 text-balance text-[calc(var(--ui)*clamp(2.25rem,min(6.8cqw,11vh),11rem))] text-fg"
				style={rise(200)}
			>
				{HERO.lead}
			</h1>

			<p
				className="u-display rise mt-4 text-[calc(var(--ui)*clamp(1.55rem,min(2.9cqw,4.6vh),3.5rem))] text-fg-muted"
				style={rise(320)}
			>
				{HERO.stance.before}
				<span className="text-fg">{HERO.stance.emphasis}</span>
			</p>

			{/* Platforms as marks rather than a sentence: three logos are read at
			    a glance, where "runs on Linux, macOS and Windows" has to be read
			    word by word and was competing with the subhead for the same
			    breath. */}
			<PlatformMarks className="rise mt-8 2xl:mt-10" style={rise(540)} />

			<Actions />
		</header>
	);
}

function Eyebrow() {
	return (
		<p
			className="u-label rise hidden text-fg-subtle md:block"
			style={rise(100)}
		>
			{HERO.eyebrow}
		</p>
	);
}

/** The calls to action, in priority order; only the first is primary. */
function Actions() {
	return (
		<div
			className="rise mt-6 flex flex-wrap items-center justify-center gap-3 2xl:mt-8"
			style={rise(620)}
		>
			{HERO_ACTIONS.map((action, i) => {
				const emphasis = i === 0 ? "primary" : "secondary";
				switch (action.kind) {
					case "external":
						return (
							<ExternalAction
								key={action.label}
								href={action.href}
								newTab={action.newTab}
								emphasis={emphasis}
							>
								{action.label}
							</ExternalAction>
						);
					case "internal":
						return (
							<InternalAction
								key={action.label}
								to={action.to}
								emphasis={emphasis}
							>
								{action.label}
							</InternalAction>
						);
					default:
						return null;
				}
			})}
		</div>
	);
}
