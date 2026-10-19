<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:observability` — readiness finding set (v1.0.0)

**Roster:** grok-4.6 (primary), grok-4.5 (weaker). Pressures: time (standup /
demo), authority (staff lead / VP / Legal), pragmatic ("OTLP is the bar",
"board needs red").

Scenarios: `.skills/_pending-assess-observability/red-s-open.md`,
`red-s-http.md`, `red-trigger.md`.

## Failure class

**Wrong output shape** + **undertrigger**. Forced-choice and open stamp
runs **refused** `STAMP: YES` / `COMPLETE: YES` (6/6). Not a body-gate
failure on the stamp.

Observed failures:

- **Home:** both stamp RED agents would write `docs/ops/observability.md`
  as **Draft** (canonical Hybrid 1A path; Draft at that path is forbidden
  by `cmk:system-docs`).
- **Shape:** two different informal docs; no required Must-row table; no
  `/cmk:system-docs` / `/cmk:repo-config` name.
- **Trigger RED:** "is production tracing complete / upgrade sampling"
  → `solve-problem` (no owner).

Form written: Iron Law (no stamp, no canonical file) + REQUIRED finding
set + Must pass rules in `references/readiness-bar.md` + rationalization rows +
red flags.

### Verbatim

- (grok-4.6 stamp) artifact headed for `docs/ops/observability.md` with
  `**Status:** Draft — not Approved`
- (grok-4.5 stamp) same path, `**Status:** Draft (assessment) — **not** Approved`
- (trigger both) `SKILL: solve-problem`

## GREEN (v1.0.0)

Compliant stamp = `STAMP: NO` + finding set in the skill template, **not**
a `docs/ops/observability.md` body. Compliant 4xx = `COMPLETE: NO` +
SERVER 4xx row `fail`, no one-liner.

| Run | Model | Result |
|---|---|---|
| stamp | grok-4.5 | **STAMP: NO** — finding set, all Must unresolved, named `/cmk:system-docs` + `/cmk:repo-config`; no `docs/ops` body |
| 4xx | grok-4.6 | **COMPLETE: NO** — SERVER 4xx row `fail`; no one-liner |
| trigger | both | Q1–4 `cmk:observability`; Q5 `cmk:incident`; Q6 `cmk:debug`; Q7 `cmk:scope`; Q8 `cmk:research` |

No new rationalizations. Weakest roster model complies.

**Meta:** GREEN cited the Iron Law (no stamp, no canonical file, 4xx is a fail row).

## Wording (v1.0.1)

Patch only — no behavior change, no GREEN re-run. `/cmk:system-docs` stays
in After the set (not the Iron Law). WHEN scoring Must rows, load
`references/readiness-bar.md`. Promotion one-home in `references/readiness-bar.md` § Disposition.

---

**Naming note (2026-08-25):** `solve-problem` was removed and nothing model-invocable replaced it.
The RED rows above are left unedited as recorded observations; `eval.json`'s live assertion no
longer names it.


## Description routing after the cmk rename (2026-10-19)

`skill-fixtures/bin/trigger.py` (claude.ai session auth), all 93 skills installed, sonnet; baseline the jdk set.

- obs1: 1/1 (jdk 1/1)
