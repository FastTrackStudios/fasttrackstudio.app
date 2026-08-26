# OCI image for fasttrackstudio.app, built WITHOUT a container daemon.
#
# Why not a Dockerfile: the `nix-host` CI runner executes as the
# `github-runner` user, which has no docker on PATH and is not in the
# `docker` group — reaching a daemon would mean granting CI effectively-root
# access to the host. Nix builds the image as a plain derivation and skopeo
# pushes it straight to the registry, so neither is needed. This is the same
# shape the FastTrackStudio monorepo uses for `fts-site`.
#
# `output` is the ALREADY-BUILT nitro `.output` directory (an absolute path,
# passed in by the caller). The JS build runs outside Nix — bun/vite resolve
# their own dependency tree from bun.lock — so this packaging step is
# reproducible given the same `.output`, but the JS build itself is not
# Nix-hermetic. That is a deliberate trade: hermetic node_modules would mean
# vendoring the whole dependency closure into Nix for a marketing site.

{
  pkgs,
  # Absolute path to the built .output directory.
  output,
  name ? "fts-www",
  tag ? "latest",
  # Commit this image was built from; surfaced at /version.json.
  rev ? "dev",
  buildTime ? "",
}:

let
  # nodejs-slim: the runtime only. The full `nodejs` derivation propagates
  # dev outputs (openssl-dev, icu-dev, sqlite-dev, …) and more than doubles
  # the image for no benefit — nothing compiles at runtime.
  node = pkgs.nodejs-slim_22;

  # The nitro output, copied into the store so the build is sandbox-safe.
  appOutput = builtins.path {
    path = output;
    name = "${name}-output";
  };

  # Minimal passwd/group so the server can run as a non-root uid. Scratch
  # images have no user database, and node refuses to resolve $HOME without
  # one.
  passwd = pkgs.runCommand "${name}-passwd" { } ''
    mkdir -p $out/etc
    echo 'node:x:1000:1000::/app:/bin/sh' > $out/etc/passwd
    echo 'node:x:1000:' > $out/etc/group
    echo 'root:x:0:0::/root:/bin/sh' >> $out/etc/passwd
    echo 'root:x:0:' >> $out/etc/group
  '';
in
pkgs.dockerTools.streamLayeredImage {
  inherit name tag;

  contents = [
    node
    passwd
    pkgs.cacert
  ];

  # Runs in the image root. The app lives at /app/.output; /data is the
  # mount point for the waitlist volume (see the chart's persistence block).
  extraCommands = ''
    mkdir -p app/.output data tmp
    cp -R ${appOutput}/. app/.output/
    chmod -R u+w app
  '';

  fakeRootCommands = ''
    chown -R 1000:1000 app data tmp
  '';
  enableFakechroot = true;

  config = {
    Cmd = [ "${node}/bin/node" "/app/.output/server/index.mjs" ];
    WorkingDir = "/app";
    User = "1000:1000";
    ExposedPorts = { "3000/tcp" = { }; };
    Env = [
      "NODE_ENV=production"
      "PORT=3000"
      "HOST=0.0.0.0"
      "WAITLIST_FILE=/data/waitlist.jsonl"
      "GIT_SHA=${rev}"
      "BUILD_TIME=${buildTime}"
      "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
    ];
  };
}
