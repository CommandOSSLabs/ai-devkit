<!-- Ported from jdk `bootstrap-repo` 1.2.0 (ADR 0001). -->
# Init mode — scaffold a greenfield repo to a proven baseline

Loaded from `SKILL.md` § Modes for `init`.

Bootstrap a greenfield repository to a verified baseline: a skeleton where every quality tool is wired and demonstrably working, so the first feature starts from green.

Do not skip ahead to feature code. The deliverable is the harness, proven by one passing example test — nothing more.

## Track progress

Create a todo for each step below (0–4) and complete them in order, checking each off only when its **Done when** is met. Step 0 is a gate: if it stops you (not greenfield), abandon the list and redirect. Otherwise the failure this guards against is a skipped step — the baseline never verified, or `cmk:repo-config` left out of the chain.

## 0. Confirm the target is greenfield — GATE

Scaffolding writes a project root (git repo, root manifest, root README, root CI, root pre-commit hook). Doing that on top of an existing project collides with or overwrites real config. So before anything else, resolve **where** you are scaffolding and prove it is empty. This gate is not optional and it is not a judgment call you make by feel — run the check.

**Resolve the target directory.** Default to the current working directory. If the user named a destination ("scaffold a `bot` package under `packages/`"), the target is that path. If the cwd is itself a populated repo root but the user asked for a *new* subpackage, resolve the target to that new subdirectory and classify **that** — do not stop at the root's verdict.

**Inspect it yourself** (never ask the user what is in the directory — look):

- `ls -A <target>` — does it exist, and is it empty?
- `git -C <target> rev-parse --is-inside-work-tree` and `git -C <target> ls-files | wc -l` — is it inside a git repo, and how many files are tracked?
- Is there a package manifest at the target (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, …)?

**Classify and branch:**

| Target state | Meaning | Action |
|---|---|---|
| Does not exist, or exists and is empty / only holds `.git`, `README`, `LICENSE` — and no manifest | **Greenfield** | Proceed to Step 1. |
| A new/empty subdirectory *inside* an existing git repo (e.g. `packages/bot` in a monorepo) | **Subpackage** | Proceed to Step 1 with the subdirectory as the target, and set `inside-existing-repo = true` (Step 2 skips the root-touching parts). |
| Exists and holds a manifest or many tracked files — a real project | **Not greenfield — STOP** | Do not scaffold. Redirect (below). |

**When you must stop, redirect — do not improvise a menu:**

- If the user wants to **use this skill set in the existing repo** → that is this skill's `adopt` mode (or `/cmk:repo-config` alone for just the agent config: tracker, verify commands, labels). Switch to it.
- If the user wants a **new package inside this repo** → confirm the new subdirectory path, then re-run this gate against that subdirectory (it should land in the Subpackage row).
- If they landed here by mistake → stop and let them reconsider.

State which case you detected and which redirect applies. **Done when:** the target is classified greenfield or subpackage and its resolved path is confirmed with the user, OR you have stopped and named the redirect.

## 1. Grill the stack

REQUIRED SUB-SKILL: use `cmk:interview` to settle the stack and layout decisions for the resolved target — full question cards (inline only), each with options, consequences, and a recommended default:

- Project name (used in the manifest and README)
- Language and runtime
- Framework (or "none — plain library/CLI")
- Test runner
- Formatter and linter
- Package manager
- Repo layout (single package vs workspace/monorepo; source and test directory shape)
- License
- Commit or stage the result for review first

Look up facts yourself (what tools the user has installed, what the parent repo already uses in subpackage mode); bring only judgment calls to the user.

**Done when:** every decision above is explicitly confirmed and restated in one summary block — including the resolved target path — that the user approves.

## 2. Scaffold — what the facets do not own

The facet chain in `SKILL.md` builds most of the tree: `cmk:project-layout` the directories,
`cmk:toolchain` git, `.gitignore` and runtime pins, `cmk:cicd` the CI workflow, `cmk:docs`
the docs taxonomy, `cmk:repo-config` the docs seeds and `docs/agents/`. This step adds the
harness no facet owns, at the resolved target. In **subpackage mode**
(`inside-existing-repo = true`), skip the items marked *(root only)* and inherit the parent's
shared config instead of creating competing copies.

1. **Project skeleton** — manifest, source directory, minimal entry point. In subpackage
   mode, extend the workspace's shared toolchain config and register the package with the
   workspace.
2. **Test harness** — install and configure the runner, plus **exactly one passing example
   test**. Its job is to prove the wiring (imports resolve, runner finds files, assertions
   execute), not to test real behavior.
3. **Formatter + linter config** — committed config, with `format`, `lint`, and `typecheck`
   (where applicable) runnable as single commands. In subpackage mode, inherit root config.
4. **Pre-commit hook** *(root only)* — on every commit: format staged files, then lint,
   typecheck, and test, with the stack's idiomatic hook mechanism. In subpackage mode,
   integrate with the parent repo's existing hook rather than installing a competing one.
5. **README skeleton** — project name, a one-paragraph description placeholder, and the
   install and verify commands, at the target.

**Done when:** every applicable item exists and is committed (or staged, per the user's
Step 1 choice).

## 3. Verify the baseline

REQUIRED SUB-SKILL: use `cmk:evidence` — run the full verify suite (typecheck, lint, test) fresh and read the output. In root mode, also prove the pre-commit hook actually fires and passes (a throwaway commit or dry run).

A scaffold that hands off with a failing or unproven check is not done. Fix or remove the offending piece before proceeding.

**Done when:** every verify command passes, and you have shown the user the passing output.

## 4. Hand back to the facet chain

Return to `SKILL.md`'s facet chain; `cmk:repo-config` runs in it after
`cmk:agent-instructions` and writes `docs/agents/` (verify commands, tracker, labels,
release steps). Do not write `docs/agents/` from here.

**Completion criterion for the whole skill:** from the repo root, one command installs dependencies and one command runs the target's verify suite green — state both commands explicitly in your final summary (in subpackage mode, scope the verify command to the new package).
