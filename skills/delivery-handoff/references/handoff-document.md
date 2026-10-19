<!-- Ported from jdk `write-handoff` 1.0.2 (ADR 0001). -->
# Hand Off

Compact this conversation into a document a fresh agent can resume from. Write it to the **OS temp directory** (`$TMPDIR`, falling back to `/tmp`; `%TEMP%` on Windows), never into the workspace — a references/handoff-document.md is session ephemera, not a project artifact. Name it `handoff-<topic>-<timestamp>.md` and tell the user the absolute path.

If the user passed an argument to this skill, treat it as what the next session will focus on and orient the whole document around that focus — trim anything the focus makes irrelevant.

## Contents

- **Goal** — what the work is ultimately for, in the user's terms.
- **Current state** — what is done, what is in flight, exact branch/worktree, whether the working tree is dirty.
- **Tried and rejected** — every approach that was attempted or considered and dropped, each with *why*. This section saves the successor from re-walking dead ends; it is usually the most valuable one.
- **Knowns / unknowns (when present)** — path to the latest knowns inventory and a one-line summary of what it locks, what it leaves open, and which blindspots are still unresolved; point at `.skills/*-knowns.md` or `.skills/*-scan.md` Blindspot when those files exist.
- **Deviations (when present)** — path to `.skills/<CODE>/implementation-notes.md`; one-line summary of each logged deviation **and** the count of entries whose **Map impact** is not `none` (or state zero non-none); the successor must not rediscover them from chat memory.
- **Next actions** — concrete, ordered, starting with the very next command or edit.
- **Suggested skills** — which skills of this set the successor should invoke, and at which step (e.g. "resume `cmk:delivery-build`'s `references/continuous.md` at task 4", "run `cmk:evidence` before claiming task 3 done"). Name `/cmk:explain <range>` for the user when a multi-task branch is ready for author self-check before merge (do not run it yourself).
- **Team context (when present)** — if `docs/agents/project.md` has `## Team` with a non-empty **roster** or band override, one line: band + how packaging applies; Small/Multi: if the roster or ownership notes name an owner for this work, state who owns the next actions; if they do not, omit the owner line. Missing Team → omit the whole section (do not invent a team).

## Rules

- **Reference, never duplicate.** Specs, plans, ADRs, issues, commits, diffs — cite them by path, URL, or hash. Copying their content bloats the references/handoff-document.md and forks the truth; the artifact on disk is authoritative.
- **Redact secrets.** API keys, tokens, passwords, personal data — replace with a placeholder naming where the real value lives. The doc may become another agent's prompt.
- **Decisions the user already made are recorded as settled**, with their rationale — the successor must not re-open them or re-ask.

## Optional: launch the successor

Only if the user asks: start a background agent seeded with the handoff document as its prompt, with a descriptive display name, running in the current working directory. Confirm the mechanism your harness provides before promising it; without one, the path you already gave the user is the whole hand-off.

## Completion criterion

Read the finished document as a skeptic: could a fresh agent, given only this file plus the artifacts it references, resume the work without asking the user anything already answered in this conversation? If any question survives that test, the answer belongs in the doc — add it before finishing.
