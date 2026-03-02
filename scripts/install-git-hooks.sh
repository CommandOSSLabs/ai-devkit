#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$ROOT_DIR/.git/hooks"
cp "$ROOT_DIR/.githooks/pre-commit" "$ROOT_DIR/.git/hooks/pre-commit"
chmod +x "$ROOT_DIR/.git/hooks/pre-commit"

printf "Installed pre-commit hook: .git/hooks/pre-commit\n"
printf "Behavior: auto-runs scripts/sync-skills.sh and stages mirrored skill changes.\n"
