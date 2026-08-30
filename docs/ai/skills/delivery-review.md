# cmk:delivery-review

## What
One review contract for two occasions — pre-ship (own work, before a PR
exists: findings fixed or deferred) and standalone (an existing PR or
someone else's diff: findings reported to one surface) — at three depths
(quick, targeted, full), covering seven review lenses with a mandatory
evidence bar and adversarial verification before any finding is acted on.
Phase 4 of `cmk:delivery-pipeline`.

## Approach
Depth is adaptive by default (size, blast radius, subsystem) but binding
once stated, and every verdict discloses the depth reached. The seven
lenses are correctness, spec/design/requirements/AC compliance, code
quality, cross-surface consistency, edge cases, security, and production
readiness. Every lens writes `file:line` findings plus a "what I read / ran
/ checked" evidence trail — a review with no findings and no evidence trail
is a failed review. Findings are adversarially verified (the
`cmk-delivery-verifier` role) before disposition: fix now, rescope the
criterion, defer with a tracker issue, or discard with a reason.

## Where
- Skill body: `skills/delivery-review/SKILL.md` — sections Review depth,
  The two occasions, The lenses, Evidence or it did not happen, Verify
  before acting, Disposition.
- `references/engines.md` — choosing or running a review engine at full
  depth.
- `references/linear.md` — the skill body's conditional tracker-binding
  pointer resolves here.

## Links
Gates `cmk:delivery-ship`; disposition and rescoping follow
`cmk:delivery-workflow`'s `references/acceptance-criteria.md`; the
production-readiness lens audits against `cmk:delivery-pipeline`'s
`references/engineering-principles.md`.
