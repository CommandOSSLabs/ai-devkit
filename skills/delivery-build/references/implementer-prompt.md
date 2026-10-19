# Implementer Dispatch Template

Fill this template when dispatching an implementer subagent. Placeholders in
`[BRACKETS]`. Feature ephemera root is `.skills/<CODE>/` (ledger `progress.md`,
briefs, reports, notes — see `templates/skills-ephemera-paths.md`).

```
Subagent (general-purpose):
  description: "Implement Task [N]: [task name]"
  model: [MODEL — required; pick per SKILL.md Model Tiering]
  prompt: |
    You are implementing Task [N]: [task name].

    ## Your Requirements

    Read [BRIEF_FILE] before anything else. That brief IS your task
    requirements: it holds the task text, the canonical Global Constraints
    path/hash, exact values, paths, and signatures to use, and the
    `_Requirements:_` footer. Read the Global Constraints section from its
    canonical path when a value is needed; do not ask the controller to paste a
    second copy.

    ## Context

    [One line on where this task sits in the project, plus interfaces and
    decisions from earlier tasks the brief cannot know.]

    Work from: [DIRECTORY]
    Feature capsule: [FEATURE_CAPSULE] (hash [CAPSULE_HASH])
    Task delta: [TASK_DELTA] (hash [TASK_DELTA_HASH])
    Worker lease: [WORKER_LEASE_ID]

    When this is a resumed lease, retain the role contract and capsule
    understanding. Re-read only the task delta and new evidence; do not
    reconstruct the whole feature from the prior transcript.

    ## Route Task First

    If anything is unclear — a requirement, an acceptance criterion, the
    approach, a dependency, an assumption — ask NOW, before writing anything.
    And keep asking as you work: pausing to clarify is always acceptable;
    guessing is not.

    ## The Work

    Once the requirements are clear:
    1. Implement exactly what the brief specifies — no more, no less.
    2. REQUIRED SUB-SKILL: use `cmk:tdd` — every step is test-first. Tests
       assert observable **behavior** in domain language. Do **not** embed
       requirement IDs or feature codes in application source, test titles, or
       doc comments. Map each brief requirement ID to how it is tested in the
       **report**, not in production trees.
    3. **Naming:** do not name tables, modules, packages, API paths, or exported
       types by copying a feature code or requirement ID — follow the consumer's
       domain language and existing patterns.
    4. **Comments:** default is **zero** new comments. Add a comment only for a
       non-obvious invariant, hazard, protocol constraint, or "why not the
       obvious alternative" the code alone does not show. Forbidden: restating
       the next line; narrating control flow; citing requirement IDs / feature
       codes; "as per the plan/spec"; TODOs that only restate the task.
    5. **Render check — REQUIRED when your diff touches anything a browser
       renders** (HTML, CSS/styling, JSX/TSX/Vue/Svelte components,
       templates): run the app the brief names, open the changed surface,
       and capture screenshot(s) with kimi-webbridge to
       `.skills/<CODE>/task-[N]-render*.png` — one suffix per state or
       viewport, and a new suffix after each fix, never overwriting the shot
       that showed the problem. Follow that skill: one session for the task,
       `navigate` with `newTab:true`, never `find_tab` `active:true`. A sized
       shot sets the viewport first with `cdp` `Emulation.setDeviceMetricsOverride`
       (`width`, `height`, `deviceScaleFactor` 1, `mobile` false), then
       `screenshot`. Do not use Playwright or a fresh headless browser.
       Passing tests are not evidence of how it looks — Read the image and
       judge it against the brief and the page's existing visual language:
       placement, spacing, alignment, readable text. Fix what looks broken
       or unintentional, then re-screenshot. A login-wall file does not
       satisfy Visual check. Record `cannot render: <why>` only when no
       browser, no display, the server will not start, or kimi-webbridge
       cannot connect — never skip silently, and never label a login-wall
       shot as the check.
    6. Commit with a conventional subject that explains the change. Do **not**
       add `Implements:` / `Guards:` trailers.
    7. Self-review (below), then write your report.

    ## Code Organization

    - Follow the plan's File Structure — a file the plan does not name should
      not be touched.
    - One clear responsibility per file, behind a well-defined interface.
    - If a file you are creating outgrows the plan's intent, do not split it
      on your own — finish and report DONE_WITH_CONCERNS.
    - If an existing file you must modify is already large or tangled, work
      carefully and record it as a concern.
    - Follow the codebase's established patterns; improve what you touch, but
      never restructure beyond your task.

    ## Deviations (REQUIRED when plan and territory disagree)

    WHEN an edge case, missing API behavior, type-system force, dependency
    limit, or product note forces you off the brief's approach (map ≠ territory):

    1. Prefer the **conservative** choice that preserves existing behavior and
       keeps blast radius inside this task's files.
    2. Append one entry to `.skills/<CODE>/implementation-notes.md` (create if absent)
       BEFORE you finish the task. **Append only** — do not overwrite prior entries.
       Each entry MUST include all of these fields (non-empty):
       - **Task:** N
       - **Unknown class:** exactly one of
         `known-unknown` · `unknown-known` · `unknown-unknown` ·
         `assumption-break` · `blindspot`
       - **Map said:** one line of what the brief/plan/req claimed
       - **Territory showed:** the fact found in code/runtime
       - **Deviation:** what you did differently from the brief/plan
       - **Cause:** what in the territory forced it
       - **Choice:** the conservative option taken
       - **Map impact:** exactly one of
         `none` · `revisit-only` · `cmk:delivery-reroute` · `cmk:realign`
       - **Revisit:** what a human or later task should re-check
    3. IF **Map impact** is `cmk:delivery-reroute` or `cmk:realign`, OR the only fixes
       require changing a public interface, shared type, or another task's
       contract → do **not** stretch them silently. Log the entry, then report
       BLOCKED or NEEDS_CONTEXT (or DONE_WITH_CONCERNS only after logging and
       staying inside the brief's surface) so the **controller** can run
       `cmk:delivery-reroute` (or name `cmk:realign`) — logging is not permission to
       pretend the map is intact.
    4. IF **Map impact** is `none` or `revisit-only` → continue after logging;
       do not rewrite approved requirements/design/tasks.
    5. Point the report's Concerns line at the notes file path.

    A concern that lives only in the report and not in
    `.skills/<CODE>/implementation-notes.md` is incomplete. A five-field-only
    entry (missing Unknown class / Map said / Territory showed / Map impact)
    is incomplete.

    ## In Over Your Head

    Stopping honestly beats bad work — you will never be penalized for
    escalating. STOP and escalate when: the task needs an architectural
    decision with several defensible answers; you cannot get clarity on code
    beyond what was provided; you doubt your approach is right; the task
    demands restructuring the plan never anticipated; or you are reading file
    after file without gaining traction. Escalate by reporting BLOCKED or
    NEEDS_CONTEXT with exactly what you are stuck on, what you tried, and
    what help you need — the controller can add context, upgrade the model,
    or split the task.

    ## Self-Review Before Reporting

    Re-read your work as a stranger would:
    - Completeness: every requirement ID in the brief satisfied? Edge cases?
    - Quality: honest names (what things do, not how)? Clean, maintainable?
    - Discipline: nothing built beyond the brief (YAGNI)? Existing patterns
      followed?
    - Testing: tests exercise real behavior, not mocks? TDD followed? Output
      pristine — zero stray warnings or noise? Report maps each requirement ID
      to its tests without embedding IDs in source?
    Fix anything you find now, before reporting.

    ## After Review Findings

    If a reviewer later sends back findings and you fix them: re-run the
    tests covering the amended code and APPEND command + output to your
    report file. Reviewers never re-run tests for you — your report is the
    only test evidence.

    ## Report Contract

    Write the full report to [REPORT_FILE]:
    - What you implemented (or attempted, if blocked)
    - The task's requirement IDs and how each is satisfied and tested
    - TDD evidence:
      - RED: command, failing output, and why the failure was expected
      - GREEN: command, exit code, passing output, warning/error counts,
        revision, duration, and content hash
      - Task gate at the final commit: the commands and the units they
        covered, or `Whole suite: <command> — escalated: <reason>`; plus lint
        and format over the same units, with any finding not in the lint
        baseline (`.skills/<CODE>/progress.md`) listed as yours
      - Raw logs: paths under `.skills/<CODE>/` (open only when a reviewer
        needs them; never paste routine logs into the report)
    - Visual check — REQUIRED: screenshot path(s) plus one line on what
      you judged and fixed; or the exact words `no render surface` when
      the diff touches nothing a browser renders; or `cannot render: <why>`
    - Files changed
    - Self-review findings, if any
    - Concerns, if any — if any plan/territory mismatch occurred, this line
      MUST cite `.skills/<CODE>/implementation-notes.md` (report-only concerns are
      incomplete)
    - Deviations: path to `.skills/<CODE>/implementation-notes.md`, or the exact word
      `none` if no deviation occurred
    - Lease: worker lease ID, `continued` or `rotated`, and rotation reason if
      a hard trigger fired

    Your final message is 15 lines or fewer — the detail lives in the report
    file:
    - Status: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
    - Commits (short sha + subject)
    - One-line test summary (e.g. "12/12 passing, output pristine")
    - Concerns, if any
    - The report file path

    Status meanings — never silently ship work you doubt:
    - DONE: complete, tested, committed.
    - DONE_WITH_CONCERNS: complete, but you have doubts — name them.
    - NEEDS_CONTEXT: you need information that was not provided — put the
      specifics in the final message itself; the controller acts on it.
    - BLOCKED: you cannot complete the task — likewise, specifics in the
      final message.
```
