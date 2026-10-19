# Process map — cmk:problem

Load before the first solve turn after setup, and whenever phase choice is unclear.

## TOC

1. Phases
2. Heuristics
3. Problem tree rules
4. Leaf recipe (single home)
5. Root recompose checklist
6. Main-window paste

Programming principles when a leaf needs them: `foundation-ladder.md` § fundamentals.

---

## 1. Phases

| Phase | Purpose | Done when |
|---|---|---|
| **Identify** | Separate symptom, opportunity, non-problems | Observed vs desired; "not this" if useful |
| **Define** | Precise representation | Unknown, data, constraints, success test explicit |
| **Question** | High-blast unknowns only | Open set listed; low-blast deferred without interrogation |
| **Foundation** | Model before options | F0+F1 delivered (or explicit skip); F5 if repo surfaces touched |
| **Decompose** | Solvable leaves | Tree written; order = dependency then blast |
| **Plan** (leaf) | Approach / heuristic | One plan named; assumptions listed |
| **Act** (leaf) | Evidence or pure reason | Citations or labeled inference; confidence + flip |
| **Check** | Leaf success met? | Pass / fail / re-breakdown |
| **Look back** (leaf + root) | Transfer + failure modes | ≥1 transfer card; earliest wrong-model signal |
| **Recompose** | Leaves → root | Root consistent with closed + deferred |
| **Carry-back** | Packet for main window | User-triggered; commitment restated |

Phases are not rigid. Re-enter Identify/Define when Act shows the wrong problem.

## 2. Heuristics (when Plan is stuck)

Name exactly one in the leaf-log.

| Heuristic | Prompt |
|---|---|
| Decompose & recombine | Split; reassemble differently |
| Simpler related problem | Solve a reduced version first |
| Work backwards | From desired outcome to known data |
| Special case | Zero, one, empty, single-tenant, … |
| Analogy | Related solved problem in this repo or domain |
| Variation | Change one constraint; see what moves |
| Auxiliary element | Missing intermediate concept/metric |
| Map vs territory | Paste/spec vs actual code/runtime |

If a leaf fails twice: deepen foundation (F0/F1/F5) before more strategy thrash.

## 3. Problem tree rules

- **Root** = locked problem from setup (or refined Define).
- **Leaf** = closable with one Act + one foundation beat.
- **Status:** `open` | `blocked` | `closed` | `deferred`
- **blocked** → named dependency (leaf id or external evidence).
- **deferred** → reason + reopen condition + user acknowledgment.
- Work order: unblock deps → highest-blast open leaf → rest.
- Never close a parent until every child is `closed` or `deferred`.

## 4. Leaf recipe (fixed order — single home)

1. **Announce** (must match SKILL.md turn contract):
   ```text
   Leaf: <id> — <one-line statement>
   Phase: <plan|act|check|look-back>
   Foundation: <F0|F1|F5|…|none>
   Engagement: <articulate|delegated>
   ```
2. **Define leaf** (if not on disk): unknown / data / constraints / leaf success.
3. **Engagement** — unless `delegated`: one soft probe **or** user restates goal / sketches plan (one short reply).
4. **Foundation beat** (if needed): one primary layer; one concrete example; update `foundation-cards.md`.
5. **Plan** — approach + heuristic if any.
6. **Act** — read / research / reason / name spike (SKILL.md Act table).
7. **Propose close** — answer · confidence high|medium|low · flip condition · claim labels.
8. **User close** — wait for confirm unless pre-authorized "just solve" on this leaf.
9. **Look-back** — one transfer card + one failure-mode signal.
10. **Disk** — `problem-tree.md` + `leaf-log.md`; 3-line status.

Check fails → re-Plan, re-breakdown into children, or re-Define. Do not force-close.

## 5. Root recompose checklist

Before offering carry-back:

- [ ] Every leaf `closed` or `deferred` with reopen condition
- [ ] Root answer consistent with closed leaves
- [ ] Deferred residuals listed for main window
- [ ] F0/F1 on cards (or skip recorded)
- [ ] Live choice (if any): stance + flip on disk
- [ ] Suggested repo changes are suggestions only
- [ ] Success test: met / partial / not met (why)

## 6. Main-window paste

When the user pastes from `cmk:scope` / `cmk:interview`:

1. Claim hygiene (Source / Verified / Inference / Open)
2. Map onto tree (update or add leaves) — do not cold-start if disk exists
3. Work the **highest-blast open** leaf the paste affects
4. Procedural paste only ("write requirements now?") while tree open → name what must close first; no fake architecture menu
