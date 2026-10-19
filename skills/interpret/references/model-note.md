# The model note — optional, opt-in, not a spec

The thin durable picture the session otherwise drops on the floor. It exists so
the next session — human or agent — does not pay again to rebuild the same
neighborhood. It is not a spec, not an ADR, not a tour, not a problem tree.

**When.** Only when the user asks for the picture they can carry, or after the
third live-choice on the same neighborhood, or at session end if they say yes to
the one offer. Off by default.

**Where.** `.skills/interpret-session/<slug>/model.md` — a gitignored learning
artifact. Never write into the product repo unless the user names the path. Do not
name it `foundation-cards.md`, `docs/requirements/glossary.md`, or anything under `docs/decisions/`; those
names belong to `cmk:glossary`'s `references/define-domain.md`.

**What it is not.** `/cmk:explain` explains how a feature or the system works, with
no pick; `/cmk:debt` tracks
technical debt. If that is what the user wants, name the skill and stop.

It is also not a decision record the product must obey. The locks in it are copies
of what the user already settled in a carry-back — this file records them, it does
not create them.

## Shape

Companion language. Four to seven parts, not the whole platform. `file:line` on
every claim about the code. Numbers you derived stay marked unverified.

```
# <the neighborhood, in plain words>

## What this part of the system is for
<one or two sentences: what a person using it thinks it does>

## The parts we can hold
- <plain meaning> → <the part> → <canonical term>
  connects to: <the next part, and how>
  [!] guarantee · [*] the last pick changed this · unmarked = scenery

## Where the picture stops
<the relation it maps, and the place it does not>

## Locked (the user decided this)
- <the lock> — because <repo fact + file:line>

## Weighed, not locked
- <a constraint this session named that the user did not freeze individually>

## Still open
- <fence items, and the one fact that would flip a pick>

## What the paste got wrong
- <the correction + file:line or commit>

## Do not change this silently
- <invariant, contract, or bound a later agent must not move without asking>
```

## The offer

Once per session, after a settle or after the third card, one question in the
companion language: whether to write this note to
`.skills/interpret-session/<slug>/model.md` so the next session does not rebuild
the picture, and that `docs/` is possible if they name the path. Two lines, not a
menu of skills — name `/cmk:explain` only when what they
asked for reaches past this session's neighborhood, which is the case this file
opens on, not every offer.

No second offer. Silence is a no, and nothing is written.

## Reading it later

A coding session that inherits this note still opens the files it names. The note
is a model of the work; the repo is the work. When they disagree, the repo wins and
the note is amended — never the other way round.
