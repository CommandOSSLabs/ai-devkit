#!/usr/bin/env bash
# collect.sh <CODE> — every source a run's status is read from, in one fixed pass.
# Read-only except for running the project's unit-test command. Sections always print,
# empty or not, so a missing source shows as missing instead of silently absent.
set -uo pipefail
code="$1"
sec() { printf '\n## %s\n' "$1"; }

sec "plan"
row="$(grep -h "^| $code |" docs/specs/catalog/*.md 2>/dev/null | head -1)"
spec="$(printf '%s' "$row" | awk -F'|' '{print $4}' | tr -d ' ')"
dir="docs/specs/${spec#../}"; dir="${dir%/}"
if [[ -f "$dir/tasks.md" ]]; then
  echo "tasks: $dir/tasks.md"; grep -E '^(Status|Execution-mode):' "$dir/tasks.md"; grep -E '^### Task [0-9]+:' "$dir/tasks.md"
else echo "no tasks.md found for $code"; fi

sec "ledger (.skills/$code)"
for f in .skills/"$code"/progress.md; do [[ -f "$f" ]] && cat "$f" || echo "no progress.md"; done

sec "git"
base="$(sed -n 's/^- \*\*Default PR base:\*\* `\([^`]*\)`.*/\1/p' docs/agents/project.md 2>/dev/null | head -1)"; base="${base:-main}"
echo "branch: $(git branch --show-current)   base: $base"
echo "commits on branch (oldest first):"; git log --reverse --format='  %h %ad %s' --date=format:'%m-%d %H:%M' "$base"..HEAD
echo "uncommitted:"; git status --porcelain | sed 's/^/  /'
if up="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)"; then
  read -r behind ahead < <(git rev-list --left-right --count "$up"...HEAD)
  echo "upstream: $up — $ahead commit(s) not pushed, $behind not pulled"
else echo "upstream: none — branch never pushed"; fi

sec "tests (working tree)"
cmd="$(grep -E '^\| Unit tests \|' docs/agents/project.md 2>/dev/null | sed 's/.*| *`\([^`]*\)`.*/\1/')"
if [[ -n "$cmd" ]]; then echo "\$ $cmd"; eval "$cmd" 2>&1 | grep -E '(pass|fail|✗|error)' | tail -6
  [[ -n "$(git status --porcelain --untracked-files=no)" ]] && echo "note: result includes uncommitted changes"
else echo "no Unit tests command in docs/agents/project.md"; fi

sec "waiting on a person"
wait_hits="$(grep -snEi -B1 -A1 'waiting on|parked|decision needed|needs (your|a) (call|decision)' \
  .skills/"$code"/implementation-notes.md .skills/"$code"/decisions.tsv)"
[[ -n "$wait_hits" ]] && printf '%s\n' "$wait_hits" || echo "none found"

sec "tracker"
tr="$(sed -n 's/^\*\*Tracker:\*\* *//p' docs/agents/issue-tracker.md 2>/dev/null)"
echo "tracker: ${tr:-not configured}"
if [[ "$tr" == local ]]; then
  for f in $(grep -lE "$code-|\[$code\]" .scratch/*/issues/*.md 2>/dev/null); do
    echo "$f"; grep -E '^(Status|Assignee):' "$f" | sed 's/^/  /'
  done
elif command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  gh issue list --search "$code" --state all --limit 5 2>&1 | head -5
else echo "not readable from here"; fi

sec "pull request and checks"
if command -v gh >/dev/null && gh pr view --json number,state,url >/dev/null 2>&1; then
  gh pr view --json number,state,url,statusCheckRollup --jq '"#\(.number) \(.state) \(.url)", (.statusCheckRollup[]? | "  \(.name): \(.conclusion // .status)")'
else echo "no PR for this branch on a reachable code host"; fi
