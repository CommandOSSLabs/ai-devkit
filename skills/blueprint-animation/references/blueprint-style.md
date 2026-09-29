# Blueprint drawing style and text rules

Sections §3–4 of `cmk:blueprint-animation`. Adapted from [blueprint-animation](https://github.com/moguzbulbul/blueprint-animation) v1.3.1 by Oğuz (@moguzbulbul), CC BY-NC 4.0.

## 3. Blueprint drawing style

- Draw on white, not on a navy background. Line colour is cyan-ink `#0B8FC2`; fill `#2ACCFF14`; guides are dotted `2 4`.
- **Everything on screen** turns into a blueprint in the blueprint phase: rail, breadcrumb, logo (box, mark and outlined wordmark), buttons, rows, tabs, cards, panel. Never convert only part of the screen.
- Each wire uses the exact rect of the element it stands for (§0), so the blueprint lines up with the real UI.
- Wires carry their real text (button labels, row text, tab names). Rounded pills stay rounded, list rows get an icon circle.
- Selection handles (5 px squares) on the 1–3 wires that matter in that step.
- Corner ticks on the focus rect, dotted alignment guides through key edges, one dimension line per step with a short UPPERCASE mono label (for example "CENTERED COLUMN · 760").
- Labels: 11–12 px mono, `letter-spacing .06em`, no stroked halo.

## 4. Text and overlap rules (checked every time)

- **No text on a moving wire.** Wire text fades out when motion starts (q > 0.15) and back in when it settles (q > 0.85).
- Wires that disappear collapse **in place** (height → 0), not across other content.
- Labels live in empty bands (above the focus, between sections). Never on top of a row or a card.
- Only one step's notes are visible at a time, in the bottom band: `[number badge · NAME] [problem] [fix]`.
- No top title bar and no end title unless the user asks for them.
