#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-sync}"

if [[ "$MODE" != "sync" && "$MODE" != "check" ]]; then
  printf "Usage: %s [sync|check]\n" "$(basename "$0")"
  exit 2
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/.agents/skills"
DST_DIR="$ROOT_DIR/.claude/skills"

mkdir -p "$SRC_DIR" "$DST_DIR"

drift=0
copied=0
removed=0

shopt -s nullglob

for src_skill_dir in "$SRC_DIR"/*; do
  [[ -d "$src_skill_dir" ]] || continue

  skill_name="$(basename "$src_skill_dir")"
  src_file="$src_skill_dir/SKILL.md"

  [[ -f "$src_file" ]] || continue

  dst_skill_dir="$DST_DIR/$skill_name"

  if [[ "$MODE" == "check" ]]; then
    if [[ ! -d "$dst_skill_dir" ]]; then
      printf "DRIFT: %s is missing in .claude/skills\n" "$skill_name"
      drift=$((drift + 1))
      continue
    fi

    if ! diff -qr "$src_skill_dir" "$dst_skill_dir" >/dev/null; then
      printf "DRIFT: %s differs between .agents/skills and .claude/skills\n" "$skill_name"
      drift=$((drift + 1))
    fi
  else
    rm -rf "$dst_skill_dir"
    cp -R "$src_skill_dir" "$dst_skill_dir"
    copied=$((copied + 1))
  fi
done

for dst_skill_dir in "$DST_DIR"/*; do
  [[ -d "$dst_skill_dir" ]] || continue

  skill_name="$(basename "$dst_skill_dir")"
  src_skill_dir="$SRC_DIR/$skill_name"

  if [[ ! -d "$src_skill_dir" ]]; then
    if [[ "$MODE" == "check" ]]; then
      printf "DRIFT: %s exists in .claude/skills but not in .agents/skills\n" "$skill_name"
      drift=$((drift + 1))
    else
      rm -rf "$dst_skill_dir"
      removed=$((removed + 1))
    fi
  fi
done

if [[ "$MODE" == "check" ]]; then
  if [[ $drift -gt 0 ]]; then
    printf "Skill sync check failed with %d drift item(s).\n" "$drift"
    exit 1
  fi

  printf "Skill sync check passed. No drift detected.\n"
  exit 0
fi

printf "Synced skills: copied %d, removed stale %d.\n" "$copied" "$removed"
