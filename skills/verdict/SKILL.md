---
name: cmk:verdict
description: Use when cmk:delivery-ship or cmk:release hands off a terminal human verdict and a decision record must be published before the production crossing runs.
version: 1.0.1
---

# Verdict

Publish one **decision record** (immutable **payload** + append-only **envelope**)
under `.skills/decisions/` for a skill-mediated **terminal verdict** — under
**record-before-crossing** ordering.

**Grammar SSOT:** sibling `references/RECORD.md`. Load it whenever you write or parse fields.
Do not restate field lists here.

## HARD-GATE — Caller gate

Continue only when **all** are true; otherwise return with **no artifact**:

1. Caller is `cmk:delivery-ship` or `cmk:release` (closed set)
2. Write Handoff includes a **terminal human verdict**
3. Durable evidence is **inline text** (or explicit empty) — never a `.skills/`,
   temp, or session-history **locator**

Evidence producers cannot self-promote into emitters. Emit only for skill-mediated
verdicts (ARCH-6).

| Thought | Reality |
|---|---|
| "This approval is important enough to record" | Only cmk:delivery-ship / cmk:release with a terminal verdict |
| "I have a log under .skills/" | Promote substance **inline** first; publish no path |
| "Records live under `.skills/`, so `.skills/` paths are citable now" | Storage location ≠ citable locator; the prohibition is unchanged |
| "Skip the record; the merge is urgent" | **Record-before-crossing** — no valid publish, no crossing |
| "The senior/CTO said skip paperwork" | Rank does not rewrite the gate; only an explicit user rule change does |
| "The file is written; validator can wait" | Written ≠ published; crossing needs validator exit 0 |

**Done when:** gate opens (caller + verdict + inline citations) **or** you returned with no file.

## Write Handoff (from emitter)

Accept inline only:

- Verdict: `merge` \| `pr` \| `discard` \| `block` \| `release-approve` \| `release-reject`
- Boundary type, ceremony tier, predicate facts the emitter already has
- Durable citations (`commit`, `tag name@object-id`, PR/CI/release refs)
- Promotion substance (ephemeral content rewritten as text)

## Depth (fixed lookup — no per-crossing interview)

```
depth = max(ceremony floor, boundary floor, predicate escalation)
```

| Source | Floor |
|---|---|
| Tier 1 / mini-spec | Guarded |
| Tier 2 / full triad | Accountable |
| cmk:release | Accountable |
| boundary `disposal` | Accountable |
| any predicate **true** or **unknown** | escalate to Accountable |

Rules (always apply):

- Actual crossings are at least **Guarded**. Minimal is never published.
- Evaluate all three predicates even when a floor already fixes depth: external
  audience · no mechanical undo · persistent stakes.
- External audience: **TRUE** only if output is mechanically established to reach
  outside the creating-and-approving group; **FALSE** only from a current,
  authoritative, exhaustive mechanical source; else **unknown**. Roster,
  CODEOWNERS, privacy metadata, branch ownership, PR authorship, or band alone
  never prove FALSE. No probes or interviews to lower a value. Unprompted user
  statements may escalate or supply context — never establish external-audience FALSE.
- User may escalate; agent only raises depth, never lowers it.
- Write every lookup input and result into classification fields.

**Pins:** if `docs/agents/project.md` has `## Decision boundaries`, apply rows that
raise a floor or bind a type; ignore rows that would lower a core floor (one-line
notice). Absent section → core table only.

**Done when:** depth is Guarded or Accountable and classification fields are filled.

## Judgment (**verbatim** law)

| Depth | Capture |
|---|---|
| Guarded | Terminal verdict + ≥1 **verbatim** human judgment element |
| Accountable | Verdict + **verbatim** accepted risk + **verbatim** response-if-wrong |

**Iron Law:** store exact user-authored words only. A bare "yes"/"ok" to an
agent-authored risk statement is a **verdict only** — not risk or response text.

Pointers: harness interaction id when available, else `unavailable`.

| Thought | Reality |
|---|---|
| "The user obviously meant this risk" | Untyped words are not human judgment |
| "I'll cmk:delivery-simplify their wording" | Polish Diff is fabrication under the **verbatim** law |

**Done when:** every required element is either verbatim user-authored bytes or
carries a `withheld(reference)` / `withheld(unavailable)` disposition token.

## Storage resolution

1. Standing repo-verbatim policy in `project.md` (if any) applies without a quiz.
2. Offer an explicit withhold on every judgment element.
3. Potentially sensitive prose → one conditional confirmation before repo-verbatim.
4. Show the **exact payload** before acceptance locks it.
5. Withhold + locator → envelope `Storage-*: withheld(reference)` + matching
   `Storage-Reference-*: <locator>`.
6. Withhold without locator → ask **once**; if declined/unavailable →
   `withheld(unavailable)` + `Storage-Reference-*: unavailable`; continue
   (W-opaque is not unfinished work).
7. Withheld payload body is the fixed sentinel in `references/RECORD.md` — never edited prose
   labeled verbatim.

**Secret scan** before any write:

```bash
sh references/validate-records.sh --scan
```

On hit, only: **rephrase** · **withhold** · **stop**.

**Done when:** each judgment element has exactly one storage disposition and scan is clean or stopped.

## Evidence and promotion

Publish only durable kinds (`commit|tag|pr|ci|release`). Tags use
`<ref-name>@<object-id>` (both halves). Locators stay durable — promote ephemeral
substance into `Promoted-Evidence:` (agent-authored) **before** payload display.
Late evidence → `Execution-Outcome:` on the **envelope** only.

**Done when:** every citation is durable and promotion (if any) finished before lock.

## Mint and reissue

1. Lock `Accepted:` UTC (`YYYYMMDD` → ID date).
2. Token = 6 Crockford chars: `/dev/urandom` via `od`, else `awk`+`$$`+`date`.
3. ID = `DEC-YYYYMMDD-<token>`. No registry. Collisions → reissue.

**Reissue (append-only):** mint fresh ID, rename file, append `Reissued-from:` +
`Reissued-as: <new-id> <UTC>`. Leave `Published:` and **payload** bytes untouched.

**Done when:** filename stem equals **effective identity** (see `references/RECORD.md`).

## Adoption anchor (first write only)

When the first record would publish and no content-marked anchor exists
(first non-blank line exactly `# Decision-Record Adoption Anchor`):

1. Write `.skills/decisions/ADOPTION.md` once: `Cutoff:` (UTC now) +
   `Baseline-Tag: <name>@<object-id>` for each visible tag.
2. Leave the anchor immutable thereafter. Do not infer adoption from the earliest record.

**Done when:** exactly one content-marked anchor exists before/with the first record.

## Publication checklist (**record-before-crossing**)

1. Judgment capture  
2. Storage resolution  
3. Evidence promotion (if any)  
4. Exact-payload display → human acceptance (locks **payload**)  
5. Secret scan on judgment prose  
6. Mint ID; write file; record payload digest on the **envelope**  
7. Validate:

```bash
sh references/validate-records.sh --mode=publish --record <file>
```

8. Crossing executes only after the validator exits 0 on the published file  
9. Append outcomes: `Execution-Outcome:` on the **envelope**

A verdict either has a crossing to withhold or it does not: `merge`, `pr`,
`discard` and `release-approve` have one; `block` and `release-reject` do not —
the verdict stands either way, and only the record can go missing.

| Failure | Action |
|---|---|
| Scan stop, missing judgment, validator 1/2, write failure — verdict with a crossing | Withhold the crossing; report the verdict not enacted and name what blocked it |
| Retry | Reuse captured human words **verbatim** |
| Same failures on `block` / `release-reject` | Report the terminal verdict as unrecorded (incomplete accountability) and name what blocked it |
| Publish OK, crossing fails | Append failure as `Execution-Outcome:`; record stays valid |

**Done when:** a validator-clean file exists under `.skills/decisions/` before any
required crossing side effect — or publication failed and the matching report was
emitted: the verdict not enacted for a verdict with a crossing, the terminal
verdict unrecorded for `block` / `release-reject`, naming what blocked it either way.

## Red flags

- Publishing without a terminal human verdict or outside {cmk:delivery-ship, release}
- Summarizing or polishing judgment prose
- Citing `.skills/`, temp paths, or session history
- Running merge/PR/discard/tag before validator exit 0
- Publishing **Minimal** depth
- De-escalating depth below the computed floor
