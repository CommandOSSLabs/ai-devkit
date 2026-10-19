# Project posture — Delivery intent, Compat obligation, Team band/packaging

WHEN `docs/agents/project.md`'s **Project posture** or `## Team` section is
present, follow this recipe. It is read from cmk:scope step 1 and right-sizes
the whole interview.

**Delivery intent** is the quality bar the approaches must meet, never a release
state. **Compat obligation** decides the migration lens — the written line, else
derived from Lifecycle stage (Idea / Early / Active development → **None**; Cut
Released / Scaling / Maintenance → **External**): on **None**, approaches land
one shape and spend no scope on backward compatibility, versioned names, or
deprecation cost, because no consumer is committed to the current ones; on
**Internal** / **External**, weigh exactly those.

Read **`## Team`** in the same file: if the **roster** is non-empty or a
**Workflow band** override is set, derive the **band** and apply **packaging**
using the rules and matrix written *in that section* (do not re-copy them here).
State the band once. Solo: leaner peer-coordination language in approaches.
Small/Multi: surface ownership and review capacity in approach trade-offs.
