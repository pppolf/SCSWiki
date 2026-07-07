#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="${SCS_ASSISTANT_PM2_APP_NAME:-scswiki-assistant}"
ENV_FILE="${SCS_ASSISTANT_ENV_FILE:-/etc/scswiki-assistant.env}"
REPO_ROOT="${SCS_ASSISTANT_REPO_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SKIP_INDEX=0
SKIP_INSTALL=0

for arg in "$@"; do
  case "$arg" in
    --skip-index)
      SKIP_INDEX=1
      ;;
    --skip-install)
      SKIP_INSTALL=1
      ;;
    -h|--help)
      cat <<'EOF'
Usage: bash deploy/update-assistant.sh [--skip-index] [--skip-install]

Run this after git pull on the cloud server.

Options:
  --skip-index    Do not rebuild the DashScope embedding index.
  --skip-install  Do not run pnpm install --frozen-lockfile.

Environment overrides:
  SCS_ASSISTANT_ENV_FILE=/etc/scswiki-assistant.env
  SCS_ASSISTANT_REPO_ROOT=/srv/SCSWiki
  SCS_ASSISTANT_PM2_APP_NAME=scswiki-assistant
  SCS_ASSISTANT_PUBLIC_HEALTH_URL=https://api.scswiki.com/health
EOF
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      exit 2
      ;;
  esac
done

log() {
  printf '\n==> %s\n' "$*"
}

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

show_pm2_logs() {
  if command -v pm2 >/dev/null 2>&1; then
    echo
    echo "Recent PM2 logs:"
    pm2 logs "$APP_NAME" --lines 40 --nostream || true
  fi
}

trap show_pm2_logs ERR

command -v pnpm >/dev/null 2>&1 || fail "pnpm is not installed."
command -v pm2 >/dev/null 2>&1 || fail "pm2 is not installed."
command -v curl >/dev/null 2>&1 || fail "curl is not installed."
command -v node >/dev/null 2>&1 || fail "node is not installed."

[[ -d "$REPO_ROOT" ]] || fail "Repo root does not exist: $REPO_ROOT"
[[ -f "$ENV_FILE" ]] || fail "Env file does not exist: $ENV_FILE"

cd "$REPO_ROOT"

log "Repository"
pwd
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "commit: $(git rev-parse --short HEAD)"
fi

log "Loading environment from $ENV_FILE"
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

[[ -n "${SCS_ASSISTANT_CHAT_API_KEY:-}" ]] || fail "SCS_ASSISTANT_CHAT_API_KEY is empty."
[[ -n "${SCS_ASSISTANT_EMBEDDING_API_KEY:-}" ]] ||
  fail "SCS_ASSISTANT_EMBEDDING_API_KEY is empty."

if [[ "$SKIP_INSTALL" -eq 0 ]]; then
  log "Installing dependencies"
  pnpm install --frozen-lockfile
else
  log "Skipping dependency install"
fi

if [[ "$SKIP_INDEX" -eq 0 ]]; then
  log "Rebuilding assistant index with ${SCS_ASSISTANT_EMBEDDING_MODEL:-text-embedding-v4}"
  pnpm assistant:index
else
  log "Skipping assistant index rebuild"
fi

log "Starting or reloading PM2 app: $APP_NAME"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

HOST="${SCS_ASSISTANT_HOST:-127.0.0.1}"
PORT="${SCS_ASSISTANT_PORT:-8787}"
LOCAL_HEALTH_URL="${SCS_ASSISTANT_LOCAL_HEALTH_URL:-http://${HOST}:${PORT}/health}"
HEALTH_FILE="$(mktemp)"
trap 'rm -f "$HEALTH_FILE"; show_pm2_logs' ERR
trap 'rm -f "$HEALTH_FILE"' EXIT

log "Checking local health: $LOCAL_HEALTH_URL"
curl -fsS "$LOCAL_HEALTH_URL" -o "$HEALTH_FILE"

node - "$HEALTH_FILE" <<'NODE'
const fs = require('node:fs');
const healthPath = process.argv[2];
const data = JSON.parse(fs.readFileSync(healthPath, 'utf8'));

if (!data.api?.ok) {
  throw new Error('assistant API health is not ok');
}

if (!data.index?.loaded) {
  throw new Error('assistant index is not loaded');
}

if (data.index?.error) {
  throw new Error(`assistant index error: ${data.index.error.code} ${data.index.error.message}`);
}

console.log(
  JSON.stringify(
    {
      api: data.api,
      llm: data.llm,
      embedding: data.embedding,
      index: {
        chunks: data.index.chunks,
        createdAt: data.index.createdAt,
        embeddingDimensions: data.index.embeddingDimensions,
        embeddingModel: data.index.embeddingModel,
      },
    },
    null,
    2,
  ),
);
NODE

if [[ -n "${SCS_ASSISTANT_PUBLIC_HEALTH_URL:-}" ]]; then
  log "Checking public health: $SCS_ASSISTANT_PUBLIC_HEALTH_URL"
  curl -fsS "$SCS_ASSISTANT_PUBLIC_HEALTH_URL" >/dev/null
fi

log "Done"
echo "Assistant API updated successfully."
