{
  description = "NixOS module for example-webapp";

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
          example-webapp = final.callPackage ./default.nix { };
        }
      );
    }
    // flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      rec {
        packages.example-webapp = pkgs.callPackage ./default.nix { };
        packages.default = packages.example-webapp;

        nixosModules.example-webapp = {
          nixpkgs.overlays = [
            self.outputs.overlays.default
          ];
          imports = [ ./module.nix ];
        };
        nixosModules.default = nixosModules.example-webapp;

        checks.opensPort = pkgs.testers.nixosTest {
          name = "example-webapp-opens-port";
          nodes.machine =
            { config, pkgs, ... }:
            {
              imports = [
                nixosModules.example-webapp
                {
                  services.example-webapp = {
                    enable = true;
                    port = 3000;
                    host = "[::]";
                  };
                }
              ];
            };
          testScript = ''
            machine.wait_for_unit("example-webapp.service", timeout = 30)
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
