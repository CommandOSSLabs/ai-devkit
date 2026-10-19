---
name: cmk:acceptance-ui
description: Use to validate a frontend against its spec by driving it in the user's browser through kimi-webbridge — click, type, reload — and asserting visible state and persistence, before merging. Not a Playwright harness. Covers the flows component tests mock away. Also persists the local run command when the repo has none.
version: 2.0.0
---

# Acceptance — UI

Drive the running app in the user's Chrome or Edge through kimi-webbridge.
Click, type, submit, reload, and assert on what is actually on screen.
Component tests mock the network; this proves the wired stack. A fresh
headless browser is a different session — it is not this drive, and this
skill does not install one.

Invoked by `cmk:acceptance` with a slice of the acceptance ledger, or run
directly against a frontend change. Work through the ledger in order.

## 1. Get the app running — and persist how

Read `docs/agents/project.md` for **Run locally (dev)**. Start the frontend (and
any backend it calls) with the recorded commands; if absent, discover them,
start the app, confirm it loads in a browser, then WRITE them into project.md
under `## Run locally (dev)`. *Done when: the app loads AND the commands are
recorded.*

**Preconditions — auth, data, environment.** If the flows need a logged-in
session, a seeded account, or environment configuration, discover how the repo
provides them and record it in project.md. The signed-in browser is the
session. Do not mint a `storageState` file for a headless runner. A run that
stalls on a login wall stops for the user to sign in once in the drive's tab,
then continues. An empty screen is not a pass.

### UI / accessibility standards (optional)

**Load:** `cmk:system-docs`'s `references/consult-recipe.md`.  
**Paths:** `docs/rules/common/ui.md`, `docs/rules/common/accessibility.md`.  
Consult when Approved; no-op when absent; suggest once
`/cmk:system-docs standards/ui|accessibility` if material; never auto-invoke.

## 2. The driver is kimi-webbridge

Follow the `kimi-webbridge` skill. One session name for this feature, on every
command. First `navigate` uses `newTab:true`. `find_tab` with `active:true`
borrows the user's tab — do not. If the daemon is down, start it. If the
extension is not connected, relay the help page that skill names and stop.
Do not install `@playwright/test`, Cypress, or any other browser harness for
this pass, and do not drive the flow in a fresh headless browser because one
is already in the repo. *Done when: the drive tab is open on the app through
kimi-webbridge, or the extension-not-connected stop is on the record.*

## 3. Drive each checklist flow

For each UI item in the ledger, act as a user. `snapshot` to find the control
by role or name, then `click` or `fill`. Assert visible outcomes — text on
screen, the input cleared, list order, an error message shown — and quote
that text into the ledger. Where the criterion says "persists", `navigate` to
the same URL again and assert the state survived. Where the check is what the
server stored, `network` `start` before the action and `detail` before `stop`,
and record status plus the response fact. Map requirement IDs in the ledger,
not in application source.

## 4. Triage what breaks

No failure is waved away. Re-drive the failing flow once:

- **Deterministic failure on a user-visible outcome** — wrong text, wrong
  status, a missing element that should render — is a **product defect**.
  REQUIRED SUB-SKILL: use `cmk:debug`. The red loop is this same webbridge
  drive, not a new browser suite. A regression for the fix lands in the repo's
  existing test stack via `cmk:tdd`.
- **Non-deterministic** (passes on re-drive) or a **drive fault** — a ref that
  no longer matches, a missing wait, absent seed state — is fixed in the
  drive, not by standing up another harness.

Only a deterministic failure on a real outcome goes to `cmk:debug`.
*Done when: every UI flow passes on a fresh webbridge drive.*

## 5. Record the drive

Write `.skills/<CODE>/cmk:acceptance-ui.md`: one block per flow, the quoted screen
text, the reload result, and pass or fail. That file is the acceptance
evidence. Note results in the ledger. Do not commit a browser-harness suite
from this pass. *Done when: the record is on disk and every flow in it passed.*

## Rationalizations

| Thought | Reality |
|---|---|
| "No Playwright, so I'll install it and CI can re-run" | This pass is the user's browser. Do not create that harness here |
| "Headless is more reliable" | It is a different session. Flows that need the signed-in browser never run there |
| "The repo already has a browser suite, so drive that" | Leave it. This acceptance drive is still kimi-webbridge |
| "A login wall means the feature failed" | Stop for one sign-in in the drive tab, then continue |

## Red Flags

- Adding a browser test dependency or config for this pass
- A pass recorded from a fresh headless browser
- `find_tab` with `active:true`
- A login-wall screenshot treated as the flow's result
