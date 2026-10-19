# Review brief — the reviewer's dispatch

Fill every field, write the filled brief to `.skills/<CODE>/review-brief.md`,
then dispatch. Paths only: no session history, no pasted cases, no opinion on
what the reviewer should find. Do not open `review.md` yourself — it is the
reviewer's recipe, not yours.

## Fields

| Field | Value |
|---|---|
| **Run file** | `.skills/<CODE>/dogfood.json` |
| **Report path** | `.skills/<CODE>/dogfood-review.md` |
| **pass_kind** | `initial` \| `re-check` |
| **Prior report** | path on a re-check, else `—` |
| **requirements.md** | `docs/specs/<feature>/requirements.md` or `—` |
| **design.md** / **tasks.md** | paths or `—` |
| **Product surfaces to open** | concrete paths from design/tasks or the app layout — routes, pages, components |
| **Skill root** | this skill's install path (in this monorepo: `skills/acceptance/write-dogfood`) |

## Dispatch prompt

Send this, with the brief path filled in, to a **read-only** subagent on the
mid tier (Sonnet). It must not spawn subagents of its own.

```text
You are reviewing a dogfood guide you did not write. Read
<skill-root>/references/review.md and follow it exactly; the report shape is in
<skill-root>/references/review-schema.md. Your inputs are in
.skills/<CODE>/review-brief.md. Read-only on product code and the run file;
write only the report. Do not spawn subagents. Return the report path and
open_count.
```
