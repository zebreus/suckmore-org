{
  stdenv,
  deno,
  lib,
  ...
}:
stdenv.mkDerivation {
  pname = "example-webapp";
  version = "0.0.1";

  src = ./.;

  nativeBuildInputs = [
    deno
  ];

  installPhase = ''
    mkdir -p $out/bin

    cat <<EOF > $out/bin/example-webapp
    #!/usr/bin/env sh
    cd "$src"
    ${lib.getExe deno} serve --allow-net --allow-env=PORT,HOST,LOCATION --allow-read="$src" "''\\$@" main.ts
    EOF

    chmod a+rwx $out/bin/example-webapp
  '';

  meta = {
    mainProgram = "example-webapp";
  };
}
