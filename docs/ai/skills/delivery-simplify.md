# cmk:delivery-simplify

## What
Behavior-preserving quality cleanup of a branch diff — reuse,
simplification, efficiency, and altitude — then apply safe fixes. Port of
Claude Code's built-in `/simplify`. Phase 3b of `cmk:delivery-pipeline`
(after implement, before review), or standalone polish.

## Approach
Four angles only (Reuse, Simplification, Efficiency, Altitude); quality
only, never a correctness hunt. Fan-out preferred (one worker per angle),
single-pass fallback. Apply only on own work; teammate PRs are report-only
unless explicitly asked. Scope is the Phase 0 diff; behavior-preserving
fixes only. Verification must stay green before handing to phase 4.

## Where
- Skill body: `skills/delivery-simplify/SKILL.md`
- `references/angles.md` — angle mandates and apply/skip rules
- Pipeline wiring: `skills/delivery-pipeline/references/phase-3b-simplify.md`

## Links
Invoked by `cmk:delivery-pipeline` as phase 3b; judged afterward by
`cmk:delivery-review` (review does not re-apply simplify).
