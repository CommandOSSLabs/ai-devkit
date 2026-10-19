---
name: cmk:acceptance-api
description: Use to validate a backend HTTP/RPC API — REST or RPC endpoints — against its spec by driving the running server as a real client — curl/http requests asserting status codes, body shape, and persistence — before merging. Covers the happy paths and the edge/error criteria that unit tests pass in isolation but miss against a live server. Also discovers and persists the local run command when the repo does not document how to start the backend.
version: 1.0.0
---

# Acceptance — API

Exercise the running server the way a real client will. A unit test passes
against the code's own assumptions; this proves the wire behavior — the status
codes, the JSON shape, the side effects that survive a reload.

Invoked by `cmk:acceptance` with a slice of the acceptance ledger — or run
directly against an API change, in which case first derive the checklist from the
change's acceptance criteria (the spec, or the endpoints touched). Either way,
work through the items in order.

## 1. Get the server running — and persist how

Read `docs/agents/project.md` for a **Run locally (dev)** entry. If it exists,
start the backend with that command. If it does not: discover the command from
the repo (Cargo bins / `tauri` / `package.json` scripts / Makefile), start the
server, confirm it answers (a health route, or the first checklist request
returning anything), then WRITE the command and its ready-signal into project.md
under `## Run locally (dev)`. *Done when: the server answers a request AND the
start command is recorded in project.md.*

**Preconditions — auth, data, environment.** If any endpoint needs
authentication (a token, a seeded test account), fixture/seed data, or
environment configuration (env vars, a test database), discover how the repo
provides them and record it in project.md alongside the run command. An
acceptance run that stalls on a `401` or an empty database is testing the
harness, not the feature — resolve the precondition and note it, rather than
marking the item unverifiable.

### API standards doc (optional)

**Applicability:** checklist items are HTTP/RPC APIs. **Load:**
`cmk:system-docs`'s `references/consult-recipe.md`. **Path:** `docs/rules/common/api.md`.
Consult when Approved; no-op when absent; suggest once `/cmk:system-docs standards/api`
if the gap is material; never auto-invoke.

## 2. Turn each checklist item into a real request

For each API item in the ledger, write the concrete request a client sends —
method, path, headers, body — and its expected response: status, the body
fields (names, casing, id type), and any side effect. Cover the edge criteria
explicitly: empty/whitespace field → the documented error, unknown id → the
documented status, malformed body, repeated calls.

## 3. Exercise against the live server

Send each request (`curl` / `http` / a script) and assert the FULL expectation,
not just a 2xx: status, body shape, and — where the criterion says "persists" —
read it back with a fresh GET; where it says "across restart", restart the
server and read again. Record actual-vs-expected in the ledger for every item.
*Done when: every API item has an observed result.*

## 4. Fix what breaks

REQUIRED SUB-SKILL: use `cmk:debug` — the failing request is already your
red-capable loop. Fix the root cause, add the regression test, re-run the item.

## 5. Promote to a durable test

Turn the exercised requests into a committed test that hits the server (or the
handler at its real seam), tagged with the requirement ID per the conventions in
`docs/agents/project.md`, so it joins the verify suite and guards the behavior
after this run. *Done when: the durable test is committed, tagged, and green.*
