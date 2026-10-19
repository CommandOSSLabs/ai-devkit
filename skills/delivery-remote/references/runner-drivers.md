# Runner drivers

One row per agent CLI. `SKILL.md` reads this file and renders a command from it;
it never names a CLI's flags itself. Adding an agent is adding a row here.

**Contents:** [The contract](#the-contract) · rows for
[grok](#grok) `verified` · [claude](#claude) · [codex](#codex) ·
[cursor-agent](#cursor-agent) · [kimi](#kimi) · [gemini](#gemini) ·
[qwen](#qwen) · [opencode](#opencode) · [strix](#strix) `unprobed` ·
[Probing a new CLI](#probing-a-new-cli). Jump to the row for the agent you are
dispatching; the rows do not depend on each other.

## The contract

| Field | Meaning |
|---|---|
| `status` | `verified` — a real headless run finished on the host, dated. `probed` — flags read from the CLI's own `--help` on the host, never run end to end. `unprobed` — no row yet |
| `bin` | Executable name, resolved against the manifest's PATH |
| `version_cmd` | Prints a version and exits |
| `auth_precheck` | Cheap, free, local: does a credential exist at all |
| `auth_check` | Authoritative: proves the CLI can reach its provider. Run **inside the tmux server** |
| `login_cmd` | What the user runs once, by hand, when `auth_check` fails |
| `headless` | Run one prompt without a UI and exit |
| `prompt_file` | Flag that takes the prompt from a file, or `no` |
| `cwd` | Flag that sets the working root, or `cd` when the CLI has none |
| `autonomy_full` | The flag that approves every tool call. `config` when the CLI has no flag |
| `log_format` | Flag producing machine-readable output |
| `result` | Where the final answer lands in that output |
| `progress` | What advances *while* the run is going, when `log_format` writes nothing until exit. `none` when the log itself streams |
| `skills_check` | Command that lists the skills the CLI can see on the host |
| `keychain` | `yes` — credentials live in the macOS login keychain, so plain SSH fails and the tmux-server rule is load-bearing |

`status: probed` is dispatchable. Say which it is in the report; do not silently
promote a row to `verified` without a dated run.

## grok

`status: verified 2026-09-09` · host `jayden-host` · `grok 1.0.24` ·
model observed `grok-4.6-build` · smoke `PONG`, 1 turn, 35s cold, $0.0069

| Field | Value |
|---|---|
| `bin` | `grok` (`~/.grok/bin/grok`, linked from `~/.local/bin`) |
| `version_cmd` | `grok --version` |
| `auth_precheck` | `test -s ~/.grok/auth.json` |
| `auth_check` | `grok -p "Reply with exactly the word PONG." --max-turns 1 --output-format json` |
| `login_cmd` | `grok login` |
| `headless` | `grok -p "<prompt>"` |
| `prompt_file` | `--prompt-file <PATH>` |
| `cwd` | `--cwd <DIR>` |
| `autonomy_full` | `--permission-mode bypassPermissions` |
| `log_format` | `--output-format json` |
| `result` | `.text`, with `.stopReason`, `.sessionId`, `.num_turns`, `.usage`, `.total_cost_usd` |
| `progress` | `~/.grok/sessions/<url-encoded cwd>/<session-id>/summary.json` — `updated_at` is a heartbeat, `num_messages` a counter, and `head_commit` / `head_branch` / `sandbox_profile` confirm what the run is actually pointed at |
| `skills_check` | `grok inspect` → the `Skills (N)` block |
| `keychain` | no — file-based, `~/.grok/auth.json` |

Also has `--max-turns <N>`, `--allow` / `--deny`, and `--worktree` /
`--worktree-ref <branch|tag|commit>`. The worktree flags are **not** used:
Phase 3 binds the base SHA itself so that the same evidence exists for every
agent. `--output-format streaming-json` emits one ACP update per line and would
give a live-progress log — unverified, so the poll signals stay the sentinel,
the session, and log growth.

Verified on the host: `grok inspect` sees every skill in `~/.agents/skills`,
including `cmk:delivery-build`'s `references/continuous.md`, `cmk:delivery-build`'s `references/story-unit.md`, `cmk:delivery-build`'s `references/inline.md`, `cmk:delivery-build`'s `references/common.md`,
`cmk:evidence`, `cmk:tdd`, `cmk:worktree`, `cmk:delivery-review`.

## claude

`status: probed 2026-09-09` · `2.1.203` on the host, `2.1.266` locally

| Field | Value |
|---|---|
| `bin` | `claude` |
| `version_cmd` | `claude --version` |
| `auth_precheck` | — |
| `auth_check` | `claude auth status` → `.loggedIn` |
| `login_cmd` | `claude auth login`, or `claude setup-token` locally then `CLAUDE_CODE_OAUTH_TOKEN` on the host |
| `headless` | `claude -p "<prompt>"` |
| `prompt_file` | no — pipe on stdin |
| `cwd` | `cd` (`--add-dir` widens the file tools) |
| `autonomy_full` | `--dangerously-skip-permissions` |
| `log_format` | `--output-format json` or `stream-json` |
| `result` | final assistant message |
| `skills_check` | unprobed |
| `keychain` | yes |

On the host `claude auth status` reported `loggedIn: false` inside the tmux
server as well as over plain SSH — that one is genuinely unauthenticated, not a
locked keychain. `claude --bg` / `attach` / `logs` exist but are not used: they
are one CLI's job manager, and the recipe needs a mechanism every CLI has.

## codex

`status: probed 2026-09-09`

| Field | Value |
|---|---|
| `bin` | `codex` |
| `version_cmd` | `codex --version` |
| `auth_check` | `codex doctor` |
| `login_cmd` | `codex login` |
| `headless` | `codex exec "<prompt>"` (`-` reads stdin) |
| `prompt_file` | no — stdin |
| `cwd` | `-C, --cd <DIR>` (`--add-dir` widens) |
| `autonomy_full` | `--dangerously-bypass-approvals-and-sandbox` |
| `log_format` | `--json` (JSONL) with `-o, --output-last-message <FILE>` |
| `result` | the file given to `-o` |
| `skills_check` | unprobed |
| `keychain` | unprobed |

Codex is the only CLI here with a real process sandbox. The user's standing
decision is full autonomy, so it is bypassed; if that decision is ever revisited,
this is the one row where a guarded profile would mean process isolation rather
than a tool allowlist. `--skip-git-repo-check` and `--output-schema` are available.

## cursor-agent

`status: probed 2026-09-09` · `2026.04.17-787b533`

| Field | Value |
|---|---|
| `bin` | `cursor-agent` |
| `version_cmd` | `cursor-agent --version` |
| `auth_check` | `cursor-agent --version` (fails closed on a locked keychain) |
| `login_cmd` | `cursor-agent login` |
| `headless` | `cursor-agent -p "<prompt>"` |
| `cwd` | `cd` |
| `autonomy_full` | `--force` |
| `log_format` | `--output-format json` |
| `skills_check` | none — no skill mechanism; kickoff must cite `SKILL.md` paths |
| `keychain` | **yes** |

This row is the evidence for the tmux-server rule in Phase 1. Over plain SSH
even `--version` fails with `Error: Your macOS login keychain is locked.`; run
from a pane of the GUI-started tmux server on the same host, the same command
prints its version.

## kimi

`status: probed 2026-09-09` · `0.22.3`

| Field | Value |
|---|---|
| `bin` | `kimi` (`~/.kimi-code/bin`) |
| `version_cmd` | `kimi -V` |
| `auth_check` | `kimi doctor` |
| `login_cmd` | `kimi login` (device code) |
| `headless` | `kimi -p "<prompt>"` |
| `cwd` | `cd` (`--add-dir` adds workspace dirs) |
| `autonomy_full` | `-y, --yolo` |
| `log_format` | `--output-format stream-json` |
| `skills_check` | `--skills-dir <dir>` pins a directory; auto-discovers user and project dirs otherwise |
| `keychain` | unprobed |

## gemini

`status: probed 2026-09-09` · `0.46.0`

| Field | Value |
|---|---|
| `bin` | `gemini` · `version_cmd` `gemini --version` |
| `headless` | `gemini -p "<prompt>"` |
| `cwd` | `cd` (`--include-directories`) |
| `autonomy_full` | `--approval-mode yolo` |
| `log_format` | `-o json` or `-o stream-json` |
| `skills_check` | unprobed |

`--skip-trust` trusts the workspace for the session; a fresh run root may need it.

## qwen

`status: probed 2026-09-09` · `0.16.1`

| Field | Value |
|---|---|
| `bin` | `qwen` · `version_cmd` `qwen --version` |
| `headless` | `qwen "<prompt>"` — positional; `-p` is deprecated |
| `cwd` | `cd` (`--include-directories` / `--add-dir`) |
| `autonomy_full` | `--approval-mode yolo` |
| `log_format` | `-o json` or `-o stream-json` |
| `skills_check` | unprobed |

`--approval-mode auto` classifies risky actions instead of approving everything —
the closest thing to a guarded profile in this set, unused under full autonomy.

## opencode

`status: probed 2026-09-09` · `1.18.30`

| Field | Value |
|---|---|
| `bin` | `opencode` · `version_cmd` `opencode --version` |
| `auth_check` | `opencode providers` (alias `auth`) |
| `headless` | `opencode run "<prompt>"` |
| `cwd` | `--dir <DIR>` |
| `autonomy_full` | **`config`** — no flag; the `permission` block in `opencode.json` decides |
| `log_format` | `--format json` |
| `skills_check` | the `skills` array in `opencode.json` |
| `keychain` | unprobed |

The only row whose autonomy is not a flag. Phase 4 must read the run root's
`opencode.json` and confirm the permission block before dispatch — a flag that
does not exist cannot be rendered, and dispatching without checking would hang
on the first approval.

## strix

`status: unprobed` — `strix --help` dropped the SSH connection twice on
2026-09-09. Not dispatchable until someone probes it from a console session.

## Probing a new CLI

On the host, inside the tmux server, in a scratch directory:

1. `<bin> --version`, then `<bin> --help` — find the headless, cwd, autonomy,
   and log-format flags. Redirect stdin from `/dev/null`; several of these CLIs
   block or take over the terminal without it.
2. Find the auth command. Prefer one that reports status without spending
   tokens; where none exists, the smoke prompt is the auth check.
3. Find how it discovers skills, if it does. No mechanism → `skills_check: none`,
   and kickoffs for that agent cite `SKILL.md` paths.
4. Write the row as `probed`. Promote to `verified` only after a real headless
   run finishes on the host, and date it.
