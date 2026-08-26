{
  description = "fasttrackstudio.app — FastTrackStudio marketing landing page";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };

        # CI passes these through the environment rather than as flake args,
        # so the workflow stays a plain `nix build --impure .#image`. They are
        # only read under --impure; a bare `nix build .#image` gets the
        # defaults and fails loudly on the missing .output.
        env = name: default: let v = builtins.getEnv name; in if v == "" then default else v;
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.bun
            pkgs.nodejs_22
            pkgs.skopeo
            pkgs.kubernetes-helm
          ];
        };

        packages.image = import ./nix/image.nix {
          inherit pkgs;
          output = env "FTS_OUTPUT" "/nonexistent-run-the-build-first";
          tag = env "FTS_TAG" "latest";
          rev = env "FTS_REV" "dev";
          buildTime = env "FTS_BUILD_TIME" "";
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
