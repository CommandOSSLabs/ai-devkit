#!/usr/bin/env bash
# Lints skills/*/SKILL.md and skills/*/references/*.md against the shape the
# skills tree is expected to hold: frontmatter, size budget, reference
# integrity, path portability, and eval fixture validity. Exits 1 and lists
# every violation found rather than stopping at the first.
set -euo pipefail

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

violations=()
fail() { violations+=("$1"); }

# Pre-existing exceptions. A new entry here must be a deliberate, reviewed
# decision, not a way to silence a fresh violation.
SIZE_BUDGET_ALLOWLIST=(codebase-docs)
CROSS_PACKAGE_PATH_ALLOWLIST=(
  "skills/docs/references/scaffold-manifest.md"
  "skills/sui-devstack/references/instance-isolation.md"
)
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

# --- 2. Size budget ----------------------------------------------------------
check_size_budget() {
  local skill_md skill_name lines
  for skill_md in skills/*/SKILL.md; do
    skill_name=$(basename "$(dirname "$skill_md")")
    lines=$(wc -l < "$skill_md" | tr -d ' ')
    if [ "$lines" -gt 150 ] && ! in_allowlist "$skill_name" "${SIZE_BUDGET_ALLOWLIST[@]}"; then
      fail "$skill_md: $lines lines exceeds the 150-line SKILL.md budget"
    fi
  done
}

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
  local skill_md skill_name
  for skill_md in skills/*/SKILL.md; do
    skill_name=$(basename "$(dirname "$skill_md")")
    awk -v skill="$skill_name" '
      BEGIN { apos = sprintf("%c", 39); last_cmk = ""; last_line = -10 }
      {
        rest = $0
        while (match(rest, /cmk:[a-z][a-z0-9-]*|references\/[A-Za-z0-9_.-]+\.md/)) {
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
    ' "$skill_md"
  done
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
  local mentions_file skill_name refdir rf fname
  mentions_file="$1"
  for refdir in skills/*/references; do
    [ -d "$refdir" ] || continue
    skill_name=$(basename "$(dirname "$refdir")")
    for rf in "$refdir"/*.md; do
      [ -e "$rf" ] || continue
      fname=$(basename "$rf")
      if ! awk -F'\t' -v s="$skill_name" -v f="$fname" '$1 == s && $2 == f { found=1 } END { exit !found }' "$mentions_file"; then
        fail "$rf: never mentioned as references/$fname by any SKILL.md"
      fi
    done
  done
}

# Every `cmk:<name>` citation under skills/ must resolve to a real skill
# directory. Scope is every skill file — SKILL.md, references/*.md, and
# eval.json — so a genuinely broken citation in a future eval.json is still
# caught; the one known non-citation (a hypothetical skill name in an eval
# fixture prompt) is exempted by exact "<file>:<name>" pair in
# CITATION_ALLOWLIST, not by excluding eval.json from the scan.
check_citations_resolve() {
  local f name
  for f in skills/*/SKILL.md skills/*/references/*.md skills/*/eval.json; do
    [ -e "$f" ] || continue
    while IFS= read -r name; do
      [ -z "$name" ] && continue
      if [ ! -d "skills/$name" ] && ! in_allowlist "$f:$name" "${CITATION_ALLOWLIST[@]}"; then
        fail "$f: cmk:$name does not resolve to skills/$name/"
      fi
    done < <(grep -oE 'cmk:[a-z][a-z0-9-]*' "$f" | sed 's/^cmk://' | sort -u)
  done
}

# --- 4. Cross-package paths ---------------------------------------------------
check_cross_package_paths() {
  local f
  while IFS= read -r f; do
    if grep -q '\.\./' "$f" && ! in_allowlist "$f" "${CROSS_PACKAGE_PATH_ALLOWLIST[@]}"; then
      fail "$f: contains '../' (cross-package path); skill files must be self-contained"
    fi
  done < <(find skills -type f | sort)
}

# --- 5. eval.json validity -----------------------------------------------------
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

mentions_file=""
main() {
  mentions_file=$(mktemp)
  trap 'rm -f "$mentions_file"' EXIT

  check_frontmatter
  check_size_budget
  extract_reference_mentions > "$mentions_file"
  check_dangling_references "$mentions_file"
  check_orphan_references "$mentions_file"
  check_citations_resolve
  check_cross_package_paths
  check_eval_json

  if [ "${#violations[@]}" -gt 0 ]; then
    echo "skill-lint: ${#violations[@]} violation(s) found:" >&2
    local v
    for v in "${violations[@]}"; do
      echo "  - $v" >&2
    done
    exit 1
  fi

  echo "skill-lint: OK (frontmatter, size, references, citations, paths, eval.json across skills/)"
}

main "$@"
