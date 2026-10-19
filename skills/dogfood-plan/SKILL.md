---
name: cmk:dogfood-plan
description: Use when a finished feature needs dogfooding — a hands-on product walk in the real running app covering visuals, feel, and eyeball edge cases — or when an existing dogfood guide needs re-reviewing for missing situations. Produces a checkable dogfood guide (run file + HTML) plus an independent review report from a clean-context reviewer. Not for executing an already-written guide (`cmk:dogfood-run`).
version: 3.0.0
---

# Write Dogfood

A product walk is a human driving the real app through every user-facing
ability and judging what they see. The deliverable is a **run file**, a
**rendered human guide**, and an **independent review report** — grounded in the
app's own rendering, one row per ability case, each tagged with the requirement
ID and a **case kind**. Cases and verdicts live in the same file, so what the
agent proves is what the person reads. Build the artifacts; a chat message is
not the deliverable. A guide of only happy paths is not done. Authoring is not
complete until the review report exists.

## Case taxonomy (every guide uses these kinds)

| `kind` | Meaning | Typical source |
|---|---|---|
| `happy` | Feature does what it is for | Primary story in requirements |
| `edge` | Boundary / empty / duplicate / max length / whitespace | Edge criteria in the same ID or sibling criteria |
| `error` | User-visible failure path (validation chip, 4xx message, retained input) | Error criteria in requirements |
| `nonbehavior` | What must **not** happen | Out-of-Scope; negative SHALLs |
| `persist` | Survives reload / re-open / restart of the client | Criteria that say "persists" or store-owned state |
| `visual` | Layout, color, empty-state copy, feel — human eyeball | Presentational requirements; no server write |
| `journey` | Multi-step workflow stitching atomic cases (optional, ≤2 per guide) | Cross-story user path |

Do **not** invent chaos, load, race, or security-fuzz suites here — those are not
a one-seat user pass. Permission/role cases belong when the UI exposes them
(`edge` or `error` + `setup` for the role).

## Todos — GATE

Before §1, put one item per section (1–4) on a **visible list** — the harness's
todo / task-list tool when it exposes one, otherwise a checklist written into your
reply and restated at each section boundary — **and** one terminal
todo **Independent review** (§5 step 2 — created now, not later). Check it off
**only** when `.skills/<CODE>/dogfood-review.md` exists for this run file.
*Done when: the list exists before scoping and includes the review todo.*

## 1. Scope every ability — coverage gate

Read the feature's `requirements.md`, `design.md`, `tasks.md`. List every
user-observable ability. Include adjacent capabilities in the same user
workflow, not only the new feature.

**Coverage rules** (all must hold before §4 is done):

1. **Every user-facing requirement ID** has ≥1 case.
2. **Every ability area** (section of the guide) has ≥1 `happy` **and** ≥1
   non-happy among `edge` | `error` | `nonbehavior` | `persist`.
3. **Every Out-of-Scope / deliberate non-behavior** that a user could try has a
   `nonbehavior` case (or an explicit note in the hand-off: *no user-facing way
   to attempt this — skipped*).
4. **Every criterion that claims persistence** has a `persist` case (or a
   `happy`/`edge` whose Expect + `backend` prove reload/store — prefer a
   dedicated `persist` row so it cannot be skipped).
5. If the area has **no** edge, error, nonbehavior, or persist material in the
   spec, write one line under that section: *Coverage exception: no edge/error/
   nonbehavior/persist cited in spec* — do not invent product behavior. The
   exception is greppable honesty, not a free pass when the triad has edges.

One happy case per ID is **not** enough when the ID or its siblings name edges.

*Done when: the coverage rules above hold, or every exception is written on the
guide.*

## 2. Ground each case in the real code

For each case, read the code to get what the user will ACTUALLY see: the exact
vocabulary (keywords, command names, labels), keyboard shortcuts, and the real
rendering — badge colors, chip styles, icons — pulled from the source (theme
tokens, CSS), never guessed. Where the code reveals an honest caveat
(a delimiter dimmed not removed, a status with no UI yet), the case says so.

## 3. Boot the real app and find the honest observation point

Start the app with the `Run locally (dev)` command from `docs/agents/project.md`
(discover and record it if missing — see `cmk:acceptance-ui`). Surface any degraded
area up front: a feature needing a key, a sub-feature not built yet. A behavior
with no UI surface still gets a case — with a real way to observe it (a devtools
`invoke(...)`, a read-only DB peek), never a pretend screen. *Done when: the app
is running and every not-yet-visible behavior has an observation method.*

## 4. Write cases + render the shell (do not invent CSS)

**Authoring SSOT is the run file**, not hand-rolled HTML.

1. Write `.skills/<CODE>/dogfood.json` (schema: load sibling
   `references/cases-schema.md` when unsure). Every case carries all required
   slots: `id`, `req`, `kind`, `title`, `setup`, `try`, `expect`, `backend`
   (`backend` is the server-side assertion, or the literal `presentational`).
   Run state (`run`, `human`) is filled in for you — author the eight slots.
2. Render the human guide from the checked-in shell — **do not** load
   `cmk:visualize` or invent a palette/layout unless the user explicitly asks for
   custom craft:

   ```bash
   python3 <skill-root>/scripts/dogfood render .skills/<CODE>/dogfood.json \
     -o .skills/<CODE>/dogfood.html
   ```

   Resolve `<skill-root>` to this skill's install path (in this kit's repo:
   `skills/dogfood-plan`). The shell is `references/shell/guide.html` — theme-aware
   CSS/JS, kind chips, verdict badges, and `data-*` attributes. The rendered page
   carries the verdicts as of render time and says so, so it is correct on a
   double-click with nothing running.
3. **Coverage self-check:** count cases by `kind` per section. If any ability
   area lacks a non-happy kind and has no *Coverage exception* line, add the
   missing cases before hand-off.

Optional: at most two `journey` rows; they do not replace atomic coverage.

**Never** ship a chat-only checklist. **Never** regenerate a full custom HTML
page as the default path — cases + `render` is the path.

*Done when: the run file and rendered HTML are on disk at known paths, coverage
holds, every case has all required slots.*

## 5. Hand over

Order: artifacts → **independent review** → optional serve → drive only after a
clean review.

1. **Artifacts** — give both paths (run file + HTML), the fastest way in — a
   ~30-second first pass that lights the feature up (usually the first `happy`
   row) — then degraded-feature notes and coverage exceptions.

2. **Independent review — spawn it IMMEDIATELY.** You wrote the cases, so you
   cannot see what they miss. After the run file and HTML are on disk and §4
   coverage holds — before serve, the drive, or any "authoring done" claim —
   fill `references/review-brief.md` beside this file and dispatch its prompt to
   a **fresh, read-only subagent** (mid tier). Do not open `references/review.md`
   yourself; it is the reviewer's recipe, and keeping it out of your context is
   the point. Write the reviewer's returned report verbatim if it could not;
   never re-judge it. Check off **Independent review** only when
   `.skills/<CODE>/dogfood-review.md` exists.
   - **No subagents in this harness?** Say `AUTHORING CLOSED — starting the
     independent review` out loud, then read `references/review.md` and follow
     it with only the brief's inputs.
   - **Open findings?** Read `references/review-fix-loop.md` beside this file
     and follow it exactly.
   - **"Re-review the guide" on an existing run file** starts here, with
     `pass_kind: re-check`.

3. **Optional serve** — offer the live guide when they will be testing by hand
   alongside the agent:

   ```bash
   python3 <skill-root>/scripts/dogfood serve .skills/<CODE>/dogfood.json
   ```

   It binds `127.0.0.1:8787`, follows verdicts as the agent records them, and
   writes their ticks back where the agent can see them. Tell them plainly what
   a tick means: it records that they looked, and never becomes a `pass`.
   Stopping it is `serve --stop`. Opened as a plain file instead, the guide still
   shows the verdicts it was rendered with — the server only buys freshness.

4. **Agent dogfood — run it.** After a clean review report (or a
   named override on open findings), REQUIRED SUB-SKILL: use `cmk:dogfood-run`
   on this run file. Before the report exists, do not name it at all. That
   drive is kimi-webbridge via `cmk:dogfood-run` — do not author a Playwright
   suite as the walk. The hand-off is a **route, not a gate**: a control measured on 2026-09-09
   drove the app unprompted rather than stopping at the artifact it had just
   written, so nothing here needs to argue it into verifying. What it does need
   is the address — verification done ad hoc produces no run file, no per-case
   verdicts, and no server probes, so downstream has nothing to read.

   Ends here instead when the user asked for a hand walk: step 3's serve is the
   deliverable and their ticks are the record.

*Done when: artifacts are on disk, grounded, the §1 coverage gate holds, every
case is fully slotted, `.skills/<CODE>/dogfood-review.md` exists for this run
file, and the guide has been handed to `cmk:dogfood-run` — or a hand walk is
recorded as the user's explicit choice.*

## Rationalizations

| Thought | Reality |
|---|---|
| "A markdown checklist in chat is enough" | It saves no tick, cannot show the real badge being checked against, and scrolls away. The deliverable is the run file + rendered guide. |
| "I'll cmk:visualize a unique layout for this feature" | Default is the checked-in shell. Custom craft only when the user asks. |
| "They're in a native desktop app, not a browser, so an artifact doesn't fit" | The artifact is a companion reference kept open beside the app; the app being native is no reason to inline the guide into chat. |
| "I'll describe the badge in words" | The user checks against what they SEE. Mirror the real rendering, or the Expect is unverifiable. |
| "One happy case per requirement is enough" | The coverage gate requires non-happy kinds (or a written exception). Happy-only is a demo, not cmk:dogfood-plan. |
| "Edges belong in unit tests, not the guide" | Write Dogfood is the user-facing surface. If the user can hit the edge, it gets a row. |
| "Worse cases mean load/chaos/fuzz" | Those are other harnesses. Write Dogfood worse cases are edge, error, nonbehavior, persist. |
| "§4 coverage self-check already ran — skip the review" | Self-check is the author grading their own cases. It is **not a substitute for the independent review**. |
| "I'll review it myself — I know the code by now" | The author's context is exactly what hides the gaps. A fresh subagent, or `AUTHORING CLOSED` when there are none |
| "I'll name the review as next and stop" | Step 2 **dispatches** the reviewer; naming is not completion |
| "Artifacts are on disk — authoring is done" | Done when the review report exists, not when the JSON/HTML land |
| "I'll add a Playwright suite so the walk is repeatable" | The walk is the run file, driven through kimi-webbridge |

## Red Flags

- Hand-writing a full HTML/CSS page instead of the run file + `dogfood render`
- Missing `backend` / `setup` / `kind` on any case
- Happy-only section without a greppable coverage exception
- Telling the agent to mark progress via guide ticks instead of `dogfood mark`
- Treating §4 coverage self-check as a substitute for the independent review
- Reading `references/review.md` in the authoring context when subagents exist
- Declaring this skill done without `.skills/<CODE>/dogfood-review.md` for this run file
- Naming `cmk:dogfood-run` (or offering the drive) before a review report exists
- Verifying the feature ad hoc instead of through `cmk:dogfood-run`, leaving no run file
- Checking off the **Independent review** todo when the report path does not exist
