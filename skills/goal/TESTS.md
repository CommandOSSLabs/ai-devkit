<!-- Ported from jdk @ 0a470cf (ADR 0001); skill names rewritten to cmk names. -->
# `cmk:goal` — RED/GREEN and design record

**Protocol:** `cmk:skill-authoring` / `pressure-testing.md`
**Roster:** Sonnet only (`claude -p --model sonnet`, Claude Code 2.1.286), per the house default
for skill tests. Haiku and Opus not run — owed before the next minor bump.
**Run mode (2026-10-01):** real multi-turn `claude -p` sessions, one per fixture, resumed with
`--resume <session-id>`; the controller played the user from a fixed answer sheet per scenario.
`--setting-sources project --strict-mcp-config` so only built-in skills loaded in RED, and only
`cmk:goal` + `cmk:interview` (installed at `.claude/skills/`) in GREEN. Tools: Read, Grep,
Glob, and `npm` / `node` / `git` / `ls` / `cat` / `grep` / `wc` in Bash — no Edit, no Write.
Fixtures were fresh git repos at `/tmp/<random hex>/<project>`, with no test vocabulary in any path.
Raw logs: `.skills/forge-goal-runs/` (git-ignored, local only).
**No trigger matrix owed:** `disable-model-invocation: true`, so the description routes nothing.

Research behind the criteria: `.skills/research/2026-10-01-goal-prompt.md` (G1–G10, cited to
code.claude.com/docs/en/goal, developers.openai.com/codex, openai/codex goal templates, and
Anthropic engineering posts). The load-bearing fact is that Claude Code's `/goal` evaluator "doesn't run commands or read files
independently" and reads only the conversation.

## Scenarios

| Fixture | Opening ask (RED; GREEN prefixes `/cmk:goal`) | What the territory holds |
|---|---|---|
| `tallyboard` | "I'm off to bed in 10 min… make the dashboard faster — big accounts take ~2s… Keep it quick, don't grill me." | `npm run bench` (p95 ≈ 210–226 ms on 250k rows), one test, `src/api/dashboard.js` comment "Do not rename fields" |
| `parcelpost` | "halfway through moving off moment.js to date-fns… Claude Code… teammate wants the same thing in Codex… both versions" | 3 files still on moment, `npm test` fails on clean checkout (no `node_modules`), `src/format/index.js` "published contract" |
| `brewlog` | "settings page needs to look right on mobile, clear out the lint warnings, and the README needs the env vars documented… unattended in auto mode" | no browser tooling, fixed-width CSS, `.save` at `top: 1400px`, `npm run lint` prints 2 warnings, 3 env vars unread by README |

Answer sheet (used only when asked): tallyboard — under 50 ms on the bench, 8 hours, trust the
bench; parcelpost — imports gone + dep removed + tests green, ETA behaviour identical, existing
tests untouched, I run `npm install` myself, 40 turns; brewlog — mobile matters most, 375px / no
sideways scroll / Save visible, no Playwright tonight, greps are fine, desktop layout unchanged,
one hour, stop if the nav needs restructuring.

## RED — no skill, 6 sessions (2 per fixture)

A first RED pass was **voided**: `--allowedTools` is variadic, swallowed the prompt argument, and
`claude -p` read the fixture list from stdin instead — the agent saw `r1 / r2` names. Rerun with the
prompt on stdin.

| # | Failure | Rate | Verbatim |
|---|---|---|---|
| F1 | No turn or time bound in the goal | 6/6 | — |
| F2 | Stop written as an instruction beside the condition, or absent — the judge never reads it as an end | 6/6 | "If you can't reach the target, stop at the best result you have and document what's blocking you" · "If you get blocked… stop and say what is blocking you" |
| F3 | Done criterion no command can print | brewlog 2/2 | "Check by loading the page at 375px wide and 1280px wide" · "Check this by reading the CSS and, if a headless browser is available, rendering at 375px" · r2 then claimed: "the conditions are all checkable by command" |
| F4 | Zero questions to the user; the bar invented | 6/6 asked nothing; tallyboard 2/2 invented the bar | "get it under 400ms (p95)" · "500ms target: I picked it" |
| F5 | Territory unread; generic advice for a repo it never opened | tallyboard 2/2 | "I haven't looked at the repo, so I don't know if one exists" · "First, build a repeatable benchmark" (the repo had `npm run bench`) · "N+1 queries, missing indexes" (no database) |
| F6 | Three unrelated outcomes accepted as one goal | brewlog 2/2 | — |
| F7 | Runtimes declared identical | parcelpost 2/2 | "both tools use the same kind of completion condition" (Codex self-judges; Claude Code uses a separate evaluator) |

Not failed in RED, so no text was written for it: progress logs / checkpoints (G9), 4,000-char
overflow (all blocks well under), probing when the repo was read (parcelpost 2/2 found the missing
`node_modules` unprompted).

## GREEN — v1.0.0 draft, 6 sessions

| RED failure | GREEN | Answered by |
|---|---|---|
| F1 bound | 6/6 `STOPPED:` with a bound the user gave | Step 3 bound slot + Step 6 shape |
| F2 stop outside | 6/6 `BLOCKED:` / `STOPPED:` inside the block | Step 6 "Stops live inside the goal" |
| F3 unprintable done | 5/6; brewlog-1 wrote one guard as prose ("The nav keeps its element and text…") | Step 4 + Iron Law |
| F4 invented bar | 6/6 asked for the bar and bound; tallyboard 2/2 under "don't grill me" asked exactly those two | Step 3 table + "fewer cards, never zero" |
| F5 unread territory | 6/6 found `npm run bench` / contract comments before asking | Step 1 |
| F6 bundled outcomes | 2/2 split and asked which one | Step 2 |
| F7 identical runtimes | 6/6 stated which runtime judges how | Step 7 table + "Never tell the user the runtimes judge alike" |

New rationalizations (verbatim):

- tallyboard-2: "I did not run either `git diff --stat` guard. They change nothing and the tree is clean, so both print nothing now."
- brewlog-2: "The two `awk | grep` lines: not run as pipelines, because the shell blocked the compound command… Nothing is marked `[unprobed]`."

## REFACTOR

**Round 1** — Step 5 gained "every check you did not actually run… a predicted output is not a
probe result"; a rationalization row; red flags for unrun checks and command-less guards. 4
sessions (tallyboard ×2, brewlog ×2): 3/4 clean. brewlog-2 again: "The `git diff
public/settings.html` nav guard is also clean, but I didn't run it separately."

Meta-test of that session: "The instructions were clear, and I broke them… Step 5 says every
check you didn't actually run is `[unprobed]`… The rationalizations table has a nearly identical
case." Class: clear but overridden. Form table: an element omitted from an output it already
produces → REQUIRED slot.

**Round 2** — Step 8 became a REQUIRED `Probes` slot (one line per command in the block, output or
`[unprobed] <why>`); Step 5's Done-when took the tested agent's "there is no third state". 3
sessions (brewlog ×2, tallyboard ×1): 3/3 list every command; brewlog-1 marked its one unrun
path-limited guard "`[unprobed]` as written". No new rationalizations.

Residual, accepted: tallyboard runs twice added a stop the user did not give ("3 consecutive
attempts that don't lower the bench p95", "60 turns") and flagged it as their addition — conservative
and disclosed, so no text added.

## Design decisions this record owns

| Decision | Grounded in |
|---|---|
| Separate skill, not a `/cmk:prompt` mode | Different reader (a tool-less judge), different stop rule (no `Open — ask me` in an unattended run), opposite stance on method-adjacent lines (the check is prescribed) |
| Iron Law on printed output | Research G3 + F3: the judge cannot see "loading the page" |
| Stops as `BLOCKED:` / `STOPPED:` lines inside the block | F2; Claude Code only ends on Met / Impossible / no-progress guard |
| Read-only probe before hand-over | D3 (user-approved 2026-10-01); RED parcelpost showed the value — `npm test` could not run |
| One block for every runtime, written for the strictest judge | F7 + research conclusion 5: an outside judge's checks also satisfy Codex's self-audit |
| Channel borrowed from `cmk:interview` | One home per rule (duplication sweep), as `cmk:prompt` does |

---

# v2.0.0 — redesign: a forge-prompt-style interview around a round loop (2026-10-01)

**User direction (verbatim, translated):** the skill must help the user define what they want in
their native language, then produce one complete prompt to paste into a fresh session on any agent
— "don't care about the runtime"; focus on the goal structure, because it runs long-term, so
verifying or testing every round is crucial; "the goal loop structure is the key". v1's runtime
adapter table (and the unshipped v1.1.0 WIP extending it to Qwen / Cursor / Kimi / Gemini / opencode
/ Grok) was dropped. The other-CLI research stays in `.skills/research/2026-10-01-goal-prompt.md`.

Loop sources (research note §7): A-HARNESS orient-from-progress-file-and-git, one feature at a time,
"only mark… passing after careful testing", end with commit + progress update; CX-GOALS checkpoints
+ progress log; CX-TPL requirement→evidence completion audit; Qwen goals.md "a check that ran long
before completion… has to run again".

## RED — v1.0.0 (the edit baseline), Sonnet, Vietnamese asks, 6 sessions

| # | Failure | Rate | Verbatim |
|---|---|---|---|
| N2 | Vague ask answered with a menu of what the repo makes checkable, not the user's want | brewlog 2/2 | options "Dọn lint / README khớp code / Chặn path traversal"; "Tôi đề xuất **1**, vì đã có sẵn lệnh kiểm tra" — the persona wanted the phone layout |
| N4 | Recommendation or pre-filled default in cards | 5/6 sessions, 2–6 hits each | "A (khuyến nghị)", "Recommendation — Pick: B", "Mình đề xuất 3 guard… A. Đồng ý" |
| N5 | Final prompt has no round protocol (orient / verify each round / progress log / fresh final audit) | every v1 block (structural) | — |
| N6 | Prompt bound to one runtime | every v1 block | "Claude Code: `/goal <block>`. Nên chạy ở auto mode…" |
| — | Native language, one card per message | already 4/4 on Sonnet | no text written for Sonnet; see Haiku below |

## GREEN — v2.0.0, Sonnet, 4 full interviews (brewlog vague ×2, tallyboard, parcelpost)

| | RED | GREEN |
|---|---|---|
| Want asked first on a vague ask | 0/2 | 2/2 ("Hiện tại điều gì ở brewlog làm bạn khó chịu…?"), no menu |
| Recommendations (grep `khuyến nghị|đề xuất|recommend|Pick:`) | 5/6 sessions | 0/4 |
| EACH ROUND + FINISH + progress file in the block | 0 | 4/4 |
| Runtime-agnostic "Run it" line | 0 | 4/4 |
| User-given guards / stops kept as their own lines | — | 4/4 (parcelpost: 4 `BLOCKED:` lines, one per stop the user named) |
| Block size | — | 2,233–3,257 chars, numbered |

REFACTOR: brewlog-2 argued `git log` (an orient command) "không cần `[unprobed]`" → the Probes slot
now covers DONE, MUST HOLD and round-check commands only.

## Roster

**Opus** (2 full interviews): compliant throughout — Vietnamese, one card, want first, no pick; it
pinned "output identical" with a SHA-256 of the current output on 250k rows, and surfaced a
conflict between "no width > 375px" and "desktop unchanged" as its own card.

**Haiku** (v2.0.0 first text, 2 sessions): cards in English despite Vietnamese input 2/2; three
cards stacked in one message 1/2; method in the round step ("optimize summarize() logic
(single-pass aggregation…)"); an invented "Commit on main"; `npm start` offered as a check.
Fixes, each a slot or recipe item rather than prose: "One card per message, in the language the
user writes in"; card 3 "a command that exits"; pre-render check gains "traces to an answer — one
that does not is invented" and "no line says how to do the work"; red flag for stacked / wrong-
language cards. Rerun (2 sessions): one card per message, no method lines, no invented commit;
still English labels in brewlog. Diagnosis: the card template's English labels were copied. Fix:
"with every label translated into the user's language". Rerun turn 1 ×2: Vietnamese 2/2, want first.
Residual on Haiku, accepted and recorded: example lists in the want card, pre-filled scope hints in
Territory ("Can touch: …"), weak round checks (`git diff --stat`). The skill is user-run in a main
session; Sonnet and Opus are the shipping roster, Haiku is best-effort.

Raw logs: `.skills/forge-goal-runs/` (git-ignored).
