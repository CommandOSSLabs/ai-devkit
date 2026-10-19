#!/usr/bin/env bash
# landed.sh <pattern>...  — where has work naming each ticket ID already landed?
#
# For every pattern (a ticket ID as the tracker writes it), print one tab-separated
# row per commit whose message names it, and one per branch whose name carries it:
#
#   pattern  commit|branch  on-default(yes|no|-)  branches-containing  subject
#
# "Default" is the branch the product ships from: origin/HEAD, else main, else master.
# No rows for a pattern means no commit or branch names it. Read-only.
set -euo pipefail

default="$(git symbolic-ref -q --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||' || true)"
[[ -n "$default" ]] || { git show-ref -q --verify refs/heads/main && default=main; } || default=master

for pat in "$@"; do
  git log --all -F --grep="$pat" --format='%H%x09%h%x09%s' | while IFS=$'\t' read -r full short subj; do
    on=no; git merge-base --is-ancestor "$full" "$default" 2>/dev/null && on=yes
    br="$(git branch -a --contains "$full" --format='%(refname:short)' | paste -sd, -)"
    printf '%s\t%s\t%s\t%s\t%s\n' "$pat" "$short" "$on" "$br" "$subj"
  done
  git branch -a --format='%(refname:short)' | grep -F -- "$pat" | while read -r b; do
    printf '%s\tbranch\t-\t%s\t-\n' "$pat" "$b"
  done || true
done
echo "# default branch: $default"
