# Decision Record Grammar

Sole grammar for boundary decision records. Operational doctrine lives in
sibling `SKILL.md` — this file defines structure only.

**Leading words:** **payload**, **envelope**, **effective identity**, **verbatim**.

## Contents

- [Substrate](#substrate)
- [File shape](#file-shape)
- [Payload fields](#payload-fields)
- [Envelope fields](#envelope-fields)
- [Adoption anchor](#adoption-anchor)
- [Verbatim guarantee](#verbatim-guarantee)
- [Prohibited evidence locator classes](#prohibited-evidence-locator-classes)

## Substrate

- One record = one file: `.skills/decisions/DEC-YYYYMMDD-XXXXXX.md`
- Single global substrate and single logical cmk:traceability target for decision records
- Feature and requirement IDs in `Scope:` are **outward citations only** — never
  storage ownership or file-location keys
- Optional human-browsing index (if any) is a **regenerable derived projection**,
  never authoritative

### Reach

`.skills/` is git-ignored, so the substrate is **working-copy local**: records do
not survive a clone, and CI, reviewers, and every other contributor cannot see
them. Immutability, the digest, and the append-only envelope are guarantees
against *editing* a record — not against losing the checkout that holds it.

This bounds what publication can claim. A published record is accountability
evidence **for whoever holds this working copy**; it is not a repository-wide or
audit-facing artifact. When a verdict needs reach beyond that, the durable
carrier is the crossing's own tracked evidence — the commit, tag, PR, or cmk:release
the record cites — and the record indexes it rather than replacing it.

## File shape

Everything before the line exactly `## Envelope` (column 0) is **payload**.
That line and after is **envelope**. One string comparison splits the file.

Fields are `Name: value` at column 0.

### Multi-line blocks

For `Human-Judgment:`, `Human-Accepted-Risk:`, `Human-Response-If-Wrong:`,
any `Predicate-*-Fact:` that needs more than one line, and `Promoted-Evidence:`:

1. Put nothing after the colon on the field line
2. Each content line is prefixed `| ` (bare `|` for a blank content line)
3. The block ends at the first unprefixed line

Stripping the `| `/`|` prefix recovers exact content bytes. No content line may
sit at column 0 (including a literal `## Envelope`).

### Withheld sentinel

When a judgment element is withheld from the payload, the payload field is
exactly one line (block form with a single content line is also accepted if
the recovered bytes equal):

```text
[[withheld — see envelope]]
```

## Payload fields

The payload carries **no publication identity**. Identity is minted at
publication into the envelope and filename.

| Field | Rules |
|---|---|
| `Accepted:` | UTC timestamp; its `YYYYMMDD` is the ID date source |
| `Emitter:` | e.g. `cmk:delivery-ship`, `cmk:release` |
| `Verdict:` | closed enum: `merge` \| `pr` \| `discard` \| `block` \| `release-approve` \| `release-reject` |
| `Boundary-Type:` | open syntax `^[a-z][a-z0-9-]*$` — never a machine whitelist |
| `Scope:` | feature/requirement IDs or `none` (outward citations only) |
| `Crossing-Exists:` | `true` |
| `Ceremony-Floor:` | ceremony tier floor applied |
| `User-Escalation:` | escalation note or `none` |
| `Depth:` | `Guarded` or `Accountable` only — `Minimal` is illegal in a published record |
| `Predicate-External-Audience:` | `true` \| `false` \| `unknown` |
| `Predicate-External-Audience-Fact:` | supporting fact (line or block) |
| `Predicate-No-Mechanical-Undo:` | `true` \| `false` \| `unknown` |
| `Predicate-No-Mechanical-Undo-Fact:` | supporting fact |
| `Predicate-Persistent-Stakes:` | `true` \| `false` \| `unknown` |
| `Predicate-Persistent-Stakes-Fact:` | supporting fact |
| `Human-Judgment:` | verbatim block or withheld sentinel |
| `Judgment-Pointer:` | interaction pointer or `unavailable` |
| `Human-Accepted-Risk:` | required at Accountable; Guarded may use sentinel/`n/a` per doctrine |
| `Accepted-Risk-Pointer:` | pointer or `unavailable` |
| `Human-Response-If-Wrong:` | required at Accountable |
| `Response-If-Wrong-Pointer:` | pointer or `unavailable` |
| `Evidence:` | repeatable; `<kind> <value>`; kind ∈ `commit` \| `tag` \| `pr` \| `ci` \| `cmk:release`; tag value is `<ref-name>@<object-id>` |
| `Promoted-Evidence:` | agent-authored blocks (name deliberately avoids "digest") |

### Boundary-Type guidance table (author guidance only — not a whitelist)

| Token | Typical use |
|---|---|
| `integration` | cmk:delivery-ship merge |
| `publication` | outbound PR |
| `disposal` | discard |
| `cmk:release` | cmk:release approve/reject |

A block verdict carries the boundary type of the crossing it blocked. Later
renames update this table only — old records stay grammar-valid without payload
mutation.

## Envelope fields

| Field | Rules |
|---|---|
| `Published:` | `<id> <UTC>` — original publication identity; never rewritten |
| `Payload-Digest-Algorithm:` | `sha256` or `git-blob` |
| `Payload-Digest:` | digest of payload bytes (everything before the `## Envelope` line) |
| `Storage-Judgment:` | `repo-verbatim` \| `withheld(reference)` \| `withheld(unavailable)` |
| `Storage-Accepted-Risk:` | same |
| `Storage-Response-If-Wrong:` | same |
| `Storage-Reference-Judgment:` | locator \| `unavailable` \| `n/a` |
| `Storage-Reference-Accepted-Risk:` | locator \| `unavailable` \| `n/a` |
| `Storage-Reference-Response-If-Wrong:` | locator \| `unavailable` \| `n/a` |
| `Reissued-from:` | prior effective id (reissue append) |
| `Reissued-as:` | `<new-id> <UTC>` (reissue append) |
| `Supersedes:` | id this record supersedes |
| `Superseded-by:` | id that supersedes this record |
| `Retired:` | optional retirement note |
| `Execution-Outcome:` | repeatable append-only; tag form `tag <ref-name>@<object-id> <note>` is a first-class tag citation |

### Identity

- Identity chain = `Published:` ID followed by each `Reissued-as:` ID in order
- **Effective identity** = last `Reissued-as:` ID, else the `Published:` ID
- Filename stem must equal the effective identity
- Effective ID's `YYYYMMDD` must equal the locked `Accepted:` date (`YYYYMMDD`)

### ID format

`DEC-YYYYMMDD-XXXXXX` where `XXXXXX` is 6 Crockford base32 characters
(`0-9A-HJKMNPQRSTVWXYZ`, case-insensitive on read).

## Adoption anchor

Content-marked (first non-blank line exactly):

```text
# Decision-Record Adoption Anchor
```

Conventionally `.skills/decisions/ADOPTION.md`. Fields:

| Field | Rules |
|---|---|
| `Cutoff:` | ISO-8601 UTC, immutable |
| `Baseline-Tag:` | repeatable `<ref-name>@<object-id>` snapshot at adoption |

While any decision record exists, exactly one content-marked anchor must exist.
Never infer adoption from the earliest record.

## Verbatim guarantee

The grammar preserves human-authored judgment bytes for **human provenance**,
not absolute authenticity. Agents must not summarize, improve, infer, or
manufacture judgment text (doctrine in `SKILL.md`).

## Prohibited evidence locator classes

Records must not cite: `.skills/` paths, temporary logs, local absolute paths,
or session history as evidence locators.

The substrate's own `.skills/decisions/` path is not an exception carved out of
this list — it is a different axis. **Storage** is where a record sits;
**evidence** is what a record cites, and the classes above are barred because a
reader without this working copy cannot resolve them. A record may reference
another record by **effective identity** (`Supersedes:`, `Superseded-by:`), never
by path.
