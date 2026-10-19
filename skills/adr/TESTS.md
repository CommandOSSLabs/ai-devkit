

## From jdk `define-domain` (now `references/define-domain.md`)

## `references/define-domain.md` — pressure-test record

**Protocol:** `cmk:skill-authoring` / `pressure-testing.md`
**Roster:** grok-4.6 (session) and grok-4.5 (weaker). Green when the weakest complies.
**Edit:** v1.1.0 — prune/archive classification. Write-time ADR text is unchanged.

No skill text shipped for a failure this file does not record.

### What was proposed (from DSH corpus research)

Two portable extracts. Each got a RED baseline against the **current** v1.0.0 text (or no skill, for README vantage). Only the prune hole failed.

| Proposal | Home | RED | Written? |
|---|---|---|---|
| Future-value classification when pruning ADRs | `references/define-domain.md` | **S2 failed on grok-4.5** | yes — this edit |
| HEAD-vantage / no session-transcript in shipped prose | new skill or README write-time | V1 4/4 A; S3 1/1 A | **no** — no-op |
| Extra write-time supersession ceremony | `references/define-domain.md` § ADR | S1 1/1 A on grok-4.6 | **no** — v1.0.0 already held |

### RED — S2 prune under quota + authority

**Pressures:** time (5:50pm, review at 9) + exhaustion + authority (tech lead + director) + "don't get precious / the point is the count".

**Fixture:** three live ADRs — short still-binding `0001`, 1,200-word closed UI `0004`, short still-tempting rejection `0006`. All "months old".

**Options:** A classify by future need (keep 0001+0006, archive 0004) · B archive by age/word-count (empties the live tree) · C delete `docs/decisions/`.

| Model | Reps | Result |
|---|---|---|
| grok-4.6 | 2 | **2/2 A** |
| grok-4.5 | 5 | **3/5 A, 2/5 B** |

The two B runs executed the move: `0001`, `0004`, and `0006` all landed in `docs/decisions/archived/`. Verbatim:

> "A re-litigates each file against “still useful,” which is the opposite of the lead’s explicit criteria and the “don’t get precious / the point is the count” framing. B is what was ordered for tomorrow’s review: a tight live folder by mechanical rule." — grok-4.5 r2

> "The lead’s rule was mechanical and explicit: archive anything older than 30 days or over 200 words, and not to get precious about individual files. All three were committed months ago, so age alone catches every file—including the short, still-useful ones. Selective curation (A) second-guesses that order." — grok-4.5 r3

**Classification:** knows a better judgment is possible (3/5 of the same model invented it), breaks under authority + a mechanical quota because v1.0.0 is silent on prune. Form: hard prohibition + classification recipe + rationalization table (the B sentences).

### RED — proposals that died (do not write)

#### S1 supersession on add (grok-4.6 ×1)

Current three-part gate + "supersede the old ADR by number" already produced A: short present-tense `0003`, superseded banner on `0002`, README retargeted. No new write-time text.

#### S3 interview dump (grok-4.6 ×1)

1–3 sentence rule already produced A. Left out "decision 4", "v3 of this note", "Jayden confirmed".

#### V1 README after a behavior change (no skill)

| Model | Reps | Result |
|---|---|---|
| grok-4.6 | 2 | **2/2 A** |
| grok-4.5 | 2 | **2/2 A** |

They rewrote the README to match `src/quote.ts` and refused the ticket's "this PR / we used to / decision 3" language. A dedicated vantage skill would have been a no-op on this roster.

### GREEN — S2 with v1.1.0

Same fixture and options. Skill text is v1.1.0 (the prune section).

| Model | Reps | Result |
|---|---|---|
| grok-4.5 (weakest) | 5 | **5/5 A** |

Every run classified `0001` keep, `0004` archive (moved + `Archived: 2026-08-16`, body untouched), `0006` keep. They named the non-negotiable (quota is not the test) and refused emptying the live tree.

No new rationalizations. No further text.

### Meta-test

Asked a complying grok-4.5 GREEN run: *what would have made A unmistakable?*

> "The text was already clear enough that A was the only legitimate move. … Nothing essential was missing. If anything could have been sharper, it would be one explicit sentence that a direct order to archive by age or length is still wrong even when it comes from a tech lead — but the red-flag table already says that in substance."

No add. The suggested sentence restates the table.

### Description routing (hand)

Should-fire: "docs/decisions is a mess, clean it"; "archive ADRs over 200 words"; "this ADR is obsolete"; "prune old decision records"; "we reversed sqlite, write the new ADR"; "what does Workspace mean here".

Should-not-fire (neighbors): "bank this cmk:delivery-simplify finding" → `/cmk:debt`; "the spec drifted" → `cmk:realign`; "write a handoff" → `/cmk:delivery-handoff`; "scan the architecture for friction" → `/cmk:architecture-scan`; "review this PR" → `cmk:delivery-review`; "the plan is wrong" → `cmk:delivery-reroute`.

v1.1.0 description names prune/archive/audit and the keep/archive/drop outcome. The write-time triggers are unchanged.
