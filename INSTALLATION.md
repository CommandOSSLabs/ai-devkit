# Installing AI DevKit

Agent: this is the kit's installation guide. Work through it with your user — if they haven't chosen a path, present the table below and recommend the vendored path, then follow the chosen path's section exactly.

## Choose a path

What separates the paths is **evolvability**: these skills are living documents meant to be adapted to the repo they serve — a team's adapted copy is the expected end state, not a fork gone stale. Only the vendored path preserves that evolution across upgrades; the other two give you read-only copies.

| Path | Scope | Evolvable | Upgrades |
|---|---|---|---|
| [Vendored with sync](#vendored-with-sync-recommended) (recommended) | repo | Yes — edit freely | `cmk:sync` semantic merge; your adaptations survive |
| [skills.sh](#skillssh-quick-read-only) | repo (default) or user (`-g`) | No — treat as read-only | `npx skills update` overwrites local edits |
| [Plugin trial](#plugin-trial-zero-setup-read-only) | user | No — immutable plugin content | wholesale plugin update |

Never mix two paths in one repo — the agent would see two competing copies of each skill.

## Vendored with sync (recommended)

Prerequisite: the agent needs the upstream skills to copy from. Clone this repository somewhere readable, or install one of the read-only paths below first and vendor from that copy.

1. Follow `cmk:agent-vendors` (in `skills/agent-vendors/SKILL.md` if the skill isn't yet invocable) to establish the canonical `.agents/skills/cmk-<name>/` home and generate the adapters each vendor in use needs.
2. Follow `cmk:sync` in baseline mode (`skills/sync/SKILL.md`) to record the upstream ref, SHA, and pristine content hash per skill in `.agents/skills.lock`.
3. If a trial install served as the copy source, remove it afterward — see [Switching paths](#switching-paths).

Per-vendor adapters, by discovery tier:

- **Claude Code** — adapter-mirror: a generated `.claude/skills/cmk-<name>/SKILL.md` per skill.
- **Grok Build** — adapter-mirror: the same generated-adapter treatment at `.grok/skills/cmk-<name>/SKILL.md`.
- **Codex** — direct-discovery: reads `.agents/skills/` directly, no adapter needed.
- **OpenCode** — direct-discovery: points its skill-paths config at `.agents/skills/` directly.
- **Cursor** — rule-mirror: a narrower `.cursor/rules/cmk-<name>.mdc` covering only the skills that function as standing rules.

Upgrading: run `cmk:sync` in sync mode ("Sync our vendored skills with upstream"). It reconciles base (pristine at the locked SHA), theirs (current upstream), and ours (your evolved copy) at the meaning level — your adaptations survive, and genuine conflicts are presented for a human decision, never auto-resolved.

Contributing back: when a local improvement looks generic, `cmk:sync`'s contribute mode prepares it as a PR upstream — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## skills.sh (quick, read-only)

The [skills.sh](https://skills.sh) CLI copies the skills into each detected agent's own directory (e.g. `.claude/skills/`):

```bash
npx skills add CommandOSSLabs/ai-devkit        # repo scope — preferred
npx skills add CommandOSSLabs/ai-devkit -g     # user scope — read the caveat below
```

The two scopes have different consequences. **Repo scope** (the default) writes into the current repository, so each repo carries its own copy and nothing leaks between projects. **User scope** (`-g`) writes one shared copy under your home directory (e.g. `~/.claude/skills/`) that every repo on the machine sees: any edit leaks into all of them, two repos that need the skill to behave differently conflict, and there is no per-repo baseline to reconcile against. Prefer repo scope.

Either way, treat skills.sh copies as read-only: `npx skills update` overwrites local edits with upstream — there is no merge. The moment you want to adapt a skill to your repo, graduate to the vendored path.

## Plugin trial (zero setup, read-only)

Try the kit before vendoring anything into your repo. Plugin skills are immutable — you can't adapt them per-repo, and upgrades replace the whole kit at once.

### Claude Code

```bash
claude plugin add CommandOSSLabs/ai-devkit
```

### OpenCode

Tell OpenCode:

`Fetch and follow the instructions at https://raw.githubusercontent.com/CommandOSSLabs/ai-devkit/refs/heads/main/.opencode/INSTALL.md.`

## Switching paths

Graduating from a read-only install to vendored: vendor from the installed copies (they are a valid upstream source — record the lock baseline against this repository's ref, not the local copy), then remove the read-only install so the agent doesn't see duplicate skills — uninstall the plugin, or delete the skills.sh-managed copies.
