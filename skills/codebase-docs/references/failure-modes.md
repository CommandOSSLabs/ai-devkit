# Common failure modes

- **Paraphrased code.** If the doc is explaining control flow line-by-line, delete that and just point to the function.
- **Essay-style prose.** Bullets and short paragraphs beat flowing prose for skim-reading.
- **Phantom references.** Never invent a function or file name. If you're unsure, open the file and check.
- **Over- or under-splitting.** Apply the split heuristic in `references/doc-shape.md`; both directions are covered there.
- **Documenting aspirations.** Only describe what's in the code now.

## Final check before finishing

- [ ] Root `docs/ai/README.md` exists and links to every top-level area.
- [ ] Every branch `README.md` has a link menu, not a wall of text.
- [ ] Every leaf has what / (why, if non-obvious) / where.
- [ ] Every `→` reference points to a real file and a real symbol (spot-check a few with grep).
- [ ] No doc is over the length contracts without a reason.
- [ ] No duplicated content between parent and child.
