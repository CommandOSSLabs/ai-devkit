# Bind the roadmap item

Loaded from Step 1's `WHERE` pointer, when `docs/roadmap/INDEX.md` exists.

Slot vs CODE definitions live in `cmk:roadmap` (**ROAD-N is a slot, not a
feature**). This step only writes the join.

WHERE `docs/roadmap/INDEX.md` exists and this work implements one of its items, put that
item's `ROAD-N` in the shard row's **Roadmap item** column. WHERE there is no roadmap, or the work
was never a roadmap item, write `—`.

This column is the only plan↔spec join, and this step is its only writer — never invent a
`ROAD-N` here. IF the chosen ROAD is already bound to another CODE (`R6` in
`cmk:roadmap-status`'s `references/templates/roadmap-findings.md`) → stop and surface the collision; do not rebind or mint
another ROAD.
