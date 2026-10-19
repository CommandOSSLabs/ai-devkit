# Quality debt ledger

Written by `cmk:debt`. Every row is a finding that was **judged real and consciously
left unfixed**, with the reason it was deferred. Observations nobody evaluated do not
belong here; neither do Critical or Important review findings, which are fixed before
merge rather than banked.

`cmk:milestone-review`, `cmk:release`, and `cmk:roadmap` read the open rows.

**ID rules** — same grammar as `ARCH-N` and `GOAL-N`: `**DEBT-N**` is bold, flat, and
repo-wide. Never renumber, never reuse. Retire by strikethrough with a reason
(`~~**DEBT-3**~~ fixed in a1b2c3d`), never by deletion.

---

## Open

<!-- newest first; every slot filled or `Unknown` -->

### **DEBT-1** `<path>` — <one-line finding>

- **Found:** `<YYYY-MM-DD>` · `<pass that found it>` on `<branch or range>`
- **Cost:** <what this makes harder or riskier, concretely>
- **Deferred because:** <the actual reason at the time>
- **Fix shape:** <one line on what fixing it looks like | Unknown>
- **Ticket:** `<tracker ID | none>`
- **Status:** `open`

---

## Closed

<!-- struck IDs stay here forever; this is how a reader learns the debt was paid -->

- ~~**DEBT-0**~~ example — <fixed in `<sha>` | obsolete — one line>
