# Architecture: <Project Name>

Status: Draft
Date: <YYYY-MM-DD>

<!--
The architecture spine: the small set of INVARIANTS that keep independently-built
features consistent — not a diagram doc. Optional. Each invariant is a bold
**ARCH-N** ID plus ONE imperative sentence (the rule). Feature design.md files cite
the ones they rely on as `Respects: ARCH-N`, and the `cmk:traceability` check verifies those
citations point at a live invariant.

Rules:
- ID grammar: **ARCH-<n>**, flat and repo-wide (unique forever, never reuse).
- One rule per invariant. If it needs "and", it is usually two invariants.
- IDs are immutable once relied upon. Retire by strikethrough, never renumber.
  Example form (do NOT use a real struck **ARCH-N** token in comments — it pollutes
  the retired-set grep): write "struck ARCH-N superseded by ARCH-M" in prose only.
  The `cmk:traceability` check treats a struck invariant as retired — a design still citing it
  surfaces as an error.
- Large project? Split invariants into per-domain files (`docs/design/<domain>.md`)
  and list them under "Domains" below; the ARCH-N namespace stays flat across files.
-->

## Invariants

- **ARCH-1** <One imperative rule every feature must respect — e.g. "All
  cross-module calls go through the event bus; no direct imports across modules.">
- **ARCH-2** <...>

## Domains

<For small projects: `None` (all invariants live above). For large projects: one
line per domain file, e.g. `- Persistence — ./persistence.md (ARCH-4, ARCH-5)`.>
