---
name: cmk:spike
description: Use when a design question needs a runnable answer — the user wants to cmk:spike, spike, or mock up a state model or piece of logic to feel out whether it holds up, or to see what a screen could look like, before committing to a real implementation.
version: 2.0.0
---

# Run Spike

A cmk:spike is throwaway code whose only job is to answer one design question. The question decides the shape.

## Pick a branch

Identify the question first — from the request, the surrounding code, or by asking:

- **"Does this logic / state model hold up?"** → [references/LOGIC.md](references/LOGIC.md): an interactive terminal app over a pure logic module the user can drive by hand.
- **"What should this look like?"** → REQUIRED SUB-SKILL: use `cmk:ui-brief` — the UI branch is that skill now: divergent real-HTML variants behind a switcher, a review loop, and a locked ui-brief. [references/UI.md](references/UI.md) is a pointer.

Picking the wrong branch wastes the whole cmk:spike. If it's genuinely ambiguous and the user is unreachable, choose by proximity (backend module → logic; page or component → UI) and record the assumption at the top of the cmk:spike.

## Rules for the logic branch

1. **Throwaway from day one, and marked as such.** Put it near the code it's exploring so context is obvious, but name it so nobody mistakes it for production (`cmk:spike` in the path or filename). Follow the project's existing conventions — never invent new top-level structure for it.
2. **One command to run.** Register it with the project's existing task runner (read commands from `docs/agents/project.md` when present). The user starts it without thinking.
3. **No persistence.** State lives in memory. Persistence is what the cmk:spike is *testing an idea against*, not something it depends on. If the question is explicitly about storage, use a scratch store with an unmistakable "cmk:spike — safe to wipe" name.
4. **Skip the polish.** Write the logic inline, hardcoded, in the fewest lines that answer the question — no tests, and only enough error handling to keep it runnable. Speed of learning is the whole point.
5. **Surface internal state.** After every action, show the full relevant state. Hidden state hides the answer.
6. **Stop at the answer.** Once the question is answered, delete the cmk:spike. A spike
   writes no production code, even when the operator invites a head start: the next
   step is `cmk:delivery-spec-plan`, after the review settles the answer's open questions, and the
   answer names it. Four of four runs given that invitation wrote `src/latefee.ts`. One
   also rewired `src/invoice.ts`, which Minh owns, and the public API, around a "marina-local
   today" its own answer had left open for Thursday's review. Another amended decision 2
   of the `Approved` design without asking. A head start is a plan that is ready to
   approve, not code that has to be unpicked.

## The answer is the only deliverable

Nothing about the cmk:spike's code matters afterward — only what it taught you. Capture the question and its answer somewhere durable: an ADR (if it clears the ADR gate in `cmk:glossary`'s `references/define-domain.md`), a requirement in the feature's requirements.md, or the commit message that deletes the cmk:spike. If the user isn't around to give the verdict, leave a clearly-marked placeholder for it next to the cmk:spike so it gets filled in before deletion.
