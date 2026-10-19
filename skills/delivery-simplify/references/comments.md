<!-- Ported from jdk `no-comments` 1.0.0 (ADR 0001). -->
# No comments

Default is zero comments. Information that matters lives in names, types, tests, or structure — not prose glued to the next line.

<HARD-GATE>
OVERRIDE SHIP (2026-09-08): prior pack judgment preferred cmk:delivery-simplify's softer
comment discipline. User override required this extreme skill anyway.
</HARD-GATE>

## Scope

Caller's files or diff. Else `git diff main...HEAD` plus the working tree.

## Exceptions (keep only these)

- Legal / license headers
- Doc comments that define a **public** API contract callers depend on
- Non-obvious behavior forced by an **external** dependency, platform, vendor, or protocol we cannot reshape — cite the external constraint
- `prettier-ignore` / equivalent formatter fences
- Issue or RFC links that encode a constraint code cannot express

Everything else dies: narration, banners, commented-out corpses, "IMPORTANT / do not remove" without a proven external keep, workaround sermons, requirement-ID citations in source, TODOs that restate the task.

Lint/TS suppressions (`eslint-disable`, `@ts-ignore`, `@ts-expect-error`): look up the rule. Correctness or safety rules → delete the suppression and flag the guilty symbol `MUST KILL` for a real fix. Style-only / faulty rules may stay.

Our-code surprises are not keep-list meat for comments — kill the comment and flag `MUST KILL` rename / extract / type / reshape so the code speaks.

## Steps

1. Spawn one read-only subagent with the brief in `references/comment-sicko-brief.md` (verbatim + scope paths). Prefer a different model family from the parent when the harness allows.
2. Triage the report. Reject application-code rewrites by the reviewer, scope escapes, and keep-claims that lack proof of an exception above. Doubt → delete.
3. Apply accepted deletions and trivial in-scope fixes (dead path, unused param) yourself. Shape changes → REQUIRED SUB-SKILL: use `cmk:delivery-simplify` or name `/architect`-style design work; do not widen the fence here.
4. Constraint comments (`do not remove`, `talk to X`): offer the cheapest encoding (type, test, lint, runtime assert). Wait for approval before encoding; unattended runs need caller pre-approval. Else delete and report the constraint open.
5. Report: deletion count, restored keeps with proof, `MUST KILL` flags, encodings offered/done, open work.

## Rationalizations

| Thought | Reality |
|---|---|
| "This comment documents the tricky bit" | Then rename, type, or test until the trick is obvious — the comment is a smell |
| "IMPORTANT means keep" | Scent, not proof. Prove an exception or delete |
| "cmk:delivery-simplify already covers comments" | That pass is soft. This skill is the extreme bar the user asked for |
| "I'll leave it as reference while we fix" | No. Delete now or encode then delete |

## Red Flags

- Keeping a comment "for now" without an exception citation
- Reviewer rewriting application logic
- Restoring a kill without exact exception + proof
- Shipping with unencoded `do not remove` constraints still in source

## Done when

Scoped comments outside the exception list are gone; keeps cite an exception; `MUST KILL` flags and open encodings are listed.
