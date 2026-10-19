<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:milestone-review` — test record

## Length pass (v1.1.1, 2026-09-07)

Brought `SKILL.md` from 335 to 193 lines (2626 to 2523 words) by tightening prose
in place — no sibling file created; extraction was judged unnecessary once the
hard-wrapped paragraphs were reflowed to one line each and adjacent same-topic
paragraphs under a heading were merged. Nothing moved out of the file.

**Deleted as duplicates** (surviving home confirmed present at `git show HEAD`
before the edit, and re-confirmed after):

- Step 5 (Committed baseline) dropped its closing sentence "Do not guess a
  baseline from a date: two milestones committed the same day are
  indistinguishable by date and distinguishable by SHA." The rule survives
  verbatim in the Rationalizations table: `"The commitment date is right
  there, I can find the commit from it" | Two milestones committed the same
  day share a date and not a SHA. Use the pickaxe`.

**No other content was removed.** Every remaining cut was prose tightening
(shorter phrasing of the same rule, or merging two adjacent paragraphs under
one heading into a single paragraph) — never a paraphrase of a rule being
relocated, since nothing was relocated.

**Atom count:** 50 atoms before, 50 atoms after
(`scripts/skill-rule-inventory.py`). `--diff` against HEAD reports all 50 with
a home: 44 exact matches, 6 scored "reworded rather than removed" at 100% of
their distinctive words surviving (bullets and a numbered gate item that were
reflowed from hard-wrapped multi-line form to one line — same words, fewer
lines). Zero atoms lost.

**Anchors confirmed present verbatim:**
- `## The two halves` — line 14
- `### Plan accuracy — descriptive only` — line 95

**Lint results:** `lint-skill-evals.py`, `lint-skill-frontmatter.py`,
`lint-context7.py`, `lint-skill-templates.py`, and `lint-write-handoffs.py` all
pass. `lint-skill-length.py` reports the file now at 193 lines, under the
200-line limit, and asks for its entry in `scripts/skill-length-budget.json`
to be cleared — left in place per the length-pass brief, for the reviewer to
clear once across the whole batch.

**Not touched:** the two `<HARD-GATE>` blocks and the `<NON-NEGOTIABLE>`
heading keep their full rule text (only the intro sentence above the first
gate, and the sentence structure inside, were tightened — no clause dropped).
The Rationalizations table and Red flags bullets are byte-for-byte unchanged
except the one Red-flag bullet reflowed from two lines to one (same words).

### Reviewer note — the line target was met; the verbosity was not

335 → 193 lines is a 42% cut. 2626 → 2523 words is 3.9%. Almost all of it was
rewrapping: the file was hard-wrapped at roughly fifty characters, so it carried
7.8 words per line before and 13 after, with the same text underneath.

Unlike `cmk:interview`, where nothing was left to cut, this file had room and
still has it. At 50.5 words per rule atom it is the most verbose skill in the set,
against 29 for `cmk:interview` and 16 for `cmk:problem`. The routing that
sent this pass here called it prose-heavy on lines per atom, which was the wrong
measure — narrow wrapping reads the same as verbosity on that axis. Words per atom
is the one that would have caught it.

Accepted at 193 because the ceiling is a line ceiling and it is met. Recorded
because the number will otherwise be read as a reduction in what this file costs
to run, and it is not one. This is the first place to look for a real content
pass.

## 1.1.2 — a duplication sweep, and a correction to what this file's numbers meant

The length pass left a note calling this the most verbose skill in the set at 50.5
words per rule atom, and the first place to look for a real content pass. Looking
found something worth fixing and disproved the framing that sent it here.

**What was wrong.** `## Record the assessment` says the template's comment block
carries the authoritative structural rules and to validate against them there
rather than restating them. The paragraph immediately after restated six of them,
and `### The disposition state machine` repeats "read it there, do not restate it
here" and then restates the transition rules — several word for word:

> template: Each transition **appends** a dated entry to `History:`; earlier
> entries are never edited, and the **latest entry** is the current disposition.

> SKILL.md: Each transition **appends** a dated entry to `History:`; earlier
> entries are never edited, and the latest entry is the current disposition.

The same holds for A3, A5, A6, A7, the append-only condition, the override
attribution and the verbatim-rationale rule.

**Why it mattered beyond the words.** `cmk:roadmap` validates against that
same template before it records a close. Two homes for one rule set is a rule two
skills can come to disagree about, and the copy here had no mechanism keeping it
in step.

**What was kept.** The write target, the HARD-GATE ordering the write before close
eligibility — sequencing between skill steps, which the template cannot own — the
initial `Pending` value, the SHA-equality-not-recency section, and one sentence
the table genuinely cannot show: why the close decision is a field separate from
the verdict, which is what lets a milestone close honestly on a negative verdict
and be held on a positive one.

**The correction.** This removed 118 words, 4.7%, and words per atom rose to 52.3
because four atoms went with them. The verbosity that flagged this file is mostly
not verbosity: `## Resolve the scope` spends 545 words on eight named `grep`/`git`
passes and the fixed rule on each output, which is the exact form `cmk:skill-authoring`
prescribes for a check that must not be misjudged. Words per atom is a screening
signal, not a verdict — it pointed at the right file for the wrong reason, and the
remaining density is earning its keep.

## v1.2.0 — Attention section removed (2026-10-06)

`select-sample` was dropped, so the assessment no longer records an attention
allocation: the `### Attention` section, its red-flag mention, and the
template's `**Attention:**` slot are gone. No baseline re-run.

## Template sync — R11 names S8 (2026-10-14)

The shared `roadmap-findings.md` now lists `S8` (the roadmap's `After:` item-order
rule, added in cmk:roadmap 1.2.0) among the structural rules `R11` reports. No
behavior of this skill changes beyond reading the longer rule list.
