{
  config,
  lib,
  pkgs,
  ...
}:

let
  cfg = config.services.suckmore-org;
in
{
  options = {
    services.suckmore-org = {
      enable = lib.mkEnableOption "Enable the suckmore-org service.";

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
        description = lib.mdDoc "suckmore-org package used for the service.";
        default = pkgs.suckmore-org;
        defaultText = lib.literalExpression "pkgs.suckmore-org";
      };

      dataDir = lib.mkOption {
        type = lib.types.str;
        default = "/var/lib/suckmore-org";
        example = "/var/lib/suckmore-org";
        description = lib.mdDoc "Data directory. All suckmore-org data will be put here.";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.users.suckmore-org = {
      isSystemUser = true;
      createHome = true;
      home = cfg.dataDir;
      group = "suckmore-org";
    };
    users.groups.suckmore-org = { };

    systemd.services."suckmore-org" = {
      serviceConfig = {
        Type = "simple";
        User = "suckmore-org";
        Group = "suckmore-org";
        Restart = "on-failure";
        RestartSec = "30s";
        WorkingDirectory = cfg.dataDir;
        ExecStart = "${lib.getExe pkgs.suckmore-org} --port ${builtins.toString cfg.port} --host ${cfg.host} ${
          if (builtins.isNull cfg.location) then "" else "--location ${cfg.location}"
        }";
      };
      wantedBy = [ "multi-user.target" ];

      description = "suckmore-org server";

      environment = {
        HOST = "${cfg.host}";
        PORT = "${builtins.toString cfg.port}";
      }
      // lib.mkIf (!builtins.isNull cfg.location) { LOCATION = "${cfg.location}"; };
    };
  };
}
