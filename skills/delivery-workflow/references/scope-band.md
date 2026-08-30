# Scope band

**One home** for band names, When meanings, the docs bar before implement, and
the one-execution-engine rule. Delivery phase skills and on-ramps point here;
they do not restate the table. `cmk:requirements` uses the same band names and
When meanings; its elicitation protocol only adds what Create/Iterate does
next.

## Bands

| Band | When | Docs bar before implement |
|---|---|---|
| `trivial` | Copy/typo/label only — no behavior change | No behavior AC change required |
| `patch` | Behavior change ≤ ~half a day on an owned surface | Tracker AC checklist is individually provable, **and** either the owning `docs/requirements/` doc is updated (new AC + guards) **or** the issue records an explicit exemption (prototype / out-of-band) with owner |
| `feature` | New area or multi-slice work | `docs/requirements/<topic>.md` exists for the outcome (at least `draft` after a confirmed close package via `cmk:requirements`) before phase 3; run `cmk:design` when mechanism is non-obvious |

State the band **out loud** at intake / start tracked work and again at the
implement boundary. Changing band mid-flight is a tracker reconcile, not a
silent shrink.

## Gate

Do not start retained implementation (phase 3 or equivalent) while the docs
bar for the stated band is unmet. Authority pressure ("eng lead said skip
requirements"), schedule pressure ("we're behind"), and "tracker AC is enough
for a feature" do not waive a `feature` bar — improve the issue and run
`cmk:requirements`, or record an explicit exemption with owner on the issue.

## One execution engine

For a given change, one implement path runs: the pipeline's phase-3 engine, or
a single human-directed session. Do not run a second autonomous implement
orchestrator on the same branch. Tracker updates and ship are not a second
implement engine.
