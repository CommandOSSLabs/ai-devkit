<!-- Ported from jdk `inspect-invariants` 2.0.0 (ADR 0001). -->
# Inspect Invariants

Judge whether a design (or a diff) honors the architecture invariants it relies on.

This is the **semantic** counterpart to `cmk:traceability`. `cmk:traceability` checks that a
`Respects: ARCH-N` citation points at a live invariant — existence and liveness,
deterministically, by `grep`. It never reads whether the design *actually* respects
the rule. That judgment is this skill's job, and because it is a judgment it is
**advisory**: its verdicts inform review, they are never a hard merge gate.

## When there is nothing to check

If `docs/design/` does not exist, there is no spine — say so once and stop.
This skill only runs where a project has opted into the architecture layer.

## Inputs

- The **architecture spine**: `docs/design/system.md` (+ any
  `docs/design/<domain>.md`). Read the invariants — each is a bold `**ARCH-N**`
  ID and one imperative rule. A struck-through `~~**ARCH-N**~~` is retired; ignore it.
- The **subject**: a feature `design.md`, or a diff (`git diff <base>...HEAD`). Collect
  its `Respects: ARCH-N` citations; for a diff, also weigh invariants the changed code
  plainly touches even if uncited.

## The judgment

For each cited invariant (and each clearly-relevant uncited one), read the rule, read
what the design/diff does, and return one verdict:

| Verdict | Meaning |
|---|---|
| **respects** | The design is consistent with the invariant. |
| **violates** | The design does something the invariant forbids, or omits something it requires. |
| **unclear** | The design neither clearly honors nor clearly breaks it — a human should look. |

Every verdict carries a one-line rationale naming the invariant and the concrete spot
(a design section, a file, a hunk). Do not restate the invariant as its own rationale.

## Output

```
inspect-invariants (3 citations, spine: docs/design/system.md)
  violates ARCH-2  design.md §Cross-module sync calls the persistence module directly (invariant: only via the event bus)
  respects ARCH-4  every write goes through the migration guard
  unclear  ARCH-5  can't tell from the design whether the cache is invalidated on write
```

Report all verdicts; do not drop `unclear` ones — they are the point. This skill
returns findings, never a pass/fail. The caller (`cmk:delivery-review`, `cmk:delivery-build`'s `references/continuous.md`,
`cmk:vision`) decides what to do with a `violates`.
