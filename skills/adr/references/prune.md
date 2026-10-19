<!-- Ported from jdk `define-domain` 1.2.0 (ADR 0001). -->
# Pruning or auditing ADRs

Loaded from `SKILL.md` § Pruning when asked to prune, audit, archive, or tidy
`docs/decisions/`.

`SKILL.md` § Whether to write one decides whether to *write* an ADR. This section decides whether a live one still earns its place.

<NON-NEGOTIABLE>
Word count, age, and folder size are not archive criteria. A lead, a review tomorrow, or a quota does not replace classification.
</NON-NEGOTIABLE>

Classify every live file. *Done when: each one is keep, archive, or drop, with a one-line reason.*

- **Keep** — a future change still needs it: the decision still constrains the running system, or a rejected alternative is still being pitched and this file is why it lost.
- **Archive** — the decision shipped and the body will not guide a future change (closed UI chrome, implementation recap, process history now obvious from the code). Move it to `docs/decisions/archived/`, insert `Archived: YYYY-MM-DD` under the title, and update its index line. Do not rewrite the body.
- **Drop a rejection** only when the losing idea is no longer a plausible proposal. Otherwise keep it.

Tightening the folder by hiding a live constraint or a still-tempting rejection is not cleaning. *Done when: the live tree still holds every decision that binds or still guards a live bad idea.*

## Red Flags

- Archiving every file older than N days or longer than N words
- Emptying `docs/decisions/` so a review "looks tight"
- Treating "don't get precious / the point is the count" as a reason to skip classification

| Thought | Reality |
|---|---|
| "Judging each file against still-useful is the opposite of the lead's explicit criteria" | The quota is a discovery hint, not the test. Classification is the job |
| "A tight live folder by mechanical rule is what was ordered" | A tight folder that hid the decisions still in force is a hollow review |
| "Don't get precious about individual files; the point is the count" | The point is which decisions still bind. Count is a side effect |
