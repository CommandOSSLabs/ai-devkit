

## Merge into cmk (ADR 0001 P4, 2026-10-19)

`init` now reads `references/bootstrap.md` (jdk `bootstrap-repo`): greenfield gate, stack card,
the harness no facet owns (one passing example test, format/lint/typecheck commands,
pre-commit hook, README), and the proof gate. `cmk:repo-config` joined the facet chain after
`cmk:agent-instructions`. The superpowers hand-off section is gone (ADR 0001). The duplicated
docs-seed templates moved out; `cmk:repo-config` seeds them.

| Run (skill-tester, sonnet) | Result |
|---|---|
| `/cmk:repo-setup init` in an empty directory holding only `.claude/skills/` — tidepool, a Bun CLI, decisions given up front | **PASS** — gate classified greenfield; layout, toolchain, docs, agent-instructions, repo-config ran, six facets skipped with reasons; one example test; Biome + tsc; pre-commit hook proven by a throwaway commit; `bun install` and `bun run verify` green with output; committed |
| `/cmk:repo-setup` on an existing Bun ledger with no docs (adopt, plan approved up front, destructive moves listed only) | **PASS** — five facets run, six skipped with reasons in `docs/reports/`; `AGENTS.md` symlinked to `CLAUDE.md`; `bun test` green; traceability clean; the package rename listed, not done |

Found by these runs and fixed: `cmk:repo-config` started `~/.kimi-webbridge` on the user's
machine in both runs although nobody asked (now opt-in, see its TESTS); `docs/guides/on-ramps.md`
was a pointer into the kit repo (now seeded from `cmk:agent-instructions`'s
`references/on-ramps.md`).
