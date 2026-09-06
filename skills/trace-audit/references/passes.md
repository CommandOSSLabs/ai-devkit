# Trace Audit Passes

The **one home** for the check. Run these passes in order, then apply the rules.
Do not substitute an equivalent search — the exact patterns are what make two
runs on one tree agree.

All commands are run from the repository root. `find … -print0 | xargs -0 grep`
is used rather than `grep --include` because the latter is not portable across
the greps found on developer machines.

## Contents

- [The ID pattern](#the-id-pattern)
- [Pass 1 — definitions](#pass-1--definitions)
- [Pass 2 — retirements](#pass-2--retirements)
- [Pass 3 — citations](#pass-3--citations)
- [Pass 4 — registry rows](#pass-4--registry-rows)
- [Pass 5 — headers](#pass-5--headers)
- [Pass 6 — status](#pass-6--status)
- [Finding rules](#finding-rules)
- [Reporting](#reporting)

## The ID pattern

```
[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+
```

A definition is always bounded by `**`; a citation is always anchored to a
`Satisfies:` line or an acceptance-criteria table row. Bounding the match by
context is deliberate: it removes the need for lookahead assertions, which the
greps on macOS and Linux do not agree about, and it keeps an ID mentioned in
running prose from being read as a citation.

## Pass 1 — definitions

```sh
find docs/requirements -name '*.md' -print0 \
  | xargs -0 grep -Eon -- '\*\*[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+\*\*'
```

Output is `file:line:**ID**`. Strip the asterisks. This set is `DEFINED_RAW`.

Fenced examples: a definition-shaped line inside a fenced code block is an illustration,
not a definition. Filter the file through a fence stripper before matching when
the file contains fences:

````sh
awk '/^```/ { f = !f; next } !f'
````

`docs/templates/` is never scanned. It contains shapes, not documents.

## Pass 2 — retirements

```sh
find docs/requirements -name '*.md' -print0 \
  | xargs -0 grep -Eon -- '~~\*\*[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+\*\*~~'
```

This set is `RETIRED`.

```
DEFINED = DEFINED_RAW − RETIRED
```

A retired ID is **undefined**. Every citation of it becomes an E1 on the next
run, which is what makes retirement visible rather than quiet.

## Pass 3 — citations

```sh
find docs/design -name '*.md' -print0 \
  | xargs -0 grep -Eon -- '^(Satisfies:|\| *[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+ *\|).*'
```

From each matched line extract every ID with:

```sh
grep -Eo -- '[A-Z][A-Z0-9]{1,11}-[0-9]+\.[0-9]+'
```

This set is `CITED`, each entry keeping its file and line. Only `Satisfies:`
lines and acceptance-criteria table rows count. An ID appearing in prose is a
mention, not a citation, and is not checked.

## Pass 4 — registry rows

Skip this pass, and report the skip, when `docs/capabilities/INDEX.md` is absent.

```sh
grep -Eon -- '^\| *[A-Z][A-Z0-9]{1,11} *\|' docs/capabilities/INDEX.md
```

For each row, split on `|` and read: code, name, requirements path, design path,
status, surface roots. Paths are relative to `docs/capabilities/`. Resolve each
non-`— none —` path and test existence:

```sh
test -f docs/capabilities/<path>
```

This set is `ROWS`.

## Pass 5 — headers

```sh
find docs/requirements docs/design -name '*.md' -print0 \
  | xargs -0 grep -Eon -- '^\*\*(Status|Notation|ID prefix|Scope|Capability|Owns|Declined):\*\*'
```

Required per document type:

| Document | Required header lines |
|---|---|
| `docs/requirements/<topic>.md` | `Status`, `Notation`, `ID prefix` |
| `docs/design/<topic>.md` | `Status`, `Scope` |

`README.md` and any `glossary.md` are excluded from Pass 5 and Pass 6 — they are
navigation and vocabulary, not specifications.

## Pass 6 — status

```sh
find docs/requirements -name '*.md' -print0 \
  | xargs -0 grep -Eon -- '^\*\*Status:\*\* *[a-z]+'
```

Only documents whose status is `active` arm W1.

## Finding rules

Apply mechanically. Each rule is a set operation on the pass output.

| Code | Rule |
|---|---|
| **E1** | For each entry in `CITED` whose ID is not in `DEFINED`: report the citing file, line, and ID. |
| **E2** | For each ID appearing more than once in `DEFINED`: report every defining file and line. |
| **E3** | For each code appearing on more than one row in `ROWS`: report the code and both line numbers. |
| **E4** | For each non-`— none —` path in `ROWS` failing `test -f`: report the code and the missing path. |
| **W1** | For each ID in `DEFINED` from a document whose Pass 6 status is `active`, and which appears in no `CITED` entry: report the ID and its defining file. |
| **W2** | For each file under `docs/requirements/` (excluding README and glossary): report it when its `ID prefix` value matches no code in `ROWS`. For each file under `docs/design/`: report it when its path appears in no `ROWS` design cell. |
| **W3** | For each document missing a required header line from the Pass 5 table: report the file and the missing line. |

A design document whose `Scope:` value begins with `System-wide` is excluded
from W2. It describes the whole system rather than one capability, and forcing a
registry row for it would add a row that owns nothing and can never be a
neighbor.

W2 is defined by **code** for requirements documents, not by path. A document
whose `ID prefix` disagrees with its registry row therefore surfaces as W2 — the
mismatch is exactly the integrity hole worth reporting, and it needs no
finding code of its own.

Nothing else is a finding. If an observation does not come out of these rules,
it is not reported by this check.

## Reporting

Group by code, errors before warnings. Each finding names the file, the line,
and the ID or code involved.

```
E1  docs/design/checkout.md:88 cites CART-2.4 — defined in no requirements document
E4  CART — registry row points at a design document that does not exist
W1  BILL-3.2 (docs/requirements/billing.md, active) is mapped by no design document
W2  docs/design/queue.md has no registry row
```

Report `no findings` explicitly when the rules produce nothing, and always state
what was not checked:

```
no findings
Not checked: application source, tests, commit history, and whether any design
section genuinely satisfies the criterion it cites.
```

Skipped registry passes are reported as a skip, never as a finding.
