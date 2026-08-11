---
name: cmk:rule
description: This skill should be used when the user asks to "add a rule that...", "make this a standard", "promote this learning to a rule", "update our coding conventions", "what are our engineering rules", or needs to codify engineering standards into docs/rules/ as enforceable rules and conventions that agents follow during development.
version: 0.4.0
---

# Rule

Codify engineering standards into `docs/rules/`. Rules are enforceable standards organized by domain — `common/` for language-agnostic, `{language}/` for language-specific, `{framework}/` for framework-specific.

## References

Read `references/rule-conventions.md` for placement rules and directory structure.

## Input

Accept whatever the user provides: direct statements, knowledge entries from `docs/knowledge/`, conversation context, code patterns from review, or incident learnings.

## Workflow: Create

1. Understand the rule: what practice to enforce and why.
2. Determine target: subdirectory (`common/`, language, or framework) and topic file. Create new file if no match: `docs/rules/{domain}/{topic}.md`.
3. Write: clear actionable statement, brief rationale, example if not self-evident.
4. Link back to `docs/knowledge/` source when applicable.
5. Add or refresh the topic's row in `docs/rules/README.md`'s Topics table.

## Workflow: Iterate

1. Read the existing rule file in full.
2. Identify what changed and why.
3. Update in place: revise statement, update rationale, add/update examples.
4. Link back to knowledge source when applicable.

## Workflow: Promote

1. Read specified knowledge entries from `docs/knowledge/`.
2. For each entry the user selects: determine target, transform learning into actionable rule, write to `docs/rules/`.
3. User decides what gets promoted — never auto-promote.
4. Add or refresh the topic's row in `docs/rules/README.md`'s Topics table.

## Workflow: Audit

A rule that lands while the codebase still contradicts it teaches the exception, not the rule. When a new or tightened rule has existing offenders, clear them in the same change.

1. **State the test that decides a violation before searching for one.** Write it as a sentence an agent can apply to a case the rule's examples never mention, then apply it first to the rule's own carve-outs and to every disposition an earlier audit recorded. A carve-out that fails the test you just wrote is not a carve-out — reverse it and correct the doc that recorded it in the same change, so no reader can find a rule and a document that disagree about the same case.
2. **Inventory file contents *and* the tracked path list.** These are two separate searches and only the first is obvious: a content grep that reports clean says nothing about offending file names, directory names, test-fixture names, or binary artifact names sitting in the tree. Running only the content search is how a change ends up shipping the very pattern it bans in its own new files.
3. **Resolve every hit rather than triaging by ease.** Rewrite it to state what it actually meant, delete it when it carried no information, or carve it out with a stated reason. Deployed, signed, or measured identity — a wire tag, a name baked into an artifact's measurement, a live stack — is never exempt on principle; it is only blocked behind a compatibility migration, so record it as scheduled work rather than blessing it. Say which of those three each carve-out is; "deployed" and "would be annoying to change" must not read the same in the diff.
4. **Verify with a residual search over both contents and paths, naming each surviving carve-out.** Commit that search rather than throwing it away: it is the executable specification a mechanical gate has to implement later, and the list of named exceptions is the gate's allowlist. A verification that a human has to re-derive from prose is a verification nobody reruns.
5. **Expect the pattern to reappear on the base branch while the change is in review.** Other work merges against the old convention, so a hand sweep is correct exactly once. Treat the recurrence as the argument for landing a mechanical gate, not as a reason to keep sweeping — and if the gate is out of scope here, leave it tracked rather than implied.

A cosmetic sweep is not automatically behavior-free. A contract check that pins a file's identity by whole-content hash fails on any edit to that file, however trivial, and such checks usually omit an auto-update flag on purpose so that re-pinning stays a human re-approval. Prove the guarded property is untouched, then disclose the pin change in review as a judgment call rather than folding it in as a mechanical fixup.

## Workflow: Gate

A hand sweep is correct once; a gate is what keeps a rule true. Build it from the residual search the audit committed, and expect the first draft to be both too loud and too quiet.

1. **Calibrate the pattern against the real tree before designing it.** Run the candidate over the whole repository and read the hits. A rule expressed as a shape rather than a roster usually collapses here — the shape that catches the thing you mean also catches identifiers, fixtures, and standard names that merely look like it, and a gate that cries wolf gets suppressed everywhere. Prefer an explicit list of the things you actually mean, with the one-line edit to extend it.
2. **Assume the boundaries are where it fails, and test each one.** Case, because the same token arrives lowercase through a branch name and uppercase through a citation. Word boundaries, because `_` is a word character, so a trailing `\b` cannot end a match before one and silently misses every snake_case and SCREAMING_CASE spelling. File-type scope, because an extension allowlist fails open on whatever you did not think of. Write the offending spelling as a fixture for each boundary and watch it fail before you fix it.
3. **Scan contents and the tracked path list as two passes.** The same reason as the audit, and the same failure if you skip one.
4. **Give every exemption the narrowest scope that fits its reason.** An immutable string that recurs everywhere is exempted as a token, not as forty file entries that restate one decision and break on unrelated edits nearby. A file whose subject matter is the pattern is exempted whole-file with the count you approved. Each carries a written reason, and anything blocked behind a migration carries the issue that owns its retirement.
5. **Make the approved count measure what the exemption admits.** If the exemption matches by pattern, count matches — counting raw substrings drifts in both directions at once, inflating the budget with text no rule would flag while letting a differently-spelled instance through uncounted. A budget that does not measure the thing it bounds is not a control.
6. **Prefer a carve-out the repository itself validates.** When the exemption is a property of the tree — a citation whose target exists — compute it instead of approving it. Nobody has to maintain it, and it lapses on its own when the property stops holding.
7. **Pin the check's own exemption.** A check that must spell out what it detects exempts itself, so assert that set is exactly those files. A self-exempting check that can quietly adopt more files stops being a check.
8. **Verify against a committed tree, not a working one.** A gate that reads the tracked file list cannot see files you have not added yet, so a clean local run before `git add` proves nothing about the very files you just wrote. This is how a gate ships flagging its own new sources.

## Output

- Rules go in `docs/rules/{domain}/{topic}.md`
- Each rule is concise, actionable, and followable by an agent without ambiguity
- Rationale explains why, not just what
- Never promote without user confirmation
- Link to source knowledge entry when applicable
