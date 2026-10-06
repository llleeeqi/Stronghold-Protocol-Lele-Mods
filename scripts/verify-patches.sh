#!/usr/bin/env bash
# Fast source-only verification; no dependencies, assets, or service changes.
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
source_dir=$(realpath "${1:?Usage: bash scripts/verify-patches.sh CLEAN_UPSTREAM_CHECKOUT}")
name="patch-check-$(date +%Y%m%d-%H%M%S)"
check_dir="$repo_dir/state/$name"
mkdir -p "$check_dir"
git clone --shared "$source_dir" "$check_dir/source"
git -C "$check_dir/source" apply --check "$repo_dir/mods/rhine/rhine-code.patch"
git -C "$check_dir/source" apply "$repo_dir/mods/rhine/rhine-code.patch"
docker run --rm --mount "type=bind,src=$check_dir,dst=/check" --mount "type=bind,src=$source_dir,dst=/baseline,readonly" --mount "type=bind,src=$repo_dir,dst=/mod,readonly" -w /check/source node:22-alpine sh -c 'node /mod/mods/rhine/generate-data.mjs /check/source /baseline && node /mod/mods/rhine/long-session-build.mjs /check/source/data /check/rounds/data'
cp -a "$check_dir/rounds/data/." "$check_dir/source/data/"
for file in public/js/screens/lobby.js public/js/screens/room.js server/lobby.js shared/protocol.js; do cp "$check_dir/rounds/overlay/$file" "$check_dir/source/$file"; done
git -C "$check_dir/source" apply --check "$repo_dir/mods/party/party-code.patch"
git -C "$check_dir/source" apply "$repo_dir/mods/party/party-code.patch"
git -C "$check_dir/source" apply --check "$repo_dir/patches/friends-profile.patch"
echo "Patches apply cleanly: $check_dir/source. This is not a deployable READY build."
