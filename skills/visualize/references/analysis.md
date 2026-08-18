# Analysis: tracing a repo into a scene graph

This is the procedure `SKILL.md` step 2 points to. It owns what is true about the repository — layout, grouping aesthetics, and style belong to the renderers, not here. Every step below produces facts that go straight into the document `references/scene-graph.md` describes; nothing here is decided twice.

## 1. Check `docs/ai/` as a routing hint

If `docs/ai/` exists (built by `cmk:codebase-docs`), read it first. It tells you where things live faster than a cold enumeration would. Nothing from it is ever copied into the scene graph as fact — it only saves time deciding where to look next. If it is missing, stale, or absent, skip straight to step 2; the rest of the procedure is identical either way.

## 2. Enumerate entrypoints and manifests

Without a routing hint, find the repository's own map: package manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, and equivalents), workspace or monorepo configuration, and the entrypoints they declare (`main`, `bin`, exported scripts, framework-conventional entry files). This is the seed set of things worth tracing from.

## 3. Trace imports and call sites, recording citations

From each entrypoint, follow imports and call sites outward. For every node (a module, package, service, or component you decide is worth its own building) and every edge (a call, an import, a data flow between two nodes), record the exact `file:line` where you saw it — not the file that merely seems related, the line that actually contains the reference. This is the only source a citation is allowed to come from: something read in this run. A citation inherited from `docs/ai/`, from memory of a similar repo, or from a plausible guess about what a file "probably" does is not a citation; it is the exact failure this skill exists to prevent.

A relationship you strongly suspect but cannot pin to a line — dynamic dispatch, a language you cannot parse, a call resolved only at runtime — is not invented into an edge. It is recorded in `gaps[]` instead (step 6).

## 4. Apply the altitude fold

If altitude mode is `budget` (the default), pick the grouping level that lands the node count inside 12 to 20: per file on a small repo, per package or per service on a monorepo. As you group, record every collapse in `folded[]`, naming the files behind each fold. Folding must never be silent — a fold that isn't recorded is a truncation wearing a diagram's clothes.

If altitude mode is `subsystem`, trace only the named slice and do not fold it at all; the caller already knows which part of the map they want.

## 5. Sample payloads, with redaction first

For edges worth a moving-dot sample, pull a short real snippet with its own citation. Before it becomes a `samples[]` entry:

1. Skip the file entirely if it matches the repository's ignore patterns or its secret patterns (env files, key material, credential stores). Do not sample from it at all.
2. Redact the remaining text by pattern — API keys, tokens, connection strings, private key blocks — before it is written into the document.

Redaction happens here, before the scene graph exists, because the scene graph is the artifact that gets published. A secret redacted after the document is built has already been written into something shareable.

## 6. Record anything uncitable in `gaps[]`

Every relationship suspected but not traced to a `file:line` in this run goes in `gaps[]` with enough description to be useful — what was suspected, and why it could not be confirmed. `gaps[]` is not a place to apologize; it is a first-class part of the output, surfaced in the explainer panel alongside `folded[]`, so the reader sees what the map does not know rather than a confident picture that is quietly incomplete in places.

## 7. Hand off to validation

Once nodes, edges, `folded[]`, and `gaps[]` are assembled into the document shape `references/scene-graph.md` describes, `SKILL.md` step 3 takes over: validate with `assets/validate.mjs` before anything renders.
