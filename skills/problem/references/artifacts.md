# Disk artifacts — cmk:problem

**Why disk:** long breakdown↔solve loops lose state in chat. These files are the
session memory. Update them every turn that changes tree, foundation, or leaf
status. `.skills/` is typically git-ignored — local to the working copy.

## TOC

1. Layout
2. Resume protocol
3. session.md
4. problem-tree.md
5. foundation-cards.md
6. leaf-log.md
7. carry-back.md
8. 3-line status block
9. Anti-patterns

## Layout

```text
.skills/work-the-problem/<slug>/
  session.md
  problem-tree.md
  foundation-cards.md
  leaf-log.md
  carry-back.md
```

`<slug>` = kebab-case from setup (e.g. `billing-idempotency`).

## Resume protocol

On any turn after the first (or after compaction / new chat with same slug):

1. Read `session.md` then `problem-tree.md`
2. Read `foundation-cards.md` and latest entries in `leaf-log.md`
3. Announce Active leaf + open counts from disk
4. Continue — do **not** re-run full setup unless user resets

If files are missing mid-session: reconstruct from chat once, write disk, then continue.

## session.md

```markdown
# Session — <slug>

- schema: work-the-problem/v1
- companion_language: <en|…>
- learner_familiarity: new | partial | strong
- project_posture: <delivery + lifecycle or unknown>
- problem_lock: <one line>
- success_test: <one line>
- started: <ISO date or session date>
- status: active | carry-back-ready | closed
- main_window: frame-change | clarify-decisions | other | unknown

## Standing notes
- <optional bullets>
```

## problem-tree.md

```markdown
# Problem tree — <slug>

## Root
- id: ROOT
- statement: <precise>
- status: open | closed | deferred
- success_test: <echo or refined>

## Nodes

### <id>
- parent: ROOT | <id>
- statement: <one line>
- status: open | blocked | closed | deferred
- depends_on: <ids or none>
- blast: high | medium | low
- engagement: articulate | delegated | unset
- answer_summary: <none | one line when closed>
- reopen_if: <only if deferred>
```

Keep the tree scannable. Detail lives in `leaf-log.md`.

## foundation-cards.md

```markdown
# Foundation cards — <slug>

- foundation: delivered | partial | explicitly_skipped
- subject: <current subject name>

## Cards
- (F0|F1|F5|…) (<kind: factual|conceptual|procedural|metacognitive>) <card>
  provenance: USER_VERBATIM | AGENT_SYNTHESIS | VERIFIED_EVIDENCE | SOURCE_CLAIM | INFERENCE
  source: <path|url|none>

## Open knowledge gaps
- <gap> — cheapest next deepen
```

## leaf-log.md

Append-only style preferred (newest at bottom). One section per leaf attempt.

```markdown
# Leaf log — <slug>

## <id> — <timestamp or turn label>
- phase_reached: plan | act | check | look-back | closed
- plan: <text>
- heuristic: <none|name>
- act:
  - reads: <file:line list or none>
  - research: <note path or none>
  - spike_named: <yes/no — user-run>
  - reasoning: <short>
- proposal:
  - answer: <text>
  - confidence: high | medium | low
  - flip: <what would change the answer>
- user_close: yes | no | pending
- human_rationale: <verbatim | not supplied | n/a>
- look_back_transfer: <one card>
- failure_signal: <earliest wrong-model signal>
- suggested_repo_changes: <none | bullets — suggestions only>
- claims:
  - Source claim: …
  - Verified fact: …
  - Inference: …
  - Open: …
```

## carry-back.md

Fill only at terminal carry-back.

```markdown
# Carry-back — <slug>

- language: en | <other>
- status: draft | handed-over

## Message for main window

\`\`\`
## Decision / direction
<text>

## Why (dominant reason)
<text>

## Locks / constraints for clarify-decisions
- …

## Residual open / deferred
- <leaf>: <reopen condition>

## Foundation not to re-litigate
- …

## What would flip this
- …

## Suggested next step in frame-change
- …

## Suggested repo changes (optional, non-binding)
- none | …
\`\`\`

## Commitment restatement (companion language)
<1–2 lines: what the message freezes>

## Provenance
- User decisions: …
- Agent analysis: …
```

## 3-line status block (every changing turn)

```text
Tree: <n> open / <n> closed / <n> deferred
Active: <node id or ROOT>
Next: <one concrete step>
```

## Anti-patterns

| Anti-pattern | Do instead |
|---|---|
| Chat-only tree after hour-long loop | Write problem-tree.md every change |
| Rewriting leaf-log from scratch | Append sections |
| carry-back.md mid-solve | Only when user settles / asks for reply |
| Storing secrets / tokens in artifacts | Never |
| Committing `.skills/` as project truth | Local session memory only |
