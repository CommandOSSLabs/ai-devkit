# Project configuration (agent-facing)

Written by `cmk:repo-config`. Skills read this file for repo-specific **machine config** —
commands, globs, paths — plus **posture** and **team** (below). Human-facing engineering
guidelines (coding standards, naming, house rules) live in `docs/requirements/guidelines.md`
when the project-docs layer is enabled; `cmk:delivery-spec-plan` sources them from there and falls
back to this file otherwise.

## Project posture

The project's standing intent, lifecycle phase, and compatibility obligation. Skills read
this instead of re-asking: `cmk:scope` and `cmk:interview` right-size migration /
compat / deprecation against **Compat obligation**; `cmk:interpret` reuses all three.
`cmk:interview` production coverage needs Delivery **Production** + Lifecycle
**Cut Released / Scaling / Maintenance** + operate/launch surface (or an ops ask); MVP,
absent, and Early/Active stay off. Edit these lines when the project moves phase.

**SSOT:** the **Compat obligation** values and what each one means live only here. Skills
carry a one-clause copy of the derivation because a repo configured before the field existed
has no Compat obligation text in this file for them to read — change the meanings here, and
the derivation in `cmk:scope`, `cmk:interview`, `cmk:interpret`, and
`cmk:problem` with it.

- **Delivery intent:** `<Production | MVP | Run Spike | Research | Learning>` — the quality bar the output must meet. A bar, not a release state: **Production** says how well the code must be built, never that the project has shipped.
- **Lifecycle stage:** `<Idea | Early development | Active development | Cut Released | Scaling | Maintenance>` — where the project is in its life.
- **Compat obligation:** `<None | Internal | External>` — who is already committed to the current shapes, and so what a change is allowed to break. **None:** nothing outside this repo depends on any current schema, endpoint, or file format. **Internal:** other services or teams in the same org read them. **External:** users, customers, or third-party clients depend on them. **Derived when the line is absent** — Lifecycle Idea / Early development / Active development → **None**; Cut Released / Scaling / Maintenance → **External**. Write the line only to override that default: a pre-release repo whose staging data must survive, or a released service whose API nobody outside the team calls.
- **Catalog sync:** `<unset | index-only | full-triad>` — optional. Shared catalog shape is always Domain router INDEX + `docs/specs/catalog/*.md` (not a flat Code table on INDEX). **`index-only`:** git tracks `docs/specs/INDEX.md` (± `docs/specs/catalog/`); feature triad dirs stay local (gitignored workbenches); `/cmk:catalog` may `export` / `materialize`. **`full-triad`:** triad dirs are committed as usual; cmk:catalog dispose-only (no materialize/export modes). **`unset` or absent:** same as full-triad (safe default — do not rewrite `.gitignore`).
- **Default PR base:** `<branch, e.g. main>` — optional; `cmk:delivery-ship` reads it as the third rung of its base-resolution ladder. Leave the placeholder unset and `cmk:delivery-ship` asks for the base per invocation instead.
- **Default landing action:** `<pr | merge | keep>` — optional; used only when intent is ambiguous and no existing PR resolves it.
- **Language:** `<English | a language>` — optional; the language of PRs, commits, tracker issues and comments. Absent means English. Replies to the operator follow the operator's own language either way.

These are distinct from the product **Goals** in `docs/requirements/vision.md` (what success
looks like): posture is *how carefully to build right now*, not *what to build*.

## Team

Who works on this repo and how skills should package collaboration.
Skills that plan, review, or hand off read this section when present and
right-size **packaging** only (Solo / Small / Multi) — Iron Law gates never
change. Edit freely; re-run `/cmk:repo-config` to re-draft from git/CODEOWNERS.
If this section is absent, skills do not invent a team.

**SSOT:** **band** derivation and the **packaging** matrix live only here.
Consumers **read** this section; they do not re-copy these rules into skill bodies.

### Roster

- <Role — Name | N × Role>
- …

Suggested roles (freeform allowed): Tech Lead, Backend Engineer, Frontend Engineer, Full-stack Engineer, Designer, Product Manager, QA, DevOps/SRE, Docs.

### Ownership notes (optional)

- `<path-or-pattern>` → <owner-token>   <!-- all CODEOWNERS owners, including @org/team -->

### Workflow band

- **Override (optional):** `<blank | Solo | Small | Multi>` — when non-blank, skills use this.
- **Derive (when override blank):**
  1. Headcount from **Roster only**: each `Role — Name` = 1; each `N × Role` / `N Role(s)` adds N.
     Ignore Ownership notes and placeholders (`<…>`).
  2. Buckets: empty roster → **no band** (same packaging as Team absent); 1 → **Solo**;
     2–4 → **Small**; ≥5 → **Multi**.
  3. Specialty upgrade only: if **Small** and ≥3 distinct role titles (case-insensitive, trimmed),
     upgrade to **Multi**. Never downgrade Multi→Small.

### Packaging matrix

| Band | Packaging |
|---|---|
| **Solo** | Lean multi-person ritual language; no invented peer reviewers/assignees; agent-as-pair; full gates |
| **Small** | Design-review checkpoints; ownership boundaries via optional freeform notes; name people when roster has names |
| **Multi** | CODEOWNERS-aware review language when ownership notes exist; explicit review responsibilities as prose; handoff/docs emphasis |
| **(no band)** | Team absent, or empty roster with blank override — pre-feature default; do not invent a team; do not hard-fail |

## Decision boundaries

Optional. When present, `cmk:verdict` reads this table. Pins may raise a
floor or bind an action to a boundary type. An entry that would lower a core
floor is ignored with a one-line notice. Absent section → core table only.

| Action | Boundary-Type | Floor |
|---|---|---|
| <e.g. cmk:delivery-ship:discard> | <disposal> | <Accountable> |

## verify commands

Run in this order; all must pass before any completion claim.

| Check | Command |
|---|---|
| Typecheck | `<command>` |
| Lint | `<command>` |
| Unit tests | `<command>` |
| E2E / smoke | `<command>` |

Single test file: `<command pattern, e.g. npx vitest run <path>>` — must narrow what
gets built, not only what runs.

Task gate (changed units + their dependents; `none` when the whole suite is fast):
`<command pattern, e.g. cargo nextest run -p <crate> -p <dependent>>`

Wave gate (compile + lint every target after a parallel merge; `none` = typecheck + lint):
`<command>`

The whole suite runs once, at close. Each task runs its task gate instead, escalating
to the whole suite when the change reaches what the build graph cannot see (schema,
migrations, shared fixtures, manifests, generated contracts, a root package).

The traceability check is not a command here — the `cmk:traceability` skill runs it as
`grep`/`git` over `docs/specs/` (and optional architecture). It is **docs-only**
and does not grep application tests for requirement IDs.

Legacy annotations in consumer code (if any) are ignored; do not require new ones.

Specs directory override: `<leave blank for docs/specs/>`

## Run locally (dev)

How to start the app for user-facing acceptance checks (read by `cmk:acceptance-api`
and `cmk:acceptance-ui`). Fill in once the app can be run locally; leave a row blank
if that surface does not exist.

| Surface | Start command | Ready signal |
|---|---|---|
| Backend / API | `<command>` | `<e.g. GET http://localhost:<port>/health → 200>` |
| Frontend | `<command>` | `<e.g. http://localhost:5173 serves the app>` |

Browser drive (kimi-webbridge): the user's Chrome or Edge. Do not add a Playwright suite for acceptance.

## Remote environments

Read by `cmk:incident` and `cmk:observability`. Skip the table
(`None — not deployed`) when nothing is live. Never put tokens here.

| Environment | Deployed | Backend | Read query |
|---|---|---|---|
| `<development \| staging \| production>` | `<yes \| no \| unknown>` | `<product + base URL + org>` | `<read-only query that is red on the symptom>` |

Or: `None — not deployed`

## release steps

<Ordered list of project-specific release steps (build commands, bundling,
signing), consumed by the `cmk:release` skill.>

## Paths

- Specs: `docs/specs/`
- ADRs: `docs/decisions/`
- Glossary: `docs/requirements/glossary.md`
- Out-of-scope KB: `.out-of-scope/`
- Engineering guidelines (project-docs layer, optional): `docs/requirements/guidelines.md`
- Product vision / architecture spine (project-docs layer, optional): `docs/requirements/vision.md`, `docs/design/`
