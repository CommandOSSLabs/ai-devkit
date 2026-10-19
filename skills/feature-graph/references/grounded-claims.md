# Grounded claims (retrieval consumers)

**One home** for conclusions drawn from a `cmk:feature-graph` envelope or
retrieval package. Callers point here; do not restate this recipe.

Load this file when the package is valid and you are about to state overlap,
reuse-miss, ownership, Out-of-Scope / "already declined", or "no relevant
feature" from retrieval.

## Recipe

WHEN stating a conclusion from retrieval:

1. **Cite** feature **CODE** + **edge or trace kind** + a **path or term**
   from the envelope (for every overlap, reuse-miss, ownership, or OOS claim).
2. **Before** concluding that no relevant feature exists:
   - if `with_owns < registered`, state the **exact** `owns_coverage` values
     (`with_owns`, `registered`, ratio) first;
   - if the neighbor or cluster result is empty, **state that emptiness** first.
3. **Never invent** `Reuse:`, `Respects:`, `**Files:**` paths, or root-cause
   hypotheses from the envelope alone — retrieval is **advisory input only**.
4. **Ignore** unknown future `via_traces` kinds; keep consuming core fields
   (`schema_version`, `shared_paths`, `via`, path/term evidence, `owns_coverage`,
   `observations`, advisory banner).
5. **Never fail a gate** solely because neighbors/cluster are empty or thin
   (cmk:scope, cmk:delivery-review, cmk:delivery-spec-plan, root-cause RED loop). Soft "thin"
   means incomplete OWNS — use the exact `owns_coverage` numbers, not vibes.
6. If `docs/specs/` is missing or seeds are unusable → explicit **no-op**; do
   not invent neighbors or clusters.

## Presentation (optional shape)

Neighbor / cluster **cards** may use schema 1.1 fields already on the envelope:
CODE, `shared_paths`, `via`, `path_evidence`, `term_evidence`, `via_traces`,
owned paths, Out-of-Scope. Cards are freeform; claims inside them still follow
the recipe above.
