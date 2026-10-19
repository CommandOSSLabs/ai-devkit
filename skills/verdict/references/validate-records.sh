#!/bin/sh
# references/validate-records.sh — decision-record validator (POSIX sh + git)
# Modes: --mode=audit-trace | --mode=publish --record <file> | --scan
# Exit: 0 no errors · 1 errors · 2 not-run (capability missing)
# Diagnostics: "ERROR <pass> …" / "warn  <pass> …" (two spaces after warn)
#
# Test-only: DREC_VISIBLE_TAGS — newline-separated name@objectid (default: git tags)
# No python/node/ruby runtime.

set -eu

MODE=""
RECORD=""
ROOT="."
SCAN=0
ERR_COUNT=0
WARN_COUNT=0

# --- diagnostics -----------------------------------------------------------
emit_error() {
  # $1=pass $2=message
  printf 'ERROR %s %s\n' "$1" "$2"
  ERR_COUNT=$((ERR_COUNT + 1))
}

emit_warn() {
  printf 'warn  %s %s\n' "$1" "$2"
  WARN_COUNT=$((WARN_COUNT + 1))
}

# --- arg parse -------------------------------------------------------------
while [ "$#" -gt 0 ]; do
  case "$1" in
    --mode=*) MODE=${1#--mode=} ;;
    --mode) shift; MODE=${1:-} ;;
    --record=*) RECORD=${1#--record=} ;;
    --record) shift; RECORD=${1:-} ;;
    --root=*) ROOT=${1#--root=} ;;
    --root) shift; ROOT=${1:-} ;;
    --scan) SCAN=1 ;;
    -h|--help)
      printf '%s\n' "usage: references/validate-records.sh --mode=trace|publish [--root DIR] [--record FILE]"
      printf '%s\n' "       references/validate-records.sh --scan   # read stdin"
      exit 0
      ;;
    *)
      printf 'ERROR E-grammar unknown argument: %s\n' "$1" >&2
      exit 2
      ;;
  esac
  shift
done

# --- secret scan -----------------------------------------------------------
# Patterns: PEM private key, AWS AKIA, GitHub ghp_/github_pat_, Slack xox, generic assignment
scan_stdin() {
  hits=0
  # Read all stdin into a temp file for multi-pattern scan
  tmp=$(mktemp 2>/dev/null || mktemp -t drecscan)
  cat >"$tmp"
  if grep -E -q -- '-----BEGIN ([A-Z0-9 ]+)?PRIVATE KEY-----' "$tmp" 2>/dev/null; then
    printf 'ERROR scan private-key block detected\n'
    hits=1
  fi
  if grep -E -q -- 'AKIA[0-9A-Z]{16}' "$tmp" 2>/dev/null; then
    printf 'ERROR scan AWS access key pattern (AKIA…)\n'
    hits=1
  fi
  if grep -E -q -- 'ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}' "$tmp" 2>/dev/null; then
    printf 'ERROR scan GitHub token pattern\n'
    hits=1
  fi
  if grep -E -q -- 'xox[baprs]-[A-Za-z0-9-]{10,}' "$tmp" 2>/dev/null; then
    printf 'ERROR scan Slack token pattern\n'
    hits=1
  fi
  if grep -E -qi -- '(api[_-]?key|token|secret|password)[[:space:]]*=[[:space:]]*[^[:space:]]+' "$tmp" 2>/dev/null; then
    printf 'ERROR scan generic secret assignment pattern\n'
    hits=1
  fi
  rm -f "$tmp"
  if [ "$hits" -ne 0 ]; then
    exit 1
  fi
  exit 0
}

if [ "$SCAN" -eq 1 ]; then
  scan_stdin
fi

if [ -z "$MODE" ]; then
  printf 'ERROR E-grammar --mode required (or use --scan)\n' >&2
  exit 2
fi

case "$MODE" in
  trace|publish) ;;
  *)
    printf 'ERROR E-grammar unknown mode: %s\n' "$MODE" >&2
    exit 2
    ;;
esac

if [ "$MODE" = "publish" ] && [ -z "$RECORD" ]; then
  printf 'ERROR E-grammar --record required for publish mode\n' >&2
  exit 2
fi

DEC_DIR="$ROOT/.skills/decisions"

# ARCH-2: no .skills/decisions → no-op success
if [ ! -d "$DEC_DIR" ]; then
  printf 'decision-records: no .skills/decisions — passes no-op\n'
  printf 'decision-records: %s errors · %s warnings\n' "$ERR_COUNT" "$WARN_COUNT"
  exit 0
fi

# --- helpers ---------------------------------------------------------------
is_anchor_file() {
  # first non-blank line == # Decision-Record Adoption Anchor
  first=$(awk 'NF { print; exit }' "$1" 2>/dev/null || true)
  [ "$first" = "# Decision-Record Adoption Anchor" ]
}

field_value() {
  # $1=file $2=field name (without colon) — first single-line match
  # shellcheck disable=SC2016
  awk -v f="$2" '
    index($0, f ":") == 1 {
      sub("^" f ":[[:space:]]*", "")
      print
      exit
    }
  ' "$1"
}

payload_bytes() {
  # everything before ## Envelope line
  awk '
    $0 == "## Envelope" { exit }
    { print }
  ' "$1"
}

envelope_section() {
  awk '
    $0 == "## Envelope" { p=1; next }
    p { print }
  ' "$1"
}

crockford_ok() {
  # 6 chars Crockford
  echo "$1" | grep -Eq '^[0-9A-HJKMNPQRSTVWXYZ]{6}$'
}

id_ok() {
  echo "$1" | grep -Eq '^DEC-[0-9]{8}-[0-9A-HJKMNPQRSTVWXYZ]{6}$'
}

effective_id_of() {
  # last Reissued-as id else Published id
  last=$(awk '
    /^Reissued-as:/ {
      sub(/^Reissued-as:[[:space:]]*/, "")
      split($0, a, /[[:space:]]+/)
      print a[1]
    }
  ' "$1" | tail -n 1)
  if [ -n "$last" ]; then
    printf '%s\n' "$last"
    return
  fi
  pub=$(field_value "$1" "Published")
  printf '%s\n' "${pub%% *}"
}

compute_digest() {
  # $1=algo $2=file of payload bytes → print hex digest or empty + set RC
  algo=$1
  pfile=$2
  case "$algo" in
    sha256)
      if command -v sha256sum >/dev/null 2>&1; then
        sha256sum <"$pfile" | awk '{print $1}'
        return 0
      fi
      if command -v shasum >/dev/null 2>&1; then
        shasum -a 256 <"$pfile" | awk '{print $1}'
        return 0
      fi
      if command -v openssl >/dev/null 2>&1; then
        openssl dgst -sha256 <"$pfile" | awk '{print $NF}'
        return 0
      fi
      return 1
      ;;
    git-blob)
      if command -v git >/dev/null 2>&1; then
        git hash-object --stdin <"$pfile"
        return 0
      fi
      return 1
      ;;
    *)
      return 1
      ;;
  esac
}

prohibited_locator() {
  # return 0 if prohibited. Classes mirror references/RECORD.md "Prohibited evidence
  # locator classes": .skills/ · /tmp/ · local absolute paths · "session history".
  # Applied to Evidence:/Storage-Reference-* VALUES only, never to a record's own
  # location — the substrate under .skills/decisions/ is storage, not a citation.
  v=$1
  case "$v" in
    *.skills/*|.skills/*|*/*/.skills/*) return 0 ;;
  esac
  echo "$v" | grep -q '\.skills/' && return 0
  echo "$v" | grep -Eq '(^|[[:space:]])/tmp/' && return 0
  # absolute path (Unix)
  echo "$v" | grep -Eq '(^|[[:space:]])/[A-Za-z0-9._-]+/' && return 0
  echo "$v" | grep -Eqi 'session[[:space:]]+history' && return 0
  return 1
}

# --- collect records & anchors --------------------------------------------
ANCHORS=""
RECORDS=""
for f in "$DEC_DIR"/*; do
  [ -f "$f" ] || continue
  case "$f" in
    *.md) ;;
    *) continue ;;
  esac
  if is_anchor_file "$f"; then
    ANCHORS="$ANCHORS
$f"
  else
    base=$(basename "$f")
    case "$base" in
      DEC-*.md) RECORDS="$RECORDS
$f" ;;
    esac
  fi
done

# publish mode: include candidate if not already under DEC_DIR listing
if [ "$MODE" = "publish" ] && [ -n "$RECORD" ]; then
  found=0
  for f in $RECORDS; do
    [ -z "$f" ] && continue
    if [ "$f" = "$RECORD" ] || [ "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" = "$(cd "$(dirname "$RECORD")" && pwd)/$(basename "$RECORD")" ]; then
      found=1
    fi
  done
  if [ "$found" -eq 0 ] && [ -f "$RECORD" ]; then
    RECORDS="$RECORDS
$RECORD"
  fi
fi

n_records=0
for f in $RECORDS; do
  [ -z "$f" ] && continue
  n_records=$((n_records + 1))
done

n_anchors=0
for f in $ANCHORS; do
  [ -z "$f" ] && continue
  n_anchors=$((n_anchors + 1))
done

# no records and no anchor → no-op (ARCH-2 adoption absent)
if [ "$n_records" -eq 0 ] && [ "$n_anchors" -eq 0 ]; then
  printf 'decision-records: empty substrate — passes no-op\n'
  printf 'decision-records: %s errors · %s warnings\n' "$ERR_COUNT" "$WARN_COUNT"
  exit 0
fi

# anchor count while records exist
if [ "$n_records" -gt 0 ]; then
  if [ "$n_anchors" -eq 0 ]; then
    emit_error "E-grammar" "adoption anchor missing while decision records exist (DREC-11.12)"
  elif [ "$n_anchors" -gt 1 ]; then
    emit_error "E-grammar" "multiple adoption anchors ($n_anchors) while decision records exist (DREC-11.12)"
  fi
fi

# --- E-spine availability --------------------------------------------------
SPINE=0
if [ -d "$ROOT/docs/specs" ]; then
  # any requirements.md?
  for rf in "$ROOT"/docs/specs/*/requirements.md "$ROOT"/docs/specs/*/*/requirements.md; do
    [ -f "$rf" ] || continue
    SPINE=1
    break
  done
fi

KNOWN_IDS=""
if [ "$SPINE" -eq 1 ]; then
  KNOWN_IDS=$(grep -RhoE '\*\*[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+\*\*' \
    "$ROOT"/docs/specs --include='*requirements.md' 2>/dev/null \
    | sed -E 's/\*\*//g' | sort -u || true)
fi

# --- per-record validation -------------------------------------------------
# identity map for E-dup: effective_id -> files
ID_MAP_FILE=$(mktemp 2>/dev/null || mktemp -t drecids)
JUDG_MAP_FILE=$(mktemp 2>/dev/null || mktemp -t drecjudg)
TAG_CITE_FILE=$(mktemp 2>/dev/null || mktemp -t drectags)
: >"$ID_MAP_FILE"
: >"$JUDG_MAP_FILE"
: >"$TAG_CITE_FILE"

validate_record() {
  f=$1
  base=$(basename "$f" .md)

  # must have ## Envelope
  if ! grep -qx '## Envelope' "$f"; then
    emit_error "E-grammar" "$f missing ## Envelope split"
    return
  fi

  ptmp=$(mktemp 2>/dev/null || mktemp -t drecpay)
  payload_bytes "$f" >"$ptmp"

  # required payload fields
  for fld in Accepted Emitter Verdict Boundary-Type Scope Crossing-Exists \
    Ceremony-Floor User-Escalation Depth \
    Predicate-External-Audience Predicate-No-Mechanical-Undo Predicate-Persistent-Stakes \
    Judgment-Pointer Accepted-Risk-Pointer Response-If-Wrong-Pointer; do
    if ! grep -q "^${fld}:" "$ptmp"; then
      emit_error "E-grammar" "$f missing payload field ${fld}:"
    fi
  done

  # Human judgment fields present (header lines)
  for fld in Human-Judgment Human-Accepted-Risk Human-Response-If-Wrong; do
    if ! grep -q "^${fld}:" "$ptmp"; then
      emit_error "E-grammar" "$f missing payload field ${fld}:"
    fi
  done

  depth=$(field_value "$f" "Depth")
  case "$depth" in
    Guarded|Accountable) ;;
    Minimal)
      emit_error "E-grammar" "$f Depth: Minimal is illegal in a published record (DREC-3.4)"
      ;;
    *)
      emit_error "E-grammar" "$f illegal Depth: $depth"
      ;;
  esac

  verdict=$(field_value "$f" "Verdict")
  case "$verdict" in
    merge|pr|discard|block|release-approve|release-reject) ;;
    *)
      emit_error "E-grammar" "$f illegal Verdict: $verdict"
      ;;
  esac

  btype=$(field_value "$f" "Boundary-Type")
  if ! echo "$btype" | grep -Eq '^[a-z][a-z0-9-]*$'; then
    emit_error "E-grammar" "$f illegal Boundary-Type syntax: $btype"
  fi

  # envelope required
  for fld in Published Payload-Digest-Algorithm Payload-Digest \
    Storage-Judgment Storage-Accepted-Risk Storage-Response-If-Wrong \
    Storage-Reference-Judgment Storage-Reference-Accepted-Risk Storage-Reference-Response-If-Wrong; do
    if ! grep -q "^${fld}:" "$f"; then
      emit_error "E-grammar" "$f missing envelope field ${fld}:"
    fi
  done

  for s in Storage-Judgment Storage-Accepted-Risk Storage-Response-If-Wrong; do
    sv=$(field_value "$f" "$s")
    case "$sv" in
      repo-verbatim|withheld\(reference\)|withheld\(unavailable\)) ;;
      *)
        emit_error "E-grammar" "$f illegal $s: $sv"
        ;;
    esac
    if [ "$sv" = "withheld(unavailable)" ]; then
      emit_warn "W-opaque" "$f $s=withheld(unavailable)"
    fi
  done

  # identity
  eff=$(effective_id_of "$f")
  if ! id_ok "$eff"; then
    emit_error "E-grammar" "$f effective identity not well-formed: $eff"
  else
    if [ "$base" != "$eff" ]; then
      emit_error "E-grammar" "$f filename stem $base != effective identity $eff"
    fi
    accepted=$(field_value "$f" "Accepted")
    adate=$(printf '%s' "$accepted" | sed -E 's/^([0-9]{4})-([0-9]{2})-([0-9]{2}).*/\1\2\3/')
    iddate=$(printf '%s' "$eff" | sed -E 's/^DEC-([0-9]{8})-.*/\1/')
    if [ -n "$adate" ] && [ -n "$iddate" ] && [ "$adate" != "$iddate" ]; then
      emit_error "E-grammar" "$f Accepted date $adate != ID date $iddate"
    fi
    printf '%s\t%s\n' "$eff" "$f" >>"$ID_MAP_FILE"
  fi

  # digest
  algo=$(field_value "$f" "Payload-Digest-Algorithm")
  want=$(field_value "$f" "Payload-Digest")
  got=""
  if ! got=$(compute_digest "$algo" "$ptmp"); then
    # capability missing for declared algorithm → not-run
    rm -f "$ptmp"
    printf 'ERROR E-grammar %s cannot compute Payload-Digest-Algorithm %s (not-run)\n' "$f" "$algo"
    printf 'decision-records: not-run\n'
    rm -f "$ID_MAP_FILE" "$JUDG_MAP_FILE" "$TAG_CITE_FILE"
    exit 2
  fi
  if [ -n "$want" ] && [ "$got" != "$want" ]; then
    emit_error "E-grammar" "$f Payload-Digest mismatch (tamper or edit after lock)"
  fi

  # prohibited locators in Evidence and Storage-Reference-*
  while IFS= read -r line; do
    case "$line" in
      Evidence:*)
        val=${line#Evidence:}
        val=$(printf '%s' "$val" | sed 's/^[[:space:]]*//')
        if prohibited_locator "$val"; then
          emit_error "E-grammar" "$f prohibited evidence locator: $val"
        fi
        # tag citations
        case "$val" in
          tag\ *)
            rest=${val#tag }
            tagpair=${rest%% *}
            case "$tagpair" in
              *@*) printf '%s\n' "$tagpair" >>"$TAG_CITE_FILE" ;;
            esac
            ;;
        esac
        ;;
      Storage-Reference-*:*)
        val=${line#*:}
        val=$(printf '%s' "$val" | sed 's/^[[:space:]]*//')
        case "$val" in
          n/a|unavailable|'') ;;
          *)
            if prohibited_locator "$val"; then
              emit_error "E-grammar" "$f prohibited storage reference: $val"
            fi
            ;;
        esac
        ;;
      Execution-Outcome:*)
        val=${line#Execution-Outcome:}
        val=$(printf '%s' "$val" | sed 's/^[[:space:]]*//')
        case "$val" in
          tag\ *)
            rest=${val#tag }
            tagpair=${rest%% *}
            # may be name@id with trailing note — first token
            case "$tagpair" in
              *@*) printf '%s\n' "$tagpair" >>"$TAG_CITE_FILE" ;;
            esac
            # if form is tag name@id more words, first word is name@id
            first=$(printf '%s' "$rest" | awk '{print $1}')
            case "$first" in
              *@*) printf '%s\n' "$first" >>"$TAG_CITE_FILE" ;;
            esac
            ;;
        esac
        ;;
    esac
  done <"$f"

  # E-spine: Scope citations
  if [ "$SPINE" -eq 1 ]; then
    scope=$(field_value "$f" "Scope")
    if [ "$scope" != "none" ] && [ -n "$scope" ]; then
      for tok in $scope; do
        case "$tok" in
          [A-Z]*-[0-9]*.[0-9]*)
            if ! printf '%s\n' "$KNOWN_IDS" | grep -qx "$tok"; then
              emit_error "E-spine" "$f Scope cites unknown id $tok"
            fi
            ;;
        esac
      done
    fi
  fi

  # collect judgment text for W-repeated-judgment (Human-Judgment block content)
  jtext=$(awk '
    /^Human-Judgment:/ {
      if ($0 ~ /^Human-Judgment:[[:space:]]*[^|]/ && $0 !~ /^Human-Judgment:[[:space:]]*$/) {
        sub(/^Human-Judgment:[[:space:]]*/, "")
        print
        next
      }
      collecting=1
      next
    }
    collecting {
      if ($0 ~ /^\|/) {
        sub(/^\|[[:space:]]?/, "")
        print
      } else {
        exit
      }
    }
  ' "$f" | tr -d '\r' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
  case "$jtext" in
    '[[withheld — see envelope]]'|merge|pr|discard|block|yes|no|'') ;;
    *)
      # normalize single line
      jnorm=$(printf '%s' "$jtext" | tr '\n' ' ' | sed -e 's/[[:space:]]\+/ /g' -e 's/^ //' -e 's/ $//')
      if [ -n "$jnorm" ]; then
        printf '%s\t%s\n' "$jnorm" "$eff" >>"$JUDG_MAP_FILE"
      fi
      ;;
  esac

  rm -f "$ptmp"
}

for f in $RECORDS; do
  [ -z "$f" ] && continue
  validate_record "$f"
done

# --- E-dup -----------------------------------------------------------------
DUP_TMP=$(mktemp 2>/dev/null || mktemp -t drecdup)
cut -f1 "$ID_MAP_FILE" 2>/dev/null | sort | uniq -c >"$DUP_TMP" || true
while read -r cnt id; do
  [ -z "${id:-}" ] && continue
  if [ "$cnt" -gt 1 ]; then
    files=$(awk -F'\t' -v i="$id" '$1==i {print $2}' "$ID_MAP_FILE" | tr '\n' ' ')
    emit_error "E-dup" "effective identity $id defined by multiple files: $files"
  fi
done <"$DUP_TMP"
rm -f "$DUP_TMP"

# --- supersession bidirectionality ----------------------------------------
# collect Supersedes and Superseded-by
SUP_FROM=$(mktemp 2>/dev/null || mktemp -t drecsupf)
SUP_BY=$(mktemp 2>/dev/null || mktemp -t drecsupb)
: >"$SUP_FROM"
: >"$SUP_BY"
for f in $RECORDS; do
  [ -z "$f" ] && continue
  eff=$(effective_id_of "$f")
  # count Supersedes lines
  nsup=$(grep -c '^Supersedes:' "$f" 2>/dev/null || true)
  nsup=${nsup:-0}
  if [ "$nsup" -gt 1 ]; then
    emit_error "E-grammar" "$f has multiple Supersedes: lines"
  fi
  nby=$(grep -c '^Superseded-by:' "$f" 2>/dev/null || true)
  nby=${nby:-0}
  if [ "$nby" -gt 1 ]; then
    emit_error "E-grammar" "$f has multiple Superseded-by: lines"
  fi
  if grep -q '^Supersedes:' "$f"; then
    old=$(field_value "$f" "Supersedes")
    printf '%s\t%s\t%s\n' "$old" "$eff" "$f" >>"$SUP_FROM"
  fi
  if grep -q '^Superseded-by:' "$f"; then
    new=$(field_value "$f" "Superseded-by")
    printf '%s\t%s\t%s\n' "$eff" "$new" "$f" >>"$SUP_BY"
  fi
done

# each Supersedes A must have A with Superseded-by pointing back
while IFS= read -r line; do
  [ -z "$line" ] && continue
  old=$(printf '%s' "$line" | cut -f1)
  new=$(printf '%s' "$line" | cut -f2)
  if ! awk -F'\t' -v o="$old" -v n="$new" '$1==o && $2==n {found=1} END{exit !found}' "$SUP_BY"; then
    emit_error "E-grammar" "Supersedes $old -> $new lacks bidirectional Superseded-by on $old"
  fi
done <"$SUP_FROM"

while IFS= read -r line; do
  [ -z "$line" ] && continue
  old=$(printf '%s' "$line" | cut -f1)
  new=$(printf '%s' "$line" | cut -f2)
  if ! awk -F'\t' -v o="$old" -v n="$new" '$1==o && $2==n {found=1} END{exit !found}' "$SUP_FROM"; then
    emit_error "E-grammar" "Superseded-by $old -> $new lacks bidirectional Supersedes on $new"
  fi
done <"$SUP_BY"

# at most one Supersedes targeting any id
cut -f1 "$SUP_FROM" 2>/dev/null | sort | uniq -c | while read -r cnt id; do
  :
done
# portable
SUP_CNT=$(mktemp 2>/dev/null || mktemp -t drecsupc)
cut -f1 "$SUP_FROM" 2>/dev/null | sort | uniq -c >"$SUP_CNT" || true
while read -r cnt id; do
  [ -z "${id:-}" ] && continue
  if [ "$cnt" -gt 1 ]; then
    emit_error "E-grammar" "multiple records Supersedes: $id"
  fi
done <"$SUP_CNT"
rm -f "$SUP_CNT" "$SUP_FROM" "$SUP_BY"

# --- W-repeated-judgment ---------------------------------------------------
if [ -s "$JUDG_MAP_FILE" ]; then
  cut -f1 "$JUDG_MAP_FILE" | sort | uniq -c | while read -r cnt text; do
    :
  done
  RJ=$(mktemp 2>/dev/null || mktemp -t drecj)
  cut -f1 "$JUDG_MAP_FILE" | sort | uniq -c >"$RJ" || true
  while read -r cnt jnorm; do
    [ -z "${jnorm:-}" ] && continue
    # uniq -c pads; reconstruct: first field count, rest is key — but key may have spaces
    # We stored single-line norms; use awk on JUDG_MAP_FILE instead
    :
  done <"$RJ"
  rm -f "$RJ"
  # better approach:
  awk -F'\t' '
    { c[$1]++; ids[$1]=ids[$1] " " $2 }
    END {
      for (k in c) if (c[k] >= 3) print c[k] "\t" k "\t" ids[k]
    }
  ' "$JUDG_MAP_FILE" | while IFS= read -r line; do
    cnt=$(printf '%s' "$line" | cut -f1)
    ids=$(printf '%s' "$line" | cut -f3-)
    emit_warn "W-repeated-judgment" "≥3 byte-identical judgment elements:$ids"
  done
fi

# --- W-uncited-tag ---------------------------------------------------------
# Build visible tags
VISIBLE=$(mktemp 2>/dev/null || mktemp -t drecvtag)
: >"$VISIBLE"
# If DREC_VISIBLE_TAGS is set (even to empty), use it — test seam for DREC-11.15.
if [ "${DREC_VISIBLE_TAGS+set}" = set ]; then
  if [ -n "$DREC_VISIBLE_TAGS" ]; then
    printf '%s\n' "$DREC_VISIBLE_TAGS" >"$VISIBLE"
  fi
else
  if command -v git >/dev/null 2>&1; then
    tags=$(git -C "$ROOT" tag -l 2>/dev/null || true)
    if [ -n "$tags" ]; then
      for t in $tags; do
        oid=$(git -C "$ROOT" rev-parse "$t^{}" 2>/dev/null || git -C "$ROOT" rev-parse "$t" 2>/dev/null || true)
        if [ -n "$oid" ]; then
          printf '%s@%s\n' "$t" "$oid" >>"$VISIBLE"
        fi
      done
    fi
  fi
fi

# baseline from anchor
BASELINE=$(mktemp 2>/dev/null || mktemp -t drecbase)
: >"$BASELINE"
if [ "$n_anchors" -eq 1 ]; then
  for af in $ANCHORS; do
    [ -z "$af" ] && continue
    awk '
      /^Baseline-Tag:/ {
        sub(/^Baseline-Tag:[[:space:]]*/, "")
        print
      }
    ' "$af" >>"$BASELINE"
  done
fi

# candidate = visible name absent from baseline OR object id differs
# no-op if visible empty while baseline non-empty (DREC-11.15)
vis_count=$(grep -c . "$VISIBLE" 2>/dev/null || true)
vis_count=${vis_count:-0}
base_count=$(grep -c . "$BASELINE" 2>/dev/null || true)
base_count=${base_count:-0}

if [ "$vis_count" -eq 0 ] && [ "$base_count" -gt 0 ]; then
  : # no-op W-uncited-tag
elif [ "$n_records" -gt 0 ] && [ "$n_anchors" -eq 1 ]; then
  while IFS= read -r vpair; do
    [ -z "$vpair" ] && continue
    vname=${vpair%@*}
    void=${vpair#*@}
    # cited if any citation matches both halves
    cited=0
    if grep -qx "$vpair" "$TAG_CITE_FILE" 2>/dev/null; then
      cited=1
    fi
    # baseline match?
    in_base=0
    base_oid=""
    while IFS= read -r bpair; do
      [ -z "$bpair" ] && continue
      bname=${bpair%@*}
      boid=${bpair#*@}
      if [ "$bname" = "$vname" ]; then
        in_base=1
        base_oid=$boid
      fi
    done <"$BASELINE"
    candidate=0
    if [ "$in_base" -eq 0 ]; then
      candidate=1
    elif [ "$base_oid" != "$void" ]; then
      candidate=1
    fi
    if [ "$candidate" -eq 1 ] && [ "$cited" -eq 0 ]; then
      emit_warn "W-uncited-tag" "tag $vpair absent from or changed since the adoption baseline"
    fi
  done <"$VISIBLE"
fi

rm -f "$ID_MAP_FILE" "$JUDG_MAP_FILE" "$TAG_CITE_FILE" "$VISIBLE" "$BASELINE"

printf 'decision-records: %s errors · %s warnings\n' "$ERR_COUNT" "$WARN_COUNT"

if [ "$ERR_COUNT" -gt 0 ]; then
  exit 1
fi
exit 0
