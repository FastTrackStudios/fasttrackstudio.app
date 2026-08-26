# fasttrackstudio.app — TanStack Start (Nitro node-server preset).
#
# Three stages, and the split matters:
#
#   deps    bun installs from bun.lock (fast, and the lockfile this repo owns)
#   build   NODE runs vite. Running the build under bun makes the bundler
#           resolve the `bun` export condition, which bakes srvx's Bun server
#           adapter into .output — and that crashes with "Bun is not defined"
#           the moment node runs it. Build under the runtime you deploy on.
#   runtime node serves the nitro output. Nothing but .output ships.

# ── deps ─────────────────────────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── build ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Baked into /version.json so CI can prove the cluster serves this commit.
ARG GIT_SHA=dev
ARG BUILD_TIME=""
ENV GIT_SHA=$GIT_SHA BUILD_TIME=$BUILD_TIME

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node node_modules/vite/bin/vite.js build

# ── runtime ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Nitro's node-server output is self-contained: server bundle + public assets.
COPY --from=build /app/.output ./.output

# The waitlist sink appends here. Mount a volume over it to keep signups
# across rollouts — otherwise they live and die with the pod.
ENV WAITLIST_FILE=/data/waitlist.jsonl
RUN mkdir -p /data && chown -R node:node /data

# Re-declared so the runtime layer carries them too.
ARG GIT_SHA=dev
ARG BUILD_TIME=""
ENV GIT_SHA=$GIT_SHA BUILD_TIME=$BUILD_TIME

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
