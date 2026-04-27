# Scaffold manifest

## What
Single source of truth for every file the `cmk:docs` skill writes when it bootstraps a `/docs` directory in a target repository — exact paths plus the exact content for each `AGENTS.md` and `README.md`. The skill body itself is short; the manifest holds the bulk of the scaffold definition.

## Approach
Content lives in fenced markdown blocks inside the manifest, one section per file. The skill's "Init" / "Update" / "Verify" modes all diff against this single file rather than against a generated template tree, which keeps the source of truth in one place.

## Where
- Manifest: `skills/docs/references/scaffold-manifest.md` — sections `Root AGENTS.md`, `docs/AGENTS.md`, etc.
- Skill that consumes it: `skills/docs/SKILL.md` — see the `## References` section.
- Live scaffolded result in this repo: every `docs/**/AGENTS.md` and `docs/**/README.md` was produced from this manifest.
