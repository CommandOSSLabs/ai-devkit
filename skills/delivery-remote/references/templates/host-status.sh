#!/usr/bin/env bash
# host-status.sh — read a build-on-host run from this machine.
#
# One copy per repo, reused by every feature. Every per-run value comes from
# .skills/<CODE>/host-run.json; nothing about a run is edited into this file.
#
# Usage:
#   scripts/host-status.sh [-c CODE] [command] [args]
#
#   status           state, commits, plan progress, heartbeat, ports  (default)
#   state            one word, for scripts: running | done | failed | died
#   peek  [N]        last N lines of the run's tmux pane (default 80)
#   log   [N]        last N lines of the run log (default 80)
#   diff  [git args] what the run has committed since BASE (default --stat)
#   attach           attach to the run's tmux session (Ctrl-b d detaches)
#   wait  [SECONDS]  poll until the run reaches a terminal state (default 30)
#   tunnel           forward the run's ports here, so the app opens in a browser
#   runs             every run record in this repo, with its host state
#
# CODE resolution: -c CODE, else $HOSTBUILD_CODE, else the only open run record.
#
# Read-only. It never returns work, pushes, merges, or reclaims — those are
# build-on-host's return leg and reclaim phase, and they are not one keystroke.
#
# Exit codes (state, wait): 0 finished clean · 1 died with no exit code
#   · 2 no record / unusable record · 3 still running · N the run's own code.
#
# A log at 0 bytes is not a stall: a driver whose log_format emits one object at
# the end writes nothing until it exits. Read the session and heartbeat instead.

set -euo pipefail

SSH_TIMEOUT="${HOSTBUILD_SSH_TIMEOUT:-8}"
CODE="${HOSTBUILD_CODE:-}"

die() { printf '%s\n' "$*" >&2; exit 2; }

usage() { sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'; }

repo_root() {
  git rev-parse --show-toplevel 2>/dev/null && return 0
  cd "$(dirname "${BASH_SOURCE[0]}")" && git rev-parse --show-toplevel
}

# ---------------------------------------------------------------- run record

open_codes() {
  python3 - "$RECORD_DIR" <<'PY'
import glob, json, os, sys
for f in sorted(glob.glob(os.path.join(sys.argv[1], "*", "host-run.json"))):
    try:
        d = json.load(open(f))
    except Exception:
        continue
    if d.get("closed") is True or d.get("state") == "closed":
        continue
    print(os.path.basename(os.path.dirname(f)))
PY
}

all_codes() {
  ls -1d "$RECORD_DIR"/*/host-run.json 2>/dev/null | while IFS= read -r f; do
    basename "$(dirname "$f")"
  done
}

resolve_code() {
  [ -n "$CODE" ] && return 0
  local found
  found=$(open_codes)
  case "$(printf '%s' "$found" | grep -c . || true)" in
    1) CODE="$found" ;;
    0) die "no open run record under $RECORD_DIR/<CODE>/host-run.json" ;;
    *) printf 'several runs are open — pass -c CODE:\n%s\n' "$found" >&2; exit 2 ;;
  esac
}

load_record() {
  local f="$RECORD_DIR/$CODE/host-run.json"
  [ -f "$f" ] || die "no run record: $f"
  eval "$(python3 - "$f" <<'PY'
import json, shlex, sys
d = json.load(open(sys.argv[1]))

def g(*keys):
    for k in keys:
        v = d.get(k)
        if v not in (None, "", [], {}):
            return v
    return ""

fields = {
    "R_ALIAS":      g("alias"),
    "R_SESSION":    g("session"),
    "R_WORKDIR":    g("workdir", "worktree", "rundir"),
    "R_BASE":       g("base_sha", "base"),
    "R_BRANCH":     g("branch"),
    "R_LOG":        g("log"),
    "R_SENTINEL":   g("sentinel"),
    "R_PLAN":       g("plan", "plan_path", "tasks"),
    "R_PROGRESS":   g("progress_glob"),
    "R_AGENT":      g("agent"),
    "R_MODEL":      g("model"),
    "R_ROUTE":      g("route"),
    "R_SLOT":       g("slot"),
    "R_PROJECT":    g("compose_project"),
    "R_DISPATCHED": g("dispatched_at"),
    "R_RETURN":     g("return"),
    "R_PATH":       g("path"),
}
pe = d.get("port_env") or {}
if isinstance(pe, dict):
    fields["R_PORTS"] = " ".join(f"{k}={v}" for k, v in pe.items())
else:
    fields["R_PORTS"] = " ".join(str(p) for p in pe)

for k, v in fields.items():
    print(f"{k}={shlex.quote(str(v))}")
PY
)"
  [ -n "${R_ALIAS:-}" ]   || die "run record names no host alias: $f"
  [ -n "${R_WORKDIR:-}" ] || die "run record names no workdir: $f"

  # A non-interactive ssh shell reads neither .zshrc nor .zprofile, so every
  # remote command below exports the manifest's PATH first.
  if [ -z "${R_PATH:-}" ]; then
    R_PATH=$(sed -n 's/^[[:space:]]*path:[[:space:]]*//p' \
      "$ROOT/docs/agents/host-build.md" 2>/dev/null | head -1 || true)
  fi
  [ -n "${R_PATH:-}" ] || R_PATH='$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH'
}

# -------------------------------------------------------------------- remote

remote() {
  ssh -o BatchMode=yes -o ConnectTimeout="$SSH_TIMEOUT" "$R_ALIAS" \
    "export PATH=\"$R_PATH\"; $1"
}

# Sends the payload on stdin so nothing has to survive two levels of quoting.
remote_script() {
  local args
  args=$(printf '%q ' "$@")
  ssh -o BatchMode=yes -o ConnectTimeout="$SSH_TIMEOUT" "$R_ALIAS" \
    "export PATH=\"$R_PATH\"; bash -s -- $args"
}

read_state() {   # -> "<word> <exit code>"
  remote_script "$R_SENTINEL" "$R_SESSION" <<'REMOTE'
set -u
ex() { case "$1" in "~/"*) printf '%s' "$HOME/${1#\~/}";; *) printf '%s' "$1";; esac; }
SENT=$(ex "${1:-}")
SESSION="${2:-}"
if [ -n "$SENT" ] && [ -f "$SENT" ]; then
  code=$(tr -d '[:space:]' < "$SENT"); [ -n "$code" ] || code=0
  if [ "$code" = "0" ]; then echo "done 0"; else echo "failed $code"; fi
elif [ -n "$SESSION" ] && tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "running 3"
else
  echo "died 1"
fi
REMOTE
}

# ------------------------------------------------------------------ commands

cmd_status() {
  local age="?"
  if [ -n "${R_DISPATCHED:-}" ]; then
    age=$(python3 - "$R_DISPATCHED" <<'PY' 2>/dev/null || echo "?"
import sys
from datetime import datetime, timezone
t = datetime.fromisoformat(sys.argv[1].replace("Z", "+00:00"))
m = (datetime.now(timezone.utc) - t).total_seconds() / 60
print(f"{m/60:.1f}h" if m >= 90 else f"{m:.0f}m")
PY
)
  fi
  printf 'code:     %s   slot: %s   route: %s\n' "$CODE" "${R_SLOT:-?}" "${R_ROUTE:-?}"
  printf 'host:     %s   session: %s\n' "$R_ALIAS" "${R_SESSION:-?}"
  printf 'agent:    %s %s   return: %s\n' "${R_AGENT:-?}" "${R_MODEL:-}" "${R_RETURN:-?}"
  printf 'started:  %s (%s ago)\n' "${R_DISPATCHED:-?}" "$age"

  remote_script "$R_WORKDIR" "$R_BASE" "$R_SESSION" "$R_LOG" "$R_SENTINEL" \
                "$R_PLAN" "$CODE" "$R_PROGRESS" "$R_PORTS" "$R_PROJECT" <<'REMOTE'
set -u
ex() { case "$1" in "~/"*) printf '%s' "$HOME/${1#\~/}";; *) printf '%s' "$1";; esac; }
WT=$(ex "$1"); BASE="$2"; SESSION="$3"; LOG=$(ex "$4"); SENT=$(ex "$5")
PLAN="$6"; CODE="$7"; PROGRESS=$(ex "$8"); PORTS="$9"; PROJECT="${10}"

if [ -n "$SENT" ] && [ -f "$SENT" ]; then
  code=$(tr -d '[:space:]' < "$SENT"); [ -n "$code" ] || code=0
  if [ "$code" = "0" ]; then echo "state:    FINISHED (exit 0)"
  else echo "state:    FAILED (exit $code)"; fi
elif tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "state:    RUNNING"
else
  echo "state:    DIED — no session and no exit code; the log tail is the evidence"
fi

if ! cd "$WT" 2>/dev/null; then
  echo "workdir missing on the host: $WT"
  exit 1
fi
echo "branch:   $(git branch --show-current 2>/dev/null)"
echo "HEAD:     $(git rev-parse --short HEAD 2>/dev/null)"
echo "BASE:     $(git rev-parse --short "$BASE" 2>/dev/null || echo "$BASE")"
echo "ahead:    $(git rev-list --count "$BASE"..HEAD 2>/dev/null || echo '?') commit(s)"

echo "--- commits since base ---"
git log --oneline "$BASE"..HEAD 2>/dev/null | head -20
echo "--- working tree ---"
git status -sb 2>/dev/null | head -15

if [ -n "$PROGRESS" ]; then
  echo "--- heartbeat ---"
  newest=$(ls -t $PROGRESS 2>/dev/null | head -1)
  if [ -z "$newest" ]; then
    echo "(no progress file matched)"
  else
    mtime=$(stat -f %m "$newest" 2>/dev/null || stat -c %Y "$newest" 2>/dev/null || echo 0)
    now=$(date +%s)
    echo "updated:  $(( (now - mtime) / 60 ))m ago  ($newest)"
    python3 - "$newest" <<'PY' 2>/dev/null || true
import json, sys
d = json.load(open(sys.argv[1]))
for k, v in d.items():
    if isinstance(v, (str, int, float, bool)) and len(str(v)) < 120:
        print(f"  {k}: {v}")
PY
  fi
fi

if [ -n "$PLAN" ] && [ -f "$WT/$PLAN" ]; then
  echo "--- plan ($PLAN) ---"
  grep -E '^Status:|^Execution-mode:' "$WT/$PLAN" | head -4 || true
  echo "checked:   $(grep -c '^- \[x\]' "$WT/$PLAN" || true)"
  echo "unchecked: $(grep -c '^- \[ \]' "$WT/$PLAN" || true)"
fi

if [ -n "$LOG" ]; then
  if [ -f "$LOG" ]; then
    size=$(wc -c < "$LOG" | tr -d ' ')
    echo "--- log ($size bytes) ---"
    [ "$size" -gt 0 ] && tail -5 "$LOG"
  else
    echo "--- log --- (absent: $LOG)"
  fi
fi

if [ -n "$PORTS" ]; then
  up=""; down=""
  for kv in $PORTS; do
    name=${kv%%=*}; port=${kv##*=}
    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then up="$up $name:$port"
    else down="$down $name:$port"; fi
  done
  echo "--- ports ---"
  echo "listening:${up:- none}"
  echo "down:     ${down:- none}"
fi

if [ -n "$PROJECT" ] && command -v docker >/dev/null 2>&1; then
  names=$(docker ps --filter "label=com.docker.compose.project=$PROJECT" \
    --format '{{.Names}}' 2>/dev/null | tr '\n' ' ')
  echo "containers ($PROJECT): ${names:-none}"
fi

echo "--- .skills/$CODE ---"
ls -1 "$WT/.skills/$CODE" 2>/dev/null | head -30
REMOTE
}

cmd_state() {
  local out word code
  out=$(read_state)
  word=${out%% *}; code=${out##* }
  printf '%s\n' "$word"
  exit "$code"
}

cmd_peek() {
  remote_script "$R_SESSION" "${1:-80}" <<'REMOTE'
set -u
# Strip control characters, then collapse the trailing blank rows a pane pads with.
out=$(tmux capture-pane -t "$1" -p -S -"$2" 2>/dev/null \
      | sed 's/[[:cntrl:]]//g' | sed -e :a -e '/^[[:space:]]*$/{$d;N;ba' -e '}')
if [ -z "$(printf '%s' "$out" | tr -d '[:space:]')" ]; then
  echo "(pane empty — a run that redirects to its log writes nothing here; use: log)"
else
  printf '%s\n' "$out"
fi
REMOTE
}

cmd_log() {
  remote_script "$R_LOG" "${1:-80}" <<'REMOTE'
set -u
ex() { case "$1" in "~/"*) printf '%s' "$HOME/${1#\~/}";; *) printf '%s' "$1";; esac; }
LOG=$(ex "${1:-}")
if [ -z "$LOG" ] || [ ! -f "$LOG" ]; then echo "no log at: ${LOG:-(unset)}"; exit 1; fi
size=$(wc -c < "$LOG" | tr -d ' ')
if [ "$size" -eq 0 ]; then
  echo "(log is 0 bytes — normal for a driver that emits one object at exit; read state and heartbeat instead)"
  exit 0
fi
tail -n "${2:-80}" "$LOG"
REMOTE
}

cmd_diff() {
  local args
  args=$(printf '%q ' "$@")
  [ $# -gt 0 ] || args='--stat'
  remote_script "$R_WORKDIR" "$R_BASE" "$args" <<'REMOTE'
set -u
ex() { case "$1" in "~/"*) printf '%s' "$HOME/${1#\~/}";; *) printf '%s' "$1";; esac; }
cd "$(ex "$1")" || { echo "workdir missing: $1"; exit 1; }
eval "git --no-pager diff $2..HEAD $3"
REMOTE
}

cmd_attach() {
  # A tty, no BatchMode, and TMUX unset so an outer session does not refuse the nest.
  ssh -o ConnectTimeout="$SSH_TIMEOUT" -t "$R_ALIAS" \
    "export PATH=\"$R_PATH\"; command -v tmux >/dev/null || { echo 'tmux not on the manifest PATH'; exit 127; }; env -u TMUX tmux attach -t $R_SESSION"
}

cmd_wait() {
  local every="${1:-30}" out word code
  printf 'polling %s every %ss until %s reaches a terminal state (Ctrl-C to stop)\n' \
    "$R_SESSION" "$every" "$CODE"
  while :; do
    out=$(read_state) || out="unreachable 2"
    word=${out%% *}; code=${out##* }
    printf '[%s] %s\n' "$(date +%H:%M:%S)" "$word"
    case "$word" in
      done|failed|died) exit "$code" ;;
    esac
    sleep "$every"
  done
}

cmd_tunnel() {
  [ -n "${R_PORTS:-}" ] || die "the run record declares no port_env to forward"
  local fwd=() kv name port
  for kv in $R_PORTS; do
    name=${kv%%=*}; port=${kv##*=}
    fwd+=(-L "127.0.0.1:$port:127.0.0.1:$port")
    printf 'forwarding %-24s http://127.0.0.1:%s\n' "$name" "$port"
  done
  printf 'Ctrl-C to stop.\n'
  ssh -N -o ExitOnForwardFailure=yes -o ConnectTimeout="$SSH_TIMEOUT" \
    "${fwd[@]}" "$R_ALIAS"
}

cmd_runs() {
  local c out
  printf '%-10s %-22s %-10s %s\n' CODE BRANCH STATE HOST
  for c in $(all_codes); do
    CODE="$c"
    load_record
    out=$(read_state 2>/dev/null) || out="unreachable 2"
    printf '%-10s %-22s %-10s %s\n' "$c" "${R_BRANCH:-?}" "${out%% *}" "$R_ALIAS"
  done
}

# ---------------------------------------------------------------------- main

while [ $# -gt 0 ]; do
  case "$1" in
    -c|--code) CODE="${2:-}"; shift 2 ;;
    -h|--help|help) usage; exit 0 ;;
    *) break ;;
  esac
done

ROOT=$(repo_root) || die "not inside a git repository"
RECORD_DIR="$ROOT/.skills"

cmd="${1:-status}"; [ $# -gt 0 ] && shift || true

case "$cmd" in
  runs) cmd_runs "$@" ;;
  status|state|peek|log|diff|attach|wait|tunnel)
    resolve_code
    load_record
    "cmd_$cmd" "$@"
    ;;
  *) die "unknown command: $cmd (try: status | state | peek | log | diff | attach | wait | tunnel | runs)" ;;
esac
