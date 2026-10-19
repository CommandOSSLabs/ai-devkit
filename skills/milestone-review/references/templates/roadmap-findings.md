# Roadmap findings — R1–R11 and the withholding set

Authoritative. Read by `cmk:roadmap-status`, which reports these findings, and by
`cmk:milestone-review`, which evaluates the withholding subset as a precondition before it
judges a milestone's outcome. Do not restate these rules in either skill body — one
statement, two readers.

Resolve this file in this order, first path that exists: (1) `references/templates/roadmap-findings.md`
beside the reading SKILL.md, (2) `${CLAUDE_PLUGIN_ROOT}/templates/roadmap-findings.md` when
that variable is set, (3) `references/templates/roadmap-findings.md` relative to the reading
SKILL.md.

<!--
Not a seed. Unlike the other files in this directory, nothing copies this one into a
consumer repo — `cmk:repo-config` and `cmk:vision` name the template files they write
individually and never glob. It sits here because `templates/` is this set's only
cross-skill content mechanism: `roadmap-INDEX.md`'s comment block already carries the
authoritative S1–S8 structural rules for the same two skills.

S1–S8 (structural defects of the roadmap artifact) live in roadmap-INDEX.md.
R1–R11 (findings derived across the roadmap, the specs, and the vision) live here.
R11 is the seam between them: it fires when the artifact violates its own S-rules.
-->

## Finding codes

| Code | Tier | Condition | Withholds |
|---|---|---|---|
| **R1** | error | a milestone's `Goals:` citation does not resolve to exactly one live `GOAL-N` | no |
| **R2** | error | a live `GOAL-N` is neither cited by a milestone nor listed under `## Goal dispositions` | **yes** |
| **R3** | error | `vision.md` defines the same `GOAL-N` more than once | no |
| **R4** | error | a `ROAD-N` sits under no milestone, or under more than one | **yes** |
| **R5** | error | a `Roadmap item` binding does not resolve to exactly one live `ROAD-N` | no |
| **R6** | error | two feature codes bind the same `ROAD-N` | no |
| **R7** | info | a `ROAD-N` has no feature code bound to it — *unspecced* | no |
| **R8** | info | a feature row's `Roadmap item` is empty while a roadmap exists — *unplanned* | no |
| **R9** | error | a `Closed` milestone holds a non-deferred `ROAD-N` that is unbound, or bound to a feature whose `Status:` is not `Shipped` | **yes** |
| **R10** | error | a feature's `requirements.md` `Status:` differs from its `docs/specs/INDEX.md` row | **yes** |
| **R11** | error | the roadmap is unparseable, violates `S1`, `S3`, `S4`, `S5`, `S7` or `S8`, or holds a `Depends-on` not resolving to exactly one live `MILE-N` | **yes** |

**Withholding set:** `{R2, R4, R9, R10, R11}` — the five codes whose `Withholds` column reads
yes. A finding in this set replaces the next action with the reason it withheld. `R7` and
`R8` are **normal states, not defects** — they are what the ladder consumes. An unspecced
item is the next thing to spec; an unplanned feature is work that predates the roadmap or
bypassed it. Errors mean the plan and the specs disagree; a repo can carry `R7`/`R8`
indefinitely and still be healthy.

## The rules

With `liveGoals`, `retiredGoals`, `goalCitations`, `dispositions`, `milestones` (in table
order), `members` (item → milestone), `bindings` (code → `ROAD-N`), and `statuses`
(code → INDEX status, spec status):

- **R1** — each citation in `goalCitations` not resolving to exactly one entry of `liveGoals`
  (undefined, retired, or duplicated).
- **R2** — each `liveGoals` entry in neither `goalCitations` nor `dispositions`.
- **R3** — each `GOAL-N` appearing more than once in `liveGoals`.
- **R4** — each `ROAD-N` whose `members` count is not exactly 1.
- **R5** — each non-empty binding not resolving to exactly one live `ROAD-N`.
- **R6** — each `ROAD-N` named by two or more bindings.
- **R7** — each live `ROAD-N` named by no binding.
- **R8** — each feature row with an empty binding.
- **R9** — for each milestone whose `Commitment` is `Closed`: each member not listed in its
  `Deferred:` slot that is unbound, or whose feature's spec `Status:` is not `Shipped`.
- **R10** — each code whose INDEX status differs from its spec `Status:`.
- **R11** — the roadmap failing to parse, or violating `S1`, `S3`, `S4`, `S5`, `S7`, `S8`, or a
  `Depends-on` not resolving to exactly one live `MILE-N`.

Scoping these findings to a single milestone is `cmk:milestone-review`'s concern, not a property
of the findings themselves — that rule lives in its skill body. `cmk:roadmap-status` reports the
whole repo and needs no scoping.
