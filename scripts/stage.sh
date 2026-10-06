#!/usr/bin/env bash
# Build in isolation. Never changes current, Compose services, or upstream checkout.
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_dir"
revision=$(python3 -c 'import json; print(json.load(open("upstream.lock.json"))["revision"])')
upstream=$(python3 -c 'import json; print(json.load(open("upstream.lock.json"))["upstream"])')
source_dir=; assets_from=; stage_name=$(date +%Y%m%d-%H%M%S)
while (($#)); do
  case "$1" in
    --revision) revision=${2:?}; shift 2;;
    --source) source_dir=${2:?}; shift 2;;
    --assets-from) assets_from=${2:?}; shift 2;;
    --name) stage_name=${2:?}; shift 2;;
    *) echo "Usage: bash scripts/stage.sh [--revision FULL_SHA] [--source CLEAN_CHECKOUT] [--assets-from RUNTIME] [--name NAME]" >&2; exit 2;;
  esac
done
[[ "$revision" =~ ^[0-9a-f]{40}$ ]] || { echo 'A full pinned revision is required' >&2; exit 2; }
[[ "$stage_name" =~ ^[a-zA-Z0-9_-]+$ ]] || exit 2
command -v git >/dev/null; command -v python3 >/dev/null; docker compose version >/dev/null
if [[ -z "$source_dir" ]]; then
  source_dir="$repo_dir/state/upstream/$revision"
  if [[ ! -d "$source_dir/.git" ]]; then
    mkdir -p "$source_dir"
    git -C "$source_dir" init -q
    git -C "$source_dir" remote add origin "$upstream"
    git -C "$source_dir" fetch --depth=1 origin "$revision"
    git -C "$source_dir" checkout --detach FETCH_HEAD
  fi
fi
source_dir=$(realpath "$source_dir")
[[ $(git -C "$source_dir" rev-parse HEAD) == "$revision" ]] || { echo 'Clean checkout revision mismatch' >&2; exit 1; }
git -C "$source_dir" diff --quiet HEAD --
stage_dir="$repo_dir/state/stages/$stage_name"
[[ ! -e "$stage_dir" ]] || { echo 'Stage already exists; use a new name' >&2; exit 1; }
mkdir -p "$stage_dir"
exec > >(tee "$stage_dir/build.log") 2>&1
printf '%s\n' "$revision" > "$stage_dir/UPSTREAM_REVISION"
git clone --shared "$source_dir" "$stage_dir/source"
cd "$stage_dir/source"
git apply --check "$repo_dir/mods/rhine/rhine-code.patch"
git apply "$repo_dir/mods/rhine/rhine-code.patch"
if [[ -n "$assets_from" ]]; then
  assets_from=$(realpath "$assets_from")
  for dir in public/assets public/fonts .cache; do
    if [[ -d "$assets_from/$dir" ]]; then mkdir -p "$(dirname "$dir")"; cp -a "$assets_from/$dir" "$dir"; fi
  done
fi
# The base checkout remains untouched; all installs and generated files live in source.
build_memory=${BUILD_MEMORY:-768m}
build=(docker run --rm --user "$(id -u):$(id -g)" --memory "$build_memory" -e HOME=/tmp -e npm_config_cache=/tmp/npm-cache -e NODE_OPTIONS=--max-old-space-size=512
  --mount "type=bind,src=$stage_dir,dst=/stage"
  --mount "type=bind,src=$source_dir,dst=/baseline,readonly"
  --mount "type=bind,src=$repo_dir,dst=/mod,readonly"
  -w /stage/source node:22-alpine)
"${build[@]}" sh -c 'npm ci --omit=dev && node /mod/mods/rhine/generate-data.mjs /stage/source /baseline && node /mod/mods/rhine/long-session-build.mjs /stage/source/data /stage/rounds/data'
cp -a "$stage_dir/rounds/data/." data/
for file in public/js/screens/lobby.js public/js/screens/room.js server/lobby.js shared/protocol.js; do cp "$stage_dir/rounds/overlay/$file" "$file"; done
git apply --check "$repo_dir/mods/party/party-code.patch"
git apply "$repo_dir/mods/party/party-code.patch"
git apply --check "$repo_dir/patches/friends-profile.patch"
git apply "$repo_dir/patches/friends-profile.patch"
git apply --check "$repo_dir/patches/source-updates.patch"
git apply "$repo_dir/patches/source-updates.patch"
"${build[@]}" sh -c 'node /mod/mods/rhine/refresh-data.mjs /stage/source && node /mod/mods/party/generate-data.mjs /stage/source && node tools/fetch-assets.mjs && node tools/fetch-rhine-assets.mjs && node tools/fetch-custom-assets.mjs && node tools/fetch-relic-icons.mjs && node --test test/party-mods.test.js test/match/party-runtime.test.js test/ui/data-profile.test.js test/content/relics.test.js test/content/makoto.test.js test/content/narant.test.js test/content/extra6.test.js test/ui/damage-board.test.js test/content/rhine.test.js test/content/rhine_equipment.test.js test/content/rhine_fx.test.js test/rhineResearch_shared.test.js test/rhine_data.test.js test/rhine_equipment_data.test.js test/render/rhineDevices.test.js test/match/rhine_equipment_bot.test.js test/content/egir-unite-down.test.js test/match/elite-acquisition.test.js test/match/feedback1-meta.test.js'
git -C "$repo_dir" rev-parse HEAD > "$stage_dir/MODKIT_REVISION" 2>/dev/null || printf 'working-copy\n' > "$stage_dir/MODKIT_REVISION"
chmod -R a+rX "$stage_dir/source"
touch "$stage_dir/READY"
printf '\nCandidate ready: %s\nNo running service changed. Activate separately with: bash scripts/activate.sh %s\n' "$stage_dir" "$stage_name"
