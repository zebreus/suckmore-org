# suckmore-org

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
  inputs.suckmore-org.url = "github:YOUR-USER/YOUR-REPO";

  outputs = { self, nixpkgs, suckmore-org, ... }: {
    nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        suckmore-org.nixosModules.default
        {
          services.suckmore-org = {
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
| `services.suckmore-org.enable`   | `false`                   | Enable the service                |
| `services.suckmore-org.port`     | `3000`                    | Port to listen on                 |
| `services.suckmore-org.host`     | `[::]`                    | Address to bind to                |
| `services.suckmore-org.dataDir`  | `/var/lib/suckmore-org` | Working directory for the service |
| `services.suckmore-org.location` | `null`                    | Value of `globalThis.location`    |
