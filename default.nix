{
  stdenv,
  deno,
  lib,
  ...
}:
stdenv.mkDerivation {
  pname = "suckmore-org";
  version = "0.0.1";

  src = ./.;

  nativeBuildInputs = [
    deno
  ];

  installPhase = ''
    mkdir -p $out/bin

    cat <<EOF > $out/bin/suckmore-org
    #!/usr/bin/env sh
    cd "$src"
    ${lib.getExe deno} serve --allow-net --allow-env=PORT,HOST,LOCATION --allow-read="$src" "''\\$@" main.ts
    EOF

    chmod a+rwx $out/bin/suckmore-org
  '';

  meta = {
    mainProgram = "suckmore-org";
  };
}
