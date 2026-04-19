{
  description = "NixOS module for suckmore-org";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    {
      overlays.default = (
        final: prev: {
          suckmore-org = final.callPackage ./default.nix { };
        }
      );
    }
    // flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      rec {
        packages.suckmore-org = pkgs.callPackage ./default.nix { };
        packages.default = packages.suckmore-org;

        nixosModules.suckmore-org = {
          nixpkgs.overlays = [
            self.outputs.overlays.default
          ];
          imports = [ ./module.nix ];
        };
        nixosModules.default = nixosModules.suckmore-org;

        checks.opensPort = pkgs.testers.nixosTest {
          name = "suckmore-org-opens-port";
          nodes.machine =
            { config, pkgs, ... }:
            {
              imports = [
                nixosModules.suckmore-org
                {
                  services.suckmore-org = {
                    enable = true;
                    port = 3000;
                    host = "[::]";
                  };
                }
              ];
            };
          testScript = ''
            machine.wait_for_unit("suckmore-org.service", timeout = 30)
            machine.wait_for_open_port(3000, timeout = 30)
          '';
        };

        # The default is enough for most use cases
        # devShells.default = pkgs.mkShell {
        #   buildInputs = [
        #     pkgs.deno
        #   ];
        # };

        formatter = pkgs.nixfmt;
      }
    );
}
