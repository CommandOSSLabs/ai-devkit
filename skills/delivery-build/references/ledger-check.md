# Ledger check

Loaded from `SKILL.md` **Ledger check**, applied by every execute-family
route before the first dispatch or Task 1.

Make `.skills/` local-only:

```
grep -qxF '.skills/' .gitignore 2>/dev/null || { printf '.skills/\n' >> .gitignore && git commit -m 'chore: ignore local skills artifacts' -- .gitignore; }
```

Read `.skills/<CODE>/progress.md` if it exists. Every task (and, on
story-unit, every unit) it marks complete IS complete — resume at the first
item it does not list.

**Lint baseline.** When `progress.md` has no `Lint baseline:` line, run the
project's lint and format commands once at the feature base before the first
task, and record each pre-existing finding (file, rule) under
`Lint baseline:` — or `Lint baseline: clean`. Every task gate is judged
against it, so a red lint run neither blocks the build nor hides new
findings. A tool that stops at the first failing unit (e.g. a crate that
fails to compile under `-D warnings`) also hides everything after it: record
which units it never reached, and lint those per unit at the task gate.

A `Verified:` line is a completion claim. REQUIRED SUB-SKILL: use
`cmk:evidence`. The line itself is the slot: `Verified: <what holds> — by
<command>, covering <what>`. An ID alone is not a checkpoint.
