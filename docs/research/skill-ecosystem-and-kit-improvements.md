# What should AI DevKit do next? Ecosystem survey and improvement backlog

Date of investigation: 2026-10-11. Prompted by the tech lead's question: *"haven't
heard any update to this project for a while. Is there anything we can improve
the kit? I'd like us to survey the team, who can take this on?"*

Research is an input, not a source of truth. Facts marked **UNVERIFIED** came
from secondary sources only.

## TL;DR

- **Status:** kit is healthy but six weeks quiet; the ecosystem moved on evals,
  vendor coverage and per-developer personalization.
- **Do first (week of Oct 13):** run skill evals in CI (item 1) and add a
  `cmk:profile` skill for personal preferences (item 12). Plan in
  [section 9](#9-plan-for-the-week-of-oct-13).
- **Do next:** curated companion-skills guide (item 7), vendor adapters for
  Gemini / Copilot / VS Code (item 3), fix the roadmap page (item 11).
- **Do not:** vendor third-party design, explainer or persona skills into the
  kit. Point at them from a curated table instead (section 4).

## How to use this doc

- Answering the tech lead: copy section 1.
- Picking work: section 3 is the backlog; each row has effort and a
  suggested owner. Confirm owners with the survey in section 7.
- Recommending a third-party skill to someone: section 4, and apply the
  policy at the top of that section before installing.
- Explaining *why* to a sceptic: sections 5 and 6 carry the dated evidence.

## Terms used in this doc

| Term | What it means here |
|---|---|
| `eval.json` | The kit's own fixture format: a list of cases, each with a `prompt` and plain-English `assertions`. 31 cases exist across 8 skills. `skill-lint` only checks the JSON shape; nothing runs the prompts |
| `claude plugin eval` | Claude Code CLI command (v2.1.269+, Sep 2026) that runs each case several times with and without the plugin, grades the transcript with graders (`regex`, `tool_used`, `tool_order`, `file_exists`, `llm`, `baseline`), reports pass rate and exits non-zero under a threshold. Its case layout is `evals/<case>/prompt.md` + `graders/*.md`, which is **not** the same as our `eval.json`, so a converter is needed |
| Trigger accuracy | Whether a skill is invoked when it should be and stays silent when it should not. Measured with should-trigger and should-not-trigger prompts; `claude plugin eval` reports it via a `tool_used: Skill` grader |
| `/skill-doctor` | Claude Code command (v2.1.252+) that reports per-skill context cost and how often each skill was invoked, and flags never-used skills |
| Team rules layer | Checked-in instructions every developer and agent gets: `CLAUDE.md`, `docs/rules/`, the `cmk:*` skills. The kit covers this layer today |
| Personal preferences layer | Per-developer settings that should not be committed: language, tone, review strictness, preferred companion skills. Claude Code reads a gitignored `CLAUDE.local.md`; Codex reads `~/.codex/AGENTS.md`; OpenClaw uses `USER.md` / `SOUL.md`. The kit has nothing here; `cmk:profile` fills it |
| Agent-written memory layer | Notes the agent writes for itself across sessions (Claude Code auto memory, Codex memories). The kit's thesis is that durable items should be promoted into `docs/knowledge` and `docs/rules` rather than staying private; `cmk:retro` (item 13) would do that |
| Companion skill | A third-party skill we recommend and pin, but do not copy into the kit |
| `.agents/skills/` | The directory most agent CLIs now read directly; the kit's canonical vendored home |

## Contents

1. [Short answer for the tech lead](#1-short-answer-for-the-tech-lead)
2. [Where the kit stands today](#2-where-the-kit-stands-today)
3. [Improvement backlog, with suggested owners](#3-improvement-backlog-with-suggested-owners)
4. [Curated external skills table](#4-curated-external-skills-table)
5. [Trends in agent skills, Apr–Oct 2026](#5-trends-in-agent-skills-apr-oct-2026)
6. [Personalization: the "Grok bots" angle](#6-personalization-the-grok-bots-angle)
7. [Team survey draft](#7-team-survey-draft)
8. [Sources](#8-sources)
9. [Plan for the week of Oct 13](#9-plan-for-the-week-of-oct-13)
10. [Per-skill improvement map](#10-per-skill-improvement-map)
11. [Reply to Daniel (tech lead)](#11-reply-to-daniel-tech-lead)

---

## 1. Short answer for the tech lead

Superseded by the fuller reply in [section 11](#11-reply-to-daniel-tech-lead); kept as the one-screen version.

> The kit has been quiet since Sep 1 (last merge: persistent runner fleets).
> It is not stale, but the ecosystem moved a lot in the meantime and three
> things are now worth doing:
>
> 1. **Catch up with the platform.** Skill evals are now first-class
>    (`claude plugin eval`, `/skill-doctor`, Anthropic skill-creator benchmark
>    mode). Only 8 of our 34 skills have `eval.json` and none run in CI. Our
>    vendor adapters also miss Gemini CLI, GitHub Copilot and VS Code, which
>    all read `.agents/skills/` now.
> 2. **Curate, don't absorb.** We can't ship every skill people like (design
>    taste, explainers, humanizer). Instead, ship a vetted "recommended
>    companions" table with install lines and a per-skill security check,
>    and let `cmk:repo-setup` offer them. Marketplace audits this year found
>    13–37% of public skills with security issues, so curation is a feature.
> 3. **Add the personal layer.** Every vendor now separates team rules from
>    per-developer preferences and agent-written memory. The kit only has the
>    team layer. A `cmk:profile` skill (gitignored personal preferences,
>    SOUL.md/USER.md style) is the cheapest high-visibility addition.
>
> I drafted a backlog with suggested owners based on who touched what in git
> (Jayden: requirements/delivery; Harry: website and explorer; Abdol/Theodore:
> review/simplify; setup/CI family is your area). Survey questions are attached.
> I can own the curated-companions table and the eval CI wiring this sprint;
> I'd like one more person for the vendor-adapter update.

## 2. Where the kit stands today

Internal audit of `main` at 85d2c6d (2026-09-01).

| Signal | State |
|---|---|
| Skills | 34 `cmk:*` skills, plugin version 1.5.0 |
| Last merge | 2026-09-01 (six weeks quiet at time of writing) |
| Commits in 2026 by author | Daniel Lam 115 · Harry Phan 63 · Jayden Đặng 36 · Abdol164 2 · Theodore 1 |
| Eval coverage | `eval.json` in 8 skills (31 cases), `TESTS.md` in 8; neither runs in CI (`skill-lint` only validates fixture shape) |
| Vendor adapters (`cmk:agent-vendors`) | Claude Code, Grok Build, Codex, OpenCode, Cursor. Missing: Gemini CLI, GitHub Copilot / `gh skill`, VS Code, JetBrains Junie, Amp, Factory, Letta, Devin |
| Roadmap page | "Now" items point at PRs 24 and 13, both merged on Aug 29–30. "Next" item `cmk:visualize` cites `docs/design/visualize.md`, which does not exist |
| Dogfooding | The kit's own `docs/decisions/`, `docs/knowledge/`, `docs/research/` were empty until this file. No ADR records why the kit is docs-first or why 150 lines is the budget |
| Frontmatter | Kit uses `name` / `description` / `version`. The open spec allows `name, description, license, compatibility, metadata, allowed-tools`; `version` is a Claude Code / Factory extension and would be rejected by a strict claude.ai upload |
| Security posture | No skill-scanner in CI; no commit pinning guidance for third-party skills; `cmk:sync` lockfile covers only our own skills |

Areas by contributor (files touched in 2026): Daniel owns `docs/ai`, `cicd`,
`local-stack`, `delivery-pipeline`, templates and rules. Jayden owns
`requirements`, `codebase-docs`, `delivery-workflow/review`. Harry owns the
website (`app/`, `components/`, `lib/`) and the explorer design docs.
Abdol164 touched `cicd` security scanning; Theodore touched `delivery-simplify`.

## 3. Improvement backlog, with suggested owners

Owners are *suggestions from git history*, to be confirmed by the survey.
Effort: S ≤ 1 day, M ≤ 1 week, L > 1 week.

### 3a. Platform catch-up

| # | Item | Why now | Effort | Suggested owner |
|---|---|---|---|---|
| 1 | **Run evals in CI.** Add `evals/<case>/prompt.md` + graders for the 8 skills that already have `eval.json`, run `claude plugin eval --json --threshold` in a nightly workflow with a cost cap; add trigger-accuracy cases (should / should-not trigger) per skill | `claude plugin eval` shipped v2.1.269 (Sep 2026); skill-creator benchmark mode gives pass-rate/tokens deltas; Anthropic reports description tuning fixed triggering on 5 of 6 skills | M | Harry (CI) + Jayden (cases) |
| 2 | **Trigger-collision check.** Run a description-overlap lint (Jaccard ≥ 0.6 warn) across the 34 skills; 10 delivery-family skills share vocabulary | Community linters (`skillcheck`, `skills-lint`) do this; our `skill-lint` does not | S | Harry |
| 3 | **Extend vendor adapters** to Gemini CLI, GitHub Copilot (`.github/skills` + `gh skill`), VS Code, Junie, Amp, Factory | 47 clients listed on agentskills.io; `.agents/skills/` is the universal path, so most are direct-discovery and cheap | M | Daniel's area; Harry can take |
| 4 | **Spec-conformant frontmatter.** Move `version` under `metadata:` (or keep both) so skills pass `skills-ref validate` and the claude.ai uploader | Spec repo now in Linux Foundation AAIF process (proposal #47, Sep 24); strict validators are spreading | S | Jayden |
| 5 | **Context-budget report.** Add a `skill-lint` line that estimates tokens per SKILL.md and total listing cost; Claude Code caps the listing at 1% of context and drops least-used descriptions | `/skill-doctor` (v2.1.252) and the 1,536-char per-entry cap mean verbose descriptions get silently truncated | S | Harry |
| 6 | **Hooks-in-skills.** Let `cmk:delivery-review` and `cmk:delivery-ship` register a `Stop` / `PreToolUse` hook via frontmatter so gates are enforced, not just described | "Hooks are what separate 'I told the agent' from 'the system enforces'" (Osmani, Apr 2026); hooks in skill frontmatter are now in Claude Code docs | M | Theodore / Abdol |

### 3b. Curation and distribution

| # | Item | Why now | Effort | Suggested owner |
|---|---|---|---|---|
| 7 | **Recommended-companions table** (section 4 below) shipped as `docs/guides/companion-skills.md` and surfaced on skills.commandoss.com, with install line, pin SHA, and audit status | Users want design-taste, explainer and humanizer skills we should not vendor; curation is the differentiator over SkillsMP-style aggregators | S | Harry |
| 8 | **`cmk:repo-setup` offers companions.** During bootstrap, ask which companion packs to install (`npx skills add owner/repo --skill x`) and record them in `.agents/skills-lock.json` | `npx skills` v1.7.2 (Oct 9) added `sync --recursive` and a `package.json` `skills` field; a kit that writes that field integrates cleanly | M | Daniel's area; Harry can take |
| 9 | **Third-party skill scanning in `cmk:cicd`.** Add Cisco `skill-scanner` or `mcp-scan --skills` as an optional CI job, plus a rule: no skill whose setup downloads archives or pipes remote scripts | ToxicSkills: 13.4% critical, 76 confirmed malicious; Zenity found trojanized skills with 1.7M installs on skills.sh (Aug 2026) | S | Abdol |
| 10 | **Publish to more registries.** Submit to `claude-plugins-official` community catalog, add a `.agents/plugins/marketplace.json` for Codex, and tag releases so `gh skill install --pin` works | Codex plugins (Mar 2026), Copilot `gh skill` (Apr 2026), Agent Plugins 1.0 (Aug 2026) | M | Harry |
| 11 | **Fix the roadmap page.** Move PRs 24/13 to Shipped, write `docs/design/visualize.md` or drop the item, add the items from this backlog | Page currently misreports state | S | Harry |

### 3c. New skills

| # | Item | Why now | Effort | Suggested owner |
|---|---|---|---|---|
| 12 | **`cmk:profile`** — per-developer preference layer: gitignored `CLAUDE.local.md` / `USER.md`-style file with tone, review strictness, language (vi/en), preferred companions; `cmk:agent-instructions` learns to merge team + personal | See section 6; every vendor now has team/project/user layering, but no first-party "about me" skill exists | M | Jayden |
| 13 | **`cmk:retro`** — session retrospective that proposes learnings for `cmk:learn`, rule candidates for `cmk:rule`, and skill-edit PRs, each needing approval | Compound-engineering `ce-compound`, `everything-claude-code` continuous-learning-v2, `netresearch/retro-skill` all converge on this; fits the docs-first thesis exactly | M | Theodore |
| 14 | **`cmk:visualize`** (already on roadmap) — now has clear prior art: `nicobailon/visual-explainer` (10k stars), `wheresryan22/anatomy`, Claude Motion / Dashboards (Oct 8). Recommend: ship it as a thin skill that delegates to those companions and only owns the "cite the files you read" contract | Anthropic shipped Claude Motion explainers and Dashboards two days ago; demand is proven | M | Harry |
| 15 | **`cmk:security-review`** lens inside `cmk:delivery-review` referencing Sentry's reasoning-style skill rather than a checklist copy | A reviewer found the most-installed "security-review" skill was an unmodified copy in a bundle | S | Abdol |
| 17 | **Plannotator gate in the delivery family.** `cmk:delivery-spec-plan` ends by handing the plan to Plannotator for annotation and approval when it is installed; `cmk:delivery-ship` offers `/plannotator-review` on the diff before opening the PR; `cmk:repo-setup` lists it as an optional companion | Plan approval is the weakest human checkpoint in `cmk:delivery-pipeline` today; Plannotator is free, hook-based and covers every vendor we adapt | S | Harry |
| 16 | **`cmk:design-system`** — turn a repo's own tokens/components into a skill (wrap `vercel-labs/design-systems-to-agent-skills`), so teams who prefer Emil's or Bakaus's taste can still ground it in their system | Google DESIGN.md (Apr 2026) and the taste-skill wave show people want *their* system codified | M | Harry |

## 4. Curated external skills table

Policy that this table follows: vendor-org or named-maintainer repos, read
every `SKILL.md` before adoption, reject setups that download archives or pipe
remote scripts, **pin by commit SHA**, run a scanner in CI. Star and install
figures were read on 2026-10-11 and will drift. Pick **one** main design
engine; stacking several conflicts.

### Design systems and UI taste

| Skill | Author | What it does | Install | Signal | Fit |
|---|---|---|---|---|---|
| [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Anthropic | Baseline "avoid generic AI UI"; most others extend it | `npx skills add anthropics/skills --skill frontend-design` | ~973k installs | Default |
| [impeccable](https://github.com/pbakaus/impeccable) | Paul Bakaus | Design-language layer with `/polish /audit /typeset` commands and anti-pattern library | `npx skills add pbakaus/impeccable` | 79.5k stars | For teams wanting opinionated polish |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder | Searchable style/palette/font DB, design-system generator, WCAG checklist; multi-framework | `npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max` | 134.6k stars, ~347k installs | For greenfield apps |
| [taste-skill](https://github.com/Leonxlnx/taste-skill) | Leon Lin | Metric-driven layout/typography/motion rules | `npx skills add Leonxlnx/taste-skill --skill design-taste-frontend` | 94.5k stars | Alternative main engine |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | Emil Kowalski | A named designer's taste: UI polish, Apple-style animation vocabulary | `npx skills add emilkowalski/skills` | 45.1k stars | Add for motion |
| [web-design-guidelines](https://github.com/vercel-labs/agent-skills) | Vercel | UI review against Vercel's web interface guidelines | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` | repo 32.2k stars | Review lens |
| [design-systems-to-agent-skills](https://github.com/vercel-labs/design-systems-to-agent-skills) | Vercel Labs | Turn *your own* design system into a skill | clone | 44 stars | Basis for item 16 |
| [shadcn skill](https://ui.shadcn.com/docs/skills) | shadcn | CLI v4, registry, Tailwind v4 config | `npx skills add shadcn/ui` | shadcn 125k stars | If on shadcn |

### Explainers and visualization

| Skill | Author | What it does | Install | Signal | Fit |
|---|---|---|---|---|---|
| [anatomy](https://github.com/wheresryan22/anatomy) | Ryan (wheresryan22) | "Explains an idea by building it as a real, working object": invents a machine whose operation *is* the concept, renders interactive isometric SVG from a small simulation; MIT, no API keys | `npx skills add wheresryan22/anatomy -g -a claude-code` | 418 stars, pushed 2026-10-10 | Teaching, onboarding docs |
| [visual-explainer](https://github.com/nicobailon/visual-explainer) | nicobailon | HTML pages / slide decks with animated hand-drawn diagrams for diffs, plan audits, recaps | `npx skills add nicobailon/visual-explainer` | 10.3k stars | Review and handoff visuals |
| [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | Egonex-AI | Codebase into an explorable, queryable knowledge graph | see README | 85.9k stars | Pairs with `cmk:codebase-docs` |
| [html-explainer](https://github.com/ds-vibe/html-explainer) | ds-vibe | Single-page HTML explainers with QA loop and anti-slop guards | clone | 18 stars | Lightweight |
| Claude Motion / Dashboards | Anthropic (product, Oct 8 2026) | 30-second code-animated explainers, live dashboards | built in | n/a | Target for `cmk:visualize` |

### Engineering workflow and methodology

| Skill | Author | What it does | Install | Signal | Overlap with kit |
|---|---|---|---|---|---|
| [superpowers](https://github.com/obra/superpowers) | Jesse Vincent | Brainstorming, writing-plans, TDD, systematic-debugging, subagent-driven-development, writing-skills | `npx skills add obra/superpowers` | 297k stars | brainstorming ≈ `cmk:requirements`; writing-plans ≈ `cmk:delivery-spec-plan` |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Matt Pocock | grill-me (interrogate the plan), tdd, triage, handoff, improve-codebase-architecture | `npx skills add mattpocock/skills` | 285k stars; grill-me 1.3M installs | grill-me is a strong elicitation companion to `cmk:requirements` |
| [planning-with-files](https://github.com/OthmanAdi/planning-with-files) | OthmanAdi | Persistent task_plan / findings / progress files for long tasks | `npx skills add othmanadi/planning-with-files` | 27.4k stars | Overlaps `cmk:delivery-pipeline` state |
| [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) | Every Inc | 36 skills incl. `lfg` autonomous loop and `ce-compound` learnings writer | marketplace add | 25.5k stars | Prior art for item 13 |
| [getsentry/skills security-review](https://github.com/getsentry/skills) | Sentry | Reasoning-style security review | `npx skills add getsentry/skills --skill security-review` | 1.0k stars | Item 15 |
| [trailofbits/skills](https://github.com/trailofbits/skills) | Trail of Bits | CodeQL/Semgrep, differential review, smart-contract audit | `/plugin marketplace add trailofbits/skills` | 7.5k stars | Sui / enclave audits |
| [agent-browser](https://github.com/vercel-labs/agent-browser) | Vercel Labs | Browser automation for QA | `npx skills add vercel-labs/agent-browser` | 1.1M installs | Ship-evidence step |
| [humanizer](https://github.com/blader/humanizer) | blader | Strips 26 AI-writing patterns from prose | `npx skills add blader/humanizer` | 55.5k stars | Docs and PR descriptions |
| [Plannotator](https://plannotator.ai/) ([repo](https://github.com/backnotprop/plannotator)) | backnotprop | Local plan and code review UI for agents: annotate a plan before it executes, PR-style diff review of uncommitted changes, feedback goes back to the agent as structured input. Hooks into Claude Code, Codex, Copilot, Gemini, OpenCode, Amp, Droid, Kiro, Pi, VS Code. MIT or Apache-2.0; hosted Workspaces on waitlist | one-line curl installer; `/plannotator-annotate`, `/plannotator-review`, `/plannotator-last` | stars not captured | Human gate between `cmk:delivery-spec-plan` and implement; review step in `cmk:delivery-review` and `cmk:delivery-ship` |

### Vendor knowledge (same genre as `cmk:sui-sdk`)

| Skill | Author | Install | Signal |
|---|---|---|---|
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (react-best-practices, vercel-optimize) | Vercel | `npx skills add vercel-labs/agent-skills` | 32.2k stars |
| [cloudflare/skills](https://github.com/cloudflare/skills) | Cloudflare | `npx skills add cloudflare/skills` | 3.0k stars |
| [stripe/ai](https://github.com/stripe/ai) stripe-best-practices | Stripe | `npx skills add stripe/ai --skill stripe-best-practices` | 1.9k stars |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) postgres-best-practices | Supabase | `npx skills add supabase/agent-skills` | 2.7k stars |
| [find-skills](https://github.com/vercel-labs/skills) | Vercel | `npx skills add vercel-labs/skills --skill find-skills` | 3.8M installs, #1 all-time |

### Memory and persona

| Skill | Author | What it does | Install | Signal |
|---|---|---|---|---|
| [claude-mem](https://github.com/thedotmack/claude-mem) | thedotmack | Cross-session memory in SQLite, re-injected | `/plugin marketplace add thedotmack/claude-mem` | 99.4k stars |
| [soul.md](https://github.com/aeonfun/soul.md) | Aaron Mars | Builds SOUL.md / STYLE.md / MEMORY.md persona from your writing via interview | clone, `/soul-builder` | 687 stars |
| [claude-memory-skill](https://github.com/hanfang/claude-memory-skill) | hanfang | Always-loaded `me.md` user profile | clone | 57 stars |
| [writing-style-skill](https://github.com/jzOcb/writing-style-skill) | jzOcb | Learns writing rules from your edits | clone | 271 stars |

### Where to look, and where not to

| Registry | Scale | Use |
|---|---|---|
| [skills.sh](https://skills.sh) | 1M+ skills, ~280M installs (Vercel, Sep 25 2026); top 375 skills = 62% of installs | Discovery and leaderboard; check the per-skill Socket/Snyk audit page |
| [claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | ~100 curated plugins | Only vetted registry; target for item 10 |
| [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 76.8k / 35.5k stars | Curated lists |
| SkillsMP, ClawHub, misc. aggregators | claims 3M+ / 10k+ | Avoid as sources: unvetted scrapes; ClawHub was the site of 341–1,184 malicious skills |

## 5. Trends in agent skills, Apr–Oct 2026

**The format won; governance is catching up.** Agent Skills (Oct 2025) is
now read by 47 listed clients including Cursor, Codex, Gemini CLI, Copilot,
VS Code, Junie and OpenCode. `.agents/skills/` is the de facto universal path.
The spec added no fields in 2026, only clarifications; Anthropic filed to move
it under the Linux Foundation AAIF on Sep 24 (approved by the TC Oct 1, board
vote pending). Agent Plugins 1.0 (Aug 6) packages skills + MCP + hooks.

**Evals became table stakes.** Anthropic's skill-creator (Mar 3) added
with/without-skill benchmarks, blind comparators and a description optimizer.
Claude Code shipped `/skill-doctor` (week 36) and `claude plugin eval` (week
37) with six grader types and trigger-accuracy arms. Papers converge on the
same point: 91.8% of 138k public SKILL.md files have at least one defect, and
focused skills beat bundles (SkillsBench, +16.6 pp).

**Skills eat MCP's token budget.** Anthropic's own posts (code execution with
MCP, Tool Search Tool) showed 85–98% token savings by deferring tool
definitions; skills wrapping CLIs became the default pattern, with MCP kept
for auth and auditability (stateless MCP spec, Jul 28).

**Skills now orchestrate.** Claude Code skill frontmatter supports
`context: fork`, `agent`, `hooks`, `allowed-tools`, `paths`; subagents can
preload up to 32 skills; dynamic workflows (`agent()/pipeline()/parallel()`)
ship inside plugins. Codex skills can declare MCP dependencies.

**Distribution professionalized.** `npx skills` added commit-SHA pins, a
lockfile, `sync --recursive`, and a `package.json` field. Cursor (Feb),
Codex (Mar) and Copilot (Apr) all launched marketplaces with enterprise
allow/block lists. Codex can import skills from Claude Code and Cursor.

**Security went mainstream.** ClawHavoc (Feb), ToxicSkills (Feb), Trail of
Bits scanner bypasses (Jun), Zenity's skills.sh trojans (Aug), and CVEs in
Claude Code, Cursor and Codex hook loading. Mitigations shipped
(`allowManagedPermissionRulesOnly`, SHA-pinned catalogs, OWASP Agentic Skills
Top 10); signing is still only a proposal in the spec repo.

**New genres.** "Grill" interrogation skills (7 of the top 15 on skills.sh);
named-designer taste skills; explain-by-building explainers (`anatomy`,
Claude Motion); session-retrospective and self-evolving skills
(continuous-learning-v2, hermes-agent-self-evolution with DSPy/GEPA);
autonomous delivery loops (Ralph, `lfg`).

## 6. Personalization: the "Grok bots" angle

The consumer companion wave (Grok Companions, Character.AI, Replika) is under
regulatory pressure and the companions themselves reportedly moved out of Grok
around Sep 1 (**UNVERIFIED**). The durable developer-side signal is different:
**people want the agent to work the way *they* work**, and every vendor now
ships a three-layer model to deliver that.

| Layer | Claude Code | Codex | Cursor | OpenClaw |
|---|---|---|---|---|
| Org / team rules | managed skills dir, `CLAUDE.md` | `/etc/codex/skills`, `AGENTS.md` | Team rules, Required plugins | `AGENTS.md` |
| Personal preferences | `~/.claude/skills`, `CLAUDE.local.md` | `~/.agents/skills`, `~/.codex/AGENTS.md` | User rules | `SOUL.md`, `IDENTITY.md`, `USER.md` |
| Agent-written memory | auto memory + consolidation | `~/.codex/memories` (dreaming) | removed → rules | `MEMORY.md` + daily logs |

What this means for the kit:

- The kit covers the top layer only. Item 12 (`cmk:profile`) adds the
  middle layer: a gitignored personal file with tone, language, review
  strictness, and preferred companion skills, merged by
  `cmk:agent-instructions`.
- Item 13 (`cmk:retro`) connects the bottom layer back to the docs tree,
  which is the kit's thesis: agent memory should be promoted into
  `docs/knowledge` and `docs/rules`, not left in a private store.
- Persona files are a prompt-injection surface (Snyk recommends reviewing
  SOUL.md/MEMORY.md for tampering; Claude Code 2.1.284 sanitizes MEMORY.md).
  `cmk:profile` should keep the personal file out of git and never execute
  from it.

## 7. Team survey draft

Five questions, one form, answers in a week.

1. Which `cmk:*` skills did you invoke in the last month? Which did you
   expect to trigger but didn't? (`/skill-doctor` output welcome.)
2. Which third-party skills do you already run next to the kit, and in which
   agent (Claude Code / Codex / Cursor / Gemini / other)?
3. Rank the backlog items in section 3 you would use yourself; pick one you
   would build.
4. What personal preference do you re-explain to the agent every session
   (language, tone, review depth, formatting)?
5. What would make you contribute a skill change: evals in CI, a template,
   pairing, something else?

## 8. Sources

Primary sources consulted on 2026-10-11 (abridged; full list in the
research transcripts).

- Spec and adoption: https://agentskills.io/specification · https://agentskills.io/clients · https://github.com/agentskills/agentskills · https://github.com/aaif/project-proposals/issues/47 · https://agent-plugins.org/specification · https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/ · https://code.visualstudio.com/docs/copilot/customization/agent-skills · https://geminicli.com/docs/cli/skills/
- Evals and quality: https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills · https://code.claude.com/docs/en/plugin-evals · https://code.claude.com/docs/en/skills · https://arxiv.org/abs/2602.12670 (SkillsBench) · https://arxiv.org/html/2608.08453v1 (138k SKILL.md defects)
- Skills vs MCP vs hooks: https://www.anthropic.com/engineering/code-execution-with-mcp · https://www.anthropic.com/engineering/advanced-tool-use · https://addyosmani.com/blog/agent-harness-engineering/ · https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html · https://code.claude.com/docs/en/workflows
- Distribution: https://skills.sh · https://vercel.com/blog/state-of-agent-skills · https://github.com/vercel-labs/skills/releases · https://cursor.com/blog/marketplace · https://developers.openai.com/codex/plugins/build · https://code.claude.com/docs/en/plugins/org
- Memory and personalization: https://code.claude.com/docs/en/memory · https://learn.chatgpt.com/docs/customization/memories · https://docs.openclaw.ai/concepts/agent-workspace · https://platform.claude.com/docs/en/managed-agents/memory
- Security: https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ · https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution/ · https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain-risk/ · https://zenity.io/company-overview/newsroom/company-news/zenity-labs-discovers-dozens-of-malicious-ai-agent-skills-evading-detection-launches-ai-total · https://github.com/cisco-ai-defense/skill-scanner · https://owasp.github.io/www-project-agentic-skills-top-10/
- Genres and catalogs: https://github.com/wheresryan22/anatomy · https://github.com/nicobailon/visual-explainer · https://github.com/pbakaus/impeccable · https://github.com/emilkowalski/skills · https://github.com/obra/superpowers · https://github.com/mattpocock/skills · https://github.com/EveryInc/compound-engineering-plugin · https://github.com/affaan-m/everything-claude-code · https://github.com/netresearch/retro-skill · https://claude.com/resources/articles/dashboards-and-motion

## 9. Plan for the week of Oct 13

Two items chosen: evals in CI (item 1) and `cmk:profile` (item 12). Each has
a definition of done so the tech lead can check it without reading the diff.

### 9a. Evals in CI (item 1)

**What it means.** Today the 31 cases in the eight `eval.json` files are
documentation: nobody runs them, so a skill edit can silently break the
behaviour they describe. The goal is that every night a workflow runs those
prompts through Claude Code with the plugin, grades the transcripts against
the assertions, and fails when the pass rate drops.

**Before starting.** Confirm the case layout and flags against the live
docs page (https://code.claude.com/docs/en/plugin-evals); the details below
came from that page on Oct 11 and may shift.

| Day | Step | Output |
|---|---|---|
| 1 | Check `claude --version` ≥ 2.1.269. Run `claude plugin eval init --bare` in the repo. Convert `skills/requirements/eval.json` (4 cases) **by hand** into `evals/<case>/prompt.md` + `graders/*.md` to learn the shape | One skill's cases runnable locally |
| 2 | Write `scripts/eval-json-to-cases.py`: each `assertion` becomes an `llm` grader; each case gets a `tool_used: Skill` grader for trigger accuracy; add two should-not-trigger prompts per skill. Keep `eval.json` as the source of truth, generate `evals/` from it | 31 generated cases + ~16 negative cases |
| 3 | Run locally with `--max-cost-usd 10 --runs 3`. Fix assertions that never discriminate (pass in both arms) or flap between runs. Record the baseline pass rate in `docs/reports/2026-10-<dd>-skill-eval-baseline.md` | Baseline report |
| 4 | Add `.github/workflows/skill-evals.yml`: nightly cron + manual dispatch, `claude plugin eval --json --threshold 0.8 --max-cost-usd 10`, upload `evals/results/` as an artifact. Needs an `ANTHROPIC_API_KEY` repository secret, requested from the tech lead | Workflow green on `main` |
| 5 | Extend `scripts/skill-lint.sh` to fail when `evals/` is stale relative to `eval.json` (regenerate check). Note the rule in `CONTRIBUTING.md`: a skill PR that changes behaviour updates `eval.json` | Lint + contributing note |

**Definition of done.** Nightly workflow runs on `main`, a baseline report is
committed, and a deliberate break in one skill's assertion makes the run red.

**Risks.** API cost (capped by `--max-cost-usd`); `llm` graders are
2-of-3 judge votes and can still flap, so keep assertions concrete; the
command is new and its flags may change.

### 9b. `cmk:profile` (item 12)

**What it means.** The kit tells an agent how the *team* works. It has no
place for how *this developer* works: reply in Vietnamese, be strict in
review, use Emil Kowalski's motion skill, never auto-commit. People
re-explain these every session. `cmk:profile` is a skill that interviews
the developer once, writes those preferences into a file the agent loads
automatically but git ignores, and knows how to promote a preference that
the whole team shares into a `docs/rules/` entry.

| Day | Step | Output |
|---|---|---|
| 1 | Dogfood `cmk:requirements`: write `docs/requirements/profile.md` covering what may live in a profile (language, tone, review depth, companion skills, editor, worktree habits), what never may (secrets, team rules, anything executable), and the injection constraint (the profile is read as data, never run) | Requirements doc |
| 2 | `skills/profile/SKILL.md` (≤ 150 lines) with modes **Init** (5-question interview → write `CLAUDE.local.md`; add `CLAUDE.local.md` to `.gitignore` via the `cmk:toolchain` baseline), **Update**, and **Promote** (a preference seen in ≥ 2 profiles → draft a `cmk:rule` proposal). `references/profile-template.md` and `references/questions.md` | Skill package |
| 3 | Vendor mapping in the skill: Claude Code reads `CLAUDE.local.md` natively; Codex gets a one-line pointer in `~/.codex/AGENTS.md`; Cursor gets a User rule. Update `cmk:agent-instructions` so `CLAUDE.md` stops carrying personal items, and add the row to `docs/guides/on-ramps.md` and the README roster | Integration edits |
| 4 | `skills/profile/eval.json` with 3 cases: refuses to store an API key; writes nothing tracked by git; Promote path drafts a rule instead of editing `CLAUDE.md`. Run `skill-lint`. Open PR with a changelog entry | PR |

**Definition of done.** "Set up my preferences" triggers the skill, the
result is gitignored and loaded on the next session, `git status` stays
clean, and a secret pasted during the interview is refused.

**Open question for the tech lead.** Should the profile live only in
`CLAUDE.local.md` (zero new conventions, Claude Code only) or also in a
vendor-neutral `.agents/profile.local.md` that adapters mirror? Recommend
starting with `CLAUDE.local.md` and adding the neutral file when a second
vendor is actually in use on the team.

### 9c. Message to the tech lead for this week

> This week I'm taking two items from the survey doc.
>
> 1. **Skill evals in CI.** Only 8 of our 34 skills have `eval.json` and
>    nothing runs them. I'll convert the 31 existing cases to the
>    `claude plugin eval` layout, add should-not-trigger prompts, and wire a
>    nightly workflow with a cost cap. Done means a baseline report is
>    committed and a deliberate break turns the run red. I need an
>    `ANTHROPIC_API_KEY` repo secret.
> 2. **`cmk:profile`.** A skill that separates team rules from each
>    developer's own preferences (language, review strictness, preferred
>    companion skills). It interviews once, writes a gitignored
>    `CLAUDE.local.md`, and can promote a shared preference into
>    `docs/rules/`. Done means the file loads next session and secrets are
>    refused.
>
> Full plan with day-by-day steps is in section 9 of the doc.

## 10. Per-skill improvement map

Audit of `skills/*/SKILL.md` on 2026-10-11: version, line count against the
150-line budget, reference files, eval cases, and last author. Every skill was
last touched Aug 28 to Sep 1 by Jayden or Daniel, so the whole roster is one
release old. Items below are the concrete edits, not themes.

### Cross-cutting (apply to all 34)

| Edit | Why | Owner |
|---|---|---|
| Generate `evals/` cases from `eval.json` and run nightly (section 9a) | Only 8 skills have cases; 0 run | Harry |
| Add 2 should-not-trigger prompts per skill | Trigger accuracy is now measurable; delivery family shares vocabulary | Jayden |
| Move `version` under `metadata:`; add `license: MIT` | Open-spec conformance | Jayden |
| Add a `Verified against` line (source URL + date) to every knowledge-family skill | Knowledge skills exist to correct stale model memory; without a date nobody knows when they themselves went stale | Jayden |
| Run a description-overlap lint; rewrite any pair above 0.6 Jaccard | 10 delivery skills overlap on "work on", "review", "ship" | Harry |

### At the 150-line ceiling (split into `references/` before adding anything)

| Skill | Lines | Refs | Evals | Edit | Owner |
|---|---|---|---|---|---|
| `cmk:cicd` | 150 | 6 | 3 | Move runner-fleet and security-scanning bodies behind references; add skill-scanner job (item 9) | Daniel's area; Harry can take |
| `cmk:local-stack` | 150 | 3 | 7 | Move port-allocation and compose patterns behind references | Daniel's area; Harry can take |
| `cmk:delivery-ship` | 150 | 1 | 0 | Extract evidence checklist to a reference; add Plannotator review step; add 3 evals (eng-lead skip pressure, AC-chore pressure, missing evidence) | Jayden |
| `cmk:delivery-spec-plan` | 150 | **0** | 0 | Extract plan template and scope-band table to references; add Plannotator approval hand-off; add 3 evals | Jayden |
| `cmk:interpret` | 150 | 1 | 5 | Already has evals; trim examples into a reference | Jayden |

### Long with no references (progressive disclosure missing)

| Skill | Lines | Edit | Owner |
|---|---|---|---|
| `cmk:delivery-handoff` | 112 | Move the handoff prompt template to `references/handoff-template.md`; add vendor-specific notes for Codex and Gemini | Theodore |
| `cmk:mcp-config` | 89 | Move per-vendor config snippets to references; add Gemini CLI, Copilot and VS Code entries | Daniel's area; Harry can take |
| `cmk:testcontainers` | 79 | Move Rust snippets to a reference; add `Verified against` line | Abdol |
| `cmk:sui-sdk` | 64 | Move the gRPC call table to a reference; add `Verified against` with the Sui release checked | Jayden |
| `cmk:glossary` | 55 | Fine as is; add 2 evals (term drift, duplicate term) | Jayden |

### Delivery family: zero evals on the most complex skills

| Skill | Evals to add first |
|---|---|
| `cmk:delivery-intake` | Scope band stated; docs-ready recorded; refuses to start without tracker context |
| `cmk:delivery-pipeline` | Phase 3 gated on docs-ready; stops at plan approval; no merge without grant |
| `cmk:delivery-review` | Cites finding IDs; security lens runs; does not approve on "looks fine" pressure |
| `cmk:delivery-simplify` | Behaviour-preserving only; refuses feature additions |
| `cmk:delivery-workflow` | Readiness vocabulary used; tracker reconciled |
| `cmk:discover-efforts` | Produces issue set, not implementation |

Owner: Jayden writes cases from the existing `TESTS.md` files (6 of these
already have RED/GREEN scenarios that convert almost line for line).

### Small skills that are fine, plus one edit each

| Skill | Lines | Edit |
|---|---|---|
| `cmk:adr` | 38 | Record the kit's own first ADRs: docs-first, 150-line budget, `version` placement |
| `cmk:codebase-docs` | 32 | Point at Understand-Anything as an optional companion |
| `cmk:learn` | 43 | Accept input from `cmk:retro` (item 13) |
| `cmk:rule` | 51 | Accept Promote input from `cmk:profile` (item 12) |
| `cmk:docs` | 47 | Create `docs/research/` and `docs/knowledge/` README stubs (the kit's own were empty) |
| `cmk:design` | 59 | Offer `cmk:visualize` or visual-explainer for the architecture picture |
| `cmk:rust`, `cmk:enclave`, `cmk:sui-devstack` | 41 to 95 | `Verified against` line only |

## 11. Reply to Daniel (tech lead)

Daniel Lam is the tech lead and asked the original question. Harry executes.
This reply answers his three questions and states Harry's part of the roadmap.
Owners named elsewhere in this doc are suggestions for Daniel to confirm.

> Hi Daniel,
>
> You asked whether there is anything to improve in the kit, whether we
> should survey the team, and who can take it on. Short version: yes, yes,
> and I can. Full research doc: [link].
>
> **Where we are.** Last merge Sep 1. 34 skills, plugin 1.5.0. Only 8 of 34
> skills have `eval.json` (31 cases) and nothing runs them. Five skills sit
> at the 150-line ceiling; `delivery-spec-plan` has no references and no
> evals. Adapters miss Gemini CLI, Copilot and VS Code. The roadmap page
> shows two merged PRs as in progress. Our own research, knowledge and
> decisions folders were empty.
>
> **What changed outside.** Evals became first-class (`claude plugin eval`,
> `/skill-doctor`, skill-creator benchmarks). The format is read by 47
> clients and is moving to the Linux Foundation. Marketplaces launched at
> Cursor, Codex and Copilot, and audits found 13 to 37 percent of public
> skills with security issues, so curation is a feature. Every vendor now
> separates team rules from per-developer preferences; we only have the
> team layer.
>
> **Three themes, 17 items.** Platform catch-up (evals, adapters,
> frontmatter, splitting skills at the ceiling). Curate, don't absorb
> (vetted companion table, scanner in CI, offered by `cmk:repo-setup`).
> New skills (`cmk:profile`, `cmk:retro`, `cmk:visualize`, a Plannotator
> gate between spec-plan and implement).
>
> **My part of the roadmap.** Week of Oct 13: item 1 evals in CI and item
> 12 `cmk:profile`, each with a definition of done in the doc. Weeks of
> Oct 20 and 27: item 7 companion guide, item 11 roadmap page, item 17
> Plannotator gate, items 2 and 5 lint checks. Later if you agree: items
> 14, 16, 10.
>
> **Survey.** Five questions, one form, one week; draft in the doc. I can
> send it Monday if you approve.
>
> **Suggested owners for the rest, yours to confirm.** Jayden: delivery
> family evals from `TESTS.md`, frontmatter conformance, splitting
> delivery-ship and delivery-spec-plan. Abdol: skill-scanner job, security
> lens in delivery-review. Theodore: `cmk:retro`, delivery-handoff
> references. Vendor adapters and splitting cicd/local-stack are in your
> area; I can take them if you prefer to stay on review.
>
> **Decisions I need.** (1) An `ANTHROPIC_API_KEY` repo secret and a cost
> cap for the nightly evals; I plan 10 USD per run. (2) Should
> `cmk:profile` write only `CLAUDE.local.md` or also a vendor-neutral
> `.agents/profile.local.md`? I recommend starting with `CLAUDE.local.md`.
> (3) OK to send the survey Monday and publish the backlog on the roadmap?
>
> Harry
