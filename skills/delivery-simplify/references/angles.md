# Simplify angles (Claude Code `/simplify` contract)

Source of truth for the four cleanup angles and the apply/skip rules.
Ported from Claude Code **2.1.227** built-in `/simplify` (bundled slash
command in the binary — **not** the marketplace `code-simplifier` agent).

Quality only. Correctness bugs are out of scope; that is phase 4 /
`cmk:delivery-review` / a dedicated code-review pass.

## Phase 0 — Gather the diff

Run `git diff @{upstream}...HEAD` (or `git diff main...HEAD` /
`git diff HEAD~1` if there is no upstream) to get the unified diff under
review. If there are uncommitted changes, or the range diff is empty, also
run `git diff HEAD` and include the working-tree changes in scope — the
pass often runs before a final commit. If a PR number, branch name, or file
path was passed as an argument, review that target instead. Treat this
diff as the review scope.

## Phase 1 — Four angles

Each finding carries `file`, `line`, a one-line `summary`, and the concrete
cost (what is duplicated, wasted, or harder to maintain).

### Reuse

Flag new code that re-implements something the codebase already has — Grep
shared/utility modules and files adjacent to the change, and name the
existing helper to call instead.

### Simplification

Flag unnecessary complexity the diff adds: redundant or derivable state,
copy-paste with slight variation, deep nesting, dead code left behind. Name
the simpler form that does the same job.

### Efficiency

Flag wasted work the diff introduces: redundant computation or repeated I/O,
independent operations run sequentially, blocking work added to startup or
hot paths. Also flag long-lived objects built from closures or captured
environments — they keep the entire enclosing scope alive for the object's
lifetime (a memory leak when that scope holds large values); prefer a
class/struct that copies only the fields it needs. Name the cheaper
alternative.

### Altitude

Check that each change is implemented at the right depth, not as a fragile
bandaid. Special cases layered on shared infrastructure are a sign the fix
isn't deep enough — prefer generalizing the underlying mechanism over adding
special cases.

## Phase 2 — Apply the fixes

Dedup findings that point at the same line or mechanism, and fix each
remaining one directly. **Skip** any finding whose fix would:

- change intended behavior,
- require changes well outside the reviewed diff, or
- that you judge to be a false positive

— note the skip rather than arguing with it. Finish with a brief summary of
what was fixed and what was skipped (or confirm the code was already clean).

When the pass ran as a single-pass (no agent fan-out), the summary must say
so explicitly so later readers are not misled about what ran.

## Engines

| Engine | When |
|---|---|
| **Fan-out** | Runtime can spawn concurrent agents: four angle workers in one dispatch, then apply |
| **Single-pass** | No fan-out tool: one worker walks all four angles in one context, then apply |

Both engines use the same Phase 0, angles, and Phase 2 rules.
