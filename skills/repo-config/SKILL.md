---
name: cmk:repo-config
description: Sets up docs/agents config so this skill set can run in an existing repo.
version: 1.13.0
disable-model-invocation: true
---

# Set Up the Repo

Configure a repository, once, so every other skill can read its answers instead of guessing. The output is a set of agent-facing config files under `docs/agents/`, seed spec files, and a pointer block in the repo's agent instructions.

This is a conversation, not a script: explore, present what you found, decide one thing at a time with the user, then write.

Template seeds live in this skill set's `templates/` directory. Pack seeds live in `references/templates/`.

## Track progress

This skill has seven steps (decisions A–N inside step 2) and skipping one is the common failure — an unconfigured tracker, or the Step 6 verification gate never run. Before Step 1, create a todo for each numbered step below and complete them in order, checking each off only when its **Done when** is met. Step 6 (prove the configuration works) is not optional.

## 1. Read the setup state

This step does one thing: determine whether the repo is already configured for the skill set, and how completely. Read the repo's **own files only** — do not probe external services or their auth (no `gh auth`, `gh label list`, `glab`, no Linear MCP call) and do not read the user's shell environment (no `env`, no `*_API_KEY` probing). Detection is not the job here: the *user* drives what gets set up in Step 2, and any service or toolchain specifics are gathered later, in service of a choice the user has already made. Check the setup markers — all by reading files in the repo:

- `docs/agents/project.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/verify.md` — present and filled in, or missing?
- `## Team` section inside `docs/agents/project.md` — present and filled, or a gap?
- An `## Agent skills` section in `CLAUDE.md` / `AGENTS.md` (note which of the two files exists)
- Seed files the skill set expects: `docs/specs/INDEX.md` (domain router) + `docs/specs/catalog/<domain>.md`, a glossary (`docs/requirements/glossary.md` or `CONTEXT-MAP.md`)
- `.skills/` and `.worktrees/` present in `.gitignore`

Then branch on what you found:

- **Already configured (fully or partly)** — this is a *fill-the-gaps* run, not a rebuild. List exactly what exists and what is missing or stale, show the user that summary, and offer to fill only the gaps. Walk only the Step 2 sections whose output is missing or that the user explicitly asks to change; leave everything already written untouched (the additive rule, Step 4).
- **Not configured** — go straight to the user-driven flow in Step 2. Do **not** guess the tracker from the git remote or a connected MCP server, and do not auto-detect anything the user should choose. Ask the user how they want to set the repo up, one decision at a time.

You may still read the repo's own manifests (lockfiles, `package.json` scripts, `Cargo.toml`, `pyproject.toml`, `Makefile`, test configs) to *pre-fill suggestions* in later steps — but reading a file in the repo is not the same as probing a service, and a pre-filled suggestion is never a decision made on the user's behalf.

**Done when:** you have classified the repo as configured / partly-configured / not-configured, listed any gaps, and presented that summary to the user.

## 2. Decide, one section at a time

Walk the fourteen decisions below (A–N; I is optional project-docs; K is optional remote environments; L is optional catalog sync; M is the cold-start drive recipe; N is an optional remote build host) strictly one at a time: give a two-or-three-sentence explainer (what this is, which skills consume it, what changes with each choice), state your recommendation with a one-line reason, then wait for the user's answer before moving on. Never dump all sections at once. Assume the user has not seen these concepts before.

### A. Issue tracker

Explainer: skills that read or write issues (`cmk:triage`, `cmk:discover-efforts`'s `references/publish.md`, `cmk:delivery-spec-plan` when publishing a plan, `cmk:delivery-ship`, `cmk:release`) need to know where issues live and which commands touch them. Options: **github**, **gitlab**, **linear**, **local**, **other**. Recommend only from the repo's local git remote — a GitHub remote → github, a GitLab remote → gitlab, no remote → local — and always let the user overrule it. Do not probe a service or its auth to guess the tracker. Linear is a separate service and will not appear in `git remote`, so present it as an option and pick it whenever the user says the team lives in Linear, even if the code host is GitHub/GitLab.

**WHEN the tracker is chosen, read `references/issue-tracker-followups.md` and follow it exactly** — what each option means, the PR-surface, Publish unit, Program sync, and Draft surface follow-up questions, the write-scope table, and the IC-default rule all live there.

**Done when:** tracker choice, PR-surface (if applicable), Publish unit, Program sync, Program write role, and Draft surface are confirmed (or declined to defaults: feature + local + ic + repo).

### B. Triage label mapping

**WHEN this decision runs, read `references/triage-label-mapping.md` and follow it exactly** — the canonical-roles table, the mapping proposal, label creation consent, and the linear-specific branch.

**Done when:** every canonical role maps to a confirmed label string.

### C. verify commands

Explainer: `cmk:tdd`, `cmk:evidence`, `cmk:delivery-build`'s `references/continuous.md`, and `cmk:release` all run this repo's proof commands; they must be exact, not guessed. Confirm each, pre-filled from what you detected: typecheck, lint, unit tests, e2e/smoke, and the **single-test-file pattern** (the command shape for running one test file — the tight loop `cmk:tdd` lives in; it must narrow what gets *built*, not only what runs — e.g. `cargo nextest run -p <crate> --test <file>`, never a bare name filter that compiles every test binary in the package). Then the two optional gates: **Task gate** (tests of the changed units plus their dependents — e.g. `cargo nextest run -p a -p b`, `vitest related`, `nx affected`) and **Wave gate** (compile and lint every target, e.g. `cargo check --workspace --all-targets` + lint). Mark them "none" when the whole suite takes a couple of minutes — then the suite is the gate. **Done when:** each command has been confirmed by the user (or explicitly marked "none").

### D. Traceability (docs-only)

Explainer: requirement IDs live in `docs/specs/**`. The `cmk:traceability` check is **docs-only** — it greps requirements and task footers, not application tests. Do **not** require `/// REQ:`, `@CODE-N.M`, or IDs in test titles for consumer apps. Optional note in project.md: legacy annotations are ignored; do not add new ones. Confirm the specs directory path if non-default; skip inventing test-annotation tables. **Done when:** docs-only trace posture is confirmed (specs path; no mandatory consumer ID-in-test convention).

### E. release steps

Explainer: the `cmk:release` skill executes an ordered list of project-specific commands — build, bundle, sign, publish — and it refuses to improvise them. Draft the ordered list from what you found (build scripts, packaging config) and confirm. Include the smoke-check command if one exists. **Done when:** the ordered release steps are confirmed (an empty list is a valid answer for libraries with no build).

### F. Docs layout

Explainer: spec and discovery skills read `docs/specs/`, `docs/decisions/`, and the domain glossary; they need to know the shape. Confirm specs at `docs/specs/`, ADRs at `docs/decisions/` (create the directories if missing), and glossary layout — **single-context** (one root `docs/requirements/glossary.md` — most repos) or **multi-context** (a root `CONTEXT-MAP.md` pointing at per-context `docs/requirements/glossary.md` files — typically monorepos). **Done when:** layout is confirmed.

### G. Project posture

Explainer: three standing facts about the project — its **delivery intent** (the quality bar the output must meet), its **lifecycle stage** (where it is in its life), and its **compat obligation** (who is already committed to the current schemas, endpoints, and formats). `cmk:scope` and `cmk:interview` read them to right-size ceremony — compat obligation alone decides the migration / backward-compat / deprecation lens — and `cmk:interpret` reuses them so they never re-ask. They live in `docs/agents/project.md` and the user edits those lines directly as the project moves phase. Confirm these, pre-filled from repo signals — never invented:

- **Delivery intent** — Production / MVP / Run Spike / Research / Learning. The quality bar, not a release state: **Production** never means the project has shipped. Recommend from what the repo shows (a published package or cmk:release workflow → Production; a bare greenfield spike → Run Spike); default **MVP** when unclear.
- **Lifecycle stage** — Idea / Early development / Active development / Cut Released / Scaling / Maintenance. Recommend from git signals (tags or a release history → Cut Released; a young repo with few commits → Early development); default **Early development** when unclear.
- **Compat obligation** — None / Internal / External. Ask only when the repo contradicts the derivation the template's Project posture section gives from Lifecycle stage (pre-release → None, released → External): a published package, a versioned public API, or a deployed database under a pre-release lifecycle argues for a written override. Otherwise leave the line out and let the derivation stand — an unwritten line is the working default, not a gap.

**Done when:** delivery intent and lifecycle stage are confirmed by the user, and compat obligation is either confirmed as an override or deliberately left to the derivation.

### H. Team

**WHEN Decision H runs, read `references/team-inference.md` and follow it exactly** — why band packaging matters, the explainer for the user, the recommend defaults, local git / CODEOWNERS / AUTHORS / CONTRIBUTORS / package manifests only, **infer-then-confirm**.

| Thought | Reality |
|---|---|
| "I'll pull collaborators from `gh api`" | Local metadata only — no collaborator APIs |
| "Commit volume proves who the tech lead is" | Never invent titles; default `Contributor` until the user re-roles |
| "Empty git history — invent a solo developer" | Empty draft + ask; never invent names |
| "Write the draft and fix it later" | Confirm gate: no Team write without explicit confirm in this run |

**Done when:** the user has confirmed the roster (named and/or count form), optional ownership notes, and optional band override — or explicitly deferred Team (remain a gap).

### I. Project-docs layer (optional — default No)

**WHEN this decision is offered, read `references/project-docs-layer.md` and follow it exactly** — what the layer is, which skills consult it, and the migration offer when guidelines already exist elsewhere. Recommendation: **No** unless this is a large, multi-feature project. **Done when:** the layer is opted in or declined.

### J. Default PR base

Explainer: `cmk:delivery-ship` reads `Default PR base:` from `docs/agents/project.md` as the third rung of its base-resolution ladder — after an explicit invocation base and a base already recorded on an existing PR — so it stops asking once a trunk is on record. Offer `dev`, `staging`, `main`, and the repo's own local branch list as suggestions only; no value is pre-selected — the user always names the branch themselves. Recommendation: the repo's actual trunk branch (commonly `main`) — it is the branch `cmk:delivery-ship` already assumes unless told otherwise. Declining: if the user declines to choose, write no value at all and skip the Step 4 item for this field — `cmk:delivery-ship` then asks for the base on every invocation, which is what keeps the field genuinely optional under ARCH-2.

**Done when:** the user has confirmed a value, or has explicitly declined and no value will be written.

### K. Remote environments (optional — default skip if nothing is deployed)

**WHEN this decision is offered, read `references/remote-environments.md` and follow it exactly** — what to confirm per environment, the token rule, and the matching write step. **Done when:** the table is confirmed, or explicitly skipped (`None — not deployed` / declined).

### L. Catalog sync (optional — default unset / full-triad behavior)

**WHEN this decision is offered, read `references/catalog-sync-choice.md` and follow it exactly** — what thin-catalog sync means, the three option definitions, and the write step (Step 4, item 11). Guide: `docs/guide/skills/catalog-sync.md`.

| Thought | Reality |
|---|---|
| "Everyone should be index-only now" | Opt-in only; default unset preserves current repos |
| "I'll add the gitignore without saying index-only" | Snippet only when L=`index-only` and user confirmed |

**Done when:** catalog sync value confirmed, or explicitly left unset.

### M. Cold-start drive recipe (optional — default Yes when a runnable surface exists)

**WHEN this decision is offered, read `references/verify-control.md` and follow it exactly** — the offer, skip rule, write step, and prove step. `npm test` is not a boot-and-click recipe. **Done when:** Yes with `docs/agents/verify.md`, or explicit Skip.

### N. Build host (optional — default skip; there is no shared host)

**WHEN this decision is offered, read `references/build-host.md` and follow it exactly** — what to confirm, the never-a-secret rule, and the write step. Offer it only when the user says they have a second machine of their own to build on; there is no shared host and `cmk:delivery-remote` stays invisible without `docs/agents/host-build.md`. **Done when:** the manifest is written and its host answers preflight, or the decision is skipped and no such file exists.

## 3. Draft and confirm

Show the user, before writing anything:

- the `docs/agents/*.md` files' contents (including `verify.md` when Decision M is Yes, and confirmed `## Team` when Decision H was confirmed)
- the `## Agent skills` block destined for CLAUDE.md/AGENTS.md

Let them edit. **Done when:** the user approves the drafts.

## 4. Write

**The additive rule: existing files are edited in place, never clobbered.** If a target file already exists, merge your content into it and preserve everything the user wrote.

1. Write `docs/agents/project.md`, `docs/agents/issue-tracker.md`, and `docs/agents/triage-labels.md`, seeded from `references/templates/agents/project.md`, `references/templates/agents/issue-tracker.md`, and `references/templates/agents/triage-labels.md`. In the issue-tracker file keep only the chosen tracker's operations section, record the PR-surface answer, and fill **Publish unit**, **Program sync**, **Program write role**, **Draft surface** (with its `### Notion draft surface` block when `notion`), and **Close linkage** from Decision A (defaults: `feature` / `local` / `ic` / `repo` / tracker-native close syntax). A repo already configured gains the rows it lacks from the template.
2. If `docs/specs/INDEX.md` is missing, create it from `references/templates/specs-INDEX.md` **and** seed `docs/specs/catalog/app.md` from `references/templates/specs-catalog-domain.md` (replace `<Domain>` with `App`). If INDEX exists but is a flat Code table, name `/cmk:catalog` Domain boundary migrate — do not invent shards silently.

3. If the glossary is missing, create `docs/requirements/glossary.md` from `references/templates/CONTEXT.md` (or a `CONTEXT-MAP.md` for multi-context, per the user's answer).
4. Fill the **Project posture** section of `docs/agents/project.md` with the confirmed delivery intent and lifecycle stage (decision G), replacing the template placeholders. Write a `- **Compat obligation:** \`<value>\`` line only when decision G confirmed an override; when it left the derivation standing, delete the placeholder line so the derivation applies. (Additive: if the section already carries real values, update only what the user changed.) If decision L confirmed **index-only** or **full-triad**, set `- **Catalog sync:** \`<value>\`` in the same section (additive). If L left unset, write no Catalog sync line.
5. Fill **`## Team`** from the confirmed Decision H content (roster, ownership notes, optional band override), merging into the template shape from `references/templates/agents/project.md`. Replace only the Team section's confirmed fields; do not clobber other sections. If the user deferred Team, leave the section as template placeholders or omit until a fill-the-gaps run.
6. **If the project-docs layer was opted in (decision I):** seed `docs/requirements/vision.md`, `docs/design/system.md`, and `docs/requirements/guidelines.md` from `references/templates/product-vision.md`, `references/templates/architecture-INDEX.md`, and `references/templates/product-guidelines.md` (additive, per the rule above). If migrating, move the existing engineering rules into `docs/requirements/guidelines.md` and leave a pointer in `docs/agents/project.md`. If the layer was declined, skip this — write none of these files.
7. Add the `## Agent skills` block. It lives in exactly **one** canonical file; any second file is a thin pointer, never a copy of the block.
   - **Neither `CLAUDE.md` nor `AGENTS.md` exists** (the default): make `AGENTS.md` canonical (it holds the block) and write a short `CLAUDE.md` whose entire body points at `AGENTS.md` — so Claude Code finds instructions by its native filename without duplicating them. Do not ask which to create; this pattern serves both.
   - **Only one exists:** that file is canonical — add or update the block in it. If it is `AGENTS.md` and Claude Code is a target, also add the `CLAUDE.md` pointer. If it is `CLAUDE.md`, leave it canonical — do not demote it to a pointer or create a competing `AGENTS.md`.
   - **Both exist:** put the block in whichever already carries real agent instructions; make the other a pointer only if it is not already substantive. Never place the block in both.
   - If an `## Agent skills` section already exists in the canonical file, update it in place — never append a duplicate, never touch surrounding sections.

   The `CLAUDE.md` pointer, when you create one, is seeded verbatim from `references/templates/claude-md-pointer.md`.

The block (include the project-docs bullet only if decision I was Yes) is seeded verbatim from `references/templates/agent-skills-block.md`.

8. Ensure the local working dirs are git-ignored: the skills' scratch artifacts — the continuous build's ledger and briefs (`cmk:delivery-build`), and the scan/review digests the spec skills write — live under `.skills/`, and isolated workspaces under `.worktrees/` (the same parent `cmk:worktree` uses); neither belongs in version control. Idempotently, for each pattern: `grep -qxF '.skills/' .gitignore 2>/dev/null || printf '.skills/\n' >> .gitignore` (same for `.worktrees/`), then stage `.gitignore`. Do not add a `.isolate-workspace/` line — that was the old parallel parent. Leave an existing `.isolate-workspace/` ignore in place (additive). (A line-presence check, not `git check-ignore` — a trailing-slash pattern only matches an *existing* directory, so `check-ignore` would re-append before the dir exists.)
9. If decision J (Default PR base) was confirmed, add `- **Default PR base:** \`<branch>\`` to the **Project posture** section of `docs/agents/project.md`, under the additive rule above — merge in, never clobber a value the user already set. If the user declined decision J, write nothing: leave the field absent so `cmk:delivery-ship` asks per invocation.
10. Follow the write step in `references/remote-environments.md` for decision K.
11. Follow the write step in `references/catalog-sync-choice.md` for decision L (index-only gitignore append).
12. Follow the write step in `references/verify-control.md` for decision M.
13. Follow the write step in `references/build-host.md` for decision N.

**Done when:** all files are written, `.skills/` and `.worktrees/` are git-ignored, index-only gitignore applied only when L=`index-only`, M's write ran or skipped, and `git status` shows only the expected additions/edits.

## 5. Offer Context7 MCP

**WHEN this step runs, read `references/optional-offers.md` and follow it exactly** — the Context7 MCP recommendation.

**Done when:** the Context7 MCP recommendation has an explicit yes/no, and a yes is recorded in `docs/agents/project.md`.

## 6. Prove the configuration actually works — GATE

Confirmed-with-the-user is not the same as works-in-this-project. Commands were pre-filled from what you detected; a wrong manifest path, a missing script, or a tool that is not installed will surface as a mid-task failure in `cmk:tdd`, `cmk:evidence`, or `cmk:release` weeks from now. Prove them now, while you own the context. This is the discipline of the `cmk:evidence` skill applied to the config you just wrote: run the command, read the output, believe the output — not the config. **Browser drive.** Before those commands, read `references/webbridge-setup.md` and follow it exactly.

Run each configured verify command fresh and classify the result. The distinction that matters is **wiring vs content**:

- **Wiring failure** — the command could not run as written: "command not found" / exit 127, "missing script", "no such file or directory", a bad `--manifest-path` or unknown flag, an uninstalled tool. **This is a config bug you must fix**: re-detect, correct `docs/agents/project.md`, and re-run until it is gone. Setup is not done while any command is mis-wired.
- **Content failure** — the tool ran correctly but reported problems (type errors, lint warnings, failing tests). The command is wired right; the repo has pre-existing issues. Record these for the user; they do **not** block setup.
- **Pass** — wired and green.

Be cost-aware — do not run the whole suite to prove wiring:

- Typecheck and lint: run in full (bounded).
- Unit/e2e runners: prove the runner resolves its config cheaply — run the **single-test-file pattern** from `project.md` against one existing test file, or the runner's collect-only/list mode. Never trigger a full e2e run during setup; state that the full run is the user's to do later.
- Audit Trace check: run it (REQUIRED SUB-SKILL: use `cmk:traceability`) and confirm it reports a clean finding set — zero requirements is a valid clean state. The check is `grep`/`git` over `docs/specs/` (and optional architecture), not application test trees.
- If the tracker is a remote service (`github` / `gitlab` / `linear`), prove it is reachable and authenticated with **one read-only call** — `gh issue list` / `glab issue list`, or for Linear a single MCP list call (or a minimal `issues` GraphQL query). This verifies the tracker the *user already chose*; it is not the setup-time detection Step 1 forbids — the choice is made, and this call only proves it works. A missing CLI, an unauthenticated session, or a disconnected or unauthenticated MCP server is a wiring failure; it would otherwise stay hidden until `cmk:triage` fails weeks later. `local` and `other` need no reachability check.
- Decision M = Yes: follow the **Prove** step in `references/verify-control.md` (Doctor, then one Drive). A recipe never executed is a draft.

Report a small table: each command → wired? → passed / failed / pre-existing.

**Done when:** every configured command is proven **wired** (no wiring failures remain), the traceability check runs clean, the configured tracker answers a read-only call, Decision M is proven or skipped, the webbridge check in `references/webbridge-setup.md` ran, and any content failures are listed for the user.

## 7. Finish

Tell the user setup is complete, which skills now read the config, that the evidence table shows what is wired vs pre-existing, and that `docs/agents/*.md` can be edited directly later — re-running this wizard is only needed to switch trackers or start over.
