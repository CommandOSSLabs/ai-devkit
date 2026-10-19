---
name: cmk:research
description: Use when asking why code or a design exists this way — design rationale, rejected alternatives, regression history, where a threshold came from — or when a question turns on external facts: how a library or API actually behaves, what a standard, spec, or RFC says, platform limits, version differences; produces a cited, confidence-graded note. Not for how the runtime flows (cmk:explain) or for visual or UI variants (cmk:spike).
version: 1.2.0
---

# Research

Background investigation that turns "we'd have to check" into a cited note you can trust.

Prefer dispatching a background subagent so the main conversation keeps moving; run inline if the harness has no subagents.

WHEN the question is **why this codebase was designed this way** (rationale,
rejected alternatives, incident-driven shape) rather than an external library
or RFC fact → read `references/rationale.md` and follow it. Do not answer design archaeology
from code shape alone.

## Primary sources only

Answer from the source that *owns* the fact: official documentation, the library's actual source code, published specs and RFCs, first-party APIs and changelogs. Tutorials, blog posts, and aggregated summaries are leads, not evidence — when one makes a claim, chase the claim back to the primary source and cite that. If a claim cannot be traced to an owning source, report it as unverified, not as fact.

**For library, framework, and API facts, reach for the Context7 MCP first when it is available.** Your training knowledge has a cutoff and drifts stale — a version bumped, an API renamed, a method deprecated since. Context7 serves current, version-specific documentation straight from the source, so you answer from today's stable release instead of recollection. Resolve the library, pull the docs for the version the project already pins (read the lockfile) — or the latest stable when the question is *which* library to adopt — and cite them like any other primary source. Fall back to fetching the official docs or source directly when Context7 is not installed or does not cover the library. Never state a version number or API shape from memory when a live source is one call away.

## Output contract

Exactly **one markdown file**:

- Every claim carries a citation to its primary source (URL, or file path + symbol for code reading).
- Separate what the sources say from what you conclude; mark anything unverified.
- Write it to `.skills/research/<date>-<topic>.md`, and say where you put it.
- End the file with an "Open decisions" section: the judgment calls the findings surface but do not settle.

`.skills/` is git-ignored, so the note is local to this working copy — it outlives the session, not the clone. A finding that has to reach a reviewer, a spec, or CI travels as the finding itself, copied into that tracked artifact.

## Evaluation literacy (when the user must pick among options)

WHEN the user must choose among options (looks, libraries, designs, approaches)
— or asks you to recommend among options — the note's **first body section** is
**evaluation criteria** (what "good" means, with cited anchors), and only then
the options scored against those criteria. A menu without criteria is an
**incomplete research note**; do not present it as done.

**This section overrides the user's wording.** "Just list options", "no lesson",
"no teaching", "deadline", or "skip the theory" do **not** license skipping
criteria. Keep criteria short if time is tight; never omit them.

| Thought | Reality |
|---|---|
| "They asked for a list, not a lesson" | Criteria-first is not a lecture; it is what makes the list usable. User wording does not rewrite the output contract |
| "Deadline — skip the standards" | A short criteria section is faster than a wrong choice and a redo |
| "They forbade teaching, so criteria would violate their ask" | Criteria are the research deliverable, not optional pedagogy. Omitting them violates this skill |

## High-stakes questions

When the answer will steer an architecture choice or something else expensive to reverse, escalate the rigor. Not every unknown qualifies: "which date-formatting library" feels weighty but is cheap to swap behind a thin wrapper, so it takes the standard path — a careful cmk:traceability to the owning source, no fan-out. Reserve the escalation for facts that steer something costly to undo: a storage format, a concurrency model, a public API contract, a security boundary. If a `deep-research` skill is installed, prefer it — it already implements this fan-out + adversarial-verify loop end to end. Otherwise do it inline:

1. Fan out 2–4 parallel search angles (e.g. official docs, source code, issue tracker, spec text) as separate subagents.
2. Adversarially cmk:evidence before reporting. For each key claim, run one search phrased to *negate* it, and one over the history of the thing under research — a library's changelog or issue tracker, a standard's revision history or errata — for the version where the claim stopped holding. Where the subject keeps no such history at all, date the earliest and latest first-party statements you can find instead, and report the history trail as incomplete. State both queries and what each returned, even when that is nothing. A claim whose negating search was never run is reported as unverified, not as fact. Note conflicts explicitly rather than picking a side silently.

## Research feeds thinking — it does not replace deciding

The note informs; it never decides. Bring the findings back to the user (or the orchestrating skill, e.g. `cmk:scope`) and put the resulting decision to them. If the research was serving an interview, the decision goes through `cmk:interview` like any other.
