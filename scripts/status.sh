#!/usr/bin/env bash
set -Eeuo pipefail
cd -- "$(dirname -- "$0")/.."
docker compose ps
container_id=$(docker compose ps -q game)
if [[ -n "$container_id" ]]; then
  docker exec "$container_id" wget -q -O - http://127.0.0.1:3000/healthz
  printf '\n'
  docker stats --no-stream "$container_id"
fi
