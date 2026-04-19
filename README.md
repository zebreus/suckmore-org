# example-webapp

A template for a web app that deploys as a NixOS service.

## Quick start

1. **Use this template** - click "Use this template" on GitHub or clone it.

2. **Rename the project** - this should happen automatically in a GitHub action.

3. **Edit `main.ts`** - this is the Deno server entry point. It exports a
   `fetch()` handler that Deno's built-in `deno serve` runs. Replace the
   placeholder HTML with your actual app. Use `nix develop .` to get a shell
   with Deno installed for development.

4. **Build and run locally**:

   ```sh
   nix run .
   ```

5. **Run the NixOS test**:
   ```sh
   nix flake check
   ```

## How it works

| File          | Purpose                                               |
| ------------- | ----------------------------------------------------- |
| `main.ts`     | Deno HTTP server - exports a `fetch()` handler        |
| `default.nix` | Nix derivation that wraps `deno serve` into a binary  |
| `module.nix`  | NixOS module with options for host, port, data dir    |
| `flake.nix`   | Flake exposing the package, module, overlay, and test |

The `default.nix` derivation creates a shell script that runs
`deno serve main.ts` with the flags passed at runtime (`--port`, `--host`).

The `module.nix` NixOS module creates a dedicated system user and a systemd
service, passing the configured options to that binary.

## Deploying to a NixOS machine

Add the flake as an input and import the module:

```nix
# flake.nix of your NixOS config
{
  inputs.example-webapp.url = "github:YOUR-USER/YOUR-REPO";

  outputs = { self, nixpkgs, example-webapp, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        example-webapp.nixosModules.default
        {
          services.example-webapp = {
            enable = true;
            port = 3000;
            host = "[::]";
          };
        }
      ];
    };
  };
}
```

### Module options

| Option                             | Default                   | Description                       |
| ---------------------------------- | ------------------------- | --------------------------------- |
| `services.example-webapp.enable`   | `false`                   | Enable the service                |
| `services.example-webapp.port`     | `3000`                    | Port to listen on                 |
| `services.example-webapp.host`     | `[::]`                    | Address to bind to                |
| `services.example-webapp.dataDir`  | `/var/lib/example-webapp` | Working directory for the service |
| `services.example-webapp.location` | `null`                    | Value of `globalThis.location`    |
