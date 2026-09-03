/**
 * Record the Keyflow landing page's live chart preview to a frame sequence.
 *
 * The preview is a Dioxus/WASM component: a typewriter drives a signal, and
 * both the source pane and the engraved chart re-render from it. There is no
 * way to import that into a TypeScript site, so this drives the DEPLOYED page
 * over the Chrome DevTools Protocol and captures what it actually draws.
 *
 * It records exactly ONE chart cycle — from the moment a chart's title
 * appears in the window bar until the bar changes to the next chart — so the
 * resulting loop is seamless rather than cut mid-keystroke.
 *
 * Usage, from the repo root:
 *
 *   bun tools/record-keyflow-preview.ts /tmp/kf 0
 *
 * then crop, scale and encode the frames it drops (the box and the per-frame
 * timestamps are written alongside them as meta.json):
 *
 *   ffmpeg -f concat -safe 0 -i frames.ffconcat \
 *     -vf "crop=1220:1110:1396:298,scale=1000:-2:flags=lanczos,fps=25" \
 *     -c:v libx264 -pix_fmt yuv420p -crf 26 -movflags +faststart -an \
 *     public/media/keyflow-preview.mp4
 *
 * CHROME is a nix store path and will not survive a channel bump — point it
 * at whatever chromium is on hand when you next run this.
 */

const OUT = process.argv[2];
const WANT_CHART = Number(process.argv[3] ?? 0);

const CHROME =
	"/nix/store/pb07gdpnff2m6mrzc8iad6xwj48gaqgj-ungoogled-chromium-152.0.7977.64/bin/chromium";
const URL = "https://keyflow.fasttrackstudio.app/";
const PORT = 9333;

// The viewport the page is laid out in. The preview's box is measured from
// the live DOM after load rather than hardcoded, so a layout change moves the
// crop instead of silently shifting the recording.
const WIDTH = 1432;
const HEIGHT = 900;
// 2x so the engraved chart's hairlines survive the downscale.
const SCALE = 2;

await Bun.$`mkdir -p ${OUT}`.quiet();

const chrome = Bun.spawn(
	[
		CHROME,
		"--headless=new",
		"--no-sandbox",
		"--disable-gpu",
		"--hide-scrollbars",
		`--remote-debugging-port=${PORT}`,
		`--window-size=${WIDTH},${HEIGHT}`,
		`--force-device-scale-factor=${SCALE}`,
		"about:blank",
	],
	{ stdout: "ignore", stderr: "ignore" },
);

/** CCD takes a moment to bind the port; poll rather than guess a sleep. */
async function debuggerUrl(): Promise<string> {
	for (let i = 0; i < 60; i++) {
		try {
			const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
			const json = (await res.json()) as { webSocketDebuggerUrl: string };
			if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
		} catch {}
		await Bun.sleep(250);
	}
	throw new Error("chrome devtools never came up");
}

const ws = new WebSocket(await debuggerUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 1;
const pending = new Map<number, (v: any) => void>();
const listeners = new Map<string, (p: any) => void>();

ws.addEventListener("message", (event) => {
	const msg = JSON.parse(String(event.data));
	if (msg.id && pending.has(msg.id)) {
		pending.get(msg.id)!(msg.result);
		pending.delete(msg.id);
	} else if (msg.method && listeners.has(msg.method)) {
		listeners.get(msg.method)!(msg.params);
	}
});

function send(method: string, params: any = {}, sessionId?: string) {
	const id = nextId++;
	ws.send(JSON.stringify({ id, method, params, sessionId }));
	return new Promise<any>((resolve) => pending.set(id, resolve));
}

// Attach to a real page target — the browser-level connection cannot render.
const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", {
	targetId,
	flatten: true,
});

const call = (method: string, params: any = {}) =>
	send(method, params, sessionId);

await call("Page.enable");
await call("Runtime.enable");
await call("Emulation.setDeviceMetricsOverride", {
	width: WIDTH,
	height: HEIGHT,
	deviceScaleFactor: SCALE,
	mobile: false,
});

async function evaluate<T>(expression: string): Promise<T> {
	const { result } = await call("Runtime.evaluate", {
		expression,
		returnByValue: true,
		awaitPromise: true,
	});
	return result?.value as T;
}

await call("Page.navigate", { url: URL });

/** The WASM bundle boots, then the preview mounts. Wait for the real thing. */
console.log("waiting for the preview to mount…");
for (let i = 0; i < 240; i++) {
	const ready = await evaluate<boolean>(
		`!!document.querySelector('.kf-window-body')`,
	);
	if (ready) break;
	await Bun.sleep(500);
}

const box = await evaluate<{ x: number; y: number; w: number; h: number }>(`
  (() => {
    const r = document.querySelector('.kf-window').getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y),
             w: Math.round(r.width), h: Math.round(r.height) };
  })()
`);
console.log("preview box", box);

/**
 * The chart currently on screen, normalised.
 *
 * The bar renders `filename_for(chart)`, which SLUGIFIES the title —
 * "Midnight Dreams" shows up as "Midnight_Dreams.kf" — so underscores come
 * back out here before anything is compared against a chart name.
 */
const title = () =>
	evaluate<string>(
		`((document.querySelector('.kf-window-bar')?.textContent || '')
		    .split('.kf')[0].trim().replace(/_/g, ' '))`,
	);

/**
 * Charts cycle in a fixed order. Start on the TRANSITION into the one we
 * want — the moment the bar changes is the moment the pane is empty and the
 * first character is about to be typed, which is what makes the loop seam
 * invisible.
 */
const CHARTS = ["Midnight Dreams", "Autumn Leaves", "City Lights", "Thriller"];
const want = CHARTS[WANT_CHART] ?? CHARTS[0];

console.log(`waiting for the cycle to reach "${want}"…`);
let previous = await title();
let reached = false;
for (let i = 0; i < 2400; i++) {
	const now = await title();
	if (now === want && previous !== want) {
		reached = true;
		break;
	}
	previous = now;
	await Bun.sleep(100);
}
if (!reached) throw new Error(`never saw the cycle turn over to "${want}"`);

const frames: { data: string; at: number }[] = [];
const started = Date.now();

listeners.set("Page.screencastFrame", async (params) => {
	frames.push({ data: params.data, at: Date.now() - started });
	// Acking is mandatory: Chrome stops emitting until the frame is
	// acknowledged, so a missed ack silently ends the recording.
	await call("Page.screencastFrameAck", { sessionId: params.sessionId });
});

await call("Page.startScreencast", {
	format: "png",
	everyNthFrame: 1,
	maxWidth: WIDTH * SCALE,
	maxHeight: HEIGHT * SCALE,
});

console.log("recording one full cycle…");
// Stop when the bar moves on to the next chart — one whole cycle, ending
// exactly where it began. Compared against what the page actually reports so
// a slug change upstream cannot silently cut the recording to one frame.
for (let i = 0; i < 900; i++) {
	await Bun.sleep(100);
	if ((await title()) !== want) break;
}
if (frames.length < 30) {
	throw new Error(`only ${frames.length} frames — the cycle ended early`);
}

await call("Page.stopScreencast");
console.log(`captured ${frames.length} frames in ${Date.now() - started}ms`);

let index = 0;
for (const frame of frames) {
	const name = `${OUT}/frame-${String(index).padStart(4, "0")}.png`;
	await Bun.write(name, Buffer.from(frame.data, "base64"));
	index++;
}

await Bun.write(
	`${OUT}/meta.json`,
	JSON.stringify(
		{
			box,
			scale: SCALE,
			chart: want,
			frames: frames.length,
			durationMs: frames.at(-1)?.at ?? 0,
			timestamps: frames.map((f) => f.at),
		},
		null,
		2,
	),
);

ws.close();
chrome.kill();
console.log("done");
process.exit(0);
