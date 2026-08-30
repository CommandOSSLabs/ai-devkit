# 2026-08-28 — author-skills wording & quality pass (CMK skills)

Immutable point-in-time record of the pack-wide remediation against
`author-skills` (Ship checklist + Vocabulary + Influence).

## Scope

All 34 skills under `skills/`, on branch `upgrade/cmk-standard-ceremony`.
Subagent model roster: **grok-4.5 only**.

## What landed

1. **skill-lint green** — fixed oversized `delivery-pipeline` /
   `delivery-review` / `delivery-spec-plan`; fixed dangling
   `delivery-pipeline` attribution of `scope-band.md` (owned by
   `delivery-workflow`); extracted review lenses to
   `skills/delivery-review/references/lenses.md`.
2. **Description house form** — 33 model-invocable skills now open with
   `Use when…` (was `This skill should be used when…`). `cmk:interpret`
   remains one plain human-facing line (`disable-model-invocation: true`).
   Trimmed outcome-heavy descriptions on `requirements`, `delivery-simplify`,
   `delivery-spec-plan`, `repo-setup`. Documented the opener in
   `docs/ai/skills/conventions.md`.
3. **Reference TOC** — `## Contents` added to 12 refs over ~100 lines
   (cicd ×3, delivery-pipeline ×2, discover-efforts, docs scaffold-manifest,
   local-stack ×2, requirements ×2, toolchain).
4. **Hierarchy** — `codebase-docs` slimmed to pointers +
   `references/{bootstrap,update,doc-shape,working-example,failure-modes}`;
   `rule` Audit/Gate moved to `references/audit.md` + `references/gate.md`.
5. **Gate wording + evidence (priority three)** — RED baselines on grok-4.5
   failed without the skill for `delivery-ship`, `delivery-review`,
   `sui-sdk`; GREEN wording added Red Flags / rationalization rows named
   from those failures; `TESTS.md` recorded under each skill.

## Explicitly still open

- Most skills still lack `TESTS.md` / `eval.json` (Iron Law evidence).
- Pack-wide verb-first renaming (`design` → verb, etc.) not done — topic
  names remain CMK packaging convention.
- Full RED→GREEN for every gate skill beyond the three priority ones.
- Description trigger micro-tests not re-run pack-wide after the opener
  rewrite (mechanical opener change; spot-checked via existing
  `requirements` routing notes + gate GREEN runs).

## Lint

`./scripts/skill-lint.sh` — OK after this pass.
