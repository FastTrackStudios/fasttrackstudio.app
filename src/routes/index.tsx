import { createFileRoute } from "@tanstack/react-router";

import { ChartBand } from "#/components/keyflow/chart-band";
import { Stage } from "#/components/stage/stage";
import { fetchLanding } from "#/fn/projects";
import { pageHead } from "#/lib/seo";

/**
 * The front door. Two screens: the stage (the marquee and the three
 * products, each a link to its own site) and the Keyflow band under it.
 */
export const Route = createFileRoute("/")({
	// Full SSR. This is the page search engines and link unfurlers read, so
	// the markup has to exist in the first response — never `data-only` here.
	ssr: true,
	head: () => pageHead(),
	loader: () => fetchLanding(),
	component: Home,
});

function Home() {
	const { positions, format } = Route.useLoaderData();

	return (
		<>
			<Stage positions={positions} />

			{/* Outside <Scene>: the band is lit by the house, not by the rig, so
			    it must not sit inside the beams' stacking context or pick up
			    their cues. */}
			{format ? <ChartBand project={format} /> : null}
		</>
	);
}
