#!/usr/bin/env bash
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
source_dir=$(realpath "${1:?Usage: verify-patches.sh CLEAN_UPSTREAM}")
check_dir="$repo_dir/state/patch-check-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$check_dir"
git clone --shared "$source_dir" "$check_dir/source"
git -C "$check_dir/source" apply --check "$repo_dir/patches/modpack-code.patch"
git -C "$check_dir/source" apply "$repo_dir/patches/modpack-code.patch"
mkdir -p "$check_dir/source/public/art"
cp -a "$repo_dir/mods/assets/public/art/." "$check_dir/source/public/art/"
docker run --rm --user "$(id -u):$(id -g)" --mount "type=bind,src=$check_dir,dst=/check" --mount "type=bind,src=$source_dir,dst=/baseline,readonly" --mount "type=bind,src=$repo_dir,dst=/mod,readonly" -w /check/source node:22-alpine sh -c 'npm ci --omit=dev && node /mod/scripts/finalize-plugin-host.mjs /check/source /baseline && node /mod/scripts/install-plugins.mjs /check/source'
echo "Plugin host prepared at $check_dir/source; not READY for deployment."
