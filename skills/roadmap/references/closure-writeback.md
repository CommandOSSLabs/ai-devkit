# Closure write-back

WHEN a `Committed → Closed` transition has just passed the closure `<HARD-GATE>` in
`SKILL.md`'s Update section, follow this exactly.

Then write into `Closed:` the SHA **read from the assessment file**, verbatim — not the one
the cmk:delivery-handoff's references/handoff-document.md carried. Where the two ever diverge, the file is the record and the cmk:delivery-handoff's references/handoff-document.md is
hearsay. That marker is how a later reader resolves what shipped in the milestone.

Never re-run the assessment, and never append a block to the assessment file: this skill
reads that file and writes only the roadmap. Then run **## The approval gate** as usual — the
assessment gate is additive and precedes it, never replaces it.

Every other update — a new milestone, a reorder, a reword, a commitment, a deferral — reaches
the approval gate exactly as before. This gate fires on closure alone.
