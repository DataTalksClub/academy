#!/usr/bin/env bash
# Non-prod design preview: build this branch under /academy-previews/<name>/ and
# publish it to the static preview host (Hetzner nginx). Never touches GitHub Pages.
# PUBLIC_API_URL is left empty on purpose so previews never write to the signup API.
# Usage: scripts/preview-deploy.sh variant-1
set -euo pipefail
name="${1:?usage: preview-deploy.sh <name>}"
host_root="${PREVIEW_ROOT:-/var/www/html/academy-previews}"
origin="${PREVIEW_ORIGIN:-http://135.181.114.209}"
mkdir -p .local/preview-dist
out=".local/preview-dist/$name"
rm -rf -- "$out"
SITE_URL="$origin" BASE_PATH="/academy-previews/$name/" PUBLIC_API_URL="" \
  npx astro build --outDir "$out" > ".local/preview-build-$name.log" 2>&1 \
  || { tail -30 ".local/preview-build-$name.log"; exit 1; }
test -f "$out/index.html" && test -f "$out/agentic-engineering/index.html"
mkdir -p "$host_root/$name"
rsync -a --delete --chmod=Da+rx,Fa+r "$out/" "$host_root/$name/"
chmod a+rx "$host_root/$name"
echo "$origin/academy-previews/$name/"
