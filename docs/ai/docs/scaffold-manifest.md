# Scaffold manifest

## What
Single source of truth for every file the `cmk:docs` skill writes when it bootstraps a `/docs` directory in a target repository — exact paths plus the exact content for each `README.md` and template. The skill body itself is short; the manifest holds the bulk of the scaffold definition.

## Approach
Content lives in fenced markdown blocks inside the manifest, one section per file, keyed by a `**Path:**` line. The skill's "Init" / "Update" / "Verify" modes all diff against this single file rather than against a generated template tree, which keeps the source of truth in one place.

## Where
- Manifest: `skills/docs/references/scaffold-manifest.md` — one `## <path>` section per file; grep `^\*\*Path:` for the full provisioned list.
- Skill that consumes it: `skills/docs/SKILL.md` — see the `## References` section.
- Live scaffolded result in this repo: every `docs/**/README.md` and `docs/templates/*.md` was produced from this manifest.
