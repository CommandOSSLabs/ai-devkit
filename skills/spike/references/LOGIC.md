# Logic spike

An interactive terminal app that lets the user drive a state model by hand. Right when the question is about business rules, state transitions, data shape, or an API's feel — things that read fine on paper and only break when pushed through awkward cases. If the question is about appearance, wrong branch: see [references/UI.md](references/UI.md).

## Process

### 1. Write the question down

Before any code: one paragraph at the top of the spike (comment or adjacent README) stating the model under test and the question it must answer. A logic spike aimed at the wrong question is pure waste, and the written question is what the verdict gets checked against later.

### 2. Use the host project's stack

Same language, same runtime, same tooling. Do not introduce a package manager, runtime, or styling library for a throwaway. If the repo has no obvious runtime, ask.

### 3. Isolate the logic in a pure, portable module

The part that answers the question lives behind a small pure interface — no I/O, no terminal codes, no logging as control flow. Choose the shape that fits the question, not the one easiest to wire up:

- **Pure reducer** — `(state, action) -> state` — when actions are discrete events over a single state value.
- **Explicit state machine** — when "which actions are legal right now" is itself part of the question.
- **A handful of pure functions** over a plain data type — when there's no ambient state, just transformations.
- **A module owning internal state** behind a clear method surface — when the logic genuinely holds ongoing state.

**Direction of dependency is absolute: the TUI imports the logic module; nothing flows the other way.** The logic module is the only part of the spike that may outlive it — once validated, it can be lifted into real code while the TUI shell is deleted.

### 4. Build the smallest TUI that exposes the state

A full-frame terminal loop: clear the screen and re-render everything on every action, so the user always sees one stable view instead of growing scrollback. Each frame, top to bottom:

1. **Current state**, pretty-printed and easy to diff by eye — one field per line or formatted JSON. Plain ANSI styling (bold headers, dim for secondary detail) is enough; add no styling dependency.
2. **Key legend** at the bottom, e.g. `[a] add item  [x] cancel  [t] advance clock  [q] quit`.

Loop: initialize in-memory state → render → read one keystroke → dispatch into the logic module → re-render → repeat until quit. The frame should fit on one screen.

### 5. One command

Wire it into the project's existing task runner so the user launches it by name, never by path. No runner? Put the exact command on the first line of the spike's README.

### 6. Hand it over, then listen

Give the user the command and let them drive. The valuable moments are "wait, that shouldn't be allowed" and "I expected X here" — those are defects in the *idea*, which is exactly what you're hunting. Add actions on request; run-spikes evolve.

### 7. Capture the answer

Per SKILL.md: the answer — not the code — goes into an ADR, a requirement, or the closing commit message, alongside the question from step 1.

## Anti-patterns

- **Tests on a spike.** If it needs tests, it has stopped being a spike.
- **Wiring to a real database.** In-memory only, unless persistence *is* the question.
- **Generalizing.** No "we might need X later." One question, one spike.
- **Terminal code leaking into the logic module.** The moment the reducer knows about escape codes or prompts, it's no longer portable — and portability is the only value it has.
- **Shipping the TUI shell.** The shell is for hand-driving in a terminal. Only the validated logic module may graduate.
