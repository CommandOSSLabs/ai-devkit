# cmk:trace-audit

## What

The vertical layer of the docs tree: a mechanical check that acceptance-criterion
IDs, the design documents citing them, and the capability registry still agree.
Runs standalone on request, and as the docs check inside `cmk:delivery-review`
and `cmk:delivery-ship`.

## Approach

Not a discipline — a fixed sequence of text-search passes with a fixed rule on
their output, so two runs over one tree agree. Reads only
`docs/requirements/**`, `docs/design/**`, and `docs/capabilities/INDEX.md`;
never source, tests, commits, or the tracker. Reports referential integrity
only (E1–E4 errors, W1–W3 warnings) and never judges whether a design section
genuinely satisfies the criterion it cites — that reading belongs to
`cmk:delivery-review`, and excluding it is what keeps this pass deterministic.
An ID retired by strikethrough counts as undefined, so every design section
still citing it surfaces as E1: retirement cannot be done quietly. A clean run
reports `no findings` explicitly, because a silent pass is indistinguishable
from a skipped one.

## Where

- Skill body: `skills/trace-audit/SKILL.md`
- Passes and finding rules: `skills/trace-audit/references/passes.md`
- Pressure-test record: `skills/trace-audit/TESTS.md`
