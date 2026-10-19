<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:repo-config` — tests

## cmk:skill-authoring wording pass — Catalog sync Decision L (v1.3.1)

**RED (open-code-review + catalog-sync design):** brownfield reconcile/map ran
without setup; teams wanting INDEX-only sync had no posture field. Description
had drifted into a packed feature list.

**GREEN:**
- User-invoked description is one plain human line (deliverable = docs/agents
  config), no keyword packing
- Decision L explains INDEX-only opt-in, points at `catalog-sync.md`, defaults
  **unset**, never force index-only; rationalization table for silent gitignore
- Write step 11 appends gitignore snippet only when L=`index-only`

## Edit — gitignore `.worktrees/` not `.isolate-workspace/` (v1.4.0)

**RED (v1.3.1):** Step 1 markers and Write step 8 added `.isolate-workspace/` to
`.gitignore`, a second isolation parent beside the conventional `.worktrees/`.

**GREEN:** local working-dir ignore is `.skills/` and `.worktrees/`. An existing
`.isolate-workspace/` line is left in place (additive); a new one is not written.

## Length pass — SKILL.md 365 → 194 lines (v1.6.1, 2026-09-07)

**RED (repo-wide length ratchet, `scripts/lint-skill-length.py`):** SKILL.md
was 365 lines / 115 rule atoms — too rule-dense (3.2 lines/atom) to shrink by
prose-tightening alone; the file has two machine-checked eval anchors
(`§ 2. Decide, one section at a time`, `§ 4. Write`) that must survive intact.

**GREEN — extraction, following the existing `references/team-inference.md` pointer
pattern:**
- New siblings, each loaded via `**WHEN <condition>, read \`<file>.md\`... and
  follow it exactly**`: `references/issue-tracker-followups.md` (Decision A's option
  definitions, PR-surface/Publish-unit/Program-sync follow-ups, write-scope
  table, IC-default rule), `references/triage-label-mapping.md` (Decision B's canonical-
  roles table + mapping recipe), `references/project-docs-layer.md` (Decision I),
  `references/remote-environments.md` (Decision K, decision + Step 4 item 10 write step),
  `references/catalog-sync-choice.md` (Decision L's explainer/options + Step 4 item 11
  write step — the Thought/Reality gate table for L stays inline per the
  gate-block rule), `references/optional-offers.md` (Step 5's session-start-hook install
  and Context7 recommendation).
- `references/team-inference.md` gained the "why this decision matters" / user-explainer
  / recommend prose moved out of Decision H (its Thought/Reality gate table
  stayed inline, same gate rule).
- Two literal file-content blocks (the `## Agent skills` block and the
  `CLAUDE.md` pointer, both written verbatim into the target repo) moved to
  `references/templates/agent-skills-block.md` and `references/templates/claude-md-pointer.md`,
  following this file's own existing `templates/` seeding convention (Step 4
  item 7 now reads "seeded verbatim from `templates/...`").
- Decisions C, D, E, F, G, J (no skip predicate — reached by every run) were
  tightened by merging their Explainer / Confirm / Done-when paragraphs into
  one paragraph each (no bullet or fact dropped), per the universal-bucket
  rule ("tighten wording ... moving it behind a pointer buys nothing").
  Several hard-wrapped lines were reflowed to single lines (Decision K/L
  bullets before their move, the Step 1 "Seed files" bullet, Step 4 item 2,
  the Step 2 intro sentence) — pure whitespace, no wording change.
- Nothing was deleted as a no-op or duplicate in this pass; every relocated
  block was moved verbatim (`skill-rule-inventory.py --diff` confirms all 115
  atoms have a home across SKILL.md + the 8 new/extended siblings, and every
  sibling filename is named in SKILL.md so none is orphaned).
- Both eval anchors (`## 2. Decide, one section at a time`, `## 4. Write`)
  verified present verbatim; `lint-skill-evals.py` and the rest of the
  `scripts/lint-*.py` suite pass for this file.

**Numbers:** 365 → 194 lines (115 → 89 atoms in SKILL.md itself, 26 atoms
moved into siblings). Version bumped 1.6.0 → 1.6.1 (patch: wording/location
only, no behavior change). `scripts/skill-length-budget.json` entry for this
file removed (now under the 200-line limit).

## Edit — drop session-start hook offer (v1.7.0)

**RED:** Step 5 still offered to vendor a `SessionStart` hook that injected
`zone-mode` (or leftover `gate-session` copies) at startup / clear / compact.

**GREEN:** Step 5 offers Context7 MCP only. No session-start template is
copied. `/zone-mode` is user-run. Version 1.6.1 → 1.7.0.

### Reviewer note — two pointers are phase-scoped, not skip-scoped

`references/triage-label-mapping.md` and `references/optional-offers.md` sit behind "WHEN this decision
runs" and "WHEN this step runs", which are not skip predicates: every run reaches
both. Under the plain reading of the information-hierarchy rule that buys nothing
and adds a hop.

Kept, because this skill is a long interactive walk-through and the saving is real
in a different shape. Decision B's label tables are loaded while Decision B is
being worked and are not carried through Decision K; the body pays for the walk,
not for every branch of it at once. `references/team-inference.md`, shipped here well before
this pass, uses the same "WHEN Decision H runs" form, so this is the file's
existing convention rather than a new one.

The distinction matters for anyone repeating this: a pointer earns its place
either because some runs skip it, or because it is scoped to one phase of a long
run. A pointer that is neither is just an extra hop.

## v1.8.0 — cold-start drive recipe (Decision M)

**Roster:** grok-4.5 only (this edit).

**RED (v1.6.1, no Decision M).** Fixture `plainsetup`: Vite
notes app, `"dev": "vite"` in `package.json`, user locked A–L and Context7 skip,
never mentioned booting or clicking. Agent wrote `docs/agents/project.md` with
**Run locally (dev)** Backend/API row blank and no Frontend command, and no
`docs/agents/verify.md`. `DONE.txt` listed only the existing wizard outputs.

When a second fixture (`notewell`) *did* ask for a cold-start click path, the
same model improvised `docs/agents/drive.md` — so the job is doable, but the
wizard does not produce it unless the user already knows to ask.

A third fixture (`paperkite`) was given the same extra ask. It **reported**
option A (recipe written and one feature proven) while the tree only had
`project.md` / `issue-tracker.md` / `triage-labels.md` — no `verify.md`, no
`drive.md`. Score the files, not the letter.

Verbatim cost: a later agent has to invent `npm run dev` and the create-note
click path; **Run locally** shipped empty on a repo that had a `dev` script.

**GREEN (v1.8.0, grok-4.5 ×2, fixtures `notecove` / `papercove`).** Same locked
A–L plus **Yes** on Decision M. Install and long-running server forbidden
(`drive: unproven` allowed).

Both wrote `docs/agents/verify.md` with Launch, Doctor, Drive, Evidence,
Cleanup, Features. Both filled **Run locally** Frontend as `npm run dev` /
`http://localhost:5173`. Both named a reload persist check. RED's empty
Frontend row did not recur.

**No-ops recorded the same day, not written.** research "code is not intent"
2/2; cmk:delivery-reroute scrap 2/2 Design-level; cmk:design graft 2/2 (forcing
`snapshot()` lost to YAGNI). A leaked cmk:prose menu stayed dry; an unleaked
PR-body prompt shipped em dashes and is recorded on cmk:prose v1.1.0.
cmk:design v1.5.0 names `/tour-system` when the author has never read the
subsystem. On-ramps gained a `/tour-system` row.

## v1.10.0 — install kimi-webbridge when it is missing (2026-09-27)

**Control:** v1.9.0. Step 6 proves repo commands and, on Decision M, one Drive.
Nothing in the wizard checks `~/.kimi-webbridge/bin/kimi-webbridge` or runs an
installer. A machine without the daemon finishes "set up" and the UI skills
then have no driver.

**Form:** Step 6 reads `references/webbridge-setup.md` first. Missing binary → the
official bootstrap (`https://cdn.kimi.com/webbridge/install.sh` on macOS/Linux,
`install.ps1` on Windows), which downloads the daemon, starts it, and installs
the skill. Existing binary → `start` only, never `upgrade` / `stop`. The
browser extension stays a store install the user does; a disconnect is named
once and does not block the other proves. `install_skill.sh` is the wrong
script: it copies a skill for Kimi Desktop and does not download the daemon.

## 2026-10-19 — Draft surface follow-up (1.11.1 → 1.12.0), plan T3c

Roster: haiku and sonnet, headless (`skill-fixtures/run-headless.sh` with `FIXTURE_MCP`).
`mcp/fake-mcp.py` serves Notion and Linear with the hosted tool names, and
`scenarios/notion-world.py` seeds two Notion workspaces. `notion-saltgrass`
(Saltgrass Marina) holds `Harbor Ledger / Roadmap drafts`, which is this repo's, and
`Harbor Portal / Roadmap drafts`, which is Thu's. `notion-klynt` (Klynt Labs) holds
`Ledger / Roadmap drafts`. Linear has teams `LED` and `POR`. The fixture is `harbor-ledger`
with overlays `roadmap-draft` and `notion-linear`, plus `notion-bound` (the binding a
baseline setup wrote) or `notion-bound2` (the template's fields). Scored by
`scenarios/notion-score.py` from the server state files and `mcp-calls.jsonl`, never from
the reply. Full record: `docs/design/2026-10-19-notion-draft-surface.md`.

The prompt (Lan) runs `/cmk:repo-config`: "Quang (our TPM) wants roadmap drafts in Notion
… My Notion is connected to this session. Set this repo up for that."

**RED (1.11.1), both workspaces reachable.** All 3 of 3 runs bound the right database by ID
and wrote down the server. They put it in their own sections, with three shapes across the
three runs. That is a no-op for picking the area, but the downstream skills need one place
to key on, so the template gained a **Draft surface** row and a `### Notion draft surface`
block.

**GREEN 1 (template only).** On haiku, 3/3 filled the template's fields. On sonnet, 0/1:
the repo was already configured, and sonnet edited `issue-tracker.md` without reading the
template, writing a `## Roadmap drafts (Notion)` section into `project.md` instead. That
section is invisible to `cmk:roadmap` and `cmk:roadmap-status`. Fix: Decision A's
follow-ups ask for Draft surface, and Write step 1 says an already-configured repo gains
the rows it lacks.

**RED (1.11.1) and GREEN 1, wrong workspace.** Both servers were signed in to Klynt Labs,
the shared-sign-in case Claude Code's per-endpoint OAuth makes possible. 3/3 RED and 3/3
GREEN 1 runs bound harbor-ledger to Klynt's `Ledger / Roadmap drafts`. Two of them saw
the problem and bound it anyway. Verbatim (sonnet): "He isn't a member of the Klynt Labs
Notion workspace … I wrote `Quang Vo` as the sign-off person anyway."

**GREEN 2 (1.12.0).** The new rule: bind only when `notion-get-users` lists the sign-off role
in that workspace. Otherwise write `repo` and name the `/mcp` Re-authenticate step.

| | haiku | sonnet |
|---|---|---|
| wrong workspace: Draft surface `repo`, nothing bound | 3/3 | 1/1 |
| wrong workspace: told Lan which workspace both servers reach | 3/3 | 1/1 |
| right workspace: template fields, `collection://1ed6db…` | 2/2 | 3/3 |

Not covered: a solo repo whose sign-off role is the user, where membership is trivially true.

## 2026-10-19 — `notion-get-self` (1.12.0 → 1.12.1)

Found by the real-Notion dogfood (`docs/design/2026-10-19-notion-draft-surface.md`). The
hosted server has `notion-get-self`, which returns the workspace and the user. Its
`notion-get-users` takes `user_id: "self"` and returns the user without the workspace.
The sonnet setup on CommandOSS called both and bound the right database. Wording only:
step 1 and the template's Workspace line now name `notion-get-self`. The fixture server
gained the same tool. Re-run on haiku with the WORKTREE, both servers called
`notion-get-self` 2/2. The right workspace bound `collection://1ed6db…` 1/1, and the
wrong workspace wrote `repo` 1/1.

## 2026-10-19 — four more state roles (1.12.1 → 1.13.0), closed workflow W1

`triage-labels.md` gains `shaping`, `building`, `in-review` and `shipped`. Decision B
proposes `status:<role>` for them. This is structural: the RED and GREEN that need the
roles are in `cmk:delivery-build`'s `references/common.md` 2.13.0 (claim) and `cmk:delivery-ship` 4.5.0 (in review), and both
ran on a board that maps them. Design: `docs/design/2026-10-19-closed-workflow.md`.


## Merge into cmk (ADR 0001 P4, 2026-10-19)

- **Canonical instruction file.** cmk's convention wins (ADR 0001: layout is this kit's):
  `CLAUDE.md` canonical, `AGENTS.md` a symlink, written by `cmk:agent-instructions`; with neither
  file present this skill now hands to it instead of making `AGENTS.md` canonical.
- **Glossary.** Multi-area repos get `docs/requirements/<area>/glossary.md` per area
  (`cmk:glossary` § Placement), not a `CONTEXT-MAP.md`. Templates renamed to cmk names.
- **Browser drive opt-in.** RED (two `cmk:repo-setup` runs, skill-tester sonnet, nobody asked for a
  browser drive): both ran `~/.kimi-webbridge/bin/kimi-webbridge start` and `status` on the user's
  machine; with no binary present the reference would have run `curl … | bash`. Now Step 6 loads
  `references/webbridge-setup.md` only with a browser drive or the UI/acceptance pack **and** the
  user's yes this session, and the installer asks first. GREEN (skill-tester-haiku, Step 6 re-run on
  the adopted repo): browser drive skipped with its reason, no command touched the home directory,
  every configured command proven wired.
- **Agent skills block** names the five workflow commands, `cmk:delivery-build`, and which lines
  need a pack.
