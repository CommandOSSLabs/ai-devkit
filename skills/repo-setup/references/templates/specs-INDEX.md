# Spec Index

Domain router for the capability catalog. Feature cards live under
`docs/specs/catalog/<domain>.md` — **not** in this file. Register a CODE in the
owning shard before writing `requirements.md`. Codes are 2–12 chars, A-Z0-9,
start with a letter, unique forever (never reuse a retired code).

Agents query via `cmk:feature-graph`'s `references/catalog-query.md`; they must not
paste the full catalog into context.

**Roadmap item** on each shard card binds the feature CODE to a live `ROAD-N`
when `docs/roadmap/INDEX.md` exists. Write `—` when there is no roadmap layer.
At most one live CODE may name a given ROAD (`R6`). `cmk:requirements` is the
only writer of the **Roadmap item** cell on new features.

| Domain | Scope | Surface roots | Feature catalog |
|---|---|---|---|
| app | Default application domain | `src/` | [catalog](./catalog/app.md) |
