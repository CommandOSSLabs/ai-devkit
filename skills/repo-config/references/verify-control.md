# Cold-start drive recipe (Decision M)

Load this file **only when Decision M runs**, and again for its write and prove
steps.

A later agent has never seen this app. `npm test` does not teach it how to boot
the process, click a feature, and prove the result survived reload. That agent
reads `docs/agents/verify.md` (and the **Run locally (dev)** table in
`project.md`). `cmk:acceptance`, `cmk:acceptance-ui`, `cmk:acceptance-api`, and
`cmk:dogfood-plan` consume it.

## Offer

Recommend **Yes** when a runnable surface exists: a `dev`/`start` script, a
Makefile run target, a CLI bin, or a process that listens. Recommend **Skip**
for a library with no process to drive.

Explainer for the user (two or three sentences): this file is the cold-start
control — Launch, Doctor, Drive, Evidence, Cleanup, plus one file per
user-facing feature. Skip only if nothing here can be started.

Wait for Yes or Skip. Do not generate on a silent default.

| Thought | Reality |
|---|---|
| "`npm test` is enough — cmk:acceptance-ui will discover the rest" | RED: a notes app with `"dev": "vite"` left **Run locally** blank and wrote no drive file. The next agent invented clicks. |
| "I'll fill Run locally later" | Empty rows are what shipped. Fill them in this decision. |
| "A Playwright spec is the recipe" | Specs are durable tests. The recipe is how a cold agent launches and drives before those specs exist. |
| "I'll install Playwright so the drive is repeatable" | A web UI is driven with kimi-webbridge in the user's browser. Do not create a browser harness for the recipe |

**Done when (decision):** Yes or an explicit Skip.

## Interview the repo (Yes only)

Answer from the codebase; ask only what you cannot observe:

- **Surface:** web UI, CLI/TUI, API, desktop, library. Pick the primary; note the rest.
- **Run:** the repo's own documented start command. Ports, env, seed, auth.
- **Drive:** kimi-webbridge for a web UI; curl for HTTP; a PTY for a CLI. Do not install a new browser harness.
- **Observe:** screenshots, transcripts, response bodies, logs, DB/files.
- **Isolate:** can two instances run side by side? If not, say so — do not
  double-drive a shared session.

## Write (Step 4 item 12)

IF Skip: write no `docs/agents/verify.md`; leave **Run locally** rows blank only
when that surface does not exist.

IF Yes:

1. Fill `docs/agents/project.md` **Run locally (dev)** from what you observed —
   start command and ready signal per surface that exists. Do not leave a
   surface that exists as an empty row.
2. Write `docs/agents/verify.md` from `references/templates/agents/verify.md` (same seed
   resolve order as other pack templates). Replace every placeholder. No
   leftover `<angle-brackets>`.
3. Seed **Features** with the top 3–5 user-facing features you can name from
   routes, commands, or menus. Each feature file-section answers: what it is,
   how a user reaches it, how to drive it, what observable end state (including
   **reload / re-open / re-read**) proves it. A final screen without a persist
   check is not proof — same bar `cmk:dogfood-plan` uses for `persist` cases.
4. **Evidence** lives under `.skills/verify/` (gitignored). Cleanup must not
   delete evidence.

## Prove (Step 6, Yes only)

A recipe that was never executed is a draft.

1. **Doctor** — run the ready signal (port answers, health URL, prompt). Wiring
   failure: fix the recipe and **Run locally** until Doctor passes. Cannot start
   the app as-is: record the blocker in `verify.md` and in the Step 6 table;
   setup may finish with `drive: unproven` — first `cmk:acceptance` run must
   prove it.
2. **Drive one feature** — only after Doctor passes. One mapped feature, end to
   end, including the persist check. Capture evidence. Then Cleanup (stop what
   you started; keep evidence).
3. Classify like other Step 6 rows: wiring vs content vs pass.

Do not run the whole e2e suite here. One feature is enough that the recipe is
not fiction.

**Done when (Yes):** `docs/agents/verify.md` exists with no placeholders, **Run
locally** rows for existing surfaces are filled, Doctor ran, and either one
feature was driven or `drive: unproven` plus the blocker is recorded.
**Done when (Skip):** the skip is explicit in the conversation; no verify file.

## Maintain

WHEN features drift or Launch/Doctor fail after app changes: re-read the
feature map under Features/, re-run Doctor + one Drive, and patch
`docs/agents/verify.md` with evidence. Do not edit product code in that pass.

