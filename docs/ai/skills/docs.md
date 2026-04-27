# cmk:docs

## What
Skill that bootstraps or re-syncs the recommended `/docs` directory structure (navigation files, READMEs, AGENTS.md, baseline templates). Three modes: **Init** (create missing only, never overwrite), **Update** (re-sync after devkit changes, confirm before overwriting), **Verify** (dry-run, report gaps).

## Approach
The full file manifest — exact paths and exact content for every file the scaffold owns — lives in a single reference file rather than the SKILL body. The workflow is therefore short: determine mode, scan the target repo, diff against the manifest, act per mode. Order matters: directories are created before contents, and `AGENTS.md` is always written before `README.md` in each folder so the agent-routing chain stays intact.

## Where
- Skill body: `skills/docs/SKILL.md` — sections `Modes`, `Workflow`, `Output`.
- File manifest (source of truth for the scaffold): `skills/docs/references/scaffold-manifest.md`.
- Live example of a scaffolded tree: `docs/` in this repo (see [`docs/ai/docs/README.md`](../docs/README.md)).
