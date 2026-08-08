# cmk:docs

## What
Skill that bootstraps or re-syncs the canonical `/docs` taxonomy (per-directory navigation READMEs and baseline templates). Three modes: **Init** (create missing only, never overwrite), **Update** (re-sync after devkit changes, confirm before overwriting), **Verify** (dry-run, report gaps plus orphan and dangling canonical-doc links).

## Approach
The full file manifest — exact paths and exact content for every file the scaffold owns — lives in a single reference file rather than the SKILL body. The workflow is therefore short: determine mode, scan the target repo, diff against the manifest, act per mode. Directories are created before their contents, in the manifest's declared order, and every directory gets exactly one `README.md` — there is no separate agent-entry file.

## Where
- Skill body: `skills/docs/SKILL.md` — sections `Modes`, `Workflow`, `Output`.
- File manifest (source of truth for the scaffold): `skills/docs/references/scaffold-manifest.md`.
- Live example of a scaffolded tree: `docs/` in this repo (see [`docs/ai/docs/README.md`](../docs/README.md)).
