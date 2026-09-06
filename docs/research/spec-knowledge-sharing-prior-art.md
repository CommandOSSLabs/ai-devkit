# Research: How other spec systems share knowledge between specs

**Date:** 2026-09-06
**Question:** Our `docs/` tree is a good SSOT, but a new spec starts blind —
it does not know what the existing specs already cover, already declined, or
already own. How do comparable systems solve that, and what is worth adopting?
**Examined:** the `jdk` (jayden-dang-kit) skill set at
`/Users/jayden/Developer/skills` — 81 skills, ~28k lines — with focus on its
horizontal (spec-to-spec) and vertical (spec-to-code) layers.

## What was examined

| Source | What it is |
|---|---|
| `docs/guide/concepts/feature-graph.md` | the horizontal layer: feature overlap, ask-time derivation |
| `docs/guide/concepts/traceability.md` | the vertical layer: requirement IDs as the spine |
| `docs/guide/concepts/requirement-ids.md` | ID grammar, immutability, status lifecycle |
| `docs/guide/concepts/system-docs.md` | standing project docs above any one feature |
| `skills/execution/load-subgraph/` (SKILL + `references/passes.md`, 417 lines) | the derivation recipe |
| `skills/execution/audit-trace/SKILL.md` | the mechanical grep/git check |
| `skills/track/map-features/`, `skills/track/reconcile-features/` | brownfield backfill |

## Findings

### 1. The horizontal problem is separate from the vertical one

jdk separates two questions that our docs tree conflates into "declare your links":

- **Vertical** — do this feature's requirements, design, and tasks agree with
  each other? Answered by `audit-trace`, a fixed sequence of `grep` passes.
- **Horizontal** — which *other* features touch the same code, and does this
  idea already exist somewhere? Answered by `load-subgraph`.

Our `## Links` sections attempt both at once, by hand, and are checked by
nobody. The split matters because the two have different enforcement profiles:
the vertical one is deterministic and can gate; the horizontal one is a
similarity judgement and must stay advisory.

### 2. Ask-time derivation beats a maintained index

The load-bearing design choice in `load-subgraph` is stated as an Iron Law:

> `NO GRAPH FILE. NO DEPENDS_ON EDGES. NO GATE FROM THIN NEIGHBORS.`

Neighbors are derived live from the specs as they stand, every time. There is
no generated artifact to fall out of date, which is the failure mode every
hand-maintained traceability matrix eventually hits. What *is* stored is only
what cannot be derived: the registry of which capability codes exist, and
which paths each one claims.

The cost is real: `references/passes.md` is a 417-line recipe (path
classifier with reject-unsafe-first ordering, denoise stop-lists, term
scoring `distinct * 1000 + hits`, `NEIGHBORS_MAX` truncation). Most of that
length buys determinism on adversarial input — path-shaped tokens in prose,
unclosed code fences, `self.assertEqual` looking like a file path.

### 3. The retrieval unit is a card, not a document

A matched neighbor is loaded as a bounded **Summary card** — code, name, owned
paths, out-of-scope list — never its full spec:

```markdown
### CHIPUI — Module chip rail
- owns: src/shell/chip-rail.tsx, src/shell/module-store.ts
- out-of-scope: keyboard shortcuts for switching | drag-to-reorder
```

The guide's own observation is the finding worth stealing: *that single
Out-of-Scope line is often the whole answer* — the new idea was already
considered here and set aside, with a reason. Out-of-Scope is the highest-value,
lowest-cost piece of shared knowledge in a spec set, and in our docs it is
buried in a `## Scope` section nobody opens.

### 4. Determinism is bought by using primitives, not by writing a linter

`audit-trace` is `grep` plus `git` plus a fixed rule on their output — nothing
to install, no program, no interpreter. The reasoning is explicit: a check that
must never be skipped or misjudged is expressed as a set sequence of
deterministic passes, because the output of a primitive is deterministic and
language interpretation is not.

Its error set is small and each code names one failure:
`E1` cites an ID defined nowhere · `E3` the same ID defined twice ·
`W1` an approved requirement no task cites · `W2` a missing `Status:` header.

### 5. Retirement by strikethrough is the mechanism that makes IDs trustworthy

Requirements are never deleted and never renumbered; a retired one is struck
through, and the check treats a struck-through ID as **undefined**. Every
citation still pointing at it surfaces immediately as an error. Retirement
cannot be done quietly. Our `requirements-guidance.md` already states the
strikethrough rule — what it lacks is the check that gives the rule teeth.

### 6. Advisory means advisory, including when the result is empty

`load-subgraph` reports `owns_coverage` on every envelope so a thin
neighborhood is visible as thin, and forbids concluding "no relevant feature"
without stating the exact coverage numbers first. An empty result never fails a
gate. This is what keeps an advisory layer from silently becoming a gate that
blocks work on greenfield repos.

## What we are adopting, and what we are not

**Adopting** (adapted to our layout, not ported):

- A capability registry as the one stored artifact — `docs/capabilities/INDEX.md`,
  keyed by the `ID prefix` our requirements template already declares.
- Owned surface paths, so overlap is computable at all.
- Out-of-Scope promoted to a retrievable card surface.
- Ask-time neighbor derivation, advisory, with coverage always reported.
- A mechanical `grep`-based check over docs IDs, links, and registry integrity.

**Not adopting:**

- The `docs/specs/<feature>/{requirements,design,tasks}.md` triad layout. Our
  requirements/design split works and the migration cost buys nothing here.
- `tasks.md` as the OWNS source. Our task plan lives in the tracker, so owned
  paths are declared on the registry row and the design doc header instead.
- The roadmap layer (`MILE-N` / `ROAD-N`), architecture invariants (`ARCH-N`),
  and system-ID families (`TB-N`, `THR-N`, `CMP-N`, `SLO-N`). Each is a
  separate spine; none is the gap we set out to close.
- ID citations in application source, tests, or commit trailers. jdk itself
  retired these (its "docs-only spine" note); our tracker already carries the
  delivery-side linkage.
- The full 417-line path classifier. We take the shape — provenance-tagged
  candidates, reject-unsafe-first, denoise — at a fraction of the size, because
  our OWNS input is a curated registry cell rather than free-form task prose.

## Still unknown

- Whether a flat registry stays readable past ~40 capabilities, or whether the
  domain-router-plus-shards split becomes necessary. Deferred until it hurts;
  the row grammar is chosen so a later split does not rewrite rows.
- Whether term-based seeding is worth its cost in a repo this size, or whether
  path overlap alone finds the same neighbors.

## Links

- Requirements: [`../requirements/spec-knowledge-sharing.md`](../requirements/spec-knowledge-sharing.md)
- Design: [`../design/spec-knowledge-sharing.md`](../design/spec-knowledge-sharing.md)
