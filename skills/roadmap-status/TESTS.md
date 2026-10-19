<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# TESTS.md — cmk:roadmap-status

## 2026-10-14 — R11 covers S8 (1.1.0 → 1.2.0)

Template sync from cmk:roadmap 1.2.0: the roadmap gained the `After:` item-order
field and structural rule `S8` (a dangling or self `After:` target, or a cycle).
`R11` now names `S8`, so this check withholds its next action on a cyclic or
dangling `After:`. RED/GREEN evidence for the field itself is in cmk:roadmap'
TESTS.md (2026-10-14); nothing in this skill's own text changed except the rule
range `S1`–`S8`.

## 2026-10-19 — Notion drafts pass (1.2.0 → 1.3.0), plan T3c

Roster: haiku and sonnet, headless (`skill-fixtures/run-headless.sh` with `FIXTURE_MCP`).
`mcp/fake-mcp.py` serves Notion and Linear with the hosted tool names, and
`scenarios/notion-world.py` seeds two Notion workspaces. `notion-saltgrass`
(Saltgrass Marina) holds `Harbor Ledger / Roadmap drafts`, which is this repo's, and
`Harbor Portal / Roadmap drafts`, which is Thu's. `notion-klynt` (Klynt Labs) holds
`Ledger / Roadmap drafts`. Linear has teams `LED` and `POR`. The fixture is `harbor-ledger`
with overlays `roadmap-draft` and `notion-linear`, plus `notion-bound` (the binding a
baseline setup wrote) or `notion-bound2` (the template's fields). Scored by
`scenarios/notion-score.py` from the server state files and `mcp-calls.jsonl`, never from
the reply. Full record: `docs/design/2026-10-19-notion-draft-surface.md`.

**RED (1.2.0), variant `inreview`.** MILE-2 is `In review`. Quang's comment on the page
says: "Drop that phrase or split refunds out, then I'll sign." The prompt asks which drafts
are waiting on Quang and whether anything is holding them up.
- **Unbound repo:** 0/2 runs opened Notion at all.
- **Bound repo:** 6/7 runs fetched the table and never read a comment. The 7 are the
  baseline binding 1/3 and the template binding 0/4. Verbatim (haiku): "Not in the repo.
  … The only thing holding it is Quang's review."

**GREEN (1.3.0).** Pass 7 runs only when Draft surface is `notion`. It fetches the data
source, reads `notion-get-comments` on every row not yet signed off, and writes one `draft`
line per row with the sign-off role's newest comment quoted verbatim.

| | haiku | sonnet |
|---|---|---|
| `notion-get-comments` on MILE-2 | 3/3 | 1/1 |
| Quang's comment quoted | 3/3 | 1/1 |
| Harbor Portal's `In review` row reported | 0/3 | 0/1 |
