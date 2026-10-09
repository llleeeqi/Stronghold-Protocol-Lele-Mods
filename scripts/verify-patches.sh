#!/usr/bin/env bash
# Fast source-only verification; no dependencies, assets, or service changes.
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
source_dir=$(realpath "${1:?Usage: bash scripts/verify-patches.sh CLEAN_UPSTREAM_CHECKOUT}")
name="patch-check-$(date +%Y%m%d-%H%M%S)"
check_dir="$repo_dir/state/$name"
mkdir -p "$check_dir"
git clone --shared "$source_dir" "$check_dir/source"
git -C "$check_dir/source" apply --check "$repo_dir/patches/modpack-code.patch"
git -C "$check_dir/source" apply "$repo_dir/patches/modpack-code.patch"
mkdir -p "$check_dir/source/public/art"
cp -a "$repo_dir/mods/assets/public/art/." "$check_dir/source/public/art/"
docker run --rm --user "$(id -u):$(id -g)" --mount "type=bind,src=$check_dir,dst=/check" --mount "type=bind,src=$source_dir,dst=/baseline,readonly" --mount "type=bind,src=$repo_dir,dst=/mod,readonly" -w /check/source node:22-alpine sh -c 'node /mod/mods/rhine/generate-data.mjs /check/source /baseline && node /mod/mods/rhine/generate-rounds.mjs /check/source && node /mod/mods/rhine/refresh-data.mjs /check/source && node /mod/mods/rhine/aphris/generate-data.mjs /check/source && node /mod/mods/party/generate-data.mjs /check/source && node /mod/mods/recruits/generate-data.mjs /check/source'
echo "Patches apply cleanly: $check_dir/source. This is not a deployable READY build."
