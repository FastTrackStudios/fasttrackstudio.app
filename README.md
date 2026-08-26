# fasttrackstudio.app

The FastTrackStudio marketing landing page — a TanStack Start (React 19, SSR)
app deployed to the cluster at `fasttrackstudio.app`.

This repo is **only the apex landing page**. The product apps ship as their own
repos and deploy to their own subdomains (`keyflow.`, `guides.`, `input.`, …);
this site links to them and never imports them. Their addresses live in
`SUBDOMAINS` in `src/lib/site.ts`.

## Quick start

```bash
bun install
bun run dev            # http://localhost:3000
```

| Command                  | What it does                                        |
| ------------------------ | --------------------------------------------------- |
| `bun run dev`            | Dev server with HMR                                  |
| `bun run build`          | Production build into `.output/`                     |
| `bun run preview`        | Serve the production build                           |
| `bun run generate-routes`| Regenerate `src/routeTree.gen.ts` from `src/routes/` |
| `bunx biome check --write .` | Lint + format                                   |
| `bunx tsc --noEmit`      | Typecheck                                            |

`src/routeTree.gen.ts` is generated but **committed** — CI fails if it drifts
from the files in `src/routes/`.

## Layout

```
src/
  lib/          isomorphic — types, zod schemas, site constants
  server/       SERVER-ONLY — data sources, side effects
  fn/           server functions: the typed RPC boundary between the two
  components/   presentational React
  routes/       file-based routes (pages + server routes)
```

### The server boundary

`src/server/*` starts with `import "@tanstack/react-start/server-only"`. That
marker makes importing the module from client code a **build-time** error, not
a runtime surprise or a silent bundle leak. Client code reaches that data
through `src/fn/*`, where every entry point validates its input with zod before
the handler runs:

```ts
export const fetchProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(64) }))
  .handler(async ({ data }) => { … });
```

Server *routes* (`version[.]json.ts`, `sitemap[.]xml.ts`) are handlers, never
shipped to the browser, so they import `src/server/*` directly.

### Data loading

Route `loader`s call server functions. Two shapes are in use, deliberately:

- **Awaited** (`/projects`) — the list *is* the page; render it with the
  document.
- **Deferred** (`/`) — the loader returns the promise unawaited and the
  component renders it inside `<Suspense><Await>`. The hero flushes to the
  browser immediately and the grid **streams** in behind it.

### Search params

`/projects` types its URL state from a zod schema (`projectSearchSchema`), and
`loaderDeps` narrows which params re-run the loader. Every field has a
`.catch()`, so a stale or hand-edited URL degrades to the default view instead
of throwing. The URL is the only source of truth — no mirrored `useState`.

### SSR mode

Every page route sets `ssr: true` explicitly. This is a marketing site: the
markup has to be in the first response for crawlers and link unfurlers, so
nothing here should be `false` or `'data-only'`. If a future route is genuinely
app-like — logged-in, interactive, not indexed — set `ssr: 'data-only'` on that
route to run `beforeLoad`/`loader` on the server and render the component on
the client only.

## Deployment

Nitro's `node-server` preset builds `.output/server/index.mjs`; the container
runs it on `$PORT` (3000).

```
push to main
  → .github/workflows/deploy.yml   (self-hosted runner `nix-host`)
  → docker build + push  registry.starcommand.live:30050/fts-www:{latest,sha-…}
  → argocd-image-updater rolls the Deployment (digest strategy on `latest`)
  → "Verify live" polls /version.json until it reports the pushed commit
```

`GIT_SHA` is baked in as a build arg and reported by `/version.json`; that is
what makes a green deploy mean *the cluster serves this commit*.

The Helm chart is `deploy/chart/fts-www`. Render it locally with:

```bash
helm template test deploy/chart/fts-www
```

### Cutover note

The Dioxus app in the FastTrackStudio monorepo (chart `fts-site`) currently
claims `fasttrackstudio.app` in its own ingress. Two Ingresses on one host is
undefined behaviour — remove the apex host from `apps/site/deploy/chart/fts-site/values.yaml`
(leaving that app on its own subdomain) in the same change that first deploys
this chart.

### Waitlist

`src/server/waitlist.ts` appends signups to `$WAITLIST_FILE` as JSONL — no
database, so the scaffold runs anywhere. Before pointing real humans at the
form, either enable `persistence` in the chart or replace the body of
`recordSignup` with a real backend. Nothing above it has to change.

## Environment

See `.env.example`. Everything is optional; the app runs with nothing set.
