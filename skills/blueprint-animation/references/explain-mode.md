# Explain mode (one screen, no Before)

Section §8 of `cmk:blueprint-animation`. Adapted from [blueprint-animation](https://github.com/moguzbulbul/blueprint-animation) v1.3.1 by Oğuz (@moguzbulbul), CC BY-NC 4.0.

## 8. Explain mode

Same piece, same blueprint, same pacing. Nothing is redesigned: the blueprint is an x-ray that shows the reasoning behind each module.

Per-step sequence (timings as in §2):

| Phase | t | What happens |
|---|---|---|
| Focus | 0 → 0.9 | As Problem in §2. The text band shows number, name and **what**. |
| Blueprint in | 0.95 → 1.75 | As §2. Above the scan line, the WHOLE app is a blueprint drawing. |
| Annotate | 1.9 → c1 | Nothing moves. The module's wires stay in place; the static blueprint behind them dims 0.7 → 0.3. The reasoning draws in, staggered 0.08–0.12 s: handles on the key wires → guides → dimension line → labels. |
| Reveal | c1 + 0.05 → c1 + 0.85 | The scan line sweeps again and brings back the SAME real UI. |
| Hold | → end | The **why** sentence fades in. Then the focus fades out. |

Pick the marks from the reason, 1–3 per step plus one dimension line:

| The reason is about | Draw |
|---|---|
| Hierarchy, the primary action | Handles on the primary wire only; label "1 PRIMARY · 2 SECONDARY" |
| Alignment, grid, column | Dotted guides through the shared edges; dimension "CENTERED COLUMN · 760" |
| Spacing, rhythm | Dimension lines across the gaps: "GAP · 24" |
| Grouping | A dashed rect around the group; label naming it: "DEAL CONTEXT" |
| Reading order, flow | Accent number badges (`Num`) in reading order, joined by one arrowed `Line` |
| Size, hit area | A dimension on the element: "40 × 40" |
| Progressive disclosure | A label on the entry point: "14 EMPTY FIELDS BEHIND THIS" |
| Colour, state | A label naming the rule: "RED ONLY FOR OVERDUE" |

Rules:
- The real UI is identical at the start and end of every step. There is no before/after swap; each region has one component.
- Wires never move or resize, so wire text stays visible the whole time (no `q` fade).
- Marks draw in (`Line` with `pathLength`, opacity ramps ≥ 0.3 s). They never slide across content.
- The number goes in the dimension label, the reason goes in the text band. Labels on the drawing name the rule, not the pixels.
- Text band: `[number badge · NAME] [what] [why]`. The why sits where the fix sits in Redesign mode (cyan).

Architecture changes from §5 (`references/architecture.md`):
- `OM_SCENES`: `Screen, <module names…>, End`. Where the redesign scene reads `CUES.After`, read `CUES.End`.
- Use the same `phases()`. Ignore `before`, `after` and `p`; drive each mark from a `ph.t` window inside 1.9 → c1 (for example `tw(ph.t, 2.0, 2.6, M.draw)`).
- Global layout values are constants. `StaticBP` takes no step props, so it renders once.
- A step's `<Focus>` children are the module's own wires (with handles) plus its marks.

QA: the §7 filmstrip (Annotate in place of mid-construct), plus: the real UI in the frame before Focus and the frame after Hold is pixel-identical for every step; no mark covers text.

Example: the After screen of the reference scene (`references/example-scene.jsx`), explained.

| # | Module | What | Why | Marks |
|---|---|---|---|---|
| 01 | Header actions | One button; the rest sit in ⋯. | You mostly send email, so that is one click. | handles on Compose · "1 ACTION + OVERFLOW" |
| 02 | Facts line | Eight facts on one line. | You read the company at a glance; empty fields stay out of sight. | guide on the baseline · "14 EMPTY FIELDS BEHIND THIS" on All details |
| 03 | Needs you | Open tasks sit above the timeline. | Overdue work is the first thing you see. | dashed group rect · `Num` 1–3 · "1 PRIMARY ACTION" |
| 04 | Timeline | One feed, Relationship view by default. | People and deals matter more than system events. | handles on the Relationship pill · "1 VIEW MENU" |
| 05 | Column | Content in one centred column. | Short lines are easier to scan on a wide screen. | guides at 368 and 1128 · "CENTERED COLUMN · 760" |
