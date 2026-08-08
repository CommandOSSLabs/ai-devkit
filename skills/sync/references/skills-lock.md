# The skills.lock format

`.agents/skills.lock` is the baseline every sync reconciles against. It lives
at `.agents/skills.lock`, a sibling of `.agents/skills/` — not inside it.

## Shape

The normative format:

```toml
schema_version = 1

[upstream]
url = "https://github.com/CommandOSSLabs/ai-devkit"

[[skill]]
name = "cmk:design"                    # frontmatter name — the join key sync maps by
dir = ".agents/skills/cmk-design"      # vendored location in this repo
upstream_ref = "v1.4.0"                # ai-devkit release tag, or a commit SHA
upstream_sha = "0123456789abcdef0123456789abcdef01234567"  # ref resolved to a commit
content_hash = "sha256:…"              # pristine upstream copy at vendor/sync time
```

One `[[skill]]` table per vendored generic skill.

## Field semantics

- `schema_version` — the lock format's own version; bump it only when the
  shape of a `[[skill]]` table changes.
- `upstream.url` — where upstream ai-devkit lives; resolved once for the
  whole repo, not repeated per skill.
- `name` — the frontmatter `name:` value, identical upstream and vendored.
  This is the join key sync maps by, not the directory name.
- `dir` — the vendored location in this repo.
- `upstream_ref` — what a human pins; prefer a release tag over a raw SHA.
- `upstream_sha` — `upstream_ref` resolved to a commit, so the base is always
  fetchable even if a tag moves later.
- `content_hash` — covers the upstream skill directory at `upstream_sha`,
  computed over its files in sorted relative-path order (path + bytes per
  file). This is what lets a consumer prove which pristine content the local
  copy diverged from — the pristine copy, never the local adaptation.

## Naming mapping

Upstream directory `skills/<name>/`, vendored directory
`.agents/skills/cmk-<name>/`, frontmatter `name: cmk:<name>` identical on
both sides. The frontmatter name is the join key; sync never relies on
directory names matching across the two sides. See `cmk:agent-vendors` for
the full vendored layout.

## Rules

- One entry per vendored generic skill.
- Project-owned skills get no entry, and project-owned skills do not take the
  `cmk-` prefix.
- Deleting a vendored skill deletes its entry in the same change.
- The lock lives at `.agents/skills.lock`, never inside `.agents/skills/`.
