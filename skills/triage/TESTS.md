<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->

## 1.1.0 — an unconfirmed bug goes to `shaping` (2026-10-19), closed workflow W10

Found by the klynt dogfood, W9. `/cmk:triage` put #242 ("Soft-deleted users stay
authenticated on existing sessions") into `ready-for-agent` with a brief, and the brief
itself said the fix needs a root-cause investigation first. `/cmk:go` and `/cmk:board` count a
ticket as Ready only once its spec is approved, so #242 sat in Ready and nothing could
build it. The owner chose to send such bugs to Shaping, where `/cmk:shape` runs `cmk:debug`
and writes the tier-1 mini-spec (option A).

**RED (1.0.0), on the real klynt board, read-only.** The run used the sandbox clone and
`/tmp/klynt-dogfood/bin/gh`: reads go to GitHub and writes are logged. Prompt:
"/cmk:triage #242 — re-triage it from scratch as if it were new … Recommend its state; do not
change the tracker."
- The original W9 run (sonnet): `ready-for-agent`.
- Re-runs: haiku `ready-for-agent`, haiku `ready-for-human`, sonnet `ready-for-agent`.

That is 3 of 4 runs recommending `ready-for-agent` for a bug whose cause was still open.

A fixture probe did not reproduce the failure: on harbor-ledger, #28 is a same-day booking
that cannot be invoiced, and triage gave `needs-info` or `ready-for-human` 3/3. That fix
turns on a pricing decision, so the probe cannot show this failure.

**GREEN (1.1.0).** `shaping` is a state triage may choose: "a confirmed bug whose root cause
is not yet established", with the brief marking the cause as open and naming `/cmk:shape #N`.
On the same re-triage, all 3 runs (2 haiku, 1 sonnet) recommended `status:shaping` and
said to remove `ready-for-agent`. 0 writes reached GitHub.


## Smoke after the cmk rename (2026-10-19)

skill-tester-haiku on harbor-ledger with the GitHub board (`KIT=cmk`, all skills): **PASS** — `/cmk:triage #27` (one-line report): searched src/docs, no PDF code; recommended `bug` + `needs-info` with four questions and waited — no tracker write before direction.
