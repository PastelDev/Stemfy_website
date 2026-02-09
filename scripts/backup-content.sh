#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${1:-$ROOT_DIR/backups}"
TIMESTAMP="$(date +"%Y%m%d-%H%M%S")"
ARCHIVE_PATH="$OUTPUT_DIR/stemfy-content-$TIMESTAMP.tar.gz"

mkdir -p "$OUTPUT_DIR"

SOURCES=()
if [[ -d "$ROOT_DIR/posts" ]]; then
  SOURCES+=("posts")
fi
if [[ -d "$ROOT_DIR/admin/data" ]]; then
  SOURCES+=("admin/data")
fi
if [[ -d "$ROOT_DIR/admin/uploads" ]]; then
  SOURCES+=("admin/uploads")
fi

if [[ ${#SOURCES[@]} -eq 0 ]]; then
  echo "No content directories found to back up." >&2
  exit 1
fi

tar -czf "$ARCHIVE_PATH" -C "$ROOT_DIR" "${SOURCES[@]}"
echo "Backup created: $ARCHIVE_PATH"
