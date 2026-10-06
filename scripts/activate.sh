#!/usr/bin/env bash
# Explicit cutover only after a READY candidate and zero rooms/matches.
set -Eeuo pipefail
repo_dir=$(cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_dir"
stage_name=${1:?Usage: bash scripts/activate.sh STAGE_NAME}
[[ "$stage_name" =~ ^[a-zA-Z0-9_-]+$ ]] || exit 2
stage_dir=$(realpath "state/stages/$stage_name")
[[ "$stage_dir" == "$repo_dir/state/stages/"* && -f "$stage_dir/READY" ]] || { echo 'Candidate is not ready' >&2; exit 1; }
container_id=$(docker compose ps -q game)
if [[ -n "$container_id" ]]; then
  docker exec "$container_id" wget -q -O - http://127.0.0.1:3000/healthz |
    python3 -c 'import json,sys; d=json.load(sys.stdin); print(d); assert d["matches"]==0 and d["rooms"]==0, "Active rooms or matches: cutover deferred"'
fi
docker compose config --quiet
previous=; if [[ -L state/current ]]; then previous=$(readlink state/current); fi
# A new link is renamed into place; running bind mounts still point to their old source.
ln -s "$stage_dir/source" state/current.next
mv -Tf state/current.next state/current
rollback() {
  if [[ -n "$previous" ]]; then
    ln -s "$previous" state/current.next
    mv -Tf state/current.next state/current
    docker compose up -d --no-deps --force-recreate game
  else
    docker compose stop game
    echo 'First activation failed. Fix the candidate and activate again.' >&2
  fi
}
if ! docker compose up -d --no-deps --force-recreate game; then rollback; exit 1; fi
container_id=$(docker compose ps -q game)
for i in {1..15}; do
  if docker exec "$container_id" wget -q -O - http://127.0.0.1:3000/healthz; then
    printf '\nActivated %s. Verify the public URL and multiplayer.\n' "$stage_name"
    exit 0
  fi
  sleep 2
done
rollback
exit 1
