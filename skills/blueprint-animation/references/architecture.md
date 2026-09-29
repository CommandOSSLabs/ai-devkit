# Scene architecture and performance

Sections §5–6 of `cmk:blueprint-animation`. Adapted from [blueprint-animation](https://github.com/moguzbulbul/blueprint-animation) v1.3.1 by Oğuz (@moguzbulbul), CC BY-NC 4.0.

## 5. Architecture (animations_v3 starter)

- The engine is Claude Design's `animations_v3` starter, copied into the project as `animations-v3.jsx`. It is not part of this skill; build on it, don't write your own.
- `OM_SCENES` literal in the DC helmet: `Before, <step names…>, After`. The scene is one `.jsx` loaded through `<x-import component-from-global-scope=… from="./animations-v3.jsx ./scene.jsx">`.
- Start the scene from `references/example-scene.jsx`. Keep its blueprint kit as it is: `phases`, `tw`/`lerp`/`LR`, `Wire`, `Guide`, `Line`, `Label`, `DimH`, `Num`, `curve`/`ctr`, `Focus`, the clip + scan-line layer and the text band. Rewrite only what belongs to the new screen: the real-UI components, `StaticBP`, the geometry and `STEPS`.
- `phases(T, start, dur, c1)` returns `{focus, hl, call, bp, wipe, rev, cdim, lines, p, before, after, fix}` for each step. All choreography reads from these.
- Global layout values are derived from step progress: column x/width, header right edge, logo x, timeline y, panel x.
- Layers inside the app, bottom → top:
  1. Real UI regions: each has a `before` and an `after` component with its own opacity.
  2. An SVG with `clipPath` = the scan-line band. Inside it, a white sheet, the **static full-screen blueprint** (memoized `StaticBP`) and each step's `<Focus>` wires.
  3. The scan line.
- The text band sits below the app, outside the SVG.

## 6. Performance (required, or it stutters)

- Every layer stays **mounted** all the time. Hide it with `visibility: hidden` when opacity is 0; never mount/unmount at section boundaries.
- `React.memo` every real-UI component. Pass quantized props (`Math.round(v*2)/2` for positions, 2 decimals for opacity).
- `StaticBP` is memoized with rounded props, so it re-renders once per step, not every frame.
- Build a step's `<Focus>` JSX only while `focus > 0`.
- Move with `transform: translate`, not `left/top`.
- No blurred box-shadows on layers that move, no `text-wrap: pretty`, no nested `<svg>` per wire, no stroked text halos. A shadow that is in the design stays (§0).
- In the engine, persist the playhead to `localStorage` at most every 500 ms (not every frame).
- Measure: a seek loop over the whole timeline (< 7 ms per frame), plus a rAF loop during real playback (no frames > 34 ms).
