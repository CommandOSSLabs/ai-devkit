# The card the user can decide from

Every live-choice turn **is** this, after grounding. Companion language. Ordinary
sentences — a table cell is not a sentence. Old information at the start of a
unit, the point at the end. Compute the verdicts in `references/grounding.md` first; do not
render those four blocks on this turn.

**Contents:** [Order](#order) · [Headings](#headings) · [How to read](#how-to-read) ·
[The fork](#the-fork) · [The lean](#the-lean) · [Hold this picture](#hold-this-picture) ·
[One walk](#one-walk) · [The full pick](#the-full-pick) · [Paste vs code](#paste-vs-code) ·
[If they confirm](#if-they-confirm) · [Fence](#fence) · [Writing](#writing) ·
[Worked](#worked)

## Order

After grounding, write in this order, then the Go deeper menu from `references/go-deeper.md`.
The first paste of a problem also opens on the map from `references/session-map.md`.

1. **How to read** — four lines, first live-choice of the session only. Then never again.
2. **The fork** — one sentence that distinguishes the options.
3. **The lean** — one sentence: the shape plus the repo fact. Not the seven stance slots.
4. **Hold this picture** — the connected parts, where the model stops, one diagram.
5. **One walk** — 4–8 lines, named actor, today versus the lean.
6. **The full pick** — why those options exist, the pick, each loser on the same fact, who it hits.
7. **Paste vs code** — only the disagreements that would move the pick. Omit the heading if none.
8. **If they confirm** — what `0` would freeze.
9. **Fence** — one line this card does not decide.

A turn that opens on `### 1. Today`, a one-line analogy, Architect's read, or the
seven stance slots has skipped the card. Measured on a ten-card session
(non-English companion, mermaid): every live-choice opened on an analogy plus
Today plus three architect tables. The user asked for the card and the pick again,
more simply, then skipped every Go deeper line except the carry-back.

The card's first two headings must answer: what is being chosen, which way this
session leans, and on which repo fact. Nothing goes above them except the session
map on a first paste and the how-to-read note on a first card. The picture comes
after them, not the seven slots.

## Headings

User-facing headings are **questions in the companion language**. Never print an
internal name (`Gist`, `Lock strip`, `Fence`, `Hop`, `Stance`, `Invariant`,
`Locality`, `Depth`, `Carry-back`, `One run`) as a heading on the card the user
reads. This file's names are for you; the card's headings are for them.

| Internal | The heading the user sees |
|---|---|
| How to read | How to read this card |
| The fork | What is being chosen |
| The lean | Which way I lean (not locked) |
| Hold this picture | Hold this picture |
| One walk | One person walking through it |
| The full pick | Why not the other one |
| Paste vs code | Where the paste disagrees with the code |
| If they confirm | If you confirm, this freezes |
| Fence | This card does not decide |

English companion → the column above, verbatim. Any other companion language →
the **same questions, written in that language**, in wording a reader of it would
use. Do not render the column in English beside the translation, and do not fall
back to the internal names for a heading you find awkward to translate — measured,
a turn left its menu labels in English and translated one internal name literally,
which is a third vocabulary on top of two.

## How to read

First live-choice of the session only, before the fork. Four lines, companion
language, one job each:

1. the first two lines are what is being chosen plus which way I lean;
2. the picture is the system around the decision, not the options;
3. the pick locks nothing — `0` is what writes the reply that travels;
4. `1` looks at the system more closely, `2` walks it file by file.

Do not expand this into a tutorial. Do not repeat it on later cards. A second
live-choice in the same session goes straight to the fork.

## The fork

One sentence. It is the fork, not a topic — "the lid on what is already stored,
not the lid on what is in flight". If a reader keeps only this line, they can
still tell the options apart.

## The lean

One sentence after the fork: the shape this session would take, and the repo fact
that decides it, in the same language as the fork. Mark it **not locked**. A
reader who stops here already has the twenty-second scan, which is why the pick
does not wait until after the argument.

Do not dump the seven stance slots here. Do not argue the losers here — that is
the full pick, after the picture.

## Hold this picture

The minimum graph the question stands on — not a glossary, not the whole
platform. Four to seven pieces. Each maps `plain meaning → the part → the
canonical term`, then uses the term. Say how each piece **connects** to the next.

WHEN a prior lock exists, the first piece is the lock this card hangs off.

**Where the picture stops** — one or two lines on the relation it maps, and the
place it does not: this graph is the pipeline inside the repo, it says nothing
about who reads the output from outside. A one-line analogy that is never used
again is not this graph — measured, an analogy sat above Today and the user still
asked for the card again.

**Draw that graph**, not the options. One picture, setup form, every node a fact
(limit, count, ordering), not just a name. Read `references/diagrams.md` and follow it.
`[!]` on the guarantee, `[*]` on what the pick changes.

## One walk

Four to eight lines. A named person walks **this** graph: today, then under the
lean. Numbers from the code. The trap — the paste looks like a widen and is a
hide — lives here, not as a lecture. This is not the hop-2 `file:line` walk.

## The full pick

Why **these** options exist (a missing owner, Compat None, a lock already taken).
One line each: what someone using or running it would notice.

**I'd pick** — the shape, and the repo fact that decides it, in the same language
as the fork. A shape the repo points at that the paste did not name gets its own
line here, judged with the others; it loses when it loses.

**Not** — each loser, one line, on that same fact.

**Who it hits** — only the actors this card moves (learner, creator, app-dev,
platform). Skip the rest.

## Paste vs code

Two to four paste-vs-repo disagreements that would **move the pick**, each one
sentence with `file:line`. These are **facts**, not commitments — they are the
Versus **Amend** lines, named here so a user who never takes a depth hop still
has them.

If the paste matches the repo, omit this heading entirely. Do not print a section
that says "none". Numbers you derived stay unverified and do not live here.

## If they confirm

What a `0` would freeze: two to four lines of **commitment**, not fact. Cost
accepted sits here when it is a cost of the pick rather than a correction of the
paste.

Facts and commitments are two headings because a user does not confirm a fact. A
correction that arrives on hop 2 arrives too late, and a correction buried among
things to approve arrives as something to approve.

## Fence

One line: this card does not decide X. Always. The paste's extra decision, if
any, is named here rather than smuggled into what `0` would freeze.

## Writing

Rephrase without the new word, then use the word. Map relations, not attributes.
Do not quiz the user. Do not open on a drawing or an analogy before the fork.

One heading per job. Bold only the fork words and the deciding repo fact. No
comparison table on this turn. No internal name as a heading.

The register of the card is the register of the worked example below, not the
register of this file. This file is for you. The card is for a person who asked
to understand the system well enough to code with an agent later.

## Worked

A live-choice on where page validation belongs, ASCII drawing. Copy this
register, not the prose of the files above. **In a real session every heading and
every line below is written in the companion language** — it is English here
because this file is.

```
How to read this card:
1. The first two lines are what is being chosen, and which way I lean
2. The picture is the system around the decision, not the options
3. "I'd pick" locks nothing — 0 is what writes the reply that goes back
4. 1 = the system in more detail · 2 = walk it file by file

**What is being chosen**
Check title/description the moment a file is read, or only when a Page is assembled.

**Which way I lean** (not locked)
Check in `toPage`. `readFrontmatter` promises Raw with no validation — that is a
contract already written down.

**Hold this picture**
- "read the top of a markdown file" → `readFrontmatter` → Raw, splits and parses, validates nothing
- "assemble a page" → `toPage` → Page, silently defaults title/description/date
- "one RSS item" → `itemXml` → a missing description becomes an empty tag
- "build the site" → `build` → one bad file stops the whole build, no per-file try/catch

Where the picture stops: this is the static pipeline inside the repo. It says
nothing about whether anything outside reads Raw frontmatter.

content/*.md
    |
    v
readFrontmatter — splits, parses, returns Raw, no validation   [!] contract as written
    |
    v
toPage — assembles Page, defaults silently                     [*] where the pick checks
    |
    +--> itemXml — missing description → <description></description>
    |
    `--> build — one bad file stops the build, under every shape

**One person walking through it**
Ren adds `posts/hello.md` with no description.
Today: `readFrontmatter` returns Raw with the field missing → `toPage` sets
description="" → `itemXml` emits an empty tag → `build` still goes green.
Checking in `toPage`: Ren gets the error while the Page is assembled, RSS stops
emitting empty tags, and `readFrontmatter` still returns Raw as promised.
Checking in `readFrontmatter`: every caller must now handle a parse error, even
the ones that never build a Page.

**Why not the other one**
I'd pick `toPage`, because the "returns Raw, validates nothing" contract lives in
`readFrontmatter`.
Not validating in `readFrontmatter`: it breaks that contract for every caller.
Not fixing only `itemXml`: RSS stops emitting empty tags, but `build` still
swallows a page with fields missing.
Who it hits: whoever writes content, whoever maintains the generator. App-devs
are untouched.

**Where the paste disagrees with the code**
The paste says the loader does not know which fields are required — true of
`readFrontmatter` (`src/frontmatter.ts:18`).
The paste never mentions that `toPage` already defaults silently
(`src/page.ts:41`) — that is where a page with fields missing becomes a valid one.

**If you confirm, this freezes**
Validation of title/description/date lives in `toPage`, and does not move into
`readFrontmatter`.

**This card does not decide**
Whether one bad file fails the whole `build` or gets skipped — the paste asks,
this card does not answer.
```
