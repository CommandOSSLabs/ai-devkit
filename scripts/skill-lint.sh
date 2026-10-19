#!/usr/bin/env bash
# Lints skills/*/SKILL.md and skills/*/references/**/*.md against the shape
# the skills tree is expected to hold: frontmatter, size budget, reference
# integrity, path portability, eval fixtures, hand-offs, and bundled scripts.
# Exits 1 and lists every violation found rather than stopping at the first.
# SKILL_LINT_ROOT lints another tree (a staging copy) instead of this repo.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SKILL_LINT_ROOT:-$SCRIPT_DIR/..}"

violations=()
fail() { violations+=("$1"); }

# Pre-existing exceptions. A new entry here must be a deliberate, reviewed
# decision, not a way to silence a fresh violation. The size budget is a
# ratchet in scripts/skill-size-budget.json, checked by skill_checks.py.
# "<file>:<name>" pairs: a cmk:<name> token in <file> that names a
# hypothetical/example skill rather than citing a real one.
CITATION_ALLOWLIST=(
  "skills/codebase-docs/eval.json:foo"
)

in_allowlist() {
  local needle="$1"; shift
  local item
  for item in "$@"; do
    [ "$item" = "$needle" ] && return 0
  done
  return 1
}

# --- 1. Frontmatter validity ------------------------------------------------
check_frontmatter() {
  local skill_md dir skill_name l1 l2 l3 l4 l5 name version expected_dir
  for skill_md in skills/*/SKILL.md; do
    dir=$(dirname "$skill_md")
    skill_name=$(basename "$dir")
    l1=$(sed -n '1p' "$skill_md")
    l2=$(sed -n '2p' "$skill_md")
    l3=$(sed -n '3p' "$skill_md")
    l4=$(sed -n '4p' "$skill_md")
    l5=$(sed -n '5p' "$skill_md")
    l6=$(sed -n '6p' "$skill_md")

    [ "$l1" = "---" ] || fail "$skill_md: line 1 must be '---', found '$l1'"
    [[ "$l2" == name:* ]] || fail "$skill_md: line 2 must be a 'name:' key, found '$l2'"
    [[ "$l3" == description:* ]] || fail "$skill_md: line 3 must be a 'description:' key, found '$l3'"
    [[ "$l4" == version:* ]] || fail "$skill_md: line 4 must be a 'version:' key, found '$l4'"
    # Optional fourth field, user-invoked skills only. Any other key, or
    # a false value, is a shape error — the closer must stay `---`.
    if [ "$l5" = "disable-model-invocation: true" ]; then
      [ "$l6" = "---" ] || fail "$skill_md: line 6 must be '---' after disable-model-invocation, found '$l6'"
    else
      [ "$l5" = "---" ] || fail "$skill_md: line 5 must be '---' or 'disable-model-invocation: true', found '$l5'"
    fi

    name="${l2#name: }"
    version="${l4#version: }"

    if [[ "$name" =~ ^cmk:[a-z][a-z0-9-]*$ ]]; then
      expected_dir="${name#cmk:}"
      [ "$expected_dir" = "$skill_name" ] || fail "$skill_md: name '$name' implies directory 'skills/$expected_dir', found 'skills/$skill_name'"
    else
      fail "$skill_md: name '$name' does not match ^cmk:[a-z][a-z0-9-]*\$"
    fi

    [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail "$skill_md: version '$version' does not match ^[0-9]+.[0-9]+.[0-9]+\$"
  done
}

# --- 2. Size budget: see skill_checks.py ------------------------------------

# --- 3. Dangling references --------------------------------------------------
# A `references/<file>.md` mention in a SKILL.md normally belongs to that
# same skill. It belongs to a DIFFERENT named skill only when it directly
# follows a possessive citation of that skill, e.g. "cmk:foo`'s
# `references/bar.md`" — the pattern this repo's SKILL.md files use to point
# a reader at another skill's reference file. That attribution is resolved
# with the same awk pass that extracts every mention, then checked two ways:
# every mentioned file must exist under its attributed owner (dangling), and
# every file that exists must be mentioned under its own name at least once,
# from any SKILL.md (orphan).
extract_reference_mentions() {
  local src skill_name
  while IFS= read -r src; do
    skill_name=$(echo "$src" | cut -d/ -f2)
    awk -v skill="$skill_name" '
      BEGIN { apos = sprintf("%c", 39); last_cmk = ""; last_line = -10 }
      {
        rest = $0
        while (match(rest, /cmk:[a-z][a-z0-9-]*|references\/[A-Za-z0-9_.\/-]+\.md/)) {
          tok  = substr(rest, RSTART, RLENGTH)
          tail = substr(rest, RSTART + RLENGTH)
          if (tok ~ /^cmk:/) {
            name = substr(tok, 5)
            t = tail
            if (substr(t, 1, 1) == "`") t = substr(t, 2)
            if (substr(t, 1, 2) == apos "s") {
              last_cmk = name
              last_line = NR
            }
          } else {
            fname = substr(tok, 12)
            owner = skill
            if (last_cmk != "" && (NR - last_line) <= 1) owner = last_cmk
            print owner "\t" fname "\t" FILENAME "\t" NR
          }
          rest = tail
        }
      }
    ' "$src"
  done < <( { ls skills/*/SKILL.md; find skills/*/references -name '*.md' 2>/dev/null; } | sort)
}

check_dangling_references() {
  local mentions_file owner fname src line
  mentions_file="$1"
  while IFS=$'\t' read -r owner fname src line; do
    [ -z "$owner" ] && continue
    if [ ! -f "skills/$owner/references/$fname" ]; then
      fail "$src:$line: references/$fname (attributed to skills/$owner) does not exist"
    fi
  done < "$mentions_file"
}

check_orphan_references() {
  local mentions_file skill_name rf fname
  mentions_file="$1"
  # A reference is reached when SKILL.md or another file of the skill names it.
  while IFS= read -r rf; do
    skill_name=$(echo "$rf" | cut -d/ -f2)
    fname="${rf#skills/$skill_name/references/}"
    if ! awk -F'\t' -v s="$skill_name" -v f="$fname" -v self="$rf" '$1 == s && $2 == f && $3 != self { found=1 } END { exit !found }' "$mentions_file"; then
      fail "$rf: never mentioned as references/$fname by its SKILL.md or another reference"
    fi
  done < <(find skills/*/references -name '*.md' 2>/dev/null | sort)
}

# Every `cmk:<name>` citation under skills/ must resolve to a real skill
# directory. Scope is every skill file — SKILL.md, references/*.md, and
# eval.json — so a genuinely broken citation in a future eval.json is still
# caught; the one known non-citation (a hypothetical skill name in an eval
# fixture prompt) is exempted by exact "<file>:<name>" pair in
# CITATION_ALLOWLIST, not by excluding eval.json from the scan.
# One grep over every file: a process substitution per file crashes macOS's
# bash 3.2 once the tree holds a few hundred files.
check_citations_resolve() {
  local f name
  while IFS=: read -r f _ name; do
    [ -z "$name" ] && continue
    if [ ! -d "skills/$name" ] && ! in_allowlist "$f:$name" "${CITATION_ALLOWLIST[@]}"; then
      fail "$f: cmk:$name does not resolve to skills/$name/"
    fi
  done < <( { ls skills/*/SKILL.md skills/*/eval.json 2>/dev/null; find skills/*/references -name '*.md' 2>/dev/null; } \
    | xargs grep -oHE 'cmk:[a-z][a-z0-9-]*' /dev/null | sort -u)
}

# --- 4. eval.json validity -----------------------------------------------------
check_eval_json() {
  local f err
  for f in $(find skills -name eval.json | sort); do
    err=$(python3 -c '
import json, sys
try:
    json.load(open(sys.argv[1]))
except Exception as e:
    print(f"{type(e).__name__}: {e}")
    sys.exit(1)
' "$f") || fail "$f: invalid JSON ($err)"
  done
}

# --- 5. Ratchet, descriptions, evals, hand-offs, scripts, paths, package root
check_python() {
  local line
  while IFS= read -r line; do
    if [ -n "$line" ]; then fail "$line"; fi
  done < <(python3 "$SCRIPT_DIR/skill_checks.py")
}

mentions_file=""
main() {
  mentions_file=$(mktemp)
  trap 'rm -f "$mentions_file"' EXIT

  check_frontmatter
  extract_reference_mentions > "$mentions_file"
  check_dangling_references "$mentions_file"
  check_orphan_references "$mentions_file"
  check_citations_resolve
  check_eval_json
  check_python

  if [ "${#violations[@]}" -gt 0 ]; then
    echo "skill-lint: ${#violations[@]} violation(s) found:" >&2
    local v
    for v in "${violations[@]}"; do
      echo "  - $v" >&2
    done
    exit 1
  fi

  echo "skill-lint: OK (frontmatter, size ratchet, references, citations, paths, evals, hand-offs, scripts across skills/)"
}

main "$@"
