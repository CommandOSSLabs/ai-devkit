# Documentation

This directory is the source of truth for documentation in this repository.

## Directory Structure

```
docs/
├── README.md        # this navigation map
├── decisions/       # Architecture Decision Records
├── requirements/    # product/project requirements
├── design/          # distilled system and feature design
├── rules/           # engineering standards
├── guides/          # how-to / integration guides
├── runbooks/        # operational procedures
├── reports/         # dated, immutable point-in-time records
├── research/        # exploratory findings
├── knowledge/       # gotchas, learnings, hard-won insights
├── ai/              # AI navigation maps → source files
└── templates/       # document templates (kit assets)
```

## When to read what

- **Any task:** [`ai/`](./ai/) — find the right source files for a topic.
- **New feature or scope change:** [`requirements/`](./requirements/) — what we're building and why.
- **Architecture or implementation:** [`design/`](./design/) — how a subsystem works; check [`decisions/`](./decisions/) for constraints.
- **Writing code:** [`rules/`](./rules/) — the standards for the area you're touching.
- **Operating the system:** [`runbooks/`](./runbooks/).
- **Before re-discovering anything:** [`knowledge/`](./knowledge/) and [`research/`](./research/).

## Conventions

- `decisions/`, `requirements/`, and `design/` are **canonical**: sources of
  truth, progress-neutral and tracker-neutral in wording. No ticket IDs, no
  delivery status. Progress lives in the tracker; facts live here.
- Every canonical doc declares its links: a design doc names the requirements
  it satisfies and the decisions that constrain it; a decision names the
  designs it shapes. Orphan docs (nothing links to them) are a defect.
- `reports/` entries are named `YYYY-MM-DD-<topic>.md` and are **immutable**
  facts about a moment — never revised to stay current. Durable conclusions
  get distilled into `design/` or `runbooks/`.
- `decisions/` entries are named `NNNN-<slug>.md`; numbers are monotonic and
  never reused.
- Every directory has exactly one `README.md`: a map of what lives there and
  when to read it — not a mirror of the content.
- Engineers can add more files or folders as needed. This structure is a
  baseline, not a restriction.
