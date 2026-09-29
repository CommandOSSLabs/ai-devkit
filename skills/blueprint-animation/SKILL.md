---
name: cmk:blueprint-animation
description: Use when the user asks to "make a blueprint animation", "animate this redesign before and after", "explain this screen's UX decisions", "animate a UX case study", or shares Before/After screens (or one screen) and wants one continuous step-by-step blueprint animation that explains UX decisions — Redesign mode rebuilds the parts that change, Explain mode annotates each module's what and why. For case studies, redesign walkthroughs, design rationale, and social posts.
version: 0.1.0
---

# Blueprint Animation

Adapted from [blueprint-animation](https://github.com/moguzbulbul/blueprint-animation) v1.3.1 by Oğuz ([@moguzbulbul](https://x.com/moguzbulbul)), inspired by Arjun Mahesh. Licensed **CC BY-NC 4.0**: non-commercial use only, with credit; commercial use needs the author's written permission. See `LICENSE` in this package.

Start your first question form or reply with `cmk:blueprint-animation <version from this file's frontmatter> · <Explain or Redesign>`, so the user can see which version and mode is running.

One continuous animation of ONE screen. The page never cuts; it runs in N numbered steps. Each step explains a single UX decision.

Two modes. Pick the mode from what the user gives you (§1); with one screen, Explain is always offered first:
- **Redesign** (Before + After screens): the screen is redesigned step by step. §1–7 describe this mode.
- **Explain** (one screen, no Before): the design never changes. Each step turns one module into a blueprint and draws why it is built that way. Read `references/explain-mode.md` (§8). Everything in §1–7 still applies unless §8 says otherwise.

In both modes the design comes from Figma and is reproduced exactly (§0).

Where each section lives:
- §0–2 and §7: this file.
- §3 drawing style and §4 text/overlap rules: read `references/blueprint-style.md` before drawing any wire.
- §5 architecture and §6 performance: read `references/architecture.md` before writing the scene.
- §8 Explain mode: `references/explain-mode.md`.
- Reference scene: `references/example-scene.jsx` (Redesign mode: a CRM record page redesigned in 5 steps).

## 0. Fidelity — the Figma design is exact

The screens the user gives are reproduced 1:1. This rule beats every other rule in this skill, performance included.

- Read every value from the Figma source, not from a screenshot: frame size; each layer's x, y, w, h; fills, strokes, radii, effects; text style (family, size, weight, line height, letter spacing, case). Use the file's colour and text styles as they are.
- If a value can't be read (only a screenshot, a missing font, a hidden layer), list what is missing and ask. Never guess, round or "tidy up" a value.
- Copy all text exactly: wording, capitals, numbers, dates, punctuation.
- Load the file's real fonts. If a font can't be loaded, stop and ask for it: a stand-in font changes every text width and wrap.
- Icons, logos and images: export them from Figma (SVG for vectors) and use them as they are. Never redraw them or swap in a lookalike from an icon set.
- Place every element at its Figma coordinates relative to the frame (`abs(x, y, w, h)`). Don't re-flow the frame into flex or grid if that moves anything by even 1 px.
- Convert Figma units exactly: letter spacing % → em (−2% = −0.02em); line height in px stays px; an inside stroke stays inside the box (`box-sizing: border-box` border or `inset` shadow); drop shadows keep the same x, y, blur, spread and colour.
- The app is the Figma frame's own size at 1:1 (1440×900 only if the frame is). The canvas grows to fit it.
- No restyling, no new spacing, no removed shadows, no "improvements". The only colours outside the design are the blueprint's.
- Redesign mode: a screen you design or derive (because the user picked that option, §1) reuses the given screen's components and changes only what the step list says.

Order of work:
1. Build each given screen as static real-UI components.
2. Render it at 1:1 and compare it with the Figma export of the same frame (50% overlay or pixel diff). Fix every difference before going on.
3. Only then build the blueprint and the motion. At rest (before step 1 and after the last step) the real UI matches the Figma frames exactly.

## 1. Before you build — gather

- **Redesign:** the Before and After screens, as Figma frames (screenshots only when there is no file; see §0). The After is the source of truth; don't redesign beyond it.
  **Explain:** the one screen, as a Figma frame. It is the source of truth and nothing on it changes.
- The list of steps, 3–6.
  **Redesign:** each step needs **name** (2–4 words), **problem** (one sentence, ≤ 12 words), **fix** (one sentence).
  **Explain:** each step is one module and needs **name** (the module, 2–4 words), **what** (one sentence, ≤ 12 words: the decision), **why** (one sentence: the user benefit or principle behind it).
- The design system for the real UI. Blueprint colours are the only colours outside it.
- Canvas size: the app is the Figma frame at 1:1 on top, with a margin and a text band below (a 1440×900 frame gives the default 1600×1200).

Pick the mode:
- **Two screens given → Redesign mode.** No mode question.
- **One screen given →** the first question is the mode. It MUST include this option, listed first, in the user's language:
  **"Continue with this one screen: the design stays as it is; explain what and why, module by module (Explain)"**
  Other options may follow: it is the Before (you design the After), it is the After (you derive the Before), or the user uploads the other screen.
- A one-screen request can always go ahead in Explain mode. Never say you can't start without a second screen.

Then:
- **Explain:** propose 3–6 modules (name · what · why) and get them confirmed. Proposals describe the screen as it is, never changes to it.
- **Redesign:** propose 3–6 changes (name · problem · fix) and get them confirmed.
- Anything else missing (a font, a Figma value, see §0): ask before building.

## 2. The per-step sequence (never skip a phase)

Local step time `t` (authored seconds ÷ K, K = 1.4 slow factor). For a 5 s step with construct end `c1 = 3.2`:

| Phase | t | What happens |
|---|---|---|
| Problem | 0 → 0.9 | Everything except the focus rect fades toward white (≈ 78%). A thin grey outline draws around the focus. The text band shows number, name and problem. |
| Blueprint in | 0.95 → 1.75 | A cyan **scan line** sweeps top → bottom. Above it, the WHOLE app is a blueprint drawing; below it, the real old UI. |
| Construct | 1.9 → c1 | Only the changing wires move / resize / merge. The static blueprint behind them dims 0.7 → 0.3. Guides and dimension lines draw. |
| Reveal | c1 + 0.05 → c1 + 0.85 | The scan line sweeps again. Above it, the real NEW UI; below it, the blueprint. |
| Hold | → end | The fix sentence fades in. Then the focus fades out. |

Rules that make it feel smooth:
- Real UI regions swap from old to new **only while fully covered** by the blueprint (the swap is invisible). Never fade old UI out in view: it reads as "the UI disappeared".
- Every opacity keys to the smooth wipe/reveal curves, never to near-instant ramps. No value may change from 0 to 1 in under ~0.3 s unless it is hidden.
- Layout pushes happen BEFORE the elements that land in the freed space (for example, the timeline moves down first, then the tasks rise into the gap).
- Stagger groups of moving wires (0.08–0.12 s apart) so they never cross each other.
- Last 1 s of the piece: fade the app out so the loop seam is soft.

## 7. QA before handing over

1. Filmstrip with `data-om-seek-to-time-frame` at each step's problem, blueprint-in, mid-construct, reveal and hold.
2. At mid-construct: no text sits on text, and no moving wire crosses a label.
3. Every counter and date on screen matches the data.
4. Fidelity (§0): the real UI at rest matches the Figma exports at 1:1 in an overlay or pixel diff, including text wraps, icon shapes, strokes and shadows.
5. Performance numbers from §6 (`references/architecture.md`).
