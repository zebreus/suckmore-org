{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.services.example-webapp;
in
{
  options = {
    services.example-webapp = {
      enable = lib.mkEnableOption "Enable the example-webapp service.";

      host = lib.mkOption {
        type = lib.types.str;
        default = "[::]";
        example = "192.168.22.22";
        description = lib.mdDoc "Address to serve on.";
      };

      port = lib.mkOption {
        type = lib.types.int;
        default = 3000;
        example = 3000;
        description = lib.mdDoc "Port to serve on.";
      };

      location = lib.mkOption {
        type = lib.types.nullOr lib.types.str;
        default = null;
        example = "https://example.com";
        description = lib.mdDoc "Value of globalThis.location used by some web APIs";
      };

      package = lib.mkOption {
        type = lib.types.package;
        description = lib.mdDoc "example-webapp package used for the service.";
        default = pkgs.example-webapp;
        defaultText = lib.literalExpression "pkgs.example-webapp";
      };

      dataDir = lib.mkOption {
        type = lib.types.str;
        default = "/var/lib/example-webapp";
        example = "/var/lib/example-webapp";
        description = lib.mdDoc "Data directory. All example-webapp data will be put here.";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.users.example-webapp = {
      isSystemUser = true;
      createHome = true;
      home = cfg.dataDir;
      group = "example-webapp";
    };
    users.groups.example-webapp = { };

    systemd.services."example-webapp" = {
      serviceConfig = {
        Type = "simple";
        User = "example-webapp";
        Group = "example-webapp";
        Restart = "on-failure";
        RestartSec = "30s";
        WorkingDirectory = cfg.dataDir;
        ExecStart = "${lib.getExe pkgs.example-webapp} --port ${builtins.toString cfg.port} --host ${cfg.host} ${
          if (builtins.isNull cfg.location) then "" else "--location ${cfg.location}"
        }";
      };
      wantedBy = [ "multi-user.target" ];

      description = "example-webapp server";

      environment = {
        HOST = "${cfg.host}";
        PORT = "${builtins.toString cfg.port}";
      }
      // lib.mkIf (!builtins.isNull cfg.location) { LOCATION = "${cfg.location}"; };
    };
  };
}
