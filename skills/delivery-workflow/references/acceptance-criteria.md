# Acceptance criteria are a live contract

The acceptance criteria are what "done" means for a tracker issue. They are
strict — work a current criterion requires is never quietly dropped — and
they are editable, because criteria written before the work are a forecast,
and forecasts meet reality. What is never acceptable is the gap between the
two going unrecorded.

## Work from them, visibly

The criteria are the spine of the session, not a formality read once at
intake. Every phase re-reads the current list, and every claim of progress
names the criterion it advances. If you cannot say which criterion a piece
of work serves, either that work is out of scope or a criterion is missing —
settle which before continuing.

## Tick them as they are proven, not at the end

Most trackers render a checklist item live, so keep it true. A criterion is
checked when its behavior is proven and the proof is reachable from the
issue: a named test, a CI run, a PR link, or a comment carrying the command
and its output. Checking a box on intent rather than evidence is worse than
leaving it open, because it destroys the signal that something still needs
proving. Ticking the whole list at ship time turns it into paperwork;
ticking each as it lands makes the issue a live picture of remaining work
that any session, human or agent, can read without reconstruction.

## Rescope deliberately when the original scope will not land

Discovering mid-flight that a criterion is larger than believed, blocked by
something outside this issue, or simply wrong is a normal outcome, not a
failure to hide behind a partial delivery or an over-broad claim of done.
Every criterion ends the run with exactly one of three dispositions:

- **Meet it** — the default. It is in scope and gets done.
- **Rescope it** — narrow this issue's criteria to what genuinely lands,
  and move the removed scope onto a tracked issue that carries the
  corresponding criteria, an effort estimate, and a blocking or related
  relation back. Rewrite the description so the remaining criteria are the
  whole truth of what this issue now delivers, and record why the scope
  moved. Nothing evaporates: a criterion that leaves one issue arrives at
  another.
- **Block on it** — the criterion stands, the work cannot proceed safely,
  and the issue records the blocker with what was tried and what would
  unblock it.

Rescoping is a scope change like any other: it happens on the owning issue
when it is discovered, and the successor issue exists before this one
reaches its review state. A smaller honest outcome with the remainder
tracked beats a larger claimed one. What rescoping may never be is a quiet
shrink of the criteria to fit whatever got built — the test is whether a
later reader can see that scope moved, where it went, and why. Material
rescoping is a human decision, not a unilateral agent call; record the
decision and its rationale on the issue either way.

## Done means every criterion is disposed

Before the done state, each criterion is either checked with reachable
evidence or has visibly moved to a named successor issue. A criterion that
is neither is unfinished work, and merging does not change that. The PR or
its review surface never quietly narrows the issue's contract — a review
that discovers the delivered scope is smaller than the criteria promise is
surfacing an undisposed criterion, not a footnote.
