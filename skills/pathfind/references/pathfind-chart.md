# Chart procedure

WHEN the user invokes `/cmk:pathfind` with a loose idea (no map yet), follow this
exactly.

1. **Surface.** Classify **greenfield** vs **brownfield** (same spirit as
   `cmk:vision` / `cmk:repo-setup`'s `references/bootstrap.md` brownfield detection). Record in Notes.
2. **Territory (brownfield).** IF no usable territory digest exists THEN dispatch a
   scan aligned with `cmk:vision` `brownfield-scan.md`, write or point to
   `.skills/pathfind/<effort-slug>/territory-scan.md`, and MUST NOT start destination
   interview until that digest exists or you hard-stop. Scan candidates are untrusted.
3. **Destination.** Nested REQUIRED SUB-SKILL: use `cmk:interview` → 1–2 line
   Destination. Destination **fixes scope**.
4. **Breadth-first fog.** Surface open decisions. **Ticket vs fog test:** ticket only
   when the question can be stated **precisely now** (even if blocked). Else
   **Not yet specified** — never pre-slice fog into fake tickets.
5. **No-map exit.** IF no multi-session fog (journey fits one session) THEN do not
   create a map; **name** `cmk:scope`, `cmk:vision`, `cmk:amend`, or
   `cmk:debug` as fits. **Done when:** user knows the next skill.
6. **Create map** (`pathfind:map` or local `map.md`) with all REQUIRED map slots;
   Decisions so far empty.
7. **Create sharp tickets**, then **wire blocking in a second pass** (ids first).
8. **Research burn.** Fire `cmk:research` subagents **in parallel** for research tickets;
   findings via throwaway branch and/or `.skills/research/…` pointers. Research is the
   **only** exception to one-ticket-per-session.
9. **Knowns skeleton.** Write `.skills/pathfind/<effort-slug>/knowns.md` (+ optional
   `map-pointer.md`). Chart MUST NOT resolve HITL **clarify** or **prototype** tickets.
10. **Stop.** Charting is one session.

**Done when (map created):** map exists with all slots; frontier tickets sharp;
research either resolved or in flight with pointers; knowns skeleton written; no HITL
clarify/prototype closed in this Chart session.
