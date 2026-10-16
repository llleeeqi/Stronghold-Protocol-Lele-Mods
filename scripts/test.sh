#!/usr/bin/env bash
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
source_dir=$(realpath "${1:?Usage: test.sh ADAPTED_SOURCE}")
docker run --rm --memory 768m -e NODE_OPTIONS=--max-old-space-size=512 --mount "type=bind,src=$source_dir,dst=/app" -w /app node:22-alpine sh -c 'node --test test/lele-plugins.test.js test/lobby-plugins.test.js test/plugins/contentSet.test.js test/render/unitview.test.js test/ui/inspect-range.test.js'
