<!-- Ported from jdk `publish-issues` 1.0.0 (ADR 0001). -->
# Publish Issues

Turn what is in front of you — this conversation, a spec, or an idea the user just described — into a set of **tracer-bullet issues** on the repo's tracker, each declaring the issues that **block** it. This is the outgoing counterpart to `cmk:triage`'s incoming queue.

Read the tracker operations from `docs/agents/issue-tracker.md` and the label strings from `docs/agents/triage-labels.md`. If either is missing, say so and suggest `cmk:repo-config`; you can still draft to local `.scratch/` files in the meantime, but a remote tracker needs its config.

Every issue you publish starts its body with this exact line:

```
> *This issue was drafted by AI with `cmk:discover-efforts`.*
```

That line is also the marker `cmk:triage` reads to skip these issues — they are born agent-ready, so re-triaging them would stack a weaker spec on a real one.

## Where this sits

Pick the right skill before drafting; do not duplicate a heavier one.

| You have | Use | Not |
|---|---|---|
| A conversation / idea / spec to capture as grabbable work | **`references/publish.md`** (this) | — |
| A tier-2 feature needing traceable `requirements.md` → `design.md` → `tasks.md` | `cmk:delivery-spec-plan` (publishes **one feature issue** by default) | `references/publish.md` |
| A raw incoming issue or external PR to evaluate | `/cmk:triage` — user-invoked; name it for the user to run | `references/publish.md` |

If the user already ran the full spec triad, `cmk:delivery-spec-plan` publishes **one feature issue** with union `Requirements covered:` — do not re-file plan tasks here. `references/publish.md` is for work that never went through the triad.

## Process

### 1. Gather context

Work from what is already in the conversation. If the user passes a reference — a spec path, an issue number or URL — read its full body and comments first. **Done when:** every reference the user passed has been read in full, and the scope to be filed is written down as an explicit in/out list.

### 2. Explore the codebase

If you have not already, explore the code so titles and descriptions use the project's **domain glossary** (`docs/requirements/glossary.md`) and respect the ADRs in the area you touch. Look for **prefactoring** that makes the later work easier — "make the change easy, then make the easy change"; a prefactor becomes its own first issue. **Done when:** every domain noun in the slice titles appears in `docs/requirements/glossary.md`, and a prefactor is either filed as the first slice or explicitly ruled out.

### 3. Draft vertical slices

Break the work into **tracer-bullet** issues.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests) — vertical, NOT a horizontal slice of one layer.
- A completed slice is demoable or verifiable on its own.
- Each slice is sized to fit in a single fresh context window.
- Any prefactoring is sequenced first.

</vertical-slice-rules>

Give each slice its **blocking edges** — the other slices that must complete before it can start. A slice with no blockers can start immediately.

**Wide refactors are the exception.** A wide refactor is one mechanical change — rename a column, retype a shared symbol — whose blast radius fans across the codebase, so a single edit breaks thousands of call sites at once and no vertical slice lands green. Sequence it as **expand → migrate → contract**: first add the new form beside the old (nothing breaks); then migrate call sites in batches sized by blast radius (per package, per directory), each batch an issue blocked by the expand, CI green batch to batch because the old form still exists; finally delete the old form in an issue blocked by every migrate batch. If even the batches cannot stay green alone, let them share an integration branch that all block a final integrate-and-verify issue — green is promised only there.

**Done when:** every slice is vertical (or a justified refactor batch) and carries its blocking edges.

### 4. Quiz the user

Present the breakdown as a numbered list. Per slice show **Title**, **Blocked by**, and **What it delivers** (the end-to-end behavior it makes work). Then ask:

- Is the granularity right — too coarse, too fine?
- Are the blocking edges correct — does each slice depend only on slices that genuinely gate it?
- Should any be merged or split?

When a slice is underspecified in a way only the user can resolve, REQUIRED SUB-SKILL: use `cmk:interview` to shape it one question at a time before publishing. Iterate until the user approves the breakdown. **Done when:** the user has approved the slices and their edges.

### 5. Publish

Publish the approved slices to the configured tracker in **dependency order — blockers first** — so each slice's edges can reference real identifiers. The slices are the same on every tracker; only the shape of the blocking edge changes.

- **Local files** → one file per slice under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order, using the local template below. Never a single combined file.
- **Remote tracker (github / gitlab / linear)** → one issue per slice, in dependency order. Use the platform's native sub-issue / blocking relationship where it has one (per `docs/agents/issue-tracker.md`); otherwise fill each issue's "Blocked by" with the blocking issues' identifiers.

**Label only what is grabbable.** `ready-for-agent` (its mapped string from `docs/agents/triage-labels.md`) means an autonomous agent may pick the issue up *now* — so it must never sit on a slice whose blockers are still open, or the agent grabs work it cannot finish. Apply it by whether the blocking edge is **enforced**, an observable property of the tracker:

- **Edge enforced** — the tracker holds a blocked issue back on its own (a native dependency link, Linear `blocks` relations). Label every slice `ready-for-agent`; the edge gates the blocked ones.
- **Edge is only text** — "Blocked by" is a line in the body with nothing enforcing it (GitHub Issues, local files). Label only the **frontier** — slices with no open blocker — `ready-for-agent`; give each blocked slice its category label alone, and tell the user to promote each one as its blockers close. Where there is no label mechanism at all (local `.scratch/` files), the template's Status field carries those same two states instead: `ready-for-agent` on the frontier, `blocked` behind it.

Work the **frontier**: publish any slice whose blockers are already published, and label per the rule above. For a purely linear chain that is top to bottom. **Do not close or modify any parent issue.** **Done when:** every approved slice exists on the tracker with its edges wired and only the grabbable slices labeled `ready-for-agent`.

<local-template>

# <NN> — <Title>

> *This issue was drafted by AI with `cmk:discover-efforts`.*

**What to build:** the end-to-end behavior this slice makes work, from the user's perspective — not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles that gate this slice, or "None — can start immediately".

**Status:** fill per the labeling rule above.

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-template>

<issue-template>

> *This issue was drafted by AI with `cmk:discover-efforts`.*

## What to build

The end-to-end behavior this slice makes work, from the user's perspective — not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1 — independently verifiable
- [ ] Criterion 2

## Blocked by

- Each blocking issue's identifier, or "None — can start immediately".

## Parent

The source issue's identifier, if this was filed from an existing issue — otherwise omit.

</issue-template>

In either form, describe **behavior and interfaces, never file paths or line numbers** — they go stale. Exception: if a spike produced a snippet that pins a decision more precisely than prose (a state machine, reducer, schema, or type shape), inline the decision-rich part and note it came from a spike. When the work is covered by an existing spec, cite the requirement IDs (`CODE-N.M`) in the relevant criteria so the trace stays intact.

## Exit

Tell the user the frontier — which slices can start now. Point them at the next step: work each slice with the execute family (`cmk:delivery-build`'s `references/continuous.md` / `cmk:delivery-build`'s `references/story-unit.md` / `cmk:delivery-build`'s `references/inline.md`) or standalone `cmk:tdd`, clearing context between slices.
