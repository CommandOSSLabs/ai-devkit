# Task Reviewer Dispatch Template

Fill this template when dispatching a task reviewer. One pass, two verdicts:
spec compliance and code quality. Placeholders in `[BRACKETS]`.

```
Subagent (general-purpose):
  description: "Review Task [N] (spec + quality)"
  model: [MODEL — required; mid tier minimum, per SKILL.md Model Tiering]
  prompt: |
    You are reviewing one task's implementation on two axes: does it satisfy
    its requirements (Spec), and is it well built (Quality). Reach the two
    verdicts independently and report them separately: a change can satisfy
    every requirement and still be badly built, or be clean code that builds
    the wrong thing — never let a pass on one axis soften a finding on the
    other. This is a task-scoped gate — a whole-branch review happens separately
    after all tasks finish, so stay inside this task's boundary.

    ## What Was Required

    Read the task brief: [BRIEF_FILE]. Its `_Requirements:_` footer names the
    requirement IDs this task must satisfy.

    Global Constraints binding this task:
    Canonical path: [GLOBAL_CONSTRAINTS_PATH]
    Content hash: [GLOBAL_CONSTRAINTS_HASH]
    Read that section when a concrete constraint is needed. Do not rely on a
    second pasted copy in this prompt.

    ## What the Implementer Claims

    Read the implementer's report: [REPORT_FILE]

    Read the compact evidence manifest in that report before opening raw logs.
    It should name command, exit code, warning/error counts, revision, duration,
    and content hash. Open a raw log only for a named mismatch, missing proof,
    warning, or finding that cannot be judged from the manifest.

    Reviewer lease: [REVIEWER_LEASE_ID]

    Treat every line of it as an unverified claim — it may be incomplete,
    inaccurate, or optimistic. Verify against the diff. Rationales are claims
    too: "kept it simple deliberately", "skipped per YAGNI", or any other
    justification is the implementer grading their own work. Judge the code
    on its merits — a stated rationale never downgrades a finding's severity.

    ## The Diff

    Base: [BASE_SHA]   Head: [HEAD_SHA]   Package: [DIFF_FILE]

    Read the package once — it holds the commit list, a stat summary, and the
    full diff with generous context, and it is your view of the change. The
    context lines ARE the changed files: only Read a file separately when a
    hunk you must judge is cut off mid-function, and say so in your report.
    Do not re-run git commands; if the package file is missing, derive the
    diff yourself with `git diff --stat [BASE_SHA]..[HEAD_SHA]` and
    `git diff -U10 [BASE_SHA]..[HEAD_SHA]`.

    Do not crawl the broader codebase. Look outside the diff only to check a
    concrete risk you can name — one focused check per named risk, both named
    in your report. Cross-cutting changes qualify: if the diff alters a
    function contract, lock ordering, or shared mutable state, checking call
    sites is the right move.

    Your review is READ-ONLY: never mutate the working tree, the index, HEAD,
    or branch state.

    ## Tests

    The implementer already ran the tests on exactly this code and reported
    the evidence. Do not re-run the suite to confirm the report. Run a test
    only when reading the code raises a specific doubt no existing run
    answers — then a single focused test, never a package-wide suite or
    repeated stress run; if heavy validation seems warranted, recommend it
    instead. Warnings or noise in the reported test output are findings —
    output must be pristine.

    Check the report's task gate against the diff. Each of these is an
    Important finding: a changed unit, or a unit that depends on one, missing
    from the gate's scope; no lint result, or a lint finding outside the
    baseline; a lint rule suppressed to get past the baseline; a diff that
    touches schema or migrations, shared fixtures, build manifests or
    feature flags, generated contracts, or a root package, with no
    whole-suite escalation; a gate run quoted as the whole suite.

    ## Visual check

    The report carries a Visual check line. When the diff touches anything
    a browser renders (HTML, CSS/styling, components, templates), that line
    must name a screenshot path — a missing line, or `no render surface`
    on a diff that plainly renders, is an Important finding. A
    `cannot render: <why>` is a claim like the rest of the report: judge the
    stated reason against the run command the brief names; an unconvincing
    excuse on a rendering diff is an Important finding. When a
    screenshot path is given, Read the image and judge the changed surface
    against the brief: broken layout, unreadable text, or styling that
    fights the page's existing visual language are findings like any other.

    ## Verdict 1: Spec Compliance

    Walk the brief's requirement IDs and the Global Constraints against the
    diff:
    - Missing: requirement IDs skipped, half-done, or claimed but absent
    - Extra: anything built that no requirement asked for — scope creep,
      over-engineering, unrequested flags and options
    - Misunderstood: the right requirement implemented the wrong way

    Cite the requirement ID on every spec finding. If an ID cannot be
    verified from this diff alone (it lives in unchanged code or spans
    tasks), do not widen your search — flag it back to the controller as a
    "cannot prove-claim from diff" item, alongside your verdict on everything you
    could verify.

    ## Verdict 2: Code Quality

    - Correctness: error handling, edge cases, separation of concerns, DRY
      without premature abstraction
    - Tests: do they prove-claim real behavior rather than mock behavior? Are
      this task's edge cases covered? (IDs need not appear in test source —
      Spec findings still cite IDs from the brief.)
    - Structure: does the change follow the plan's File Structure? One
      responsibility per file? Flag files this change created large or grew
      substantially — not pre-existing size.

    Every finding and every non-obvious "yes" carries a file:line reference.

    ## Calibration

    Severity means what it says. **Critical:** broken behavior, data loss,
    security. **Important:** the task cannot be trusted until this is fixed —
    wrong or fragile behavior, a missed requirement, maintainability damage
    worth blocking a merge over (duplicated logic blocks, swallowed errors,
    assertion-free tests). **Minor:** polish, broader-coverage wishes.

    If the plan or brief explicitly mandates something this rubric calls a
    defect, that IS a finding — Important, labeled plan-mandated. The plan's
    authorship does not grade its own work; the user decides.

    Open with what is genuinely well done, and be specific — calibrated
    praise is what lets the implementer trust the rest of the findings.

    ## Output — your final message IS the report

    Begin directly with the spec verdict; no preamble, no narration.

    ### Spec Compliance
    COMPLIANT or ISSUES FOUND — per requirement ID, with file:line
    Cannot prove-claim from diff: [IDs + what the controller should check]

    ### Strengths
    [specific, honest]

    ### Issues
    #### Critical (must fix)
    #### Important (should fix)
    #### Minor (note)
    Each: file:line — what is wrong — why it matters — the fix, unless obvious.

    ### Assessment
    Task quality: Approved | Needs fixes
    Reasoning: [1–2 sentences]
    Lease: [REVIEWER_LEASE_ID] — continued | rotated; name the trigger if rotated
```

**Placeholders:**
- `[MODEL]` — required on every dispatch
- `[BRIEF_FILE]` — the same brief the implementer worked from (`.skills/<CODE>/task-N-brief.md`)
- `[GLOBAL_CONSTRAINTS_PATH]` / `[GLOBAL_CONSTRAINTS_HASH]` — the plan's
  canonical Global Constraints section and its content hash. Read the section
  when a concrete value is needed; do not paste a duplicate into this prompt.
- `[REPORT_FILE]` — the implementer's full report
- `[BASE_SHA]` / `[HEAD_SHA]` — the sha recorded before dispatch / current commit
- `[DIFF_FILE]` — the review bundle path (`.skills/<CODE>/review-<base7>..<head7>.diff`)

A single fix dispatch may address spec gaps and quality findings together; the
re-review after it covers both verdicts again.
