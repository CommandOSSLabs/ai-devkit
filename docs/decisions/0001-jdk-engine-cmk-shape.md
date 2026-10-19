# 0001 — The kit takes the Engineer Pack's behavior in cmk's shape

- **Status**: Accepted
- **Date**: 2026-10-19

## Context

Two skill kits cover the same lifecycle. This kit (`cmk:*`) is documentation-first and
tracker-first. Its delivery pipeline runs with no human gates, and implementation is
delegated to an external execution engine. The Engineer Pack (`jdk`, `jayden-dang/skills`)
covers the same ground with more of it under test:

- a spec triad per feature with requirement IDs and a feature catalog;
- a closed ticket workflow of ten states and five entry commands;
- its own build engine;
- ship-time guards backed by scripts;
- RED/GREEN evidence for every skill.

Teams installing both get two competing copies of each step. They get two docs layouts, two
ticket vocabularies, and twice the description tokens. The kits disagree on five
points:

- where feature specs live;
- whether unshaped work may be built unattended;
- how many skills a repo pays for by default;
- how long a `SKILL.md` may be;
- how one skill points at another's files.

## Decision

We replace the overlapping behavior of this kit with the Engineer Pack's behavior. Skill
names, layout, conventions and distribution stay this kit's.

1. **Names and layout.** Every ported skill becomes a flat `skills/<name>/` with
   `name: cmk:<name>` and detail in `references/`. Names follow this kit's topic style.
   Where an existing skill does the same job, its name is kept (`cmk:requirements`,
   `cmk:design`, `cmk:delivery-ship`, …). The Engineer Pack's names do not survive.
2. **Behavior.** The ported body replaces the overlapping body. A behavior this kit has and
   the Engineer Pack lacks is merged into the ported skill, never dropped.
3. **Docs layout (hybrid).**
   - Feature specs use the triad `docs/specs/<date>-<feature>/{requirements,design,tasks}.md`,
     with `tasks.md` committed, plus the catalog under `docs/specs/catalog/`.
   - Everything else keeps this kit's paths:
     - decisions in `docs/decisions/`;
     - the glossary in `docs/requirements/glossary.md`;
     - product vision in `docs/requirements/`;
     - architecture invariants in `docs/design/system.md`;
     - rules in `docs/rules/`.
   - Per-repo agent configuration lives in `docs/agents/`.
   - A spec's `Status:` line is a lifecycle state of the document, not tracker progress.
4. **Autonomy by scope band.** An unshaped ticket in band `trivial` or `patch` may be
   planned and built unattended, with its decisions listed at the top of the pull request.
   A `feature` needs an approved spec. Without one, it goes back to Shaping.
5. **Core and packs.** About fifty skills form the default core. Roadmap, acceptance and UI,
   incident, maintainer and extra skills ship as packs a repo opts into. Personal-life
   skills stay out of this kit.
6. **Size by ratchet.** A ported `SKILL.md` keeps its current length. A recorded budget
   stops it from growing. The 150-line target is reached by later, tested trims.
7. **Self-contained packages.** No `../` paths. A skill names another as `cmk:<name>`, and a
   shared file as `cmk:<name>`'s `references/<file>`. Scripts live in the calling skill's
   `scripts/`.

## Alternatives Considered

- **Keep this kit's docs tree for features.** Specs would go in
  `docs/requirements/<topic>.md` and `docs/design/<topic>.md`, with plans as scratch.
  Rejected: the board, ship guard, owner notice, catalog and eligibility checks all read
  the triad. Rewriting them would discard their test evidence.
- **Adopt the Engineer Pack's tree wholesale** (`docs/adr/`, `CONTEXT.md`,
  `docs/product/`). Rejected: every repo already on this kit would have to move its
  decisions and glossary, and nothing would be gained by it.
- **Always build unattended, or never build unshaped work.** Rejected. The first lets an
  agent decide a feature's scope alone. The second makes a one-line fix wait for a
  spec approval.
- **Raise the size ceiling to 300 lines, or trim everything during the move.** Rejected.
  The first gives up this kit's budget. The second adds about thirty untested rewrites
  to a migration that is already large.

## Consequences

- Easier: one vocabulary and one docs layout per repo. Every step has recorded RED/GREEN
  evidence. Ticket state is on the board and readable by people and agents.
- Harder: repos that vendored this kit get a major upgrade. Their local adaptations must
  follow renamed and merged skills through `cmk:sync`. The lint and the explorer must
  understand scripts, tests and the ratchet.
- Committed to: a 2.0.0 release with a migrations list, and a test fixture that runs this
  kit's skills on GitHub and on Linear.
- Not done: no personal-life skills. The Engineer Pack's per-vendor plugin manifests are not
  carried over; this kit's vendor adapters cover them. Its execution engine is not kept
  alongside an external one; `superpowers` is no longer required.

## Links

- Shapes: [`../design/sdl-phases.md`](../design/sdl-phases.md), which is rewritten to the
  closed workflow when the delivery skills move.
- Constrains: every skill under `skills/`, `scripts/skill-lint.sh`, and the explorer's
  category map.
